const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// === LISTAR TODOS OS VEÍCULOS (com nome do dono) ===
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT v.*, u.name AS owner_name, u.email AS owner_email
      FROM vehicles v
      JOIN users u ON v.owner_id = u.id
      ORDER BY v.id DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar veículos:', error);
    res.status(500).json({ error: 'Erro ao buscar veículos' });
  }
});

// === LISTAR VEÍCULOS DE UM USUÁRIO ===
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query('SELECT * FROM vehicles WHERE owner_id = $1 ORDER BY id DESC', [userId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar veículos do usuário:', error);
    res.status(500).json({ error: 'Erro ao buscar veículos do usuário' });
  }
});

// === CADASTRAR NOVO VEÍCULO ===
router.post('/', async (req, res) => {
  const { owner_id, brand, model, plate, year } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO vehicles (owner_id, brand, model, plate, year)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [owner_id, brand, model, plate, year]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao cadastrar veículo:', error);
    res.status(500).json({ error: 'Erro ao cadastrar veículo' });
  }
});

// === ATUALIZAR VEÍCULO ===
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { brand, model, plate, year } = req.body;
  try {
    const result = await pool.query(
      `UPDATE vehicles
       SET brand = $1, model = $2, plate = $3, year = $4
       WHERE id = $5 RETURNING *`,
      [brand, model, plate, year, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar veículo:', error);
    res.status(500).json({ error: 'Erro ao atualizar veículo' });
  }
});

// === DELETAR VEÍCULO ===
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM vehicles WHERE id = $1', [id]);
    res.json({ message: 'Veículo removido com sucesso!' });
  } catch (error) {
    console.error('Erro ao remover veículo:', error);
    res.status(500).json({ error: 'Erro ao remover veículo' });
  }
});

module.exports = router;
