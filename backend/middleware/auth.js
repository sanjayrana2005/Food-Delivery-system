import jwt from 'jsonwebtoken';
import "dotenv/config"
import userModel from '../models/userModel.js';

const authMiddleware = async (req, res, next) => {
    const { foodDelToken } = req.cookies;
    if (!foodDelToken) {
        return res.json({success:false,message:'Not Authorized Login'});
    }
    try {
        const token_decode =  jwt.verify(foodDelToken, process.env.JWT_TOKEN_SECRETE);
        if(!token_decode){
            return res.json({success:false,message:'Not Authorized Login'})
        }
        const {id} = token_decode;
        const user = await userModel.findById({_id:id});
        req.user = user;
        next();
    } catch (error) {
        return res.json({success:false,message:error.message});
    }
}

export default authMiddleware;