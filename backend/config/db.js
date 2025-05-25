require('dotenv').config(); // Load env variables
const sqlite3 = require('sqlite3').verbose();
const path = require('path');


// Use DB path from .env or fallback to default
const dbPath = path.resolve(__dirname, '..', process.env.SQLITE_DB_PATH || './inventory.db');
console.log(`🗂️ Connecting to SQLite DB at: ${dbPath}`);
const fs = require('fs');
console.log("🔍 DB file exists:", fs.existsSync(dbPath));

const db = new sqlite3.Database(path.resolve(__dirname, '..', dbPath), (err) => {
  if (err) console.error('❌ DB Connection Error:', err.message);
  else console.log(`✅ Connected to SQLite database at ${dbPath}`);
});

module.exports = db;
