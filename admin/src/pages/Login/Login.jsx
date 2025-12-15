import React from "react";
import "./Login.css";
import { useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const navigateTo = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const {data} = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/login`,{email,password},{
        withCredentials:true,
        headers:{
          "Content-Type":"application/json"
        }
      });
      if(data.success){
        localStorage.setItem("foodDelToken", data.token);
        toast.success(data?.message);
        navigateTo("/add");
        setEmail("")
        setPassword("")
      }else{
        toast.error(data?.message);
      }
    } catch (error) {
      if(error.response.data.message){
        toast.error(error.response.data.message)
      }
    }
  }
  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h2>Login</h2>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit">Login</button>

        </form>
      </div>
    </div>
  );
};

export default Login;
