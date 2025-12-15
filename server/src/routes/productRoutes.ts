import express from "express";
import {
  getProducts,
  createProduct,
  deleteProduct,
} from "../controllers/productController";

import { getExpiringSoonProducts } from "../controllers/expiryController";

const router = express.Router();

router.get("/", getProducts);
router.post("/", createProduct);
router.delete("/:id", deleteProduct);

// ⭐ Add this:
router.get("/expiring-soon", getExpiringSoonProducts);

export default router;
