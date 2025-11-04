const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// === LISTAR TODOS OS USUÁRIOS ===
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, created_at FROM users ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({ error: 'Erro ao listar usuários' });
  }
});

// === DETALHAR USUÁRIO COM VEÍCULOS ===
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const userResult = await pool.query('SELECT id, name, email, created_at FROM users WHERE id = $1', [id]);
    const vehiclesResult = await pool.query('SELECT * FROM vehicles WHERE owner_id = $1', [id]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({
      ...userResult.rows[0],
      vehicles: vehiclesResult.rows
    });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
});

// === DELETAR USUÁRIO ===
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ message: 'Usuário e seus dados foram removidos com sucesso!' });
  } catch (error) {
    console.error('Erro ao remover usuário:', error);
    res.status(500).json({ error: 'Erro ao remover usuário' });
  }
});

module.exports = router;
