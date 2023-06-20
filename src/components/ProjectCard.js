import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import formatDate from "../utils/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { faMessage } from "@fortawesome/free-regular-svg-icons";
import { BsTrash, BsPen } from "react-icons/bs";
import { FaUserPlus } from "react-icons/fa";
import "../styles/project-card.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useDispatch, useSelector } from "react-redux";
import Modal from "./Modal";
import {
  DeleteProject,
  InviteProjectMember,
  UpdateProject,
} from "./forms/projectPageForms";
import { fetchProjectMembers } from "../store/slices/userSlice";

export const CardSkeleton = ({ cards }) => {
  return Array(cards)
    .fill(0)
    .map((item, index) => (
      <div className="project-card-skeleton" key={index}>
        <h2 className="header">
          <Skeleton height={20} width={130} containerClassName="flex-1" />
        </h2>
        <span>
          <Skeleton count={2} height={35} />
          <Skeleton width={180} height={65} />
        </span>
      </div>
    ));
};

const ProjectCard = ({
  title,
  start_date,
  end_date,
  create_time,
  message,
  team,
  id: projectId,
  completed,
  description,
  userId,
  token,
}) => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(false);

  const dispatch = useDispatch();
  const members = useSelector((state) => state?.members);
  useEffect(() => {
    dispatch(fetchProjectMembers({ projectId, token }));
  }, [dispatch, token, projectId]);

  // if user is an admin

  const { projectMembers } = members;

  // Format Date
  const createdAt = formatDate(create_time, "EEE, dd MMM yyyy");
  const startDate = formatDate(start_date, "EEE, dd MMM yyyy");
  const endDate = formatDate(end_date, "EEE, dd MMM yyyy");

  // Handle Modal
  const [isOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalcontent] = useState(null);

  // Handle Modal
  const handleModalOpen = () => {
    setIsModalOpen(true);
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleShowModal = (action) => {
    handleModalOpen();
    if (action === "delete") {
      setModalcontent(
        <DeleteProject
          projectId={projectId}
          title={title}
          setIsModalOpen={setIsModalOpen}
        />
      );
    } else if (action === "update") {
      setModalcontent(
        <UpdateProject
          title={title}
          projectId={projectId}
          completed={completed}
          description={description}
          setIsModalOpen={setIsModalOpen}
          end_date={end_date}
          start_date={start_date}
        />
      );
    } else if (action === "invite-member") {
      setModalcontent(
        <InviteProjectMember
          handleModalClose={handleModalClose}
          setIsModalOpen={setIsModalOpen}
          userId={userId}
          projectId={projectId}
          token={token}
          title={title}
        />
      );
    }
  };

  // Navigate to Tasks under a project
  const handleProjectTasks = (id) => {
    navigate(`/user/projects/${id}/tasks`);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleModalClose}
        modalContent={modalContent}
      />
      <div className="project-card">
        <div
          className="project-info"
          onClick={() => handleProjectTasks(projectId)}
        >
          <h2 className="header">{title}</h2>
          <h5>
            Desc:{" "}
            <span>{`${description ? description : "No Description..."}`}</span>
          </h5>
          <h5>
            Created: <span>{createdAt}</span>
          </h5>
          <h5>
            Start date: <span>{startDate}</span>
          </h5>
          <h5>
            End State: <span>{endDate}</span>
          </h5>
        </div>
        <div className="form-action">
          <div>
            <FontAwesomeIcon icon={faUsers} className="card_icon" />
            <span>{team}</span>
          </div>
          <div>
            <FontAwesomeIcon icon={faMessage} className="card_icon" />
            <span>{message}</span>
          </div>

          {
            <div onClick={() => handleShowModal("delete")}>
              <BsTrash className="card_icon" />
            </div>
          }
          <div onClick={() => handleShowModal("update")}>
            <BsPen className="card_icon" />
          </div>
          <div className="invite-member">
            <FaUserPlus
              className="card_icon invite-member-icon"
              onClick={() => handleShowModal("invite-member")}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectCard;
