import express from "express";
import { generateRecipes } from "../controllers/aiController";

const router = express.Router();

router.post("/recipes", generateRecipes);

export default router;
