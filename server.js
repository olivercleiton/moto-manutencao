const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const vehicleRoutes = require('./routes/vehicles');
const serviceRoutes = require('./routes/services');
const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: [
    'https://motomanutencao.up.railway.app',
    'http://localhost:3000'
  ],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'MotoManutenção API está funcionando!',
    timestamp: new Date().toISOString()
  });
});

// ✅ ROTA API RAIZ - ADICIONAR ESTA ROTA
app.get('/api', (req, res) => {
  res.json({
    name: 'MotoManutenção API',
    version: '1.0.0',
    status: 'Online',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    endpoints: {
      auth: '/api/auth',
      vehicles: '/api/vehicles',
      services: '/api/services',
      users: '/api/users',
      health: '/api/health'
    }
  });
});

// Rota raiz do servidor
app.get('/', (req, res) => {
  res.redirect('/api');
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});