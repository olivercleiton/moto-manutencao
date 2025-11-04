const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ conectado: true, hora: result.rows[0].now });
  } catch (err) {
    console.error('Erro no teste do banco:', err);
    res.status(500).json({ conectado: false, erro: err.message });
  }
});

module.exports = router;
