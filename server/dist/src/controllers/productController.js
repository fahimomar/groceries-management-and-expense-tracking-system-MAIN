"use strict";
// server/src/controllers/productController.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.createProduct = exports.getProducts = exports.getExpiringSoonProducts = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getExpiringSoonProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const now = new Date();
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(now.getDate() + 7);
        // Find products expiring within 7 days
        const expiring = yield prisma.products.findMany({
            where: {
                expiryDate: {
                    gte: now,
                    lte: sevenDaysFromNow,
                },
            },
            orderBy: { expiryDate: "asc" },
            take: 20,
        });
        res.json(expiring);
    }
    catch (err) {
        console.error("Error fetching expiring items:", err);
        res.status(500).json({ message: "Failed to load expiring items" });
    }
});
exports.getExpiringSoonProducts = getExpiringSoonProducts;
/* ============================
   GET ALL PRODUCTS
============================ */
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const search = req.query.search;
        const products = yield prisma.products.findMany({
            where: search
                ? {
                    name: {
                        contains: search,
                        mode: "insensitive",
                    },
                }
                : {},
            orderBy: { name: "asc" },
        });
        res.json(products);
    }
    catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Failed to fetch products" });
    }
});
exports.getProducts = getProducts;
/* ============================
   CREATE PRODUCT + PURCHASE
============================ */
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, price, rating, stockQuantity, expiryDate, storageLocation, // ⭐ NEW
         } = req.body;
        // Validate required fields
        if (!name || price === undefined || stockQuantity === undefined) {
            return res.status(400).json({
                message: "Missing required fields: name, price, stockQuantity",
            });
        }
        // 1️⃣ Create Product
        const product = yield prisma.products.create({
            data: {
                name,
                price: Number(price),
                rating: rating ? Number(rating) : null,
                stockQuantity: Number(stockQuantity),
                expiryDate: expiryDate ? new Date(expiryDate) : null,
                storageLocation: storageLocation || null, // ⭐ SAVE LOCATION
            },
        });
        // 2️⃣ Create Purchase Record for Expense Tracking
        yield prisma.purchases.create({
            data: {
                productId: product.productId,
                quantity: Number(stockQuantity),
                unitCost: Number(price),
                totalCost: Number(price) * Number(stockQuantity),
                timestamp: new Date(),
            },
        });
        res.status(201).json(product);
    }
    catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: "Failed to create product" });
    }
});
exports.createProduct = createProduct;
/* ============================
   DELETE PRODUCT (Cascade Safe)
============================ */
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        console.log("🗑️ DELETE REQUEST:", id);
        // 1️⃣ Check if product exists
        const exists = yield prisma.products.findUnique({
            where: { productId: id },
        });
        console.log("🔍 PRODUCT FOUND:", exists);
        if (!exists) {
            console.log("❌ PRODUCT NOT FOUND");
            return res.status(404).json({ message: "Product not found" });
        }
        // 2️⃣ Delete related Purchases (CASCADE FIX)
        yield prisma.purchases.deleteMany({
            where: { productId: id },
        });
        // 3️⃣ Delete related Sales (optional but safe)
        yield prisma.sales.deleteMany({
            where: { productId: id },
        });
        // 4️⃣ Now delete the product
        yield prisma.products.delete({
            where: { productId: id },
        });
        console.log("✅ PRODUCT DELETED:", id);
        res.json({ message: "Product deleted successfully" });
    }
    catch (error) {
        console.error("🔥 ERROR deleting product:", error);
        res.status(500).json({ message: "Failed to delete product" });
    }
});
exports.deleteProduct = deleteProduct;
