import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

// Import routes
import aiRoutes from "./routes/aiRoutes";
import recipeRoutes from "./routes/recipeRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import expenseRoutes from "./routes/expenseRoutes";
import productRoutes from "./routes/productRoutes";
import userRoutes from "./routes/userRoutes";
import expiryRoutes from "./routes/expiryRoutes";
import predictionRoutes from "./routes/predictionRoutes";

const app = express();
const PORT = process.env.PORT || 8000;

// Middlewares
app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));

// Routes
app.use("/api/predictions", predictionRoutes);

app.use("/api/ai", aiRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/expiring", expiryRoutes);
app.use("/api/products/expiring-soon", expiryRoutes);

// Health check
app.get("/", (_req, res) => {
  res.status(200).json({ message: "🚀 API is running" });
});

// Error handler
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error("🔥 Global Error Handler:", err);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server listening on http://localhost:${PORT}`);
});

export default app;
