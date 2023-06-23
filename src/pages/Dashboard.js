import React, { useEffect } from "react";
import DashboardCard from "../components/DashboardCard";
import ExpirationDateList from "../components/ExpirationDateList";
import { dashboardCardData, deadlineTask } from "../data/data";
import { useSelector } from "react-redux";
import { selectAllTasks } from "../store/slices/allTasks";
import "../styles/dashboard.css";

const Dashboard = () => {
  const allTasks = useSelector(selectAllTasks);

  useEffect(() => {
    console.log(allTasks);
  }, []);

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
            <p className="end_date">Due Date</p>
            <p className="prority">Propriety</p>
          </div>

          <ul className="list_items">
            {deadlineTask.map((list, index) => (
              <ExpirationDateList {...list} key={index} sN={index + 1} />
            ))}
          </ul>
        </div>

        <div className="other-analysis">Over Due Tasks</div>
      </div>
    </div>
  );
};

export default Dashboard;