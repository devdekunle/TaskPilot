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
  const { token } = useSelector((state) => state.auth);

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
        <div className="filter">
          <Formik
            initialValues={{
              filterProjects: "",
            }}
          >
            <Form>
              <Select label="Filter Projects: " name="filterProjects">
                <option value="">All</option>
                <option value="ownProjects">My Own Projects</option>
              </Select>
              {/* <button type="submit" className="btn">
              Submit
            </button> */}
            </Form>
          </Formik>
        </div>
        <div className="btn add_project_btn" onClick={handleShowModal}>
          Create Project
        </div>
        {isLoading ? (
          <CardSkeleton cards={6} />
        ) : (
          <div className="project-cards">
            {projects ? (
              projects.map((item, index) => (
                <ProjectCard {...item} key={index} />
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
