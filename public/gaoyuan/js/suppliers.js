const API_URL = '/api/suppliers';

let searchTimer = null;

// Check authentication
document.addEventListener('DOMContentLoaded', function() {
  const user = localStorage.getItem('user');
  if (!user) {
    window.location.href = 'index.html';
    return;
  }
  loadSuppliers();
});

// debounce search
function debouncedSearch() {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => loadSuppliers(), 250);
}

// Load suppliers from API
async function loadSuppliers() {
  const category = document.getElementById('categoryFilter').value;
  const search = document.getElementById('searchInput').value;

  let url = API_URL;
  const params = new URLSearchParams();
  if (category) params.append('category', category);
  if (search && search.trim()) params.append('search', search.trim());
  if (params.toString()) url += '?' + params.toString();

  try {
    const res = await fetch(url);
    const suppliers = await res.json();
    renderSuppliers(suppliers);
  } catch (err) {
    console.error('Error loading suppliers:', err);
  }
}

// Render suppliers to table
function renderSuppliers(suppliers) {
  const tbody = document.getElementById('suppliersBody');

  if (!Array.isArray(suppliers) || suppliers.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" class="empty-state">No suppliers found. Click "Add Supplier" to create one.</td></tr>';
    return;
  }

  tbody.innerHTML = suppliers.map(s => {
    const cats = Array.isArray(s.categories) ? s.categories.join(', ') : (s.categories || '');
    const rating = (s.rating === undefined || s.rating === null || s.rating === '') ? 3 : s.rating;

    return `
      <tr>
        <td><strong>${escapeHtml(s.companyName || '')}</strong><div class="muted">${escapeHtml(s.address || '')}</div></td>
        <td>${escapeHtml(s.contactPerson || '')}</td>
        <td>${escapeHtml(s.phone || '')}</td>
        <td>${escapeHtml(s.email || '')}</td>
        <td class="categories">${escapeHtml(cats)}</td>
        <td><span class="rating">${rating} ★</span></td>
        <td class="muted">${escapeHtml((s.notes || '').slice(0, 80))}${(s.notes && s.notes.length > 80) ? '…' : ''}</td>
        <td class="actions">
          <button class="btn-edit" onclick="editSupplier('${s._id}')">Edit</button>
          <button class="btn-delete" onclick="deleteSupplier('${s._id}')">Delete</button>
        </td>
      </tr>
    `;
  }).join('');
}

// Open modal for adding new supplier
function openModal() {
  document.getElementById('modalTitle').textContent = 'Add New Supplier';
  document.getElementById('supplierForm').reset();
  document.getElementById('supplierId').value = '';
  document.getElementById('rating').value = '3';
  document.getElementById('supplierModal').classList.add('active');
}

// Close modal
function closeModal() {
  document.getElementById('supplierModal').classList.remove('active');
}

// Edit supplier
async function editSupplier(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    const supplier = await res.json();

    document.getElementById('modalTitle').textContent = 'Edit Supplier';
    document.getElementById('supplierId').value = supplier._id;

    document.getElementById('companyName').value = supplier.companyName || '';
    document.getElementById('contactPerson').value = supplier.contactPerson || '';
    document.getElementById('phone').value = supplier.phone || '';
    document.getElementById('email').value = supplier.email || '';
    document.getElementById('address').value = supplier.address || '';
    document.getElementById('categories').value = Array.isArray(supplier.categories) ? supplier.categories.join(', ') : (supplier.categories || '');
    document.getElementById('rating').value = String(supplier.rating ?? 3);
    document.getElementById('notes').value = supplier.notes || '';

    document.getElementById('supplierModal').classList.add('active');
  } catch (err) {
    console.error('Error loading supplier:', err);
  }
}

// Delete supplier
async function deleteSupplier(id) {
  if (!confirm('Are you sure you want to delete this supplier?')) return;

  try {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    loadSuppliers();
  } catch (err) {
    console.error('Error deleting supplier:', err);
  }
}

// Handle form submit
document.getElementById('supplierForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const id = document.getElementById('supplierId').value;

  const supplier = {
    companyName: document.getElementById('companyName').value,
    contactPerson: document.getElementById('contactPerson').value,
    phone: document.getElementById('phone').value,
    email: document.getElementById('email').value,
    address: document.getElementById('address').value,
    categories: document.getElementById('categories').value
        .split(',')
        .map(s => s.trim())
        .filter(Boolean),
    rating: document.getElementById('rating').value,
    notes: document.getElementById('notes').value
  };

  try {
    const url = id ? `${API_URL}/${id}` : API_URL;
    const method = id ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(supplier)
    });

    closeModal();
    loadSuppliers();
  } catch (err) {
    console.error('Error saving supplier:', err);
  }
});

// Logout
function logout() {
  localStorage.removeItem('user');
  window.location.href = 'index.html';
}

// Close modal when clicking outside
document.getElementById('supplierModal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

// Basic HTML escape for safety in table render
function escapeHtml(str) {
  return String(str)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
}
