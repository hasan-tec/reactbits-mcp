const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

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
 * Use Firecrawl API to map the site and get all component URLs
 * @returns {Promise<Object>} Object containing arrays of URLs by category
 */
async function mapReactBitsSite() {
  console.log('Mapping ReactBits.dev site structure...');
  
  try {
    const response = await axios.get('https://www.reactbits.dev/');
    
    const result = {};
    CATEGORIES.forEach(category => {
      result[category] = [];
    });
    
    const baseUrl = 'https://www.reactbits.dev';
    
    const links = [
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
    ];

    links.forEach(link => {
      const category = link.split('/')[1];
      if (CATEGORIES.includes(category)) {
        result[category].push(`${baseUrl}${link}`);
      }
    });

    console.log(`Found ${links.length} total items to scrape`);
    return result;
  } catch (error) {
    console.error('Error mapping site:', error);
    throw error;
  }
}

/**
 * Use Puppeteer to scrape a component page
 * @param {object} page Puppeteer page object
 * @param {string} url The component URL to scrape
 * @param {string} category The category of the component
 * @returns {Promise<Object>} The scraped component data
 */
async function scrapeComponentPage(page, url, category) {
  console.log(`Scraping ${category} page: ${url}`);
  
  try {
    await page.goto(url, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
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
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    const componentInfo = await page.evaluate(() => {
      const name = document.querySelector('h2')?.innerText || 
                   document.querySelector('h1')?.innerText || 
                   'Unknown Component';
      
      const description = document.querySelector('meta[name="description"]')?.content || 
                          document.querySelector('p')?.innerText || '';
      
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
      
      const dependenciesHeader = Array.from(document.querySelectorAll('h2, h3'))
        .find(el => el.innerText && el.innerText.includes('Dependencies'));
      
      let dependencies = [];
      if (dependenciesHeader) {
        const nextElement = dependenciesHeader.nextElementSibling;
        if (nextElement) {
          dependencies = nextElement.innerText.split('\n').map(d => d.trim()).filter(Boolean);
        }
      }
      
      let previewImage = '';
      const images = Array.from(document.querySelectorAll('img'));
      if (images.length > 0) {
        const relevantImages = images.filter(img => {
          const src = img.src || '';
          return !src.includes('logo') && !src.includes('header') && !src.includes('icon');
        });
        
        if (relevantImages.length > 0) {
          previewImage = relevantImages[0].src;
        }
      }
      
      return {
        name,
        description,
        props,
        dependencies,
        previewImage,
        url: window.location.href
      };
    });
    
    const code = await extractCodeBlocks(page);
    componentInfo.code = code;
    
    if (!componentInfo.code) {
      console.log("Standard code extraction failed, trying advanced methods...");
      
      try {
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
            }
          }
        });
        
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
        
        await page.setRequestInterception(false);
      } catch (e) {
        console.error("Error in advanced code extraction:", e);
      }
    }
    
    return componentInfo;
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
    return {
      name: `Error: ${url.split('/').pop()}`,
      description: `Failed to scrape: ${error.message}`,
      url,
      error: true
    };
  }
}

/**
 * Main scraper function
 */
async function scrapeReactBits() {
  console.log('Starting ReactBits scraper...');
  console.log(`Force rescrape is ${FORCE_RESCRAPE ? 'enabled' : 'disabled'}`);
  console.log(`Limit set to ${LIMIT_PER_CATEGORY === Infinity ? 'unlimited' : LIMIT_PER_CATEGORY} items per category`);
  
  const browser = await puppeteer.launch({ 
    headless: "new",
    defaultViewport: null,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1280, height: 800 });
  
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  try {
    const siteMap = await mapReactBitsSite();
    
    let totalComponents = 0;
    for (const category of CATEGORIES) {
      totalComponents += siteMap[category].length;
    }
    
    console.log(`Found ${totalComponents} total items to scrape`);
    
    const results = {
      successful: 0,
      failed: 0,
      skipped: 0
    };
    
    for (const category of CATEGORIES) {
      const components = siteMap[category];
      console.log(`Processing ${Math.min(components.length, LIMIT_PER_CATEGORY)} of ${components.length} ${category}...`);
      
      for (let i = 0; i < Math.min(components.length, LIMIT_PER_CATEGORY); i++) {
        const url = components[i];
        console.log(`[${i+1}/${Math.min(components.length, LIMIT_PER_CATEGORY)}] Scraping ${category}: ${url}`);
        
        try {
          const componentName = url.split('/').pop();
          const safeFileName = componentName.replace(/[^a-z0-9]/gi, '-').toLowerCase();
          const filePath = path.join(OUTPUT_DIR, category, `${safeFileName}.json`);
          
          if (!FORCE_RESCRAPE && fs.existsSync(filePath)) {
            console.log(`Skipping ${componentName}, already scraped`);
            results.skipped++;
            continue;
          }
          
          const componentData = await scrapeComponentPage(page, url, category);
          
          fs.writeFileSync(
            filePath,
            JSON.stringify(componentData, null, 2)
          );
          
          if (componentData.code) {
            // Format the code with proper headers to avoid duplicates
            const formattedCode = formatCodeWithHeaders(componentData.code, componentData);
            
            // Determine the appropriate file extension based on code content
            const extension = determineFileExtension(componentData.code, category);
            const codePath = path.join(OUTPUT_DIR, category, `${safeFileName}.${extension}`);
            
            // Save the formatted code
            fs.writeFileSync(codePath, formattedCode);
            console.log(`Saved formatted code for ${componentName}`);
            
            // If there's already a file with a different extension, remove it
            // This handles cases where we've previously saved with the wrong extension
            const alternateExtension = extension === 'jsx' ? 'js' : 'jsx';
            const alternatePath = path.join(OUTPUT_DIR, category, `${safeFileName}.${alternateExtension}`);
            if (fs.existsSync(alternatePath)) {
              fs.unlinkSync(alternatePath);
              console.log(`Removed duplicate file with wrong extension: ${alternatePath}`);
            }
          }
          
          results.successful++;
          
          const delay = 2000 + Math.random() * 1000;
          console.log(`Waiting ${Math.round(delay)}ms before next request...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        } catch (error) {
          console.error(`Failed to scrape ${url}:`, error);
          results.failed++;
        }
      }
    }
    
    console.log('Scraping completed!');
    console.log(`Results: ${results.successful} successful, ${results.failed} failed, ${results.skipped} skipped`);
    
  } catch (error) {
    console.error('Error during scraping:', error);
  } finally {
    await browser.close();
  }
}

scrapeReactBits().catch(console.error);