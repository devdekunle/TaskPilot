import React, { useEffect, useState } from "react";
import { Outlet, NavLink, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProject } from "../store/slices/projectSlice";
import { CreateTask } from "../components/forms/taskPageForms";
import Modal from "../components/Modal";

import "../styles/tasks-layout.css";

const TasksLayout = () => {
  const dispatch = useDispatch();
  const { id: projectId } = useParams();
  const { isLoading, isError, project } = useSelector(
    (state) => state.projects
  );
  const { token } = useSelector((state) => state.auth);

  // Handle Modal
  // Handle Modal Logic
  const [isOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalcontent] = useState(null);
  const handleShowModal = () => {
    handleModalOpen();
    setModalcontent(<CreateTask setIsModalOpen={setIsModalOpen} />);
  };
  const handleModalOpen = () => {
    setIsModalOpen(true);
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (projectId) {
      dispatch(fetchProject({ projectId, token }));
    }
  }, [dispatch, projectId]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleModalClose}
        modalContent={modalContent}
      />
      <div className="tasks-layout">
        <div className="header-container">
          <h1 className="heading">
            TASKS <small>{`(${project?.title})`}</small>
          </h1>
          <div className="tasks-layout-links">
            <NavLink to="./" replace>
              All Tasks
            </NavLink>
            <NavLink to="pending" replace>
              Pending
            </NavLink>
            <NavLink to="on-going" replace>
              On Going
            </NavLink>
            <NavLink to="completed" replace>
              Completed
            </NavLink>
            <NavLink to="approved" replace>
              Approved
            </NavLink>
            <button className="btn add_task_btn" onClick={handleShowModal}>
              {" "}
              <span>+</span> Create Task
            </button>
          </div>
        </div>

        <Outlet />
      </div>
    </>
  );
};

export default TasksLayout;
