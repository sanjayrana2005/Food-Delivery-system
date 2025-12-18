import mongoose from "mongoose";

const cartSchema =new mongoose.Schema({
     userId:{
        type:mongoose.Schema.ObjectId,
        ref:"user"
    },
    foodId:{
        type:mongoose.Schema.ObjectId,
        ref:"food"
    },
    quantity:{
        type:Number,
        default:1
    },
   
},{timestamps:true});

const cartModel = new mongoose.model("cart",cartSchema);
export default cartModel;