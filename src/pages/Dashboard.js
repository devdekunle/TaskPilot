import React from "react";
import DashboardCard from "../components/DashboardCard";
import ExpirationDateList from "../components/ExpirationDateList";
import { dashboardCardData, deadlineTask } from "../data/data";
import "../styles/dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="dashboard-cards">
        {dashboardCardData.map((card) => (
          <DashboardCard key={card.id} {...card} />
        ))}
      </div>

      <div className="dashboard-stats">
        <div className="deadline-tasks">
          <h3>Task aproaching deadline</h3>
          <div className="list_header">
            <p className="serial_num">S/N</p>
            <p className="task_name">Task Name</p>
            <p className="end_date">End Date</p>
            <p className="prority">Propriety</p>
          </div>

          <ul className="list_items">
            {
              deadlineTask.map((list, index) =>  <ExpirationDateList  {...list} key={index} sN={index + 1}/>)
            }
           
          </ul>
        </div>

        <div className="other-analysis"></div>
      </div>
    </div>
  );
};

export default Dashboard;
