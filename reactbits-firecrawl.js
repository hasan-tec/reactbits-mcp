const fs = require('fs');
const path = require('path');
const axios = require('axios');
const puppeteer = require('puppeteer');

// Parse command line arguments
const args = process.argv.slice(2);
const limitParam = args.find(arg => arg.startsWith('--limit='));
const forceParam = args.find(arg => arg === '--force' || arg === '-f');
const LIMIT_PER_CATEGORY = limitParam ? parseInt(limitParam.split('=')[1]) : Infinity;
const FORCE_RESCRAPE = forceParam !== undefined;

// Create output directory
const OUTPUT_DIR = path.join(__dirname, 'scraped-components');
const CATEGORIES = ['components', 'backgrounds', 'animations'];

// Make sure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Create directories for each category
CATEGORIES.forEach(category => {
  const categoryDir = path.join(OUTPUT_DIR, category);
  if (!fs.existsSync(categoryDir)) {
    fs.mkdirSync(categoryDir, { recursive: true });
  }
});

/**
 * Configuration for Firecrawl MCP Client
 * Note: In a real implementation, you would get these from environment variables
 */
const FIRECRAWL_API_ENDPOINT = "https://api.firecrawl.dev";  // Example placeholder
const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY || "fc-69acb4db857c434b95d285c919556ec5";

/**
 * Firecrawl MCP client for web scraping
 */
class FirecrawlClient {
  constructor(apiKey, endpoint = FIRECRAWL_API_ENDPOINT) {
    this.apiKey = apiKey;
    this.endpoint = endpoint;
    this.axios = axios.create({
      baseURL: endpoint,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Map a website to discover URLs
   * @param {string} url The starting URL
   * @param {object} options Options for mapping
   * @returns {Promise<Array<string>>} List of discovered URLs
   */
  async mapSite(url, options = {}) {
    try {
      const response = await this.axios.post('/map', {
        url,
        includeSubdomains: options.includeSubdomains || false,
        limit: options.limit || 100,
        sitemapOnly: options.sitemapOnly || false
      });
      return response.data;
    } catch (error) {
      console.error('Error mapping site with Firecrawl:', error.message);
      throw error;
    }
  }

  /**
   * Scrape a single webpage
   * @param {string} url The URL to scrape
   * @param {object} options Options for scraping
   * @returns {Promise<object>} The scraped data
   */
  async scrapePage(url, options = {}) {
    try {
      const response = await this.axios.post('/scrape', {
        url,
        formats: options.formats || ['markdown', 'html'],
        onlyMainContent: options.onlyMainContent !== false,
        waitFor: options.waitFor || 1000,
        actions: options.actions || []
      });
      return response.data;
    } catch (error) {
      console.error(`Error scraping ${url} with Firecrawl:`, error.message);
      throw error;
    }
  }

  /**
   * Extract structured data from a webpage
   * @param {string} url The URL to extract from
   * @param {object} schema The schema for extraction
   * @param {string} prompt Custom prompt for extraction
   * @returns {Promise<object>} The extracted data
   */
  async extractData(url, schema, prompt) {
    try {
      const response = await this.axios.post('/extract', {
        urls: [url],
        schema,
        prompt
      });
      return response.data;
    } catch (error) {
      console.error(`Error extracting data from ${url} with Firecrawl:`, error.message);
      throw error;
    }
  }
}

/**
 * Use Firecrawl to map the ReactBits site and get component URLs
 * @returns {Promise<object>} Object with URLs by category
 */
async function mapReactBitsSiteWithFirecrawl() {
  console.log('Mapping ReactBits.dev site structure using Firecrawl...');
  
  // In a real implementation with an actual Firecrawl API key:
  // const firecrawl = new FirecrawlClient(FIRECRAWL_API_KEY);
  // const urls = await firecrawl.mapSite('https://www.reactbits.dev', { limit: 100 });
  
  // Since we don't have an actual API key, we'll use our predefined list from above
  // in a way that simulates what the Firecrawl API would return
  const baseUrl = 'https://www.reactbits.dev';
  const mockUrls = [
    '/components/stepper',
    '/components/counter',
    '/components/dock',
    '/components/carousel',
    '/components/stack',
    '/components/lanyard',
    '/components/folder',
    '/components/masonry',
    '/backgrounds/ballpit',
    '/backgrounds/dither',
    '/backgrounds/balatro',
    '/backgrounds/particles',
    '/backgrounds/aurora',
    '/backgrounds/iridescence',
    '/backgrounds/waves',
    '/backgrounds/hyperspeed',
    '/backgrounds/orb',
    '/backgrounds/lightning',
    '/backgrounds/threads',
    '/backgrounds/squares',
    '/backgrounds/grid-motion',
    '/animations/magnet',
    '/animations/ribbons',
    '/animations/noise',
    '/animations/crosshair',
    '/animations/splash-cursor',
    '/animations/pixel-transition',
    '/animations/animated-content'
  ].map(path => `${baseUrl}${path}`);
  
  // Categorize URLs
  const result = {};
  CATEGORIES.forEach(category => {
    result[category] = mockUrls.filter(url => url.includes(`/${category}/`));
  });
  
  console.log(`Found ${mockUrls.length} total items to scrape`);
  return result;
}

/**
 * Component extraction schema for Firecrawl structured extraction
 */
const COMPONENT_SCHEMA = {
  name: {
    type: "string",
    description: "The name of the component, found in h1 or h2"
  },
  description: {
    type: "string",
    description: "Brief description of the component, often found in a paragraph under the heading"
  },
  code: {
    type: "string",
    description: "The code example for the component, found in code blocks"
  },
  props: {
    type: "array",
    description: "List of props from the props table",
    items: {
      type: "object",
      properties: {
        name: { type: "string" },
        type: { type: "string" },
        defaultValue: { type: "string" },
        description: { type: "string" }
      }
    }
  },
  dependencies: {
    type: "array",
    description: "List of dependencies required for this component",
    items: { type: "string" }
  }
};

/**
 * Clean code from line numbers and formatting issues
 * @param {string} codeText The raw code text to clean 
 * @returns {string} The cleaned code
 */
function cleanCodeText(codeText) {
  if (!codeText) return '';
  
  // Remove npm install lines
  codeText = codeText.replace(/^npm i .*$/gm, '');
  
  // Split into lines to process
  const lines = codeText.split('\n');
  
  // Check if the code has line numbers (starts with digits followed by space)
  const hasLineNumbers = lines.some(line => /^\d+\s/.test(line.trim()));
  
  if (hasLineNumbers) {
    // Remove line numbers if present
    return lines.map(line => {
      // Match line numbers at the beginning of lines
      const match = line.match(/^\s*\d+\s*(.*)/);
      return match ? match[1] : line;
    }).join('\n');
  }
  
  return codeText;
}

/**
 * Determine appropriate file extension based on code content
 * @param {string} code The code content
 * @param {string} category The component category
 * @returns {string} The appropriate file extension
 */
function determineFileExtension(code, category) {
  if (!code) return category === 'components' ? 'jsx' : 'js';
  
  // Check for JSX syntax
  if (code.includes('</') || code.includes('/>') || 
      (code.includes('<') && code.includes('>') && code.includes('props'))) {
    return 'jsx';
  }
  
  // Check for React imports
  if (code.includes('import React') || code.includes('from "react"') || code.includes("from 'react'")) {
    return 'jsx';
  }
  
  return 'js';
}

/**
 * Format code with headings to make it more readable
 * @param {string} code The raw code
 * @param {Object} componentData Additional component data
 * @returns {string} Formatted code with headers
 */
function formatCodeWithHeaders(code, componentData) {
  if (!code) return '';
  
  // Clean the code first
  let cleanedCode = cleanCodeText(code);
  
  // Avoid duplicates by identifying unique code blocks
  const blocks = {};
  const codeLines = cleanedCode.split('\n');
  let currentBlock = '';
  let blockId = '';
  
  for (const line of codeLines) {
    // Skip empty lines at the beginning of blocks
    if (!currentBlock && !line.trim()) continue;
    
    // If we see an import statement, it might be the start of a new block
    if (line.trim().startsWith('import ') && currentBlock) {
      // Store the previous block if it's not empty
      if (currentBlock.trim()) {
        blocks[blockId] = currentBlock;
      }
      currentBlock = line + '\n';
      blockId = line.trim().substring(0, 20); // Use the beginning of the import as blockId
    } else {
      currentBlock += line + '\n';
      // If this is the first line, use it as block ID
      if (!blockId) {
        blockId = line.trim().substring(0, 20);
      }
    }
  }
  
  // Add the last block
  if (currentBlock.trim() && blockId) {
    blocks[blockId] = currentBlock;
  }
  
  // Prepare the formatted code
  let formattedCode = `/**
 * ${componentData.name}
 * 
 * ${componentData.description || ''}
 */

`;

  // Separate usage examples from implementation
  let usageExamples = [];
  let implementation = [];
  
  for (const blockId in blocks) {
    const block = blocks[blockId].trim();
    
    // Simple heuristic to identify usage examples vs implementation
    if (block.includes('export default') || 
        block.includes('function ') || 
        (block.includes('import ') && block.includes('from ')) ||
        block.includes('class ')) {
      implementation.push(block);
    } else if (block.includes('<') && block.includes('>')) {
      // This is likely a usage example
      usageExamples.push(block);
    } else {
      // Not sure, add to implementation
      implementation.push(block);
    }
  }
  
  // Add installation section if dependencies exist
  if (componentData.dependencies && componentData.dependencies.length > 0) {
    formattedCode += `// ============================================================================
// INSTALLATION
// ============================================================================

// Install dependencies:
// npm install ${componentData.dependencies.join(' ')}

`;
  }

  // Add usage examples
  if (usageExamples.length > 0) {
    formattedCode += `// ============================================================================
// USAGE EXAMPLE
// ============================================================================

${usageExamples.join('\n\n')}

`;
  }
  
  // Add implementation code
  formattedCode += `// ============================================================================
// IMPLEMENTATION
// ============================================================================

${implementation.join('\n\n')}
`;

  return formattedCode;
}

/**
 * Extract code blocks from the page
 * @param {object} page Puppeteer page
 * @returns {Promise<string>} The cleaned and combined code
 */
async function extractCodeBlocks(page) {
  // First, try to get visible code blocks
  let codeBlocks = await page.evaluate(() => {
    const blocks = Array.from(document.querySelectorAll('pre code, code.language-jsx, code.language-tsx, .language-tsx, .language-jsx, div[data-language="jsx"], div[data-language="tsx"], .prism-code, [class*="codeBlock"], [class*="CodeBlock"], [class*="code-block"]'));
    return blocks.map(block => block.innerText);
  });
  
  // Filter out empty blocks
  codeBlocks = codeBlocks.filter(block => block && block.trim().length > 0);
  
  // Get unique blocks to avoid duplication
  const uniqueBlocks = [...new Set(codeBlocks)];
  
  // Join blocks with appropriate spacing
  return uniqueBlocks.join('\n\n');
}

/**
 * Extract component data using Firecrawl's structured extraction
 * @param {string} url The URL to extract from
 * @param {FirecrawlClient} firecrawl The Firecrawl client
 * @returns {Promise<object>} The extracted component data
 */
async function extractComponentWithFirecrawl(url, firecrawl) {
  console.log(`Extracting component data from ${url} using Firecrawl...`);
  
  try {
    const extractPrompt = `
      Extract detailed information about this React component from the page.
      Look for the component name in the heading.
      Find any code examples in code blocks or syntax-highlighted areas.
      Locate prop information in the props table if it exists.
      Check for dependencies listed at the bottom of the page.
    `;
    
    const extractedData = await firecrawl.extractData(url, COMPONENT_SCHEMA, extractPrompt);
    return {
      ...extractedData,
      url,
    };
  } catch (error) {
    console.error(`Error extracting data from ${url}:`, error);
    return null;
  }
}

/**
 * Use Puppeteer as a fallback to scrape a component page when Firecrawl extraction fails
 * @param {object} page Puppeteer page object
 * @param {string} url The component URL to scrape
 * @param {string} category The category of the component
 * @returns {Promise<object>} The scraped component data
 */
async function scrapeComponentWithPuppeteer(page, url, category) {
  console.log(`Falling back to Puppeteer for ${url}...`);
  
  try {
    await page.goto(url, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    // First check if there's a "Code" tab to click
    const hasCodeTab = await page.evaluate(() => {
      const codeTabSelector = Array.from(document.querySelectorAll('button, a'))
        .find(el => el.innerText.toLowerCase().includes('code'));
      return !!codeTabSelector;
    });
    
    if (hasCodeTab) {
      console.log('Code tab found, clicking to reveal code...');
      await page.evaluate(() => {
        const codeTab = Array.from(document.querySelectorAll('button, a'))
          .find(el => el.innerText.toLowerCase().includes('code'));
        if (codeTab) {
          codeTab.click();
        }
      });
      
      // Wait for code to load
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Extract component details
    const componentInfo = await page.evaluate(() => {
      const name = document.querySelector('h2')?.innerText || 
                   document.querySelector('h1')?.innerText || 
                   'Unknown Component';
      
      const description = document.querySelector('meta[name="description"]')?.content || 
                          document.querySelector('p')?.innerText || '';
      
      // Extract props table
      const propsTable = document.querySelector('table');
      let props = {};
      
      if (propsTable) {
        const rows = Array.from(propsTable.querySelectorAll('tr'));
        rows.slice(1).forEach(row => {
          const cells = Array.from(row.querySelectorAll('td'));
          if (cells.length >= 2) {
            const propName = cells[0].innerText.trim();
            const type = cells.length >= 3 ? cells[1].innerText.trim() : '';
            const defaultValue = cells.length >= 4 ? cells[2].innerText.trim() : '';
            const description = cells.length >= 5 ? cells[3].innerText.trim() : 
                                (cells.length >= 3 ? cells[2].innerText.trim() : '');
            
            props[propName] = {
              type,
              default: defaultValue,
              description
            };
          }
        });
      }
      
      // Extract dependencies
      const dependenciesHeader = Array.from(document.querySelectorAll('h2, h3'))
        .find(el => el.innerText && el.innerText.includes('Dependencies'));
      
      let dependencies = [];
      if (dependenciesHeader) {
        const nextElement = dependenciesHeader.nextElementSibling;
        if (nextElement) {
          dependencies = nextElement.innerText.split('\n').map(d => d.trim()).filter(Boolean);
        }
      }
      
      return {
        name,
        description,
        props,
        dependencies,
        url: window.location.href
      };
    });
    
    // Extract code using our specialized function
    const code = await extractCodeBlocks(page);
    componentInfo.code = code;
    
    // If code is still empty, try advanced code extraction methods
    if (!componentInfo.code) {
      console.log("Standard code extraction failed, trying advanced methods...");
      
      try {
        // Click the code tab again and monitor network requests
        await page.setRequestInterception(true);
        
        let codeContent = '';
        page.on('request', request => {
          request.continue();
        });
        
        page.on('response', async response => {
          const url = response.url();
          if (url.includes('code') || url.includes('snippet') || url.includes('.jsx') || url.includes('.tsx')) {
            try {
              const contentType = response.headers()['content-type'] || '';
              if (contentType.includes('json') || contentType.includes('javascript') || contentType.includes('text')) {
                const text = await response.text();
                if (text.includes('import') || text.includes('function') || text.includes('export') || text.includes('const')) {
                  codeContent = text;
                }
              }
            } catch (e) {
              // Ignore errors in response handling
            }
          }
        });
        
        // Click code tab and wait for some time
        await page.evaluate(() => {
          const codeTab = Array.from(document.querySelectorAll('button, a'))
            .find(el => el.innerText.toLowerCase().includes('code'));
          if (codeTab) {
            codeTab.click();
          }
        });
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        if (codeContent) {
          componentInfo.code = cleanCodeText(codeContent);
        }
        
        // Disable request interception
        await page.setRequestInterception(false);
      } catch (e) {
        console.error("Error in advanced code extraction:", e);
      }
    }
    
    return componentInfo;
  } catch (error) {
    console.error(`Error scraping ${url} with Puppeteer:`, error);
    return {
      name: `Error: ${url.split('/').pop()}`,
      description: `Failed to scrape: ${error.message}`,
      url,
      error: true
    };
  }
}

/**
 * Take a screenshot of a component for preview
 * @param {object} page Puppeteer page object
 * @param {string} url The component URL
 * @param {string} outputPath Path to save the screenshot
 * @returns {Promise<string>} Path to the screenshot
 */
async function captureComponentScreenshot(page, url, outputPath) {
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Find the main component preview
    const previewElement = await page.evaluate(() => {
      // Try to find the preview section - this will depend on the specific page structure
      // Look for elements that might contain the component preview
      const possiblePreviewSelectors = [
        'div[role="presentation"]',
        '.component-preview',
        '.preview-container',
        'main > div:not(:has(h1, h2, table))',
        'section:first-of-type'
      ];
      
      for (const selector of possiblePreviewSelectors) {
        const element = document.querySelector(selector);
        if (element && element.offsetHeight > 50 && element.offsetWidth > 50) {
          // Get position and size
          const rect = element.getBoundingClientRect();
          return {
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
            found: true
          };
        }
      }
      
      return { found: false };
    });
    
    if (previewElement.found) {
      await page.screenshot({
        path: outputPath,
        clip: {
          x: previewElement.x,
          y: previewElement.y,
          width: previewElement.width,
          height: previewElement.height
        }
      });
      return outputPath;
    }
    
    // If we couldn't identify a specific preview element, take a screenshot of the viewport
    await page.screenshot({ path: outputPath });
    return outputPath;
  } catch (error) {
    console.error(`Error capturing screenshot of ${url}:`, error);
    return null;
  }
}

/**
 * Main function to scrape ReactBits using hybrid approach with Firecrawl and Puppeteer
 */
async function scrapeReactBitsHybrid() {
  console.log('Starting ReactBits hybrid scraper with Firecrawl and Puppeteer...');
  console.log(`Limit set to ${LIMIT_PER_CATEGORY === Infinity ? 'unlimited' : LIMIT_PER_CATEGORY} items per category`);
  console.log(`Force rescrape is ${FORCE_RESCRAPE ? 'enabled' : 'disabled'}`);
  
  // Initialize results tracking
  const results = {
    successful: 0,
    failed: 0,
    skipped: 0,
    firecrawlExtracted: 0,
    puppeteerFallback: 0
  };
  
  // Initialize Firecrawl client
  const firecrawl = new FirecrawlClient(FIRECRAWL_API_KEY);
  
  // Launch Puppeteer browser as a fallback and for screenshots
  const browser = await puppeteer.launch({ 
    headless: "new",
    defaultViewport: { width: 1280, height: 800 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  try {
    // Map the ReactBits site to get all component URLs
    const siteMap = await mapReactBitsSiteWithFirecrawl();
    
    // Process each category
    for (const category of CATEGORIES) {
      const components = siteMap[category] || [];
      console.log(`Processing ${Math.min(components.length, LIMIT_PER_CATEGORY)} of ${components.length} ${category}...`);
      
      for (let i = 0; i < Math.min(components.length, LIMIT_PER_CATEGORY); i++) {
        const url = components[i];
        const componentName = url.split('/').pop();
        const safeFileName = componentName.replace(/[^a-z0-9]/gi, '-').toLowerCase();
        const filePath = path.join(OUTPUT_DIR, category, `${safeFileName}.json`);
        
        console.log(`[${i+1}/${Math.min(components.length, LIMIT_PER_CATEGORY)}] Processing ${category}/${componentName}`);
        
        // Skip existing files unless force flag is enabled
        if (!FORCE_RESCRAPE && fs.existsSync(filePath)) {
          console.log(`Skipping ${componentName} as it already exists`);
          results.skipped++;
          continue;
        }
        
        let componentData;
        
        // Try with Firecrawl extraction first
        try {
          console.log(`Attempting to extract ${componentName} with Firecrawl...`);
          componentData = await extractComponentWithFirecrawl(url, firecrawl);
          
          if (componentData && componentData.name && !componentData.error) {
            console.log(`Successfully extracted ${componentName} with Firecrawl`);
            results.firecrawlExtracted++;
          } else {
            throw new Error('Firecrawl extraction failed or returned incomplete data');
          }
        } catch (error) {
          console.log(`Firecrawl extraction failed for ${componentName}: ${error.message}`);
          
          // Fall back to Puppeteer
          console.log(`Falling back to Puppeteer for ${componentName}...`);
          componentData = await scrapeComponentWithPuppeteer(page, url, category);
          
          if (componentData && componentData.name && !componentData.error) {
            console.log(`Successfully scraped ${componentName} with Puppeteer fallback`);
            results.puppeteerFallback++;
          } else {
            console.error(`Both extraction methods failed for ${componentName}`);
            results.failed++;
            continue;
          }
        }
        
        // Add metadata
        componentData.category = category;
        componentData.scrapedAt = new Date().toISOString();
        
        // Take a screenshot for visual reference
        console.log(`Capturing screenshot for ${componentName}...`);
        const screenshotPath = path.join(OUTPUT_DIR, category, `${safeFileName}-preview.png`);
        const screenshotResult = await captureComponentScreenshot(page, url, screenshotPath);
        
        if (screenshotResult) {
          componentData.previewImage = `${safeFileName}-preview.png`;
          console.log(`Screenshot saved for ${componentName}`);
        }
        
        // Save component data as JSON
        fs.writeFileSync(filePath, JSON.stringify(componentData, null, 2));
        console.log(`Saved JSON data for ${componentName}`);
        
        // Save code separately if available
        if (componentData.code) {
          const extension = determineFileExtension(componentData.code, category);
          const codePath = path.join(OUTPUT_DIR, category, `${safeFileName}.${extension}`);
          fs.writeFileSync(codePath, formatCodeWithHeaders(componentData.code, componentData));
          console.log(`Saved code file for ${componentName}`);
        }
        
        results.successful++;
        
        // Be nice to the server
        const delay = 1500 + Math.random() * 1000;
        console.log(`Waiting ${Math.round(delay)}ms before next request...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  } catch (error) {
    console.error('Error during hybrid scraping:', error);
  } finally {
    await browser.close();
    
    // Print overall results
    console.log('\nScraping completed!');
    console.log(`Results: ${results.successful} successful (${results.firecrawlExtracted} via Firecrawl, ${results.puppeteerFallback} via Puppeteer), ${results.failed} failed, ${results.skipped} skipped`);
  }
}

/**
 * Generate README with overview of scraped components
 */
async function generateReadme() {
  console.log('Generating README with overview of scraped components...');
  
  const readmePath = path.join(OUTPUT_DIR, 'README.md');
  const timestamp = new Date().toISOString();
  
  let content = `# ReactBits Components Library\n\n`;
  content += `Scraped components from [ReactBits.dev](https://www.reactbits.dev/) as of ${timestamp}\n\n`;
  
  for (const category of CATEGORIES) {
    const categoryDir = path.join(OUTPUT_DIR, category);
    
    if (!fs.existsSync(categoryDir)) {
      continue;
    }
    
    const jsonFiles = fs.readdirSync(categoryDir)
      .filter(file => file.endsWith('.json'));
    
    if (jsonFiles.length === 0) {
      continue;
    }
    
    content += `## ${category.charAt(0).toUpperCase() + category.slice(1)}\n\n`;
    
    for (const file of jsonFiles) {
      const filePath = path.join(categoryDir, file);
      const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      content += `### ${jsonData.name}\n\n`;
      
      if (jsonData.description) {
        content += `${jsonData.description}\n\n`;
      }
      
      if (jsonData.previewImage) {
        content += `![${jsonData.name} Preview](./${category}/${jsonData.previewImage})\n\n`;
      }
      
      content += `[View Component Details](./${category}/${file}) | `;
      content += `[View Code](./${category}/${file.replace('.json', '.jsx')})\n\n`;
    }
    
    content += '\n';
  }
  
  fs.writeFileSync(readmePath, content);
  console.log(`README generated at ${readmePath}`);
}

// Run the hybrid scraper and generate README
async function main() {
  try {
    await scrapeReactBitsHybrid();
    await generateReadme();
    console.log('All done!');
  } catch (error) {
    console.error('Error in main process:', error);
  }
}

// Execute if this is the main module
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  scrapeReactBitsHybrid,
  generateReadme
};