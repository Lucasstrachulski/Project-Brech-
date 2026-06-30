const API_URL = '/api/products';

let currentCategory = 'todos';
let allProducts = [];

document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  initNavigation();
  initModal();
});

function initNavigation() {
  const navBtns = document.querySelectorAll('.nav-btn');
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      navBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.category;
      loadProducts();
    });
  });
}

function initModal() {
  const modal = document.getElementById('productModal');
  const closeBtn = document.getElementById('modalClose');

  closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

function openModal(productId) {
  const product = allProducts.find(p => p.id === productId);
  if (!product) return;

  const modal = document.getElementById('productModal');
  const modalImage = document.getElementById('modalImage');
  const modalCategory = document.getElementById('modalCategory');
  const modalTitle = document.getElementById('modalTitle');
  const modalDescription = document.getElementById('modalDescription');
  const modalPrice = document.getElementById('modalPrice');
  const modalWhatsapp = document.getElementById('modalWhatsapp');

  if (product.image) {
    modalImage.innerHTML = `<img src="${product.image}" alt="${product.title}">`;
  } else {
    modalImage.innerHTML = `<i class="fas fa-tshirt"></i>`;
  }

  modalCategory.textContent = product.category;
  modalTitle.textContent = product.title;
  modalDescription.textContent = product.description;
  modalPrice.textContent = product.price.toFixed(2);

  const whatsappMsg = encodeURIComponent(
    `Olá! Tenho interesse na peça "${product.title}" que vi no site por R$ ${product.price.toFixed(2)}. Ainda está disponível?`
  );
  modalWhatsapp.href = `https://api.whatsapp.com/send?phone=${product.whatsapp}&text=${whatsappMsg}`;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('productModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

async function loadProducts() {
  try {
    const url = currentCategory === 'todos'
      ? API_URL
      : `${API_URL}?category=${currentCategory}`;

    const response = await fetch(url);
    const products = await response.json();
    allProducts = products;

    renderProducts(products);
  } catch (error) {
    console.error('Erro ao carregar produtos:', error);
  }
}

function renderProducts(products) {
  const grid = document.getElementById('productsGrid');
  const emptyState = document.getElementById('emptyState');

  if (products.length === 0) {
    grid.innerHTML = '';
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';

  grid.innerHTML = products.map(product => {
    const imageHtml = product.image
      ? `<img src="${product.image}" alt="${product.title}">`
      : `<i class="fas fa-tshirt"></i>`;

    return `
      <a href="/produto?id=${product.id}" class="product-card">
        <div class="product-image">
          ${imageHtml}
        </div>
        <div class="product-info">
          <span class="product-category">${product.category}</span>
          <h3 class="product-title">${product.title}</h3>
          <p class="product-description">${product.description}</p>
          <div class="product-price">${product.price.toFixed(2)}</div>
        </div>
      </a>
    `;
  }).join('');
}
