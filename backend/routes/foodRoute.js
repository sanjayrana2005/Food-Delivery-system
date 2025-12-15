import express from 'express';
import { addFood, listFood, removeFood } from '../controllers/foodController.js';
import upload from "../middleware/multer.js";
import authMiddleware from '../middleware/auth.js';
import { isAdmin } from '../middleware/isAdmin.js';
const foodRouter = express.Router();

foodRouter.get("/list",listFood);
foodRouter.post("/add",upload.single('image'),authMiddleware,isAdmin,addFood);
foodRouter.delete("/remove/:id",authMiddleware,isAdmin,removeFood);

export default foodRouter;