import { Request, Response } from "express";
import { predictAllProducts } from "../services/predictionService";

export async function getPredictedNeeds(req: Request, res: Response) {
  try {
    const result = await predictAllProducts();
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Prediction failed" });
  }
}
