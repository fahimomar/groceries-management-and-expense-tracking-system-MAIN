"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productController_1 = require("../controllers/productController");
const expiryController_1 = require("../controllers/expiryController");
const router = express_1.default.Router();
router.get("/", productController_1.getProducts);
router.post("/", productController_1.createProduct);
router.delete("/:id", productController_1.deleteProduct);
// ⭐ Add this:
router.get("/expiring-soon", expiryController_1.getExpiringSoonProducts);
exports.default = router;
