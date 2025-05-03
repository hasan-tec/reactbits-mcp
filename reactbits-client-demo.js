const WebSocket = require('ws');
const readline = require('readline');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Connect to the MCP server
const ws = new WebSocket('ws://localhost:3000');

// Message counter for request IDs
let messageId = 1;

// Store pending requests
const pendingRequests = new Map();

// Handle connection events
ws.on('open', () => {
  console.log('Connected to ReactBits MCP Server!');
  console.log('---------------------------------');
  
  // Get and display available categories at startup
  sendRequest('listCategories', {})
    .then(result => {
      console.log('Available Categories:');
      result.categories.forEach(cat => {
        console.log(`- ${cat}`);
      });
      console.log('---------------------------------');
      showMainMenu();
    })
    .catch(err => {
      console.error('Failed to get categories:', err);
      showMainMenu();
    });
});

ws.on('message', (data) => {
  try {
    const message = JSON.parse(data.toString());
    
    if (message.id && pendingRequests.has(message.id)) {
      const { resolve, reject } = pendingRequests.get(message.id);
      pendingRequests.delete(message.id);
      
      if (message.error) {
        reject(new Error(message.error));
      } else {
        resolve(message.result);
      }
    }
  } catch (err) {
    console.error('Failed to parse message:', err);
  }
});

ws.on('close', () => {
  console.log('Disconnected from server');
  process.exit(0);
});

ws.on('error', (error) => {
  console.error('WebSocket error:', error);
  process.exit(1);
});

// Function to send MCP request and wait for response
function sendRequest(method, params) {
  return new Promise((resolve, reject) => {
    const id = messageId++;
    const request = {
      jsonrpc: '2.0',
      id,
      method,
      params
    };
    
    pendingRequests.set(id, { resolve, reject });
    ws.send(JSON.stringify(request));
  });
}

// Function to display the main menu
function showMainMenu() {
  console.log('\nReactBits Component Explorer');
  console.log('1. List all components');
  console.log('2. List components by category');
  console.log('3. Search components');
  console.log('4. Get component details');
  console.log('5. Exit');
  
  rl.question('\nSelect an option: ', (answer) => {
    switch (answer) {
      case '1':
        listAllComponents();
        break;
      case '2':
        listByCategory();
        break;
      case '3':
        searchComponents();
        break;
      case '4':
        getComponentDetails();
        break;
      case '5':
        console.log('Exiting...');
        ws.close();
        rl.close();
        break;
      default:
        console.log('Invalid option');
        showMainMenu();
    }
  });
}

// Function to list all components
function listAllComponents() {
  sendRequest('listComponents', {})
    .then(result => {
      console.log(`\nFound ${result.count} components:\n`);
      result.components.forEach((comp, i) => {
        console.log(`${i + 1}. ${comp.name} (${comp.category})`);
        if (comp.description) {
          console.log(`   ${comp.description}`);
        }
      });
      
      rl.question('\nPress Enter to continue...', () => {
        showMainMenu();
      });
    })
    .catch(err => {
      console.error('Error:', err.message);
      rl.question('\nPress Enter to continue...', () => {
        showMainMenu();
      });
    });
}

// Function to list components by category
function listByCategory() {
  sendRequest('listCategories', {})
    .then(result => {
      console.log('\nSelect a category:');
      result.categories.forEach((cat, i) => {
        console.log(`${i + 1}. ${cat}`);
      });
      
      rl.question('\nEnter category number: ', (answer) => {
        const index = parseInt(answer) - 1;
        if (index >= 0 && index < result.categories.length) {
          const category = result.categories[index];
          
          sendRequest('listComponents', { category })
            .then(compResult => {
              console.log(`\nFound ${compResult.count} ${category}:\n`);
              compResult.components.forEach((comp, i) => {
                console.log(`${i + 1}. ${comp.name}`);
                if (comp.description) {
                  console.log(`   ${comp.description}`);
                }
              });
              
              rl.question('\nPress Enter to continue...', () => {
                showMainMenu();
              });
            })
            .catch(err => {
              console.error('Error:', err.message);
              rl.question('\nPress Enter to continue...', () => {
                showMainMenu();
              });
            });
        } else {
          console.log('Invalid category');
          showMainMenu();
        }
      });
    })
    .catch(err => {
      console.error('Error:', err.message);
      showMainMenu();
    });
}

// Function to search components
function searchComponents() {
  rl.question('\nEnter search query: ', (query) => {
    rl.question('Filter by category? (Press Enter to skip or enter category name): ', (category) => {
      const params = {
        query,
        ...(category ? { category } : {})
      };
      
      sendRequest('searchComponents', params)
        .then(result => {
          console.log(`\nFound ${result.count} matches:\n`);
          result.components.forEach((comp, i) => {
            console.log(`${i + 1}. ${comp.name} (${comp.category})`);
            if (comp.description) {
              console.log(`   ${comp.description}`);
            }
          });
          
          rl.question('\nPress Enter to continue...', () => {
            showMainMenu();
          });
        })
        .catch(err => {
          console.error('Error:', err.message);
          rl.question('\nPress Enter to continue...', () => {
            showMainMenu();
          });
        });
    });
  });
}

// Function to get component details
function getComponentDetails() {
  rl.question('\nEnter component name: ', (name) => {
    sendRequest('getComponent', { name })
      .then(result => {
        if (result.found) {
          const comp = result.component;
          console.log('\n--------------------------------');
          console.log(`Component: ${comp.name}`);
          console.log(`Category: ${comp.category}`);
          console.log(`Description: ${comp.description || 'N/A'}`);
          
          if (comp.dependencies) {
            console.log(`\nInstallation: ${comp.installCommand}`);
          }
          
          if (Object.keys(comp.props).length > 0) {
            console.log('\nProps:');
            for (const [key, value] of Object.entries(comp.props)) {
              console.log(`- ${key}: ${value.type || 'any'} ${value.default ? `(default: ${value.default})` : ''}`);
              if (value.description) {
                console.log(`  ${value.description}`);
              }
            }
          }
          
          console.log('\nCode:');
          console.log('--------------------------------');
          
          // Show a preview of the code (first 10 lines)
          const codeLines = comp.code ? comp.code.split('\n').slice(0, 10) : [];
          console.log(codeLines.join('\n') + (comp.code && comp.code.split('\n').length > 10 ? '\n... (code truncated)' : ''));
          
          console.log('--------------------------------');
        } else {
          console.log(`Component "${name}" not found`);
        }
        
        rl.question('\nPress Enter to continue...', () => {
          showMainMenu();
        });
      })
      .catch(err => {
        console.error('Error:', err.message);
        rl.question('\nPress Enter to continue...', () => {
          showMainMenu();
        });
      });
  });
}