const express = require('express');
const path = require('path');
const { connectDB } = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
const productsRouter = require('./routes/products');
const suppliersRouter = require('./routes/suppliers');
const employeesRouter = require('./routes/employees');

app.use('/api/products', productsRouter);
app.use('/api/suppliers', suppliersRouter);
app.use('/api/employees', employeesRouter);

// Start server
async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Xuyang's pages: http://localhost:${PORT}/xuyang/`);
    console.log(`Gaoyuan's pages: http://localhost:${PORT}/gaoyuan/`);
  });
}

startServer();