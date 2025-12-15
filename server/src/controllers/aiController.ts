import { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

/**
 * AI Recipe Generator (Groq)
 */
export const generateRecipes = async (req: Request, res: Response) => {
  try {
    const { ingredients } = req.body;

    if (!ingredients || !Array.isArray(ingredients)) {
      return res.status(400).json({ error: "Ingredients must be an array." });
    }

    // Dynamically import Groq (keeps build clean)
    const Groq = (await import("groq-sdk")).default;

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
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant", // ✅ updated & working model
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const raw = completion.choices[0]?.message?.content || "";

    // -----------------------------
    // Safe JSON Extraction
    // -----------------------------
    const jsonMatch = raw.match(/\[[\s\S]*\]/);
    let recipes = [];

    if (jsonMatch) {
      try {
        recipes = JSON.parse(jsonMatch[0]);
      } catch (err) {
        console.error("JSON parse error:", err);
      }
    }

    // Fallback to empty list
    if (!Array.isArray(recipes)) recipes = [];

    return res.json({ recipes });
  } catch (error) {
    console.error("🔥 GROQ ERROR:", error);
    return res.status(500).json({ error: "Failed to generate recipes." });
  }
};
