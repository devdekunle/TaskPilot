import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { DeleteTask, UpdateTask } from "./forms/taskPageForms";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { updateTask } from "../store/slices/taskSlice";
import SubTaskBody from "./SubTaskBody";

import {
  FaUserPlus,
  FaClock,
  FaPen,
  FaArrowRight,
  FaUsers,
  FaTrash,
  FaComments,
  FaBell,
} from "react-icons/fa";

const TaskCard = ({
  title,
  priority,
  description,
  end_date,
  start_date,
  teamcount,
  btnText,
  btnTextBack,
  btnTextNext,
  status,
  id: taskId,
}) => {
  const dispatch = useDispatch();
  const { isLoading, isError } = useSelector((state) => state?.tasks);
  const { userData, token } = useSelector((state) => state?.auth);
  const { id: userId } = userData;
  // handle main and subTask-modal
  const [isOpen, setIsModalOpen] = useState(
    localStorage.getItem("modalOpen") === "true"
  );

  const [modalContent, setModalcontent] = useState(
    <SubTaskBody
      taskId={taskId}
      isError={isError}
      taskTitle={title}
      setIsModalOpen={setIsModalOpen}
      description={description}
    />
  );

  // handle Main Modal
  const handleModalOpen = () => {
    setIsModalOpen(true);
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
    localStorage.removeItem("modalOpen");
  };

  // Handle Delete and Task Update
  const handleShowModal = (action) => {
    handleModalOpen();
    if (action === "delete") {
      setModalcontent(
        <DeleteTask
          taskId={taskId}
          title={title}
          setIsModalOpen={setIsModalOpen}
        />
      );
    } else if (action === "update") {
      setModalcontent(
        <UpdateTask
          taskId={taskId}
          title={title}
          setIsModalOpen={setIsModalOpen}
          description={description}
          priority={priority}
          start_date={start_date}
          end_date={end_date}
        />
      );
    } else if (action === "show") {
      localStorage.setItem("modalOpen", "true");

      setModalcontent(
        <SubTaskBody
          taskId={taskId}
          isError={isError}
          taskTitle={title}
          setIsModalOpen={setIsModalOpen}
          description={description}
        />
      );
      // setModalcontent(
      //   <SubTaskBody
      //     description={description}
      //     taskId={taskId}
      //   />
      // );
    }
  };

  // Handle Card Progress (Pending -> <- ongoing -> <- completed -> approved)
  const handleTaskProgress = async (e) => {
    const target = e.target;
    const pendingClassList = [
      "btn-pending",
      "btn2-pending",
      "btn-ongoing",
      "arrowRight-pending",
    ];

    if (
      pendingClassList.some((className) =>
        target.classList.contains(className)
      ) ||
      target.innerText === "Back to on Going"
    ) {
      try {
        // Move to ongoing
        dispatch(
          updateTask({ taskId, userId, token, values: { status: "ongoing" } })
        );
        setIsModalOpen(false);
      } catch (error) {
        toast.error(error.message);
      }
    } else if (target.classList.contains("btn2-ongoing")) {
      // Move to Completed
      try {
        dispatch(
          updateTask({ taskId, userId, token, values: { status: "completed" } })
        );
        setIsModalOpen(false);
      } catch (error) {
        toast.error(error.message);
      }
    } else if (target.classList.contains("btn2-completed")) {
      // Move to Completed
      try {
        dispatch(
          updateTask({ taskId, userId, token, values: { status: "approved" } })
        );
        setIsModalOpen(false);
      } catch (error) {
        toast.error(error.message);
      }
    } else if (target.innerText === "Back to Pending") {
      // Move to Completed
      try {
        dispatch(
          updateTask({ taskId, userId, token, values: { status: "pending" } })
        );
        setIsModalOpen(false);
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleModalClose}
        modalContent={modalContent}
      />

      <motion.div className="task_card" layout transition={{ duration: 0.5 }}>
        <h3 className="task_title" onClick={() => handleShowModal("show")}>
          {title}
        </h3>
        <div className={`priority priority-${priority}`}>{priority}</div>
        <div className="task_card_body">
          <div className="details">
            <div
              className="show-subTask-modal"
              onClick={() => handleShowModal("show")}
            >
              <div className="date">
                {start_date} - {end_date}
              </div>
            </div>
            <div className="action_btns_2">
              <div title="Members">
                <FaUsers />
                <span>{teamcount}</span>
              </div>
              <div title="Comments">
                <FaComments />
                <span>{teamcount}</span>
              </div>

              <div title="Notifications">
                <FaBell />
                <span>{teamcount}</span>
              </div>

              <div
                title="Delete Card"
                onClick={() => handleShowModal("delete")}
              >
                <FaTrash />
              </div>
            </div>
          </div>
          <div className="action_btns">
            <div
              className="btn"
              onClick={() => handleShowModal("update")}
              title="Edit Task"
            >
              <FaPen />
            </div>
            <div title="Set deadline">
              <FaClock />
            </div>
            <div title="Invite Member">
              <FaUserPlus />
            </div>
          </div>
        </div>

        <div
          className={` task_card_btn btn-${status} ${isLoading && "disabled"}`}
          onClick={handleTaskProgress}
        >
          <button className="btn">{btnTextBack || btnText}</button>
          <button className={`btn btn2-${status} second-btn`}>
            {btnTextNext}
          </button>
          <span className={`arrowRight-${status}`}>
            <FaArrowRight />
          </span>
        </div>
      </motion.div>
    </>
  );
};

export default TaskCard;
