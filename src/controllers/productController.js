const redis = require('../config/database');

const PRODUCTS_KEY = 'products';

async function getProducts() {
  const data = await redis.get(PRODUCTS_KEY);
  return data || [];
}

async function saveProducts(products) {
  await redis.set(PRODUCTS_KEY, products);
}

async function getAll(req, res) {
  const products = await getProducts();
  const { category } = req.query;
  if (category && category !== 'todos') {
    const filtered = products.filter(p => p.category === category);
    return res.json(filtered);
  }
  res.json(products);
}

async function getById(req, res) {
  const products = await getProducts();
  const product = products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
  res.json(product);
}

async function create(req, res) {
  const products = await getProducts();
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
    image: req.file ? req.file.path : null,
    createdAt: new Date().toISOString()
  };

  products.push(newProduct);
  await saveProducts(products);
  res.status(201).json(newProduct);
}

async function update(req, res) {
  const products = await getProducts();
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
    product.image = req.file.path;
  }

  products[index] = product;
  await saveProducts(products);
  res.json(product);
}

async function remove(req, res) {
  let products = await getProducts();
  const product = products.find(p => p.id === req.params.id);

  if (!product) {
    return res.status(404).json({ error: 'Produto não encontrado' });
  }

  products = products.filter(p => p.id !== req.params.id);
  await saveProducts(products);
  res.json({ message: 'Produto removido com sucesso' });
}

module.exports = { getAll, getById, create, update, remove };
