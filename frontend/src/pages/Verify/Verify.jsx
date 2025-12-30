// Frontend: /verify page
import React, { useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { StoreContext } from "../../Context/StoreContext";
import { toast } from "react-toastify";

const VerifyOrder = () => {
  const { setCartItems, loadCartData, url } = useContext(StoreContext);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || url;
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const orderId = params.get("orderId");
    const success = params.get("success");

    const verify = async () => {
      try {
        const { data } = await axios.post(
          `${BACKEND_URL}/api/order/verify`,
          { orderId, success },
          { withCredentials: true }
        );

        if (data.success) {
          toast.success("Payment successful, order placed!");
          // Clear frontend cart
          setCartItems([]);
          // Clear backend cart
          await axios.post(`${BACKEND_URL}/api/cart/clear`, {}, { withCredentials: true });
          await loadCartData();
          navigate("/myorders");
        } else {
          toast.error("Payment failed or not verified");
          navigate("/cart");
        }
      } catch (err) {
        toast.error("Error verifying order");
        navigate("/cart");
      }
    };

    if (orderId) verify();
  }, []);

  return <div>Verifying your order...</div>;
};

export default VerifyOrder;
