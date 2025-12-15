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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRecipes = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
/**
 * AI Recipe Generator (Groq)
 */
const generateRecipes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { ingredients } = req.body;
        if (!ingredients || !Array.isArray(ingredients)) {
            return res.status(400).json({ error: "Ingredients must be an array." });
        }
        // Dynamically import Groq (keeps build clean)
        const Groq = (yield import("groq-sdk")).default;
        const groq = new Groq({
            apiKey: process.env.GROQ_API_KEY || "",
        });
        const prompt = `
      You are a recipe generator AI.
      Create 3 simple, easy-to-follow recipes using ONLY these ingredients: ${ingredients.join(", ")}.

      Answer ONLY in valid JSON ARRAY FORMAT like this example:

      [
        {
          "name": "Recipe Name",
          "difficulty": "Easy/Medium/Hard",
          "ingredients": ["ing1", "ing2"],
          "steps": ["step 1", "step 2"]
        }
      ]
    `;
        // ✅ Updated model name (old one was decommissioned)
        const completion = yield groq.chat.completions.create({
            model: "llama-3.1-8b-instant", // ✅ updated & working model
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
        });
        const raw = ((_b = (_a = completion.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) || "";
        // -----------------------------
        // Safe JSON Extraction
        // -----------------------------
        const jsonMatch = raw.match(/\[[\s\S]*\]/);
        let recipes = [];
        if (jsonMatch) {
            try {
                recipes = JSON.parse(jsonMatch[0]);
            }
            catch (err) {
                console.error("JSON parse error:", err);
            }
        }
        // Fallback to empty list
        if (!Array.isArray(recipes))
            recipes = [];
        return res.json({ recipes });
    }
    catch (error) {
        console.error("🔥 GROQ ERROR:", error);
        return res.status(500).json({ error: "Failed to generate recipes." });
    }
});
exports.generateRecipes = generateRecipes;
