import express from "express";
import { getRecipeSuggestions } from "../controllers/recipeController";

const router = express.Router();

router.get("/suggest", getRecipeSuggestions);

export default router;
