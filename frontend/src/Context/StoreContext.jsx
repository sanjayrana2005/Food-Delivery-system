import { createContext, useEffect, useState } from "react";
import { menu_list } from "../assets/assets";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

  const [foodList, setFoodList] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState("");
  const [user, setUser] = useState()
 console.log(user)
  const currency = "₹";
  const deliveryCharge = 50;

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  /* ---------------- ADD TO CART ---------------- */
  const addToCart = async (itemId) => {
    setCartItems(prev => ({
      ...(prev || {}),
      [itemId]: (prev?.[itemId] || 0) + 1
    }));

    if (token) {
      await axios.post(
        `${BACKEND_URL}/api/cart/add`,
        { itemId },
        { withCredentials: true }
      );
    }
  };


  /* ---------------- REMOVE FROM CART ---------------- */
  const removeFromCart = async (itemId) => {
    setCartItems(prev => ({
      ...(prev || {}),
      [itemId]: Math.max((prev?.[itemId] || 0) - 1, 0)
    }));

    if (token) {
      await axios.delte(
        `${BACKEND_URL}/api/cart/remove`,
        { itemId },
        { withCredentials:true}
      );
    }
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

  /* ---------------- LOAD CART DATA ---------------- */
  const loadCartData = async (userToken) => {
    const { data } = await axios.get(
      `${BACKEND_URL}/api/cart/get`,
      { withCredentials: true }
    );
    setCartItems(data?.cartData || {});
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
    user,setUser
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
