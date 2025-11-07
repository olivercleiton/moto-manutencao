const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authMiddleware = require('../middleware/auth');

// 🔒 Todas as rotas exigem token válido
router.use(authMiddleware);

// 📥 Listar veículos do usuário logado
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM vehicles WHERE owner_id = $1 ORDER BY id DESC',
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error('Erro ao listar veículos:', err);
    res.status(500).json({ error: 'Erro ao listar veículos' });
  }
});

// ➕ Criar novo veículo
router.post('/', async (req, res) => {
  const { name, model, year, plate, mileage } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO vehicles (owner_id, name, model, year, plate, mileage)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [req.user.id, name, model, year, plate, mileage]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Erro ao adicionar veículo:', err);
    res.status(500).json({ error: 'Erro ao adicionar veículo' });
  }
});

// 🗑️ Excluir veículo
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM vehicles WHERE id = $1 AND owner_id = $2', [
      req.params.id,
      req.user.id,
    ]);
    res.json({ success: true });
  } catch (err) {
    console.error('Erro ao excluir veículo:', err);
    res.status(500).json({ error: 'Erro ao excluir veículo' });
  }
});

module.exports = router;
