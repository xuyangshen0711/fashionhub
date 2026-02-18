import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./db.js";
import "dotenv/config";

import authRouter from "./routes/auth.js";
import productsRouter from "./routes/products.js";
import suppliersRouter from "./routes/suppliers.js";
import employeesRouter from "./routes/employees.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/suppliers", suppliersRouter);
app.use("/api/employees", employeesRouter);

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
