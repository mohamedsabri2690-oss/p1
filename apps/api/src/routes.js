// Updated routes with auth middleware protection, role checks and validation
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('./db');
const { authMiddleware } = require('./middleware');
const { requireRole } = require('./authz');

// Health
router.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Auth: register (for admins/techs) - simple
router.post('/auth/register',
  body('name').isLength({ min: 1 }),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('role').isIn(['admin','tech','customer']),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const { name, email, password, role } = req.body;
      const hashed = bcrypt.hashSync(password, 10);
      await db.query('INSERT INTO users (name, email, password_hash, role) VALUES ($1,$2,$3,$4)', [name, email, hashed, role]);
      res.json({ ok: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'server error' });
    }
});

// Auth: login
router.post('/auth/login',
  body('email').isEmail(),
  body('password').isLength({ min: 1 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const { email, password } = req.body;
      const r = await db.query('SELECT id, password_hash, role, name FROM users WHERE email = $1', [email]);
      if (r.rowCount === 0) return res.status(400).json({ error: 'Invalid credentials' });

      const user = r.rows[0];
      const match = bcrypt.compareSync(password, user.password_hash || '');
      if (!match) return res.status(400).json({ error: 'Invalid credentials' });

      const token = jwt.sign({ userId: user.id, role: user.role, name: user.name }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
      res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'server error' });
    }
});

// Customers
router.get('/customers', async (req, res) => {
  try {
    const r = await db.query('SELECT * FROM customers ORDER BY id DESC');
    res.json({ data: r.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// Protected: create customer (admin only)
router.post('/customers',
  authMiddleware,
  requireRole(['admin']),
  body('name').isLength({ min: 1 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const { name, contact_phone, address } = req.body;
      const r = await db.query('INSERT INTO customers (name, contact_phone, address) VALUES ($1,$2,$3) RETURNING *', [name, contact_phone, address]);
      res.json({ data: r.rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'server error' });
    }
});

// Devices
router.get('/devices', async (req, res) => {
  try {
    const r = await db.query('SELECT d.*, c.name as customer_name FROM devices d LEFT JOIN customers c ON d.customer_id = c.id ORDER BY d.id DESC');
    res.json({ data: r.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// Protected: create device (admin, tech)
router.post('/devices',
  authMiddleware,
  requireRole(['admin','tech']),
  body('customer_id').isInt(),
  body('model').isLength({ min: 1 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const { customer_id, model, serial_number, location_description } = req.body;
      const r = await db.query('INSERT INTO devices (customer_id, model, serial_number, location_description) VALUES ($1,$2,$3,$4) RETURNING *', [customer_id, model, serial_number, location_description]);
      res.json({ data: r.rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'server error' });
    }
});

// Tickets
router.get('/tickets', async (req, res) => {
  try {
    const r = await db.query('SELECT t.*, c.name as customer_name, d.model as device_model FROM tickets t LEFT JOIN customers c ON t.customer_id = c.id LEFT JOIN devices d ON t.device_id = d.id ORDER BY t.id DESC');
    res.json({ data: r.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// Protected: create ticket (admin, tech, customer)
router.post('/tickets',
  authMiddleware,
  requireRole(['admin','tech','customer']),
  body('customer_id').isInt(),
  body('title').isLength({ min: 1 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const { customer_id, device_id, title, description, scheduled_at, assigned_tech } = req.body;
      const r = await db.query('INSERT INTO tickets (customer_id, device_id, title, description, scheduled_at, assigned_tech) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *', [customer_id, device_id, title, description, scheduled_at, assigned_tech]);
      res.json({ data: r.rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'server error' });
    }
});

// Parts
router.get('/parts', async (req, res) => {
  try {
    const r = await db.query('SELECT * FROM parts ORDER BY id DESC');
    res.json({ data: r.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

module.exports = router;
