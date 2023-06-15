import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextInput } from "./formElements";
import { FaSpinner } from "react-icons/fa";
import "../../styles/form/project-forms.css";
import { useDispatch, useSelector } from "react-redux";
import {
  createProject,
  deleteProject,
  updateProject,
} from "../../store/slices/projectSlice";
import { useEffect } from "react";
import { toast } from "react-toastify";

// Create Project Form
export const CreateProject = ({ setIsModalOpen }) => {
  const dispatch = useDispatch();
  const { isLoading, isError } = useSelector((state) => state?.projects);
  const { userData, token } = useSelector((state) => state?.auth);
  const { id: userId } = userData;

  // handle create peoject
  const handleCreateProject = async (values, { setSubmitting, resetForm }) => {
    try {
      dispatch(createProject({ userId, values, token }));
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      toast.error(isError);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Formik
        initialValues={{
          title: "",
          description: "",
          end_date: "",
          start_date: "",
        }}
        // form validation
        validationSchema={Yup.object({
          title: Yup.string().required("Required"),
          end_date: Yup.string().required("Required"),
          start_date: Yup.string().required("Required"),
        })}
        // handle form submit
        onSubmit={handleCreateProject}
      >
        <Form>
          <div className="create-project-form">
            <h2>Create Project</h2>
            <TextInput name="title" placeholder="Title" />
            <TextInput
              name="description"
              placeholder="brief description (optional)"
              as="textarea"
            />
            <TextInput name="start_date" label={"Start Date"} type="date" />
            <TextInput label={"End Date"} name="end_date" type="date" />
            <button
              disabled={isLoading}
              className="btn create-btn"
              type="submit"
            >
              {isLoading ? <FaSpinner className="spinner" /> : "Submit"}
            </button>
          </div>
        </Form>
      </Formik>
    </>
  );
};

// Delete project Form
export const DeleteProject = ({ projectId, title, setIsModalOpen }) => {
  const dispatch = useDispatch();
  const { isLoading, isError } = useSelector((state) => state?.projects);
  const { userData, token } = useSelector((state) => state?.auth);
  const { id: userId } = userData;

  const handleDeleteProject = async () => {
    try {
      dispatch(deleteProject({ projectId, userId, token }));
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="delete-form">
      <p>
        You are about to delete <span>{`(${title})`}</span> project!
      </p>
      <small>NOTE: This action can't be undone when completed</small>

      <button
        disabled={isLoading}
        className="btn"
        type="submit"
        onClick={handleDeleteProject}
      >
        {isLoading ? <FaSpinner className="spinner" /> : "Delete"}
      </button>
    </div>
  );
};

// Update A Project
export const UpdateProject = ({
  title,
  projectId,
  description,
  setIsModalOpen,
  end_date,
  start_date,
}) => {
  const dispatch = useDispatch();
  const { isLoading, isError } = useSelector((state) => state?.projects);
  const { userData, token } = useSelector((state) => state?.auth);
  const { id: userId } = userData;

  // handle update peoject
  const handleUpdateProject = async (values) => {
    try {
      dispatch(updateProject({ projectId, userId, token, values }));
      setIsModalOpen(false);
    } catch (error) {
      toast.error(isError);
    }
  };

  return (
    <Formik
      initialValues={{
        title,
        description,
        end_date,
        start_date,
      }}
      // form validation
      validationSchema={Yup.object({
        title: Yup.string().required("Required"),
        end_date: Yup.string().required("Required"),
        start_date: Yup.string().required("Required"),
      })}
      onSubmit={handleUpdateProject}
    >
      <Form>
        <div className="create-project-form">
          <h2>Edit Project</h2>
          <TextInput name="title" placeholder="Title" />
          <TextInput
            name="description"
            placeholder="brief description (optional)"
            as="textarea"
          />
          <TextInput name="start_date" label={"Start Date"} type="date" />
          <TextInput label={"End Date"} name="end_date" type="date" />
          <button className="btn update-btn" type="submit" disabled={isLoading}>
            {isLoading ? <FaSpinner className="spinner" /> : "Submit"}
          </button>
        </div>
      </Form>
    </Formik>
  );
};
