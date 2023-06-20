import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import { Select } from "../components/forms/formElements";
import ProjectCard from "../components/ProjectCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "../store/slices/projectSlice";
import { CardSkeleton } from "../components/ProjectCard";
import Modal from "../components/Modal";
import "../styles/projects.css";
import { toast } from "react-toastify";
import { CreateProject } from "../components/forms/projectPageForms";

const Projects = () => {
  // Retrive project state
  const dispatch = useDispatch();
  const { isLoading, isError, projects } = useSelector(
    (state) => state.projects
  );
  // Auth State
  const { token, userData } = useSelector((state) => state.auth);
  const { id: userId } = userData;

  // Handle Modal Logic
  const [isOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalcontent] = useState(null);
  const handleShowModal = () => {
    handleModalOpen();
    setModalcontent(<CreateProject setIsModalOpen={setIsModalOpen} />);
  };
  const handleModalOpen = () => {
    setIsModalOpen(true);
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    localStorage.removeItem("modalOpen");
    localStorage.removeItem("taskId");
    if (token) {
      dispatch(fetchProjects(token));
    }
    if (isError) {
      toast.error("An error occured while fetching your projects");
    }
  }, [dispatch, token]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleModalClose}
        modalContent={modalContent}
      />
      <div className="projects">
        <div className="btn add_project_btn" onClick={handleShowModal}>
          Create Project
        </div>
        {isLoading ? (
          <CardSkeleton cards={6} />
        ) : (
          <div className="project-cards">
            {projects && projects.length > 0 ? (
              projects.map((item, index) => (
                <ProjectCard
                  {...item}
                  key={index}
                  userId={userId}
                  token={token}
                />
              ))
            ) : (
              <div className="empty-project">
                No Projects! <br /> Click the create project button to begin
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Projects;
