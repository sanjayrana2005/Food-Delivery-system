import userModel from "../models/userModel.js"

// add to user cart  
const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { itemId } = req.body;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Ensure cartData exists
    let cartData = user.cartData || {};

    // Add or increment item
    cartData[itemId] = (cartData[itemId] || 0) + 1;

    // Save back to DB
    user.cartData = cartData;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Added to cart",
      cartData
    });

  } catch (error) {
    console.error("Add to cart error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


// remove food from user cart
const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { itemId } = req.body;

    const user = await userModel.findById(userId);
    let cartData = user.cartData || {};

    if (cartData[itemId]) {
      cartData[itemId] -= 1;
      if (cartData[itemId] <= 0) {
        delete cartData[itemId];
      }
    }

    user.cartData = cartData;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Removed from cart",
      cartData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


// get user cart
const getCart = async (req, res) => {
   try {
      let userData = await userModel.findById(req.body.userId);
      let cartData = await userData.cartData;
      res.json({ success: true, cartData:cartData });
   } catch (error) {
      console.log(error);
      res.json({ success: false, message: "Error" })
   }
}


export { addToCart, removeFromCart, getCart }