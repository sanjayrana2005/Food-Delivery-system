export const isAdmin = (req,res,next) => {
    const user = req.user;
    if(user.role !== "admin"){
        return res.json({success:false,message:"Unauthorized"});
    }

    next();
}