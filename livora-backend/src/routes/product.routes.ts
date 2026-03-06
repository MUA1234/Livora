import express from "express";
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} from "../controllers/product.controller";
import { authMiddleware, adminOnly } from "../middleware/auth.middleware";

const router = express.Router();

router.route("/").get(getAllProducts).post(authMiddleware, adminOnly, createProduct);

router
    .route("/:id")
    .get(getProductById)
    .put(authMiddleware, adminOnly, updateProduct)
    .delete(authMiddleware, adminOnly, deleteProduct);

export default router;
