ReactBits MCP
This project is a toolkit for scraping, organizing, and serving React components from the ReactBits.dev site. It provides both a web scraper and a hybrid scraper (using Firecrawl and Puppeteer), as well as a simple MCP server and a client demo for interacting with the scraped data.

File Explanations
1. reactbits-firecrawl.js (Hybrid Firecrawl Scraper)
This is the most advanced script in the repo. It combines the Firecrawl API and Puppeteer to extract React components from ReactBits.dev.

Key features:

FirecrawlClient class: Handles API requests to Firecrawl, allowing the mapping and scraping of the site, and extraction of structured data (component name, code, props, dependencies, etc.).
Hybrid scraping: Tries to use Firecrawl for structured extraction first; if that fails, falls back to Puppeteer for direct scraping and code extraction.
Component organization: Scraped data is saved in a structured way (JSON, code files, previews) under scraped-components/, organized by category (components, backgrounds, animations).
Code formatting: Extracted code is processed and formatted with headers for readability, and file extensions are determined based on content.
Screenshots: Captures preview images of components for visual reference.
Extensive CLI options: Allows for limiting the number of components scraped and forcing re-scraping.
Typical usage:

bash
node reactbits-firecrawl.js
Add --limit=10 to limit per category, or --force to re-scrape existing entries.
2. reactbits-scraper.js (Puppeteer Scraper)
This is a pure Puppeteer-based scraper for ReactBits.dev.

Key features:

Automates browser: Uses Puppeteer to navigate the site, click "Code" tabs, and extract component code, props, and dependencies.
Category crawling: Maps the site to find and categorize all components.
Data output: Saves JSON metadata and code files in category folders under scraped-components/.
Reliability: Skips already-scraped components unless --force is used and includes error handling and retry logic.
File cleanup: Detects and removes duplicate code files with wrong extensions.
Typical usage:

bash
node reactbits-scraper.js
Add --limit=10 or --force as needed.
3. reactbits-mcp-server.js (MCP Server)
This is a simple MCP (Message Control Protocol) server that reads the scraped component data from the scraped-components/ directory.
Provides an MCP API for searching and retrieving components.
Uses an underlying database to store and query component metadata.
4. reactbits-client-demo.js (Client Demo)
A command-line interface for browsing, searching, and retrieving details of scraped components via the MCP server.
Supports listing, searching, and viewing details interactively.
How to Run Everything (One Command)
Most users will want to scrape components and start the server. You can do this by running:

bash
# 1. Scrape all components (hybrid approach)
node reactbits-firecrawl.js

# 2. Start the MCP server
node reactbits-mcp-server.js

# 3. (Optional) Run the client demo to explore:
node reactbits-client-demo.js
Or, if you want to do it with a single command (on Unix-like systems):

bash
# Scrape, then start the server (in the background)
node reactbits-firecrawl.js && node reactbits-mcp-server.js
(You can also substitute reactbits-scraper.js for the firecrawl version if you prefer only Puppeteer.)

Requirements
Node.js (v18 or newer recommended)
Puppeteer and axios (install via npm install)
(Optional) Set a FIRECRAWL_API_KEY in your environment for advanced scraping.
Directory Structure
/scraped-components/ - Where all scraped components, backgrounds, and animations are stored.
/scripts/ - Contains all script files (scrapers, server, client).
About
This repo demonstrates programmatic extraction and serving of reusable React UI components using both browser automation (Puppeteer) and AI-powered scraping (Firecrawl MCP).
The MCP server exposes a simple API and database for searching and retrieving these components.
