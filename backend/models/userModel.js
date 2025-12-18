import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  role: {
    type: String,
    enum: ["user", "admin"], // allowed values only
    default: "user",         // always user by default
  },
  cartData: {
    type:mongoose.Schema.ObjectId,
    ref:"cart"
  },
}, { minimize: false })

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;