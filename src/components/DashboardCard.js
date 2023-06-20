import React from "react";
import "../styles/dashboard.css";

const DashboardCard = ({ title, count, icon }) => {
  return (
    <div className="dashboard-card">
      <h2 className="title">{title}</h2>
      <div className="numbers">
        <span>{count}</span>
        <p className="dashboard_icon">{icon}</p>
      </div>
    </div>
  );
};

export default DashboardCard;
