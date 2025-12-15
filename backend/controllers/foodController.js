import { addFoodControllerValidation } from "../middleware/foodValidation.js";
import foodModel from "../models/foodModel.js";
import cloudinary from "../utils/cloudinary.js";
import fs from "fs"

// all food list
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({})
        res.json({ success: true, foods })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }

}

// add food
const addFood = async (req, res) => {
    const image = req.file;
    try {
        addFoodControllerValidation(req);
        const cloudinaryRes = await cloudinary.uploader.upload(image.path, {
            folder: "Food-del",
            resource_type: "auto"
        });

        let imageData = {
            url: cloudinaryRes.secure_url,       // Cloudinary URL
            public_id: cloudinaryRes.public_id // Cloudinary public_id
        }
        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: imageData,
        });



        await food.save();
        res.json({ success: true, message: "Food Added", food });
    } catch (error) {
        if (req.file && req.file.path) {
            fs.unlinkSync(req.file.path)
        }
        res.json({ success: false, message: error.message });
    } finally {
        if (req.file && req.file.path) {
            return fs.unlinkSync(req.file.path);
        }
    }
}

// delete food
const removeFood = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.json({ success: false, message: "Select food to delete or provide id" })
        }
        const food = await foodModel.findById(id);

        if (!food) {
            return res.json({ success: false, message: "Food already removed" })
        }

        await cloudinary.uploader.destroy(food.image.public_id);

        await foodModel.findByIdAndDelete(id)
        res.json({ success: true, message: "Food Removed" })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }

}

export { listFood, addFood, removeFood }