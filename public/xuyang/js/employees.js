const API_URL = '/api/employees';

// Check authentication
document.addEventListener('DOMContentLoaded', function() {
  const user = localStorage.getItem('user');
  if (!user) {
    window.location.href = 'index.html';
    return;
  }
  loadEmployees();
});

// Load employees from API
async function loadEmployees() {
  const department = document.getElementById('departmentFilter').value;
  
  let url = API_URL;
  if (department) url += '?department=' + department;
  
  try {
    const res = await fetch(url);
    const employees = await res.json();
    renderEmployees(employees);
  } catch (err) {
    console.error('Error loading employees:', err);
  }
}

// Render employees to table
function renderEmployees(employees) {
  const tbody = document.getElementById('employeesBody');
  
  if (employees.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="empty-state">No employees found. Click "Add Employee" to create one.</td></tr>';
    return;
  }
  
  tbody.innerHTML = employees.map(e => `
    <tr>
      <td><strong>${e.name}</strong></td>
      <td>${e.email}</td>
      <td>${e.department}</td>
      <td>${e.position}</td>
      <td>${e.hireDate || 'N/A'}</td>
      <td><span class="status ${e.status}">${e.status}</span></td>
      <td class="actions">
        <button class="btn-edit" onclick="editEmployee('${e._id}')">Edit</button>
        <button class="btn-delete" onclick="deleteEmployee('${e._id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

// Open modal for adding new employee
function openModal() {
  document.getElementById('modalTitle').textContent = 'Add New Employee';
  document.getElementById('employeeForm').reset();
  document.getElementById('employeeId').value = '';
  document.getElementById('employeeModal').classList.add('active');
}

// Close modal
function closeModal() {
  document.getElementById('employeeModal').classList.remove('active');
}

// Edit employee
async function editEmployee(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    const employee = await res.json();
    
    document.getElementById('modalTitle').textContent = 'Edit Employee';
    document.getElementById('employeeId').value = employee._id;
    document.getElementById('employeeName').value = employee.name;
    document.getElementById('employeeEmail').value = employee.email;
    document.getElementById('employeePhone').value = employee.phone || '';
    document.getElementById('employeeDepartment').value = employee.department;
    document.getElementById('employeePosition').value = employee.position;
    document.getElementById('employeeSalary').value = employee.salary || '';
    document.getElementById('employeeHireDate').value = employee.hireDate || '';
    document.getElementById('employeeStatus').value = employee.status;
    
    document.getElementById('employeeModal').classList.add('active');
  } catch (err) {
    console.error('Error loading employee:', err);
  }
}

// Delete employee
async function deleteEmployee(id) {
  if (!confirm('Are you sure you want to delete this employee?')) return;
  
  try {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    loadEmployees();
  } catch (err) {
    console.error('Error deleting employee:', err);
  }
}

// Handle form submit
document.getElementById('employeeForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const id = document.getElementById('employeeId').value;
  const employee = {
    name: document.getElementById('employeeName').value,
    email: document.getElementById('employeeEmail').value,
    phone: document.getElementById('employeePhone').value,
    department: document.getElementById('employeeDepartment').value,
    position: document.getElementById('employeePosition').value,
    salary: document.getElementById('employeeSalary').value,
    hireDate: document.getElementById('employeeHireDate').value,
    status: document.getElementById('employeeStatus').value
  };
  
  try {
    const url = id ? `${API_URL}/${id}` : API_URL;
    const method = id ? 'PUT' : 'POST';
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employee)
    });
    
    closeModal();
    loadEmployees();
  } catch (err) {
    console.error('Error saving employee:', err);
  }
});

// Logout
function logout() {
  localStorage.removeItem('user');
  window.location.href = 'index.html';
}

// Close modal when clicking outside
document.getElementById('employeeModal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});