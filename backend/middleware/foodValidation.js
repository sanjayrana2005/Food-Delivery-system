export const addFoodControllerValidation = (req) => {
    const {name,description,price,category} = req.body;
  
    if(!req.file){
        throw new Error("Please upload food image");
    }

    if(!name){
        throw new Error("Name is required");
    } else if(name.trim().length > 20){
        throw new Error("Food name must below 20 characters");
    }

    if(!description){
        throw new Error("Description is required");
    } else if(description.trim().length > 100){
        throw new Error("Food Description must below 100 characters");
    }

    if(!price){
        throw new Error("Price is required");
    } 

    if(!category){
        throw new Error("Category is required");
    } 
    return true;
}