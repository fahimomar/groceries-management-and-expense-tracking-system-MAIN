"use strict";
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
exports.getRecipeSuggestions = void 0;
const client_1 = require("@prisma/client");
const openai_1 = require("@langchain/openai");
const prisma = new client_1.PrismaClient();
const getRecipeSuggestions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch all products with stock > 0
        const ingredients = yield prisma.products.findMany({
            where: { stockQuantity: { gt: 0 } },
            select: { name: true },
        });
        const ingredientList = ingredients.map((i) => i.name).join(", ");
        const llm = new openai_1.OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
            model: "gpt-4o-mini", // great + lightweight
            temperature: 0.5,
        });
        const prompt = `
      You are a cooking assistant.  
      Suggest **5 recipes** using only the following available ingredients:

      Ingredients: ${ingredientList}

      For each recipe include:
      - Name
      - Ingredients needed
      - Steps
      - Difficulty (Easy/Medium/Hard)

      Format the response as a JSON array.
    `;
        const response = yield llm.invoke(prompt);
        const text = response.trim();
        res.json({ recipes: JSON.parse(text) });
    }
    catch (error) {
        console.error("❌ Recipe generation error:", error);
        res.status(500).json({ message: "Failed to generate recipes" });
    }
});
exports.getRecipeSuggestions = getRecipeSuggestions;
