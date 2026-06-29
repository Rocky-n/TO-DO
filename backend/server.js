const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize SQLite Database
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // UPGRADED: Added priority column
  db.run(`CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    tags TEXT DEFAULT '',
    due_date DATETIME,
    priority TEXT DEFAULT 'Low',
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

// Create Todo (POST) - Upgraded with Priority
app.post('/api/todos', (req, res) => {
  const { title, description, tags, due_date, priority } = req.body;
  if (!title) return res.status(400).json({ error: "Title is required" });
  
  const sql = `INSERT INTO todos (title, description, tags, due_date, priority) VALUES (?, ?, ?, ?, ?)`;
  db.run(sql, [title, description || null, tags || '', due_date || null, priority || 'Low'], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    
    db.get(`SELECT * FROM todos WHERE id = ?`, [this.lastID], (err, row) => {
      res.json(row);
    });
  });
});

// Get All Todos (GET)
app.get('/api/todos', (req, res) => {
  db.all(`SELECT * FROM todos ORDER BY created_at DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Get Single Todo (GET)
app.get('/api/todos/:id', (req, res) => {
  db.get(`SELECT * FROM todos WHERE id = ?`, [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Todo not found" });
    res.json(row);
  });
});

// Update Todo (PUT)
app.put('/api/todos/:id', (req, res) => {
  const updates = [];
  const values = [];
  
  if (req.body.status !== undefined) { updates.push('status = ?'); values.push(req.body.status); }
  if (req.body.title !== undefined) { updates.push('title = ?'); values.push(req.body.title); }
  if (req.body.priority !== undefined) { updates.push('priority = ?'); values.push(req.body.priority); }

  if (updates.length === 0) return res.status(400).json({ error: "No fields to update" });

  const sql = `UPDATE todos SET ${updates.join(', ')} WHERE id = ?`;
  values.push(req.params.id);
  
  db.run(sql, values, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Updated successfully" });
  });
});

// Delete Todo (DELETE)
app.delete('/api/todos/:id', (req, res) => {
  db.run(`DELETE FROM todos WHERE id = ?`, [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Deleted successfully" });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));