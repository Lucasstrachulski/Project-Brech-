const API_URL = '/api/products';
const AUTH_URL = '/api/auth';

let authToken = localStorage.getItem('brecho_auth');
let editingId = null;

document.addEventListener('DOMContentLoaded', () => {
  if (authToken) {
    showDashboard();
    loadProducts();
  } else {
    showLogin();
  }

  initLoginForm();
  initProductForm();
  initLogout();
});

function showLogin() {
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('adminDashboard').style.display = 'none';
}

function showDashboard() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('adminDashboard').style.display = 'block';
}

function initLoginForm() {
  const form = document.getElementById('loginForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const password = document.getElementById('password').value;
    const errorEl = document.getElementById('loginError');

    try {
      const response = await fetch(AUTH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (response.ok) {
        authToken = data.token;
        localStorage.setItem('brecho_auth', authToken);
        showDashboard();
        loadProducts();
      } else {
        errorEl.style.display = 'block';
      }
    } catch (error) {
      errorEl.style.display = 'block';
    }
  });
}

function initLogout() {
  document.getElementById('logoutBtn').addEventListener('click', () => {
    authToken = null;
    localStorage.removeItem('brecho_auth');
    showLogin();
  });
}

function initProductForm() {
  const form = document.getElementById('productForm');
  const imageInput = document.getElementById('image');
  const imagePreview = document.getElementById('imagePreview');
  const previewImg = document.getElementById('previewImg');
  const removeImageBtn = document.getElementById('removeImage');
  const cancelBtn = document.getElementById('cancelBtn');

  imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        previewImg.src = event.target.result;
        imagePreview.style.display = 'block';
      };
      reader.readAsDataURL(file);
    }
  });

  removeImageBtn.addEventListener('click', () => {
    imageInput.value = '';
    imagePreview.style.display = 'none';
    previewImg.src = '';
  });

  cancelBtn.addEventListener('click', () => {
    resetForm();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await saveProduct();
  });
}

async function saveProduct() {
  const form = document.getElementById('productForm');
  const formData = new FormData();

  formData.append('title', document.getElementById('title').value);
  formData.append('description', document.getElementById('description').value);
  formData.append('price', document.getElementById('price').value);
  formData.append('category', document.getElementById('category').value);
  formData.append('whatsapp', document.getElementById('whatsapp').value);

  const imageFile = document.getElementById('image').files[0];
  if (imageFile) {
    formData.append('image', imageFile);
  }

  try {
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;
    const method = editingId ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { 'X-Admin-Password': authToken },
      body: formData
    });

    if (response.ok) {
      showToast(editingId ? 'Peça atualizada com sucesso!' : 'Peça cadastrada com sucesso!');
      resetForm();
      loadProducts();
    } else {
      const data = await response.json();
      showToast(data.error || 'Erro ao salvar peça', true);
    }
  } catch (error) {
    showToast('Erro ao conectar com o servidor', true);
  }
}

async function loadProducts() {
  try {
    const response = await fetch(API_URL, {
      headers: { 'X-Admin-Password': authToken }
    });
    const products = await response.json();
    renderProductsList(products);
  } catch (error) {
    console.error('Erro ao carregar produtos:', error);
  }
}

function renderProductsList(products) {
  const list = document.getElementById('productsList');
  const empty = document.getElementById('emptyAdmin');

  if (products.length === 0) {
    list.innerHTML = '';
    empty.style.display = 'block';
    return;
  }

  empty.style.display = 'none';

  list.innerHTML = products.map(product => {
    const imageHtml = product.image
      ? `<img src="${product.image}" alt="${product.title}">`
      : `<i class="fas fa-tshirt"></i>`;

    return `
      <div class="product-item">
        <div class="product-item-image">
          ${imageHtml}
        </div>
        <div class="product-item-info">
          <h4>${product.title}</h4>
          <span class="category-badge">${product.category}</span>
          <div class="price">R$ ${product.price.toFixed(2)}</div>
        </div>
        <div class="product-item-actions">
          <button class="btn-edit" onclick="editProduct('${product.id}')" title="Editar">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn-delete" onclick="deleteProduct('${product.id}')" title="Excluir">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

async function editProduct(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      headers: { 'X-Admin-Password': authToken }
    });
    const product = await response.json();

    editingId = id;
    document.getElementById('productId').value = id;
    document.getElementById('title').value = product.title;
    document.getElementById('description').value = product.description;
    document.getElementById('price').value = product.price;
    document.getElementById('category').value = product.category;
    document.getElementById('whatsapp').value = product.whatsapp;

    if (product.image) {
      document.getElementById('previewImg').src = product.image;
      document.getElementById('imagePreview').style.display = 'block';
    }

    document.getElementById('cancelBtn').style.display = 'flex';
    document.querySelector('.form-section h2').innerHTML =
      '<i class="fas fa-edit"></i> Editar Peça';

    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (error) {
    showToast('Erro ao carregar produto', true);
  }
}

async function deleteProduct(id) {
  if (!confirm('Tem certeza que deseja excluir esta peça?')) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: { 'X-Admin-Password': authToken }
    });

    if (response.ok) {
      showToast('Peça excluída com sucesso!');
      loadProducts();
    } else {
      showToast('Erro ao excluir peça', true);
    }
  } catch (error) {
    showToast('Erro ao conectar com o servidor', true);
  }
}

function resetForm() {
  editingId = null;
  document.getElementById('productForm').reset();
  document.getElementById('productId').value = '';
  document.getElementById('imagePreview').style.display = 'none';
  document.getElementById('previewImg').src = '';
  document.getElementById('cancelBtn').style.display = 'none';
  document.querySelector('.form-section h2').innerHTML =
    '<i class="fas fa-plus-circle"></i> Cadastrar Nova Peça';
}

function showToast(message, isError = false) {
  const existingToast = document.querySelector('.toast');
  if (existingToast) existingToast.remove();

  const toast = document.createElement('div');
  toast.className = `toast ${isError ? 'error' : ''}`;
  toast.innerHTML = `
    <i class="fas fa-${isError ? 'exclamation-circle' : 'check-circle'}"></i>
    ${message}
  `;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}
