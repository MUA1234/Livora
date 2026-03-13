import express from "express";
import {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    checkWishlist
} from "../controllers/wishlist.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getWishlist);
router.post("/", addToWishlist);
router.get("/check/:productId", checkWishlist);
router.delete("/:productId", removeFromWishlist);

export default router;
