import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const generateToken = (id) => {
    return jwt.sign({id:id},process.env.JWT_TOKEN_SECRETE,{
        expiresIn:"7d"
    })
}

