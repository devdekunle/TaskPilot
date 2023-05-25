import React from "react";
import { Formik, Form } from "formik";
import { Select } from "../components/forms/formElements";
import ProjectCard from "../components/ProjectCard";
import { projectData } from "../data/data";
import "../styles/projects.css";


const Projects = () => {

  return (
    <div className="projects">
      <div className="filter">
        <Formik
          initialValues={{
            filterProjects: "",
          }}
          // Handle Login Form Submition
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2));
              setSubmitting(false);
            }, 400);
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
      <div className="btn add_project_btn">Add A New Project</div>
      {
        projectData.map(project => (
          <ProjectCard {...project} key={project.id}/>
        ))
            }
    </div>
  );
};

export default Projects;