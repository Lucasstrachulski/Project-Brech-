const express = require('express');
const cors = require('cors');
const path = require('path');
const { PORT, PUBLIC_DIR, ADMIN_DIR } = require('./config');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(PUBLIC_DIR));
app.use('/admin', express.static(ADMIN_DIR));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

app.get('/produto', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'produto.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(ADMIN_DIR, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🛍️  Engordei Perdi rodando em http://localhost:${PORT}`);
  console.log(`🔐 Painel admin em http://localhost:${PORT}/admin`);
  console.log(`📋 Senha padrão do admin: brecho2024\n`);
});
