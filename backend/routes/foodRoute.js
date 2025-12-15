import express from 'express';
import { addFood, listFood, removeFood } from '../controllers/foodController.js';
import upload from "../middleware/multer.js";
const foodRouter = express.Router();

foodRouter.get("/list",listFood);
foodRouter.post("/add",upload.single('image'),addFood);
foodRouter.delete("/remove",removeFood);

export default foodRouter;