import { useState, useEffect } from "react";
import axios from "axios";

const UseAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/profile`,
        { withCredentials: true } // important
      );
      if (data.success) setUser(data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return { user, loading, checkAuth };
};

export default UseAuth;
