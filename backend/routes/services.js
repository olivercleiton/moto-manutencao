const express = require('express');
const auth = require('../middleware/auth');
const { getServices, saveServices } = require('../data/database');

const router = express.Router();

router.use(auth);

// Listar serviços do usuário
router.get('/', (req, res) => {
  const services = getServices();
  const userServices = services.filter(s => s.userId === req.user.userId);
  res.json(userServices);
});

// Adicionar serviço
router.post('/', (req, res) => {
  const { vehicleId, type, date, mileage, cost, notes } = req.body;
  const services = getServices();

  const newService = {
    id: Date.now().toString(),
    userId: req.user.userId,
    vehicleId,
    type,
    date,
    mileage: parseInt(mileage),
    cost: cost ? parseFloat(cost) : 0,
    notes: notes || '',
    createdAt: new Date().toISOString()
  };

  services.push(newService);
  saveServices(services);
  res.status(201).json(newService);
});

// Excluir serviço
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const services = getServices();

  const serviceIndex = services.findIndex(s => s.id === id && s.userId === req.user.userId);
  if (serviceIndex === -1) {
    return res.status(404).json({ error: 'Serviço não encontrado' });
  }

  services.splice(serviceIndex, 1);
  saveServices(services);
  res.json({ message: 'Serviço excluído com sucesso' });
});

module.exports = router;