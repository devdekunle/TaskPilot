import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Radio, TextInput } from "./formElements";
import { FaSpinner } from "react-icons/fa";
import "../../styles/form/project-forms.css";
import { useDispatch, useSelector } from "react-redux";
import {
  createProject,
  deleteProject,
  updateProject,
} from "../../store/slices/projectSlice";
import { toast } from "react-toastify";
import axios from "axios";
import { isAfter, parseISO } from "date-fns";
import { BASE_URL } from "../../api/api";

// Create Project Form
export const CreateProject = ({ setIsModalOpen }) => {
  const dispatch = useDispatch();
  const { isLoading, isError } = useSelector((state) => state?.projects);
  const { userData, token } = useSelector((state) => state?.auth);
  const { id: userId } = userData;

  // handle create peoject
  const handleCreateProject = async (values, { setSubmitting, resetForm }) => {
    console.log(values);
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
          start_date: Yup.string()
            .test(
              "is-later-or-equal",
              "Date must be later or equal to the current date",
              function (value) {
                const currentDate = new Date();
                const selectedDate = parseISO(value);
                return (
                  isAfter(selectedDate, currentDate) ||
                  this.createError({
                    message: "Date must be later or equal to the current date",
                  })
                );
              }
            )
            .required("Required"),
          end_date: Yup.string()
            .test(
              "is-later-than-start",
              "End date must be later than the start date",
              function (value) {
                const { start_date } = this.parent;
                const startDate = parseISO(start_date);
                const endDate = parseISO(value);
                return (
                  isAfter(endDate, startDate) ||
                  this.createError({
                    message: "End date must be later than the start date",
                  })
                );
              }
            )
            .required("Required"),
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
      if (!isError) {
        setIsModalOpen(false);
      }
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

  console.log(end_date);

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
        start_date: Yup.string()
          .test(
            "is-later-or-equal",
            "Date must be later or equal to the current date",
            function (value) {
              const currentDate = new Date();
              const selectedDate = parseISO(value);
              return (
                isAfter(selectedDate, currentDate) ||
                this.createError({
                  message: "Date must be later or equal to the current date",
                })
              );
            }
          )
          .required("Required"),
        end_date: Yup.string()
          .test(
            "is-later-or-equal",
            "Date must be later or equal to the current date",
            function (value) {
              const currentDate = new Date();
              const selectedDate = parseISO(value);
              return (
                isAfter(selectedDate, currentDate) ||
                this.createError({
                  message: "Date must be later or equal to the current date",
                })
              );
            }
          )
          .required("Required"),
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

// Invite New Members
export const InviteProjectMember = ({
  handleModalClose,
  userId,
  projectId,
  token,
  title,
}) => {
  const handleProjectInvite = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/auth/invite/senders/${userId}/projects/${projectId}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response);

      toast.success("Mail Sent");
      resetForm();
      handleModalClose();
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="invite-project-member">
      <h5 className="heading">Invite Member to ({title}) Project</h5>
      <Formik
        initialValues={{
          recipient_email: "",
          member_role: "member",
        }}
        onSubmit={handleProjectInvite}
      >
        {({ isSubmitting }) => (
          <Form>
            <TextInput name="recipient_email" placeholder="Email Address" />
            <div className="member-role">
              <h5>Choose member role</h5>
              <Radio name="member_role" value="member">
                member
              </Radio>
              <Radio name="member_role" value="admin">
                admin
              </Radio>
            </div>
            <h6 className="foot-note">
              Note:{" "}
              <small>
                An <strong>admin</strong> can create, delete, edit and invite
                members to tasks and subtasks
              </small>
            </h6>
            <div className="mini-modal-btns">
              <button className="btn" type="submit" disabled={isSubmitting}>
                {isSubmitting ? <FaSpinner className="spinner" /> : "Invite"}
              </button>

              <button className="btn" type="reset" onClick={handleModalClose}>
                Cancel
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};
