const express = require('express');
const auth = require('../middleware/auth');
const { getUsers, saveUsers, getVehicles, getServices } = require('../data/database');

const router = express.Router();

router.use(auth);

// Obter perfil do usuário
router.get('/profile', (req, res) => {
  const users = getUsers();
  const user = users.find(u => u.id === req.user.userId);
  
  if (!user) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }

  // Retornar dados sem a senha
  const { password, ...userData } = user;
  res.json(userData);
});

// Atualizar perfil do usuário
router.put('/profile', (req, res) => {
  const { name, email } = req.body;
  const users = getUsers();

  const userIndex = users.findIndex(u => u.id === req.user.userId);
  if (userIndex === -1) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }

  // Verificar se email já existe (exceto para o próprio usuário)
  const emailExists = users.find(u => u.email === email && u.id !== req.user.userId);
  if (emailExists) {
    return res.status(400).json({ error: 'Email já está em uso' });
  }

  users[userIndex] = {
    ...users[userIndex],
    name,
    email,
    updatedAt: new Date().toISOString()
  };

  saveUsers(users);

  const { password, ...updatedUser } = users[userIndex];
  res.json(updatedUser);
});

// Alterar senha
router.put('/change-password', async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const bcrypt = require('bcryptjs');
  const users = getUsers();

  const userIndex = users.findIndex(u => u.id === req.user.userId);
  if (userIndex === -1) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }

  // Verificar senha atual
  const validPassword = await bcrypt.compare(currentPassword, users[userIndex].password);
  if (!validPassword) {
    return res.status(400).json({ error: 'Senha atual incorreta' });
  }

  // Criptografar nova senha
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  users[userIndex] = {
    ...users[userIndex],
    password: hashedPassword,
    updatedAt: new Date().toISOString()
  };

  saveUsers(users);
  res.json({ message: 'Senha alterada com sucesso' });
});

// Excluir conta do usuário
router.delete('/account', async (req, res) => {
  const { password } = req.body;
  const bcrypt = require('bcryptjs');
  
  const users = getUsers();
  const vehicles = getVehicles();
  const services = getServices();

  const userIndex = users.findIndex(u => u.id === req.user.userId);
  if (userIndex === -1) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }

  // Verificar senha
  const validPassword = await bcrypt.compare(password, users[userIndex].password);
  if (!validPassword) {
    return res.status(400).json({ error: 'Senha incorreta' });
  }

  // Remover usuário
  users.splice(userIndex, 1);

  // Remover veículos do usuário
  const userVehicles = vehicles.filter(v => v.userId === req.user.userId);
  userVehicles.forEach(vehicle => {
    const vehicleIndex = vehicles.findIndex(v => v.id === vehicle.id);
    if (vehicleIndex !== -1) {
      vehicles.splice(vehicleIndex, 1);
    }
  });

  // Remover serviços do usuário
  const userServices = services.filter(s => s.userId === req.user.userId);
  userServices.forEach(service => {
    const serviceIndex = services.findIndex(s => s.id === service.id);
    if (serviceIndex !== -1) {
      services.splice(serviceIndex, 1);
    }
  });

  // Salvar todas as alterações
  const data = require('../data/database').readData();
  data.users = users;
  data.vehicles = vehicles;
  data.services = services;
  require('../data/database').writeData(data);

  res.json({ message: 'Conta excluída com sucesso' });
});

// Estatísticas do usuário
router.get('/stats', (req, res) => {
  const vehicles = getVehicles();
  const services = getServices();

  const userVehicles = vehicles.filter(v => v.userId === req.user.userId);
  const userServices = services.filter(s => s.userId === req.user.userId);

  const stats = {
    totalVehicles: userVehicles.length,
    totalServices: userServices.length,
    totalCost: userServices.reduce((sum, service) => sum + service.cost, 0),
    recentServices: userServices
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
  };

  res.json(stats);
});

module.exports = router;