import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoutes = () => {
  const { isAuthenticated: user } = useSelector((state) => state.auth);

  return user ? <Outlet /> : <Navigate to={"/auth"} replace/>;
};

export default PrivateRoutes;
