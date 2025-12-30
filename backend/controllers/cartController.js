import cartModel from "../models/cartModel.js";
import userModel from "../models/userModel.js";

// ADD FOOD TO CART
export const addFoodToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { foodId } = req.body;

    // check if cart item exists for this user and food
    let cartItem = await cartModel.findOne({ userId, foodId });

    if (cartItem) {
      // same food → increase quantity
      cartItem.quantity += 1;
      await cartItem.save();
    } else {
      // new food → create cart item
      cartItem = await cartModel.create({
        userId,
        foodId,
        quantity: 1,
      });
    }

    // add cartId to user.cartData (no duplicates)
    await userModel.findByIdAndUpdate(
      userId,
      { $addToSet: { cartData: cartItem._id } }
    );

    res.status(200).json({
      success: true,
      message: "Food added to cart",
      data: cartItem,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};



// REMOVE FOOD FROM CART
export const removeFoodFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { foodId } = req.body;

    const cartItem = await cartModel.findOne({ userId, foodId });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    if (cartItem.quantity > 1) {
      cartItem.quantity -= 1;
      await cartItem.save();
    } else {
      await cartModel.findByIdAndDelete(cartItem._id);
    }

    return res.status(200).json({
      success: true,
      message: "Food removed from cart",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// cartController.js
export const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;

    // Delete all cart items for the user
    await cartModel.deleteMany({ userId });

    // Clear user's cartData array
    await userModel.findByIdAndUpdate(userId, { cartData: [] });

    res.json({ success: true, message: "Cart cleared" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error clearing cart" });
  }
};



export const getUserCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cartItems = await cartModel
      .find({ userId })
      .populate("foodId");

    res.status(200).json({
      success: true,
      cartItems,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

