import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { apiRequest } from '../lib/apiRequest';
import { loginStart, loginSuccess, loginFailure, logout } from '../redux/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";


export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {loading } = useSelector((state) => state.user);


  const register = async (formData) => {
    dispatch(loginStart());
    try {
      const res = await apiRequest.post("/auth/register", formData);
      dispatch(loginSuccess(res.data));
      toast.success("Registration Successful");
      navigate("/login");
      return res.data;
    } catch (err) {
      dispatch(
        loginFailure(err.response?.data?.message || "Registration failed")
      );
      toast.error(err.response?.data?.message || "Registration Failed");
      return null;
    }
  };

  const login = async (formData) => {
    dispatch(loginStart());
    try {
      const res = await apiRequest.post("/auth/login", formData);
      dispatch(loginSuccess(res.data));
      toast("Login Successful");
      navigate("/");
      return res.data;
    } catch (err) {
      dispatch(loginFailure(err.response?.data?.message || "Login failed"));
      toast.error(
        err.response?.data?.message ||
        "Invalid credentials or server error. Please try again.",
       );
      return null;
    }
  };

  const logoutUser = async () => {
    try {
      await apiRequest.post("/auth/logout");
      dispatch(logout());
      toast.success("You have been logged out.");
      navigate("/login");
    } catch (err) {
     toast.success("Logout Failed");
    } 
  };

  
  return {
    register,
    login,
    logout : logoutUser,
    loading,
  };
};
