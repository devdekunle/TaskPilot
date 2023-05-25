import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import "../styles/tasks-layout.css";

const TasksLayout = () => {
  return (
    <div className="tasks-layout">
      <div className="header-container">
        <h1 className="heading">TASKS</h1>
        <div className="tasks-layout-links">
          <NavLink to="#">All Tasks</NavLink>
          <NavLink to="pending">Pending</NavLink>
          <NavLink to="in-progess">In Progress</NavLink>
          <NavLink to="completed">Completed</NavLink>
          <NavLink to="approved">Approved</NavLink>
          <button className="btn add_task_btn"> <span>+</span> Add New Task</button>
        </div>
      </div>

      <Outlet />
    </div>
  );
};

export default TasksLayout;
