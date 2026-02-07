const API_URL = '/api/products';

// Check authentication
document.addEventListener('DOMContentLoaded', function() {
  const user = localStorage.getItem('user');
  if (!user) {
    window.location.href = 'index.html';
    return;
  }
  loadProducts();
});

// Load products from API
async function loadProducts() {
  const category = document.getElementById('categoryFilter').value;
  const status = document.getElementById('statusFilter').value;
  
  let url = API_URL;
  const params = new URLSearchParams();
  if (category) params.append('category', category);
  if (status) params.append('status', status);
  if (params.toString()) url += '?' + params.toString();
  
  try {
    const res = await fetch(url);
    const products = await res.json();
    renderProducts(products);
  } catch (err) {
    console.error('Error loading products:', err);
  }
}

// Render products to grid
function renderProducts(products) {
  const grid = document.getElementById('productsGrid');
  
  if (products.length === 0) {
    grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#666;padding:40px;">No products found. Click "Add Product" to create one.</p>';
    return;
  }
  
  grid.innerHTML = products.map(p => `
    <div class="product-card">
      <div class="product-image">
        ${p.image ? `<img src="${p.image}" alt="${p.name}">` : 'No Image'}
      </div>
      <div class="product-info">
        <h3>${p.name}</h3>
        <div class="price">$${p.price.toFixed(2)}</div>
        <div class="meta">
          ${p.category} | Stock: ${p.inventory || 0}
        </div>
        <span class="status ${p.status}">${p.status}</span>
        <div class="product-actions">
          <button class="btn-edit" onclick="editProduct('${p._id}')">Edit</button>
          <button class="btn-delete" onclick="deleteProduct('${p._id}')">Delete</button>
        </div>
      </div>
    </div>
  `).join('');
}

// Open modal for adding new product
function openModal() {
  document.getElementById('modalTitle').textContent = 'Add New Product';
  document.getElementById('productForm').reset();
  document.getElementById('productId').value = '';
  document.getElementById('productModal').classList.add('active');
}

// Close modal
function closeModal() {
  document.getElementById('productModal').classList.remove('active');
}

// Edit product
async function editProduct(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    const product = await res.json();
    
    document.getElementById('modalTitle').textContent = 'Edit Product';
    document.getElementById('productId').value = product._id;
    document.getElementById('productName').value = product.name;
    document.getElementById('productImage').value = product.image || '';
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productSizes').value = (product.sizes || []).join(', ');
    document.getElementById('productColors').value = (product.colors || []).join(', ');
    document.getElementById('productInventory').value = product.inventory || 0;
    document.getElementById('productStatus').value = product.status;
    
    document.getElementById('productModal').classList.add('active');
  } catch (err) {
    console.error('Error loading product:', err);
  }
}

// Delete product
async function deleteProduct(id) {
  if (!confirm('Are you sure you want to delete this product?')) return;
  
  try {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    loadProducts();
  } catch (err) {
    console.error('Error deleting product:', err);
  }
}

// Handle form submit
document.getElementById('productForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const id = document.getElementById('productId').value;
  const product = {
    name: document.getElementById('productName').value,
    image: document.getElementById('productImage').value,
    price: document.getElementById('productPrice').value,
    category: document.getElementById('productCategory').value,
    sizes: document.getElementById('productSizes').value.split(',').map(s => s.trim()).filter(Boolean),
    colors: document.getElementById('productColors').value.split(',').map(s => s.trim()).filter(Boolean),
    inventory: document.getElementById('productInventory').value,
    status: document.getElementById('productStatus').value
  };
  
  try {
    const url = id ? `${API_URL}/${id}` : API_URL;
    const method = id ? 'PUT' : 'POST';
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    
    closeModal();
    loadProducts();
  } catch (err) {
    console.error('Error saving product:', err);
  }
});

// Logout
function logout() {
  localStorage.removeItem('user');
  window.location.href = 'index.html';
}

// Close modal when clicking outside
document.getElementById('productModal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});