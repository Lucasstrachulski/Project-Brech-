const express = require('express');
const cors = require('cors');
const path = require('path');
const productRoutes = require('../src/routes/productRoutes');
const authRoutes = require('../src/routes/authRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/admin', express.static(path.join(__dirname, '..', 'admin')));

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.get('/produto', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'produto.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'admin', 'index.html'));
});

app.use((err, req, res, next) => {
  console.error('Erro:', err.message);
  res.status(500).json({ error: err.message || 'Erro interno do servidor' });
});

module.exports = app;
