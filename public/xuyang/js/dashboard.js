// Check authentication
document.addEventListener('DOMContentLoaded', function() {
  const user = localStorage.getItem('user');
  if (!user) {
    window.location.href = 'index.html';
    return;
  }
  
  // Display username
  const userData = JSON.parse(user);
  document.getElementById('userName').textContent = userData.username || 'User';
  
  // Load all data
  loadDashboardData();
});

async function loadDashboardData() {
  try {
    // Fetch products and employees in parallel
    const [productsRes, employeesRes] = await Promise.all([
      fetch('/api/products'),
      fetch('/api/employees')
    ]);
    
    const products = await productsRes.json();
    const employees = await employeesRes.json();
    
    // Update product stats
    updateProductStats(products);
    
    // Update employee stats
    updateEmployeeStats(employees);
    
  } catch (err) {
    console.error('Error loading dashboard data:', err);
  }
}

function updateProductStats(products) {
  const total = products.length;
  const active = products.filter(p => p.status === 'active').length;
  const lowStock = products.filter(p => p.inventory < 10);
  
  document.getElementById('totalProducts').textContent = total;
  document.getElementById('activeProducts').textContent = active;
  document.getElementById('lowStockCount').textContent = lowStock.length;
  
  // Update low stock list
  const listEl = document.getElementById('lowStockList');
  
  if (lowStock.length === 0) {
    listEl.innerHTML = '<li class="empty-state">All products are well stocked! 🎉</li>';
  } else {
    listEl.innerHTML = lowStock.map(p => `
      <li class="alert-item">
        <span class="name">${p.name}</span>
        <span class="stock ${p.inventory < 5 ? 'critical' : 'warning'}">
          ${p.inventory} in stock
        </span>
      </li>
    `).join('');
  }
}

function updateEmployeeStats(employees) {
  document.getElementById('totalEmployees').textContent = employees.length;
  
  // Count by department
  const deptCounts = {};
  employees.forEach(e => {
    const dept = e.department || 'Other';
    deptCounts[dept] = (deptCounts[dept] || 0) + 1;
  });
  
  // Update department grid
  const gridEl = document.getElementById('deptGrid');
  const departments = Object.keys(deptCounts);
  
  if (departments.length === 0) {
    gridEl.innerHTML = '<div class="empty-state">No employees yet</div>';
  } else {
    gridEl.innerHTML = departments.map(dept => `
      <div class="dept-card">
        <h4>${deptCounts[dept]}</h4>
        <p>${dept}</p>
      </div>
    `).join('');
  }
}

// Logout
function logout() {
  localStorage.removeItem('user');
  window.location.href = 'index.html';
}