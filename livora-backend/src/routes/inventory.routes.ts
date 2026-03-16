import express from "express";
import { authMiddleware, adminOnly } from "../middleware/auth.middleware";
import { getInventory, updateStock, bulkImportProducts } from "../controllers/inventory.controller";

const router = express.Router();

router.use(authMiddleware, adminOnly);

router.get("/", getInventory);
router.put("/:id/stock", updateStock);
router.post("/bulk-import", bulkImportProducts);

export default router;
