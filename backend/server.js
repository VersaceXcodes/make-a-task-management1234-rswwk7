import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from 'pg';
const { Pool } = pkg;

dotenv.config();

// Workaround for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : null
});

// Initialize Express
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Middleware: JWT Authentication
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// REST API Routes
app.post('/api/users', async (req, res) => {
  try {
    const { email, password, name, role = 'member' } = req.body;
    const password_hash = await hashPassword(password); // Use bcrypt for hashing
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, name, role)
       VALUES ($1, $2, $3, $4) RETURNING user_id, email, name, role, created_at`,
      [email, password_hash, name, role]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/tasks', authenticateToken, async (req, res) => {
  try {
    const { title, description, priority = 'low', due_date, assigned_to } = req.body;
    const created_by = req.user.user_id;
    const result = await pool.query(
      `INSERT INTO tasks (title, description, priority, due_date, created_by, assigned_to)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING task_id, title, description, status, priority, due_date, created_at`,
      [title, description, priority, due_date, created_by, assigned_to]
    );
    io.emit('task/updated', { taskId: result.rows[0].task_id, updates: result.rows[0] });
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// WebSocket Events
io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('task/updated', async (data) => {
    try {
      const { task_id, updates } = data;
      await pool.query(
        `UPDATE tasks SET status = $1, priority = $2, assigned_to = $3, updated_at = NOW() WHERE task_id = $4`,
        [updates.status, updates.priority, updates.assigned_to, task_id]
      );
      io.emit('task/updated', { taskId: task_id, updates });
    } catch (err) {
      console.error(err);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start server
server.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});