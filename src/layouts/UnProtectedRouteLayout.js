import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const UnProtectedRouteLayout = () => {
  return (
    <div className="landing-page">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default UnProtectedRouteLayout;