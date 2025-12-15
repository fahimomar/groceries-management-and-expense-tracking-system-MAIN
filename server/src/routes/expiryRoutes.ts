// server/src/routes/expiryRoutes.ts
import express from "express";
import { getExpiringSoonProducts } from "../controllers/expiryController";

const router = express.Router();

// Route: GET /api/expiring
router.get("/", getExpiringSoonProducts);

export default router;
