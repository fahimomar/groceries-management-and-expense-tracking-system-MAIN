// server/src/controllers/productController.ts

import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export const getExpiringSoonProducts = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(now.getDate() + 7);

    // Find products expiring within 7 days
    const expiring = await prisma.products.findMany({
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
  } catch (err) {
    console.error("Error fetching expiring items:", err);
    res.status(500).json({ message: "Failed to load expiring items" });
  }
};


/* ============================
   GET ALL PRODUCTS
============================ */
export const getProducts = async (req: Request, res: Response) => {
  try {
    const search = req.query.search as string | undefined;

    const products = await prisma.products.findMany({
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
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

/* ============================
   CREATE PRODUCT + PURCHASE
============================ */
export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
      price,
      rating,
      stockQuantity,
      expiryDate,
      storageLocation, // ⭐ NEW
    } = req.body;

    // Validate required fields
    if (!name || price === undefined || stockQuantity === undefined) {
      return res.status(400).json({
        message: "Missing required fields: name, price, stockQuantity",
      });
    }

    // 1️⃣ Create Product
    const product = await prisma.products.create({
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
    await prisma.purchases.create({
      data: {
        productId: product.productId,
        quantity: Number(stockQuantity),
        unitCost: Number(price),
        totalCost: Number(price) * Number(stockQuantity),
        timestamp: new Date(),
      },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Failed to create product" });
  }
};

/* ============================
   DELETE PRODUCT (Cascade Safe)
============================ */
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    console.log("🗑️ DELETE REQUEST:", id);

    // 1️⃣ Check if product exists
    const exists = await prisma.products.findUnique({
      where: { productId: id },
    });

    console.log("🔍 PRODUCT FOUND:", exists);

    if (!exists) {
      console.log("❌ PRODUCT NOT FOUND");
      return res.status(404).json({ message: "Product not found" });
    }

    // 2️⃣ Delete related Purchases (CASCADE FIX)
    await prisma.purchases.deleteMany({
      where: { productId: id },
    });

    // 3️⃣ Delete related Sales (optional but safe)
    await prisma.sales.deleteMany({
      where: { productId: id },
    });

    // 4️⃣ Now delete the product
    await prisma.products.delete({
      where: { productId: id },
    });

    console.log("✅ PRODUCT DELETED:", id);

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("🔥 ERROR deleting product:", error);
    res.status(500).json({ message: "Failed to delete product" });
  }
};
