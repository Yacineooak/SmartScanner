import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Database file path
const dbPath = join(__dirname, 'database.sqlite');

// Setup database tables and initial data
export const setupDatabase = () => {
  // Create database directory if it doesn't exist
  const dbDir = dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  
  // Create and initialize the database
  const db = new sqlite3.Database(dbPath);
  
  db.serialize(() => {
    // Create users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at TEXT NOT NULL
      )
    `);
    
    // Create scans table
    db.run(`
      CREATE TABLE IF NOT EXISTS scans (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        scan_type TEXT NOT NULL,
        target TEXT NOT NULL,
        port_range TEXT,
        status TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        completed_at TEXT,
        data TEXT,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);
    
    // Add an index for faster querying of user scans
    db.run(`
      CREATE INDEX IF NOT EXISTS idx_scans_user_id ON scans (user_id)
    `);
    
    // Check if we need to insert the demo user
    db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
      if (!err && row.count === 0) {
        // Insert demo user
        db.run(`
          INSERT INTO users (id, username, email, password_hash, created_at)
          VALUES (?, ?, ?, ?, ?)
        `, [
          'user-001',
          'admin',
          'admin@example.com',
          '$2a$10$X7L8dPr6Qa9hnOXZX8E1.OY6v7sZA0t5yEjkYnH0KsU7UuUaD2WgW', // password: 'password'
          new Date().toISOString()
        ]);
      }
    });
  });
  
  db.close();
};