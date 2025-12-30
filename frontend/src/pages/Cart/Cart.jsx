import React, { useContext } from 'react';
import './Cart.css';
import { StoreContext } from '../../Context/StoreContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    currency,
    deliveryCharge
  } = useContext(StoreContext);

  const navigate = useNavigate();

  // ✅ Calculate total from backend cartItems
  const getTotalCartAmount = () => {
    return Array.isArray(cartItems)
      ? cartItems.reduce(
          (total, item) => total + item.foodId.price * item.quantity,
          0
        )
      : 0;
  };

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Image</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />

        {/* ✅ Empty cart */}
        {(!cartItems || cartItems.length === 0) && (
          <h1 className="no-food-in-cart">No food added to cart</h1>
        )}

        {/* ✅ Render cart items */}
        {Array.isArray(cartItems) &&
          cartItems.map((item) => (
            <div key={item._id}>
              <div className="cart-items-title cart-items-item">
                <img
                  src={item.foodId.image.url}
                  alt={item.foodId.name}
                />
                <p>{item.foodId.name}</p>
                <p>{currency}{item.foodId.price}</p>
                <div>{item.quantity}</div>
                <p>{currency}{item.foodId.price * item.quantity}</p>
                <p
                  className="cart-items-remove-icon"
                  onClick={() => removeFromCart(item.foodId._id)}
                >
                  x
                </p>
              </div>
              <hr />
            </div>
          ))}
      </div>

      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>{currency}{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>
                {currency}
                {getTotalCartAmount() === 0 ? 0 : deliveryCharge}
              </p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>
                {currency}
                {getTotalCartAmount() === 0
                  ? 0
                  : getTotalCartAmount() + deliveryCharge}
              </b>
            </div>
          </div>

          <button onClick={() => navigate('/order')}>
            PROCEED TO CHECKOUT
          </button>
        </div>

        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, Enter it here</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder="Promo code" />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
