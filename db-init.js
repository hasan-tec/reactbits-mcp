const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

// Create the database instance
const db = new Database(path.join(__dirname, 'reactbits.db'));

// Initialize the database schema
function initializeDatabase() {
  db.pragma('journal_mode = WAL');
  
  // Create tables for components
  db.exec(`
    CREATE TABLE IF NOT EXISTS components (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      category TEXT NOT NULL,
      code TEXT,
      dependencies TEXT,
      preview_image TEXT,
      json_data TEXT,
      file_path TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    
    -- Create indexes for faster searching
    CREATE INDEX IF NOT EXISTS idx_components_name ON components(name);
    CREATE INDEX IF NOT EXISTS idx_components_category ON components(category);
    CREATE VIRTUAL TABLE IF NOT EXISTS components_fts USING fts5(
      name, description, category, 
      content='components', 
      content_rowid='id'
    );
    
    -- Trigger to keep the FTS index updated
    CREATE TRIGGER IF NOT EXISTS components_ai AFTER INSERT ON components BEGIN
      INSERT INTO components_fts(rowid, name, description, category) 
      VALUES (new.id, new.name, new.description, new.category);
    END;
    
    CREATE TRIGGER IF NOT EXISTS components_ad AFTER DELETE ON components BEGIN
      INSERT INTO components_fts(components_fts, rowid, name, description, category) 
      VALUES('delete', old.id, old.name, old.description, old.category);
    END;
    
    CREATE TRIGGER IF NOT EXISTS components_au AFTER UPDATE ON components BEGIN
      INSERT INTO components_fts(components_fts, rowid, name, description, category) 
      VALUES('delete', old.id, old.name, old.description, old.category);
      INSERT INTO components_fts(rowid, name, description, category) 
      VALUES (new.id, new.name, new.description, new.category);
    END;
  `);
  
  console.log('Database schema initialized successfully');
}

// Import components from the scraped data
function importComponents() {
  const baseDir = path.join(__dirname, 'scraped-components');
  const categories = ['components', 'backgrounds', 'animations'];
  
  // Clear existing data
  db.prepare('DELETE FROM components').run();
  
  // Prepare the insert statement
  const insertStmt = db.prepare(`
    INSERT INTO components (name, description, category, code, dependencies, preview_image, json_data, file_path)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  let totalComponents = 0;
  
  // Process each category
  categories.forEach(category => {
    const categoryDir = path.join(baseDir, category);
    if (!fs.existsSync(categoryDir)) {
      console.log(`Category directory not found: ${categoryDir}`);
      return;
    }
    
    // Get all JSON files in the category
    const jsonFiles = fs.readdirSync(categoryDir)
      .filter(file => file.endsWith('.json'));
    
    console.log(`Processing ${jsonFiles.length} ${category}...`);
    
    jsonFiles.forEach(jsonFile => {
      const jsonPath = path.join(categoryDir, jsonFile);
      const componentData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      
      // Find the corresponding code file (.jsx or .js)
      const baseName = jsonFile.replace('.json', '');
      let codeFile = path.join(categoryDir, `${baseName}.jsx`);
      if (!fs.existsSync(codeFile)) {
        codeFile = path.join(categoryDir, `${baseName}.js`);
        if (!fs.existsSync(codeFile)) {
          codeFile = null;
        }
      }
      
      // Read code content if available
      let codeContent = '';
      if (codeFile) {
        codeContent = fs.readFileSync(codeFile, 'utf8');
      }
      
      // Process dependencies
      const dependencies = Array.isArray(componentData.dependencies) 
        ? componentData.dependencies.join(' ')
        : '';
      
      // Insert into database
      insertStmt.run(
        componentData.name,
        componentData.description || '',
        category,
        codeContent,
        dependencies,
        componentData.previewImage || '',
        JSON.stringify(componentData),
        codeFile ? path.relative(__dirname, codeFile) : ''
      );
      
      totalComponents++;
    });
  });
  
  console.log(`Successfully imported ${totalComponents} components`);
}

// Run initialization
initializeDatabase();
importComponents();

console.log('Database setup complete');

// Close the database connection
db.close();