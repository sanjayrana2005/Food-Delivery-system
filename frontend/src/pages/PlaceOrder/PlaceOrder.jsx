import React, { useContext, useEffect, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const PlaceOrder = () => {
  const [payment, setPayment] = useState("cod");
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  });

  const { cartItems, currency, deliveryCharge, setCartItems, loadCartData, url } = useContext(StoreContext);
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || url;

  // ---------------- HANDLE INPUT ----------------
  const onChangeHandler = (e) => {
    setData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // ---------------- TOTAL ----------------
  const getTotalCartAmount = () => {
    return Array.isArray(cartItems)
      ? cartItems.reduce(
          (total, item) => total + item.foodId.price * item.quantity,
          0
        )
      : 0;
  };

  // ---------------- PLACE ORDER ----------------
  const placeOrder = async (e) => {
    e.preventDefault();

    if (!cartItems || cartItems.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    const orderItems = cartItems.map(item => ({
      foodId: item.foodId._id,
      name: item.foodId.name,
      price: item.foodId.price,
      quantity: item.quantity
    }));

    const orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + deliveryCharge
    };

    try {
      if (payment === "stripe") {
        const { data } = await axios.post(`${BACKEND_URL}/api/order/place`, orderData, { withCredentials: true });
        if (data.success) {
          // Stripe checkout redirect
          window.location.replace(data.session_url);
        } else {
          toast.error("Payment failed");
        }
      } else {
        // COD order
        const { data } = await axios.post(`${BACKEND_URL}/api/order/placecod`, orderData, { withCredentials: true });
        if (data.success) {
          toast.success(data.message);

          // Clear frontend cart
          setCartItems([]);

          // Clear backend cart
          await axios.post(`${BACKEND_URL}/api/cart/clear`, {}, { withCredentials: true });

          // Reload cart data from backend
          await loadCartData();

          navigate("/myorders");
        } else {
          toast.error("Order failed");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Order error");
    }
  };

  // ---------------- AUTH CHECK ----------------
  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      navigate("/cart");
    }
  }, [cartItems]);

  return (
    <form onSubmit={placeOrder} className="place-order">
      {/* LEFT SIDE - DELIVERY INFO */}
      <div className="place-order-left">
        <p className="title">Delivery Information</p>

        <div className="multi-field">
          <input name="firstName" value={data.firstName} onChange={onChangeHandler} placeholder="First name" required />
          <input name="lastName" value={data.lastName} onChange={onChangeHandler} placeholder="Last name" required />
        </div>

        <input name="email" value={data.email} onChange={onChangeHandler} placeholder="Email" required />
        <input name="street" value={data.street} onChange={onChangeHandler} placeholder="Street" required />

        <div className="multi-field">
          <input name="city" value={data.city} onChange={onChangeHandler} placeholder="City" required />
          <input name="state" value={data.state} onChange={onChangeHandler} placeholder="State" required />
        </div>

        <div className="multi-field">
          <input name="zipcode" value={data.zipcode} onChange={onChangeHandler} placeholder="Zip code" required />
          <input name="country" value={data.country} onChange={onChangeHandler} placeholder="Country" required />
        </div>

        <input name="phone" value={data.phone} onChange={onChangeHandler} placeholder="Phone" required />
      </div>

      {/* RIGHT SIDE - CART TOTAL & PAYMENT */}
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>

          <div className="cart-total-details">
            <p>Subtotal</p>
            <p>{currency}{getTotalCartAmount()}</p>
          </div>
          <hr />

          <div className="cart-total-details">
            <p>Delivery Fee</p>
            <p>{currency}{deliveryCharge}</p>
          </div>
          <hr />

          <div className="cart-total-details">
            <b>Total</b>
            <b>{currency}{getTotalCartAmount() + deliveryCharge}</b>
          </div>
        </div>

        <div className="payment">
          <h2>Payment Method</h2>

          <div onClick={() => setPayment("cod")} className="payment-option">
            <img src={payment === "cod" ? assets.checked : assets.un_checked} alt="" />
            <p>COD (Cash on Delivery)</p>
          </div>

          <div onClick={() => setPayment("stripe")} className="payment-option">
            <img src={payment === "stripe" ? assets.checked : assets.un_checked} alt="" />
            <p>Card</p>
          </div>
        </div>

        <button type="submit" className="place-order-submit">
          {payment === "cod" ? "Place Order" : "Proceed To Payment"}
        </button>
      </div>
    </form>
  );
};

export default PlaceOrder;
