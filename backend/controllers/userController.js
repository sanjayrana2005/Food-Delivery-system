import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import { loginUserControllerValidation, registerControllerValidation } from "../middleware/uservalidation.js";
import { generateToken } from "../utils/generateToken.js";

//login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        loginUserControllerValidation(req);
        const user = await userModel.findOne({ email }).select("password");

        if (!user) {
            return res.json({ success: false, message: "User does not exist" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials" })
        }

        const token = generateToken(user._id);
        res.cookie("foodDelToken", token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });
        res.json({ success: true, token });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

//register user
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        registerControllerValidation(req);
        //check if user already exists
        const exists = await userModel.findOne({ email })
        if (exists) {
            return res.json({ success: false, message: "User already exists" })
        }

        // hashing user password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new userModel({ name, email, password: hashedPassword })
        const user = await newUser.save();
        const token = generateToken(user._id);

        res.cookie("foodDelToken", token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });
        res.json({ success: true, message: "Registaterd successfully", token })

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export { loginUser, registerUser }