// src/routes.js
const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Placeholder routes
router.get('/customers', (req, res) => {
  res.json({ data: [] });
});

router.get('/tickets', (req, res) => {
  res.json({ data: [] });
});

module.exports = router;
