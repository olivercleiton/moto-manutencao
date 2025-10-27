const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const vehicleRoutes = require('./routes/vehicles');
const serviceRoutes = require('./routes/services');
const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 3000; 

// Middleware
app.use(cors({
  origin: true,
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

// ✅ ROTA API RAIZ
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

// ✅ SERVIR FRONTEND ESTÁTICO
if (process.env.NODE_ENV === 'production') {
  console.log('📁 Servindo frontend estático da pasta:', path.join(__dirname, '../frontend'));
  
  // Servir arquivos estáticos do frontend
  app.use(express.static(path.join(__dirname, '../frontend')));
  
  // Para qualquer rota que não seja /api, servir o frontend
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
  });
}

// Rota raiz do servidor - AGORA VEM DEPOIS DO FRONTEND
app.get('/', (req, res) => {
  res.json({
    message: 'Bem-vindo à MotoManutenção API',
    documentation: 'Acesse /api para informações completas da API',
    status: 'Online',
    timestamp: new Date().toISOString()
  });
});

// ✅ MIDDLEWARE DE ROTA NÃO ENCONTRADA (404)
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    path: req.originalUrl,
    message: 'Verifique a documentação em /api'
  });
});

// ✅ ERROR HANDLER GLOBAL
app.use((error, req, res, next) => {
  console.error('Erro no servidor:', error);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Algo deu errado. Tente novamente mais tarde.',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'production'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});