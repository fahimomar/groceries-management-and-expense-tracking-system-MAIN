"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
// Import routes
const aiRoutes_1 = __importDefault(require("./routes/aiRoutes"));
const recipeRoutes_1 = __importDefault(require("./routes/recipeRoutes"));
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
const expenseRoutes_1 = __importDefault(require("./routes/expenseRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const expiryRoutes_1 = __importDefault(require("./routes/expiryRoutes"));
const predictionRoutes_1 = __importDefault(require("./routes/predictionRoutes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8000;
// Middlewares
app.use((0, cors_1.default)({ origin: process.env.CLIENT_URL || "*" }));
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json({ limit: "10mb" }));
// Routes
app.use("/api/predictions", predictionRoutes_1.default);
app.use("/api/ai", aiRoutes_1.default);
app.use("/api/recipes", recipeRoutes_1.default);
app.use("/api/dashboard", dashboardRoutes_1.default);
app.use("/api/expenses", expenseRoutes_1.default);
app.use("/api/products", productRoutes_1.default);
app.use("/api/users", userRoutes_1.default);
app.use("/api/expiring", expiryRoutes_1.default);
app.use("/api/products/expiring-soon", expiryRoutes_1.default);
// Health check
app.get("/", (_req, res) => {
    res.status(200).json({ message: "🚀 API is running" });
});
// Error handler
app.use((err, _req, res, _next) => {
    console.error("🔥 Global Error Handler:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
});
// Start server
app.listen(PORT, () => {
    console.log(`✅ Server listening on http://localhost:${PORT}`);
});
exports.default = app;
