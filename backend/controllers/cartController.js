import userModel from "../models/userModel.js";

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Increment the cartData number
    user.cartData = (user.cartData || 0) + 1;

    await user.save();

    res.status(200).json({
      success: true,
      cartData: user.cartData
    });
  } catch (error) {
    console.error("Add cart error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { itemId } = req.body;

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const cart = user.cartData || new Map();

    if (cart.has(itemId)) {
      const qty = cart.get(itemId) - 1;
      if (qty <= 0) cart.delete(itemId);
      else cart.set(itemId, qty);
    }

    user.cartData = cart;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Removed from cart",
      cartData: Object.fromEntries(cart)
    });
  } catch (error) {
    console.error("Remove from cart error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get user cart
const getCart = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
     
    let cartData = user.cartData || 0;
    cartData = cartData + 1;
    

    res.status(200).json({
      success: true,
      cartData
    });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export { addToCart, removeFromCart, getCart };
