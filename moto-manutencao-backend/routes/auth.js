const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getUsers, saveUsers } = require('../data/database');

const router = express.Router();
const JWT_SECRET = 'seu_jwt_secret_aqui';

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = getUsers();
    
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ error: 'Usuário não encontrado' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Senha incorreta' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

// Cadastro
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const users = getUsers();

    // Verificar se usuário já existe
    const userExists = users.find(u => u.email === email);
    if (userExists) {
      return res.status(400).json({ error: 'Usuário já existe' });
    }

    // Criptografar senha
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);

    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

module.exports = router;