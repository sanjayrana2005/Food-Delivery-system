import { createContext, useEffect, useState } from "react";
import { menu_list } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

  const [foodList, setFoodList] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState("");
  const [user, setUser] = useState();
  const currency = "₹";
  const deliveryCharge = 50;

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


    /* ---------------- LOAD CART DATA ---------------- */
 const loadCartData = async () => {
  try {
    const { data } = await axios.get(
      `${BACKEND_URL}/api/cart/get`,
      { withCredentials: true }
    );
    const cartArray = data?.cartItems || data?.cartItems || [];

    setCartItems(cartArray);

  } catch (error) {
    console.error("Load cart error:", error);
  }
};



  /* ---------------- ADD TO CART ---------------- */
  const addToCart = async (foodId) => {
    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/api/cart/add`,
        { foodId },
        { withCredentials: true }
      );
      if (data.success) {
        toast.success(data.message)
        setCartItems(prev => ({
          ...prev,
          [foodId]: (prev?.[foodId] || 0) + 1
        }));
        loadCartData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message)
      console.error("Add cart error:", error.response?.data?.message || error.message);
    }
  };



  /* ---------------- REMOVE FROM CART ---------------- */
  const removeFromCart = async (foodId) => {
    setCartItems(prev => ({
      ...(prev || {}),
      [foodId]: Math.max((prev?.[foodId] || 0) - 1, 0)
    }));
    const {data} = await axios.delete(
      `${BACKEND_URL}/api/cart/remove`, { foodId },
      {
        withCredentials: true
      }
    );
    toast.success(data.message)
  };


  /* ---------------- TOTAL CART AMOUNT ---------------- */
  const getTotalCartAmount = () => {
    let total = 0;

    for (const itemId in cartItems) {
      if (cartItems[itemId] > 0) {
        const itemInfo = foodList.find(
          (product) => product._id === itemId
        );
        if (itemInfo) {
          total += itemInfo.price * cartItems[itemId];
        }
      }
    }
    return total;
  };

  /* ---------------- FETCH FOOD LIST ---------------- */
  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/food/list`);
      if (response.data.success) {
        setFoodList(response.data.foods);
      }
    } catch (error) {
      console.error("Food list error", error);
    }
  };





  const getUser = async () => {
    const { data } = await axios.get(`${BACKEND_URL}/api/user/profile`, {
      withCredentials: true
    })
    setUser(data?.user);
  }

  /* ---------------- ON LOAD ---------------- */
  useEffect(() => {
    async function loadData() {
      await fetchFoodList();

      const storedToken = localStorage.getItem("foodDelToken");
      if (storedToken) {
        setToken(storedToken);
        await loadCartData(storedToken);
      }
    }
    loadData();
  }, []);

  const contextValue = {
    foodList,
    menu_list,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    fetchFoodList,
    loadCartData,
    token,
    setToken,
    setCartItems,
    currency,
    deliveryCharge,
    getUser,
    user, setUser
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
