#!/usr/bin/env node
const { Server } = require("@modelcontextprotocol/sdk/server/index.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const path = require('path');
const Database = require('better-sqlite3');
const fs = require('fs');

// Log to console for debugging
console.error("Starting ReactBits MCP Server...");

// Connect to the database
const db = new Database(path.join(__dirname, 'reactbits.db'), { readonly: true });

// Create server
const server = new Server(
  { name: "reactbits-mcp-server", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// Define our tools
const TOOLS = [
  {
    name: "searchComponents",
    description: "Search for React components by keyword or description",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search query for finding components by name, description, or category"
        },
        category: {
          type: "string", 
          description: "Optional filter by category: 'components', 'backgrounds', or 'animations'",
          enum: ["components", "backgrounds", "animations"]
        }
      },
      required: ["query"]
    }
  },
  {
    name: "getComponent",
    description: "Get complete details about a specific component by name",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Exact name of the component to retrieve"
        }
      },
      required: ["name"]
    }
  },
  {
    name: "listCategories",
    description: "List all available component categories",
    inputSchema: {
      type: "object",
      properties: {},
      required: []
    }
  },
  {
    name: "listComponents",
    description: "List available components, optionally filtered by category",
    inputSchema: {
      type: "object",
      properties: {
        category: {
          type: "string",
          description: "Optional category filter",
          enum: ["components", "backgrounds", "animations"]
        }
      },
      required: []
    }
  }
];

// Helper function to get full file path for a component
function getComponentFilePath(component) {
  if (component.file_path) {
    return path.join(__dirname, component.file_path);
  }
  
  // Try to construct the path if not available
  const safeFileName = component.name.replace(/[^a-z0-9]/gi, '-').toLowerCase();
  const potentialPaths = [
    path.join(__dirname, 'scraped-components', component.category, `${safeFileName}.jsx`),
    path.join(__dirname, 'scraped-components', component.category, `${safeFileName}.js`)
  ];
  
  for (const filePath of potentialPaths) {
    if (fs.existsSync(filePath)) {
      return filePath;
    }
  }
  
  return null;
}

// Helper function to get component code either from database or file
function getComponentCode(component) {
  // First try to get code from database
  if (component.code && component.code.trim()) {
    return component.code;
  }
  
  // If not in database, try to read from file
  const filePath = getComponentFilePath(component);
  if (filePath && fs.existsSync(filePath)) {
    try {
      return fs.readFileSync(filePath, 'utf8');
    } catch (e) {
      console.error(`Error reading component file ${filePath}:`, e);
    }
  }
  
  return "// No code available for this component";
}

// Handle all requests
server.fallbackRequestHandler = async (request) => {
  try {
    const { method, params, id } = request;
    console.error(`REQUEST: ${method} [${id}]`);
    
    // Initialize
    if (method === "initialize") {
      return {
        protocolVersion: "2024-11-05",
        capabilities: { tools: {} },
        serverInfo: { name: "reactbits-mcp-server", version: "1.0.0" }
      };
    }
    
    // Tools list
    if (method === "tools/list") {
      console.error(`TOOLS: ${JSON.stringify(TOOLS)}`);
      return { tools: TOOLS };
    }
    
    // Tool call
    if (method === "tools/call") {
      const { name, arguments: args = {} } = params || {};
      
      // Search components
      if (name === "searchComponents") {
        try {
          const { query, category } = args;
          let results = [];
          
          // Use a more robust search approach - try FTS first, then fallback to LIKE if no results
          if (query) {
            let sql;
            let sqlParams;

            // First try with FTS
            if (category) {
              sql = `
                SELECT c.* 
                FROM components_fts ft
                JOIN components c ON ft.rowid = c.id
                WHERE ft.components_fts MATCH ? AND c.category = ?
                ORDER BY rank
                LIMIT 20
              `;
              sqlParams = [`${query}*`, category];
            } else {
              sql = `
                SELECT c.*
                FROM components_fts ft
                JOIN components c ON ft.rowid = c.id
                WHERE ft.components_fts MATCH ?
                ORDER BY rank
                LIMIT 20
              `;
              sqlParams = [`${query}*`];
            }

            results = db.prepare(sql).all(...sqlParams);
            
            // If no results with FTS, try with LIKE
            if (results.length === 0) {
              const searchPattern = `%${query}%`;
              
              if (category) {
                sql = `
                  SELECT * 
                  FROM components
                  WHERE (name LIKE ? OR description LIKE ?) AND category = ?
                  ORDER BY name
                  LIMIT 20
                `;
                sqlParams = [searchPattern, searchPattern, category];
              } else {
                sql = `
                  SELECT * 
                  FROM components
                  WHERE name LIKE ? OR description LIKE ?
                  ORDER BY category, name
                  LIMIT 20
                `;
                sqlParams = [searchPattern, searchPattern];
              }
              
              results = db.prepare(sql).all(...sqlParams);
            }
          } else {
            // If no query provided, return all components in the specified category
            if (category) {
              results = db.prepare(`
                SELECT * 
                FROM components
                WHERE category = ?
                ORDER BY name
                LIMIT 20
              `).all(category);
            } else {
              // Return an error if neither query nor category is specified
              return {
                error: {
                  code: -32602,
                  message: "Search query or category must be provided"
                }
              };
            }
          }
          
          // Return enhanced component info as plain text for Claude to display properly
          let resultText = `Found ${results.length} components matching "${query || ''}"${category ? ` in category ${category}` : ''}:\n\n`;
          
          results.forEach((comp, index) => {
            // Parse JSON data for additional info
            let jsonData = {};
            try {
              if (comp.json_data) {
                jsonData = JSON.parse(comp.json_data);
              }
            } catch (e) {
              console.error('Error parsing JSON data:', e);
            }
            
            // Get installation command
            let installCommand = '';
            if (comp.dependencies && comp.dependencies.trim()) {
              installCommand = `npm install ${comp.dependencies}`;
            }
            
            resultText += `${index + 1}. **${comp.name}** (${comp.category})\n`;
            resultText += `   ${comp.description || 'No description available'}\n`;
            if (installCommand) {
              resultText += `   Installation: \`${installCommand}\`\n`;
            }
            resultText += '\n';
          });
          
          // Return a single text content type that Claude can display
          return {
            content: [
              {
                type: "text",
                text: resultText
              }
            ]
          };
        } catch (error) {
          console.error('Search error:', error);
          return {
            error: {
              code: -32603,
              message: `Failed to search components: ${error.message}`
            }
          };
        }
      }
      
      // Get component details
      if (name === "getComponent") {
        try {
          const { name } = args;
          
          if (!name) {
            return {
              error: {
                code: -32602,
                message: "Component name is required"
              }
            };
          }
          
          // Try exact match first
          let component = db.prepare(`
            SELECT * FROM components 
            WHERE name = ?
            LIMIT 1
          `).get(name);
          
          // If not found, try case-insensitive match
          if (!component) {
            component = db.prepare(`
              SELECT * FROM components 
              WHERE LOWER(name) = LOWER(?)
              LIMIT 1
            `).get(name);
          }
          
          // If still not found, try partial match
          if (!component) {
            component = db.prepare(`
              SELECT * FROM components 
              WHERE name LIKE ?
              LIMIT 1
            `).get(`%${name}%`);
          }
          
          if (!component) {
            return {
              error: {
                code: -32602,
                message: `Component "${name}" not found`
              }
            };
          }

          // Parse the JSON data field
          let jsonData = {};
          try {
            jsonData = JSON.parse(component.json_data);
          } catch (e) {
            console.error('Error parsing JSON data:', e);
          }

          // Build installation instructions
          let installCommand = '';
          if (component.dependencies && component.dependencies.trim()) {
            installCommand = `npm install ${component.dependencies}`;
          }
          
          // Get the code content with fallback to file if needed
          const codeContent = getComponentCode(component);
          
          // Try to get the full file path
          const filePath = getComponentFilePath(component);
          
          // Format the response as plain text so Claude can display it properly
          let responseText = `# ${component.name}\n\n`;
          responseText += `**Category:** ${component.category}\n\n`;
          responseText += `${component.description || 'No description available.'}\n\n`;
          
          if (installCommand) {
            responseText += `## Installation\n\n\`\`\`bash\n${installCommand}\n\`\`\`\n\n`;
          }
          
          if (jsonData.props && Object.keys(jsonData.props).length > 0) {
            responseText += "## Component Props\n\n";
            for (const [key, value] of Object.entries(jsonData.props)) {
              responseText += `- **${key}**: ${value.type || 'any'}`;
              if (value.default) {
                responseText += ` (default: ${value.default})`;
              }
              responseText += "\n";
              if (value.description) {
                responseText += `  ${value.description}\n`;
              }
              responseText += "\n";
            }
          }
          
          responseText += "## Component Code\n\n";
          responseText += "```jsx\n";
          responseText += codeContent;
          responseText += "\n```\n\n";
          
          if (component.preview_image) {
            responseText += `## Preview\n\n`;
            responseText += `Preview Image URL: ${component.preview_image}\n\n`;
          }

          // Return only plain text content that Claude can display
          return {
            content: [
              {
                type: "text",
                text: responseText
              }
            ]
          };
        } catch (error) {
          console.error('Get component error:', error);
          return {
            error: {
              code: -32603,
              message: `Failed to get component details: ${error.message}`
            }
          };
        }
      }
      
      // List categories
      if (name === "listCategories") {
        try {
          const categories = db.prepare(`
            SELECT DISTINCT category FROM components
          `).all();

          // Format as plain text
          const categoriesText = `Available categories: ${categories.map(cat => cat.category).join(', ')}`;
          
          return {
            content: [
              {
                type: "text",
                text: categoriesText
              }
            ]
          };
        } catch (error) {
          console.error('List categories error:', error);
          return {
            error: {
              code: -32603,
              message: `Failed to list categories: ${error.message}`
            }
          };
        }
      }
      
      // List components
      if (name === "listComponents") {
        try {
          const { category } = args;
          let sql;
          let sqlParams = [];

          if (category) {
            sql = `
              SELECT id, name, description, category
              FROM components
              WHERE category = ?
              ORDER BY name
            `;
            sqlParams = [category];
          } else {
            sql = `
              SELECT id, name, description, category
              FROM components
              ORDER BY category, name
            `;
          }

          const components = db.prepare(sql).all(...sqlParams);
          
          // Format as plain text
          let componentsText = `Found ${components.length} components${category ? ` in category ${category}` : ''}:\n\n`;
          
          // Group by category
          const componentsByCategory = {};
          components.forEach(comp => {
            if (!componentsByCategory[comp.category]) {
              componentsByCategory[comp.category] = [];
            }
            componentsByCategory[comp.category].push(comp);
          });
          
          // Format the components grouped by category
          Object.entries(componentsByCategory).forEach(([category, comps]) => {
            componentsText += `## ${category}\n\n`;
            
            comps.forEach((comp, index) => {
              componentsText += `${index + 1}. **${comp.name}**\n`;
              componentsText += `   ${comp.description || 'No description available'}\n\n`;
            });
          });

          return {
            content: [
              {
                type: "text",
                text: componentsText
              }
            ]
          };
        } catch (error) {
          console.error('List components error:', error);
          return {
            error: {
              code: -32603,
              message: `Failed to list components: ${error.message}`
            }
          };
        }
      }
      
      return {
        error: {
          code: -32601,
          message: `Tool not found: ${name}`
        }
      };
    }
    
    // Required empty responses
    if (method === "resources/list") return { resources: [] };
    if (method === "prompts/list") return { prompts: [] };
    
    // Empty response for unhandled methods
    return {};
  } catch (error) {
    console.error(`ERROR: ${error.message}`);
    return {
      error: {
        code: -32603,
        message: "Internal error",
        data: { details: error.message }
      }
    };
  }
};

// Determine if we should start with stdio or websocket based on arguments
const args = process.argv.slice(2);
const transportType = args.find(arg => arg === '--ws' || arg === '--stdio') || '--stdio';

// Connect to stdio transport by default
const transport = new StdioServerTransport();

// Add signal handlers for graceful shutdown
process.on('SIGINT', () => {
  console.error('Shutting down server...');
  db.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.error('SIGTERM received');
  // Stay alive by default in SIGTERM, just like the example
});

// Connect server
console.error(`Starting ReactBits MCP Server with stdio transport...`);
server.connect(transport)
  .then(() => console.error("Server connected successfully"))
  .catch(error => {
    console.error(`Connection error: ${error.message}`);
    process.exit(1);
  });