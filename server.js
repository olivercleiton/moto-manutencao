// server.js unificado - MotoManutenção
const express = require('express');
const cors = require('cors');
const path = require('path');

// Rotas da API
const authRoutes = require('./routes/auth');
const vehicleRoutes = require('./routes/vehicles');
const serviceRoutes = require('./routes/services');
const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 3000;

// === CONFIGURAÇÕES ===
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://moto-manutencao.onrender.com' // ajuste pro domínio final no Render
  ],
  credentials: true
}));

app.use(express.json());

// Logs de requisição
app.use((req, res, next) => {
  console.log(`📨 ${new Date().toISOString()} | ${req.method} ${req.url}`);
  next();
});

// === ROTAS API ===
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'MotoManutenção API funcionando!',
    timestamp: new Date().toISOString()
  });
});

// === SERVIR FRONTEND ESTÁTICO ===
// (coloque seus arquivos HTML, CSS e JS na pasta /public)
app.use(express.static(path.join(__dirname, 'public')));

// Para qualquer rota não-API, devolve o index.html
app.get('*', (req, res) => {
  try {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } catch (error) {
    console.error('❌ Erro ao servir index.html:', error);
    res.status(500).send('Erro interno do servidor');
  }
});

// === ERRO GLOBAL ===
app.use((err, req, res, next) => {
  console.error('❌ Erro no servidor:', err);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo deu errado. Tente novamente mais tarde.',
    timestamp: new Date().toISOString()
  });
});

// === INICIAR SERVIDOR ===
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor MotoManutenção rodando na porta ${PORT}`);
  console.log(`📁 Servindo arquivos estáticos de: ${path.join(__dirname, 'public')}`);
});
