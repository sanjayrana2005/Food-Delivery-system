import express from 'express';
import { addFoodToCart, clearCart, getUserCart, removeFoodFromCart } from '../controllers/cartController.js';
import authMiddleware from '../middleware/auth.js';

const cartRouter = express.Router();

cartRouter.post("/add",authMiddleware,addFoodToCart);
cartRouter.delete("/remove",authMiddleware,removeFoodFromCart);
cartRouter.post("/clear", authMiddleware, clearCart);
cartRouter.get("/get",authMiddleware,getUserCart);

export default cartRouter;