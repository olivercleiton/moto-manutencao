const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// === LISTAR SERVIÇOS (com info do veículo e dono) ===
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.*, v.model AS vehicle_model, v.plate, u.name AS owner_name
      FROM services s
      JOIN vehicles v ON s.vehicle_id = v.id
      JOIN users u ON v.owner_id = u.id
      ORDER BY s.date DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar serviços:', error);
    res.status(500).json({ error: 'Erro ao listar serviços' });
  }
});

// === LISTAR SERVIÇOS DE UM VEÍCULO ===
router.get('/vehicle/:vehicleId', async (req, res) => {
  const { vehicleId } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM services WHERE vehicle_id = $1 ORDER BY date DESC',
      [vehicleId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar serviços do veículo:', error);
    res.status(500).json({ error: 'Erro ao listar serviços do veículo' });
  }
});

// === CADASTRAR SERVIÇO ===
router.post('/', async (req, res) => {
  const { vehicle_id, description, cost, date } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO services (vehicle_id, description, cost, date)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [vehicle_id, description, cost, date]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao cadastrar serviço:', error);
    res.status(500).json({ error: 'Erro ao cadastrar serviço' });
  }
});

// === ATUALIZAR SERVIÇO ===
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { description, cost, date } = req.body;
  try {
    const result = await pool.query(
      `UPDATE services
       SET description = $1, cost = $2, date = $3
       WHERE id = $4 RETURNING *`,
      [description, cost, date, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar serviço:', error);
    res.status(500).json({ error: 'Erro ao atualizar serviço' });
  }
});

// === DELETAR SERVIÇO ===
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM services WHERE id = $1', [id]);
    res.json({ message: 'Serviço removido com sucesso!' });
  } catch (error) {
    console.error('Erro ao remover serviço:', error);
    res.status(500).json({ error: 'Erro ao remover serviço' });
  }
});

module.exports = router;
