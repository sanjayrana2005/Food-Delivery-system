import validator from "validator";

export const registerControllerValidation = (req) =>{
    const {name, email, password} = req.body;

    if(!name || !email || !password ){
        throw new Error("Fill all required fields");
    }

    if(name.trim().length > 20){
        throw new Error("Name should below 20 characters");
    }
    if(!validator.isEmail(email.trim())){
        throw new Error("Invalid email format");
    }

    if(!validator.isStrongPassword(password)){
        throw new Error("Enter a strong password");
    }

    return true;
}

export const loginUserControllerValidation = (req) => {
    const {email,password} = req.body;
    if(!email){
        throw new Error("Email is required");
    }
    if(!password){
        throw new Error("Password is required");
    }

    return true;
}