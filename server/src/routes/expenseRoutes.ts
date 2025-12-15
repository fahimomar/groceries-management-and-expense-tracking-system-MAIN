import { Router } from "express";
import { getMonthlyExpenses } from "../controllers/expenseController";

const router = Router();

router.get("/", getMonthlyExpenses);

export default router;
