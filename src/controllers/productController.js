const fs = require('fs');
const path = require('path');
const { DATA_DIR } = require('../config');

const DATA_FILE = path.join(DATA_DIR, 'products.json');

function readProducts() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, '[]', 'utf-8');
  }
  const data = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(data);
}

function writeProducts(products) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2), 'utf-8');
}

function getAll(req, res) {
  const products = readProducts();
  const { category } = req.query;
  if (category && category !== 'todos') {
    const filtered = products.filter(p => p.category === category);
    return res.json(filtered);
  }
  res.json(products);
}

function getById(req, res) {
  const products = readProducts();
  const product = products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
  res.json(product);
}

function create(req, res) {
  const products = readProducts();
  const { title, description, price, category, whatsapp } = req.body;

  if (!title || !description || !price || !category) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  const newProduct = {
    id: Date.now().toString(),
    title,
    description,
    price: parseFloat(price),
    category,
    whatsapp: whatsapp || '5542988505792',
    image: req.file ? `/uploads/${req.file.filename}` : null,
    createdAt: new Date().toISOString()
  };

  products.push(newProduct);
  writeProducts(products);
  res.status(201).json(newProduct);
}

function update(req, res) {
  const products = readProducts();
  const index = products.findIndex(p => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Produto não encontrado' });
  }

  const { title, description, price, category, whatsapp } = req.body;
  const product = products[index];

  if (title) product.title = title;
  if (description) product.description = description;
  if (price) product.price = parseFloat(price);
  if (category) product.category = category;
  if (whatsapp) product.whatsapp = whatsapp;
  if (req.file) {
    if (product.image) {
      const oldPath = path.join(__dirname, '..', '..', product.image);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
    product.image = `/uploads/${req.file.filename}`;
  }

  products[index] = product;
  writeProducts(products);
  res.json(product);
}

function remove(req, res) {
  let products = readProducts();
  const product = products.find(p => p.id === req.params.id);

  if (!product) {
    return res.status(404).json({ error: 'Produto não encontrado' });
  }

  if (product.image) {
    const imagePath = path.join(__dirname, '..', '..', product.image);
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
  }

  products = products.filter(p => p.id !== req.params.id);
  writeProducts(products);
  res.json({ message: 'Produto removido com sucesso' });
}

module.exports = { getAll, getById, create, update, remove };
