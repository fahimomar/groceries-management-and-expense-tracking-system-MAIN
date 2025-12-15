import express from "express";
import { getPredictedNeeds } from "../controllers/predictionController";

const router = express.Router();

router.get("/", getPredictedNeeds);

export default router;
