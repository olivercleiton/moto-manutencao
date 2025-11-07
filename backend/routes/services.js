const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

// 📋 Listar serviços por veículo
router.get('/:vehicleId', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM services WHERE vehicle_id = $1 ORDER BY date DESC`,
      [req.params.vehicleId]
    );
    res.json(rows);
  } catch (err) {
    console.error('Erro ao listar serviços:', err);
    res.status(500).json({ error: 'Erro ao listar serviços' });
  }
});

// ➕ Adicionar serviço
router.post('/', async (req, res) => {
  const { vehicle_id, description, cost, date, mileage, notes } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO services (vehicle_id, description, cost, date, mileage, notes)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [vehicle_id, description, cost, date, mileage, notes]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Erro ao adicionar serviço:', err);
    res.status(500).json({ error: 'Erro ao adicionar serviço' });
  }
});

module.exports = router;
