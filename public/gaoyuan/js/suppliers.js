// TODO: Gaoyuan will implement supplier management logic here

const API_URL = '/api/suppliers';

console.log('Supplier management module - To be implemented by Gaoyuan');

// Placeholder function
async function loadSuppliers() {
  try {
    const res = await fetch(API_URL);
    const suppliers = await res.json();
    console.log('Suppliers:', suppliers);
  } catch (err) {
    console.error('Error loading suppliers:', err);
  }
}

// Load suppliers on page load
document.addEventListener('DOMContentLoaded', loadSuppliers);