"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server/src/routes/expiryRoutes.ts
const express_1 = __importDefault(require("express"));
const expiryController_1 = require("../controllers/expiryController");
const router = express_1.default.Router();
// Route: GET /api/expiring
router.get("/", expiryController_1.getExpiringSoonProducts);
exports.default = router;
