import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { OpenAI } from "@langchain/openai";

const prisma = new PrismaClient();

export const getRecipeSuggestions = async (req: Request, res: Response) => {
  try {
    // Fetch all products with stock > 0
    const ingredients = await prisma.products.findMany({
      where: { stockQuantity: { gt: 0 } },
      select: { name: true },
    });

    const ingredientList = ingredients.map((i) => i.name).join(", ");

    const llm = new OpenAI({
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

    const response = await llm.invoke(prompt);
    const text = response.trim();

    res.json({ recipes: JSON.parse(text) });

  } catch (error) {
    console.error("❌ Recipe generation error:", error);
    res.status(500).json({ message: "Failed to generate recipes" });
  }
};
