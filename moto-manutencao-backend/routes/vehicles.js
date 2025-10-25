const express = require('express');
const auth = require('../middleware/auth');
const { getVehicles, saveVehicles } = require('../data/database');

const router = express.Router();

// Todos os endpoints exigem autenticação
router.use(auth);

// Listar veículos do usuário
router.get('/', (req, res) => {
  const vehicles = getVehicles();
  const userVehicles = vehicles.filter(v => v.userId === req.user.userId);
  res.json(userVehicles);
});

// Adicionar veículo
router.post('/', (req, res) => {
  const { name, model, year, plate, mileage } = req.body;
  const vehicles = getVehicles();

  const newVehicle = {
    id: Date.now().toString(),
    userId: req.user.userId,
    name,
    model,
    year: parseInt(year),
    plate,
    mileage: parseInt(mileage),
    createdAt: new Date().toISOString()
  };

  vehicles.push(newVehicle);
  saveVehicles(vehicles);

  res.status(201).json(newVehicle);
});

// Atualizar veículo
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { model, year, plate, mileage } = req.body;
  const vehicles = getVehicles();

  const vehicleIndex = vehicles.findIndex(v => v.id === id && v.userId === req.user.userId);
  if (vehicleIndex === -1) {
    return res.status(404).json({ error: 'Veículo não encontrado' });
  }

  vehicles[vehicleIndex] = {
    ...vehicles[vehicleIndex],
    model,
    year: parseInt(year),
    plate,
    mileage: parseInt(mileage)
  };

  saveVehicles(vehicles);
  res.json(vehicles[vehicleIndex]);
});

// Excluir veículo
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const vehicles = getVehicles();

  const vehicleIndex = vehicles.findIndex(v => v.id === id && v.userId === req.user.userId);
  if (vehicleIndex === -1) {
    return res.status(404).json({ error: 'Veículo não encontrado' });
  }

  vehicles.splice(vehicleIndex, 1);
  saveVehicles(vehicles);
  res.json({ message: 'Veículo excluído com sucesso' });
});

module.exports = router;