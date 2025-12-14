import foodModel from "../models/foodModel.js";
import cloudinary from "../utils/cloudinary.js";

// all food list
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({})
        res.json({ success: true, data: foods })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }

}

// add food
const addFood = async (req, res) => {

    try {
         const image = req.body.file;
         if(!image){
            return res.json({success:false,message:"Image is required"});
         }

         let imageData;

         const cloudinaryRes = await cloudinary.uploader(image.tempFilePath,{
            folder:"Food-Del",
            overwrite:true
         });

         imageData = {
                public_id:cloudinaryRes?.public_id,
                url:cloudinaryRes?.secure_url
         }

         if(!cloudinaryRes || cloudinaryRes.error){
            return res.json({success:false,message:cloudinaryRes?.error?.message || "Image upload failed"})
         }

        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category:req.body.category,
            image: imageData,
        })

        await food.save();
        res.json({ success: true, message: "Food Added",food })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: ffff })
    }
}

// delete food
const removeFood = async (req, res) => {
    try {

        const food = await foodModel.findById(req.body.id);

        await cloudinary.uploader.destroy(food.image?.public_id);

        await foodModel.findByIdAndDelete(req.body.id)
        res.json({ success: true, message: "Food Removed" })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }

}

export { listFood, addFood, removeFood }