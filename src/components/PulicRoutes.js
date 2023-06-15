import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PulicRoutes = () => {
  const { isAuthenticated: user } = useSelector((state) => state.auth);

  return user ? <Navigate to={"/user"} replace /> : <Outlet />;
};

export default PulicRoutes;
