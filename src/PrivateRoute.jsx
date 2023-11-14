import React from 'react';
import { Outlet, useNavigate } from "react-router-dom";

const PrivateRoute = () => {
  const navigate = useNavigate();
  
  const isAuthenticated = localStorage.getItem('authToken');
  
  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }
  
  return <Outlet />;
};

export default PrivateRoute;

