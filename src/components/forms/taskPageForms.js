import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextInput, Radio } from "./formElements";
import { FaSpinner } from "react-icons/fa";
import "../../styles/form/task-forms.css";
import {
  createTask,
  deleteTask,
  updateTask,
} from "../../store/slices/taskSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { isAfter, parseISO } from "date-fns";

// Create Task Form
export const CreateTask = ({ setIsModalOpen }) => {
  const { id: projectId } = useParams();
  const dispatch = useDispatch();
  const { isLoading, isError } = useSelector((state) => state?.tasks);
  const { userData, token } = useSelector((state) => state?.auth);
  const { id: userId } = userData;

  // handle create task
  const handleCreateTask = async (values, { setSubmitting, resetForm }) => {
    try {
      dispatch(createTask({ projectId, userId, values, token }));
      setIsModalOpen(false);
      toast.success("New Task Created");
      resetForm();
    } catch (error) {
      toast.error(error.message);
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
          priority: "medium",
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
        onSubmit={handleCreateTask}
      >
        <Form>
          <div className="create-task-form">
            <h2>Create Task</h2>
            <TextInput name="title" placeholder="Title" />
            <TextInput name="start_date" label={"Start Date"} type="date" />
            <TextInput label={"End Date"} name="end_date" type="date" />
            <div className="radio-btns">
              <h5>Task Priority</h5>
              <Radio name="priority" value="low">
                low
              </Radio>
              <Radio name="priority" value="medium">
                medium
              </Radio>
              <Radio name="priority" value="high">
                high
              </Radio>
            </div>
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

// Delete Task Form
export const DeleteTask = ({ taskId, title, setIsModalOpen }) => {
  const dispatch = useDispatch();
  const { isLoading, isError } = useSelector((state) => state?.tasks);
  const { userData, token } = useSelector((state) => state?.auth);
  const { id: userId } = userData;

  const handleDeleteTask = async () => {
    try {
      dispatch(deleteTask({ taskId, userId, token }));
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="delete-form">
      <p>
        You are about to delete <span>{`(${title})`}</span> Task!
      </p>
      <small>NOTE: This action can't be undone when completed</small>

      <button
        disabled={isLoading}
        className="btn"
        type="submit"
        onClick={handleDeleteTask}
      >
        {isLoading ? <FaSpinner className="spinner" /> : "Delete"}
      </button>
    </div>
  );
};

// Update Task Form
export const UpdateTask = ({
  title,
  taskId,
  description,
  setIsModalOpen,
  priority,
  end_date,
  start_date,
}) => {
  const dispatch = useDispatch();
  const { isLoading, isError } = useSelector((state) => state?.tasks);
  const { userData, token } = useSelector((state) => state?.auth);
  const { id: userId } = userData;

  // handle Task Update
  const handleUpdateTask = async (values) => {
    try {
      dispatch(updateTask({ taskId, userId, token, values }));
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
        priority,
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
      // Handkle Submit
      onSubmit={handleUpdateTask}
    >
      <Form>
        <div className="create-task-form">
          <h2>Edit Task</h2>
          <TextInput name="title" placeholder="Title" />
          <TextInput name="start_date" label={"Start Date"} type="date" />
          <TextInput label={"End Date"} name="end_date" type="date" />
          <div className="radio-btns">
            <h5>Task Priority</h5>
            <Radio name="priority" value="low">
              low
            </Radio>
            <Radio name="priority" value="medium">
              medium
            </Radio>
            <Radio name="priority" value="high">
              high
            </Radio>
          </div>
          <button disabled={isLoading} className="btn create-btn" type="submit">
            {isLoading ? <FaSpinner className="spinner" /> : "Submit"}
          </button>
        </div>
      </Form>
    </Formik>
  );
};
