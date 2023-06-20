import { useState, useEffect } from "react";
import { Checkbox, TextInput, QuillTextArea } from "./formElements";
import parse from "html-react-parser";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import "../../styles/form/subtask-forms.css";
import { FaClock, FaUserPlus, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { updateTask, fetchTask } from "../../store/slices/taskSlice";
import {
  createSubTask,
  deleteSubTask,
  fetchSubTask,
  updateSubTask,
} from "../../store/slices/subTaskSlice";

export const CreateSubTask = ({ userId, token, taskId, taskStatus }) => {
  const [TextInputIsOpen, setTextInputIsOpen] = useState(false);
  const dispatch = useDispatch();

  // toggle field to add new substask
  const toogleTextInput = () => {
    setTextInputIsOpen(true);
  };

  // Handle SubTask Creation
  const handleSubTaskCreation = (values, { setSubmitting, resetForm }) => {
    console.log(taskStatus);
    if (taskStatus === "pending") {
      console.log("Hello World");
    }
    // dispatch an action
    try {
      dispatch(createSubTask({ taskId, userId, token, values }));
      setTextInputIsOpen(false);
      resetForm();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // close the create input box - cancel
  const closeInput = () => {
    setTextInputIsOpen(false);
  };
  return (
    <>
      {TextInputIsOpen && (
        <div className="add-subtask-form">
          <Formik
            initialValues={{ title: "" }}
            validationSchema={Yup.object({
              title: Yup.string().required("Required"),
            })}
            onSubmit={handleSubTaskCreation}
          >
            <Form>
              <TextInput name="title" />
              <div className="form-actions">
                <div>
                  <button className="btn" type="submit">
                    Add
                  </button>
                  <button className="btn" type="reset" onClick={closeInput}>
                    Cancel
                  </button>
                </div>

                <div className="assign-members">
                  <div className="dates">
                    <FaClock />
                  </div>
                  <div className="user-plus">
                    <FaUserPlus />
                  </div>
                </div>
              </div>
            </Form>
          </Formik>
        </div>
      )}
      {!TextInputIsOpen && (
        <button className="btn add-sub-task" onClick={toogleTextInput}>
          Add Subtask
        </button>
      )}
    </>
  );
};

// RichTexteditor
export const RichTexteditor = ({ description, userId, token, taskId }) => {
  const [richTextDesc, setRichTextDesc] = useState("");

  const [editDesc, setEditDesc] = useState(false);
  const { task, isLoading } = useSelector((state) => state?.tasks);
  const dispatch = useDispatch();

  const toggleEditDesc = () => {
    setEditDesc(!editDesc);
  };

  const handleEditDesc = async (values) => {
    try {
      dispatch(updateTask({ taskId, userId, token, values }));
      dispatch(fetchTask({ taskId, token }));
      const parsedDescription = parse(description);
      setRichTextDesc(parsedDescription);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // To make the page re-render
  useEffect(() => {
    dispatch(fetchTask({ taskId, token }));
  }, [taskId, editDesc, token]);

  // Update local state with fetched task data
  useEffect(() => {
    if (task) {
      const { description } = task;
      const parsedDescription = parse(description);
      setRichTextDesc(parsedDescription);
    }
  }, [taskId, token, dispatch, task, editDesc, isLoading]);
  return (
    <>
      <div className="rich-text-editor">
        <Formik
          initialValues={{ description: description }}
          onSubmit={handleEditDesc}
        >
          <Form>
            <div className="rich-text">
              <span>Description</span>{" "}
              {editDesc && (
                <QuillTextArea name="description" className="quill-text" />
              )}
              <button
                className={`${editDesc ? "save-desc" : "edit-desc"} btn`}
                type={editDesc ? "button" : "submit"}
                onClick={toggleEditDesc}
              >
                {editDesc ? "Save" : "Edit"}
              </button>
              {editDesc && (
                <button
                  className="btn"
                  type="reset"
                  onClick={() => setEditDesc(false)}
                >
                  Cancel
                </button>
              )}
              <div className="task-description">{richTextDesc}</div>
            </div>
          </Form>
        </Formik>
      </div>
    </>
  );
};

// Check Boxes
export const CheckSubTaskBox = ({
  title,
  id: subTaskId,
  token,
  completed,
  end_date,
  start_date,
}) => {
  const [isDelModalOpen, setIsDelModalOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(completed);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [editSubtaskTitle, setEditSubtaskTitle] = useState(false);
  const dispatch = useDispatch();

  const toogleOnDeleteModal = () => {
    setIsDelModalOpen(true);
  };

  //Toggle Date Update Modal
  const toggleOnDateModal = () => {
    setIsUpdateModalOpen(true);
  };

  const onDelModalClose = () => {
    setIsDelModalOpen(false);
  };

  // Toogle off update Modal
  const onUpdateModalClose = () => {
    setIsUpdateModalOpen(false);
  };

  // Toogle between edit input
  const showEditInput = (e) => {
    if (!e.target.classList.contains("subtask-checkbox")) {
      e.stopPropagation();
      return;
    }
    if (isChecked || completed) {
      return;
    } else {
      setEditSubtaskTitle(true);
    }
  };

  // Handle SubTask Title
  const handleEditSubtasktitle = async (values) => {
    try {
      dispatch(updateSubTask({ subTaskId, token, values }));
      setEditSubtaskTitle(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // add status update
  const handleCheckboxChange = (checked) => {
    if (checked) {
      try {
        dispatch(
          updateSubTask({ subTaskId, token, values: { completed: true } })
        );
        setIsChecked(true);
      } catch (error) {
        toast.error("An Error occured while updating sub task");
      }
    } else {
      try {
        dispatch(
          updateSubTask({ subTaskId, token, values: { completed: false } })
        );
        setIsChecked(false);
      } catch (error) {
        toast.error("An Error occured while updating sub task");
      }
    }

    // Perform any other actions based on the checked value
  };
  return (
    <>
      {editSubtaskTitle && (
        <Formik
          initialValues={{
            title: title,
          }}
          onSubmit={handleEditSubtasktitle}
        >
          <Form>
            <div className="edit-subtask-title">
              <TextInput name="title" />
              <div className="btn edit-title-btns">
                <button className="btn" type="submit">
                  Save
                </button>
                <button
                  className="btn"
                  type="reset"
                  onClick={() => setEditSubtaskTitle(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Form>
        </Formik>
      )}

      {!editSubtaskTitle && (
        <Formik
          initialValues={{
            subTaskValue: isChecked,
          }}
        >
          {({ setFieldValue, values }) => (
            <Form
              className={`${!isChecked && !completed && "subtask-checkbox"}`}
              onClick={showEditInput}
            >
              <Checkbox
                className={`checkbox-input ${
                  (isChecked || completed) && "checkbox-input-checked"
                }`}
                name="subTaskValue"
                checked={values.subTaskValue}
                onChange={(e) => {
                  const { checked } = e.target;
                  setFieldValue("subTaskValue", checked);
                  handleCheckboxChange(checked);
                }}
              >
                {title}
              </Checkbox>
              {!isChecked && !completed && (
                <div
                  className="assign-members member-actions"
                  onClick={showEditInput}
                >
                  <div className="dates" title="set due date">
                    <FaClock onClick={toggleOnDateModal} />
                    <UpdateDate
                      end_date={end_date}
                      start_date={start_date}
                      subTaskId={subTaskId}
                      token={token}
                      isUpdateModalOpen={isUpdateModalOpen}
                      onUpdateModalClose={onUpdateModalClose}
                    />
                  </div>
                  <div className="user-plus" title="assign subtask">
                    <FaUserPlus />
                  </div>
                  <div className="delete-subtask" title="delete">
                    <DeleteSubTask
                      isDelModalOpen={isDelModalOpen}
                      subTaskId={subTaskId}
                      token={token}
                      onDelModalClose={onDelModalClose}
                    />

                    <FaTrash onClick={toogleOnDeleteModal} />
                  </div>
                </div>
              )}
            </Form>
          )}
        </Formik>
      )}
    </>
  );
};

// Delete sub Task
export const DeleteSubTask = ({
  isDelModalOpen,
  onDelModalClose,
  subTaskId,
  token,
}) => {
  const dispatch = useDispatch();
  // useEffect(() => {
  //   dispatch(fetchSubTask());

  // }, []);
  const handleSubTaskDelete = () => {
    try {
      dispatch(deleteSubTask({ subTaskId, token }));
      toast.success("Successfully deleted sub task");
    } catch (error) {
      toast.error("Sub Task deletion Failed!");
    }
  };
  return (
    <>
      {isDelModalOpen && (
        <div className="delete-modal">
          <p>
            You are about to delete a subtask.. <br />{" "}
            <span>this action can't be undone once completed!</span>
          </p>
          <div className=" delete-modal-btn">
            <button className="btn" type="submit" onClick={handleSubTaskDelete}>
              Delete
            </button>
            <button className="btn" type="reset" onClick={onDelModalClose}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

// Set Due Date
export const UpdateDate = ({
  end_date: endDate,
  start_date: startDate,
  token,
  subTaskId,
  isUpdateModalOpen,
  onUpdateModalClose,
}) => {
  const [newStartDate, setNewStartDate] = useState(startDate || "");
  const [newEndDate, setNewEndDate] = useState(endDate || "");
  const dispatch = useDispatch();

  const handleDateUpdate = (e) => {
    const updatedDates = {
      start_date: newStartDate,
      end_date: newEndDate,
    };

    try {
      dispatch(updateSubTask({ subTaskId, token, values: updatedDates }));
      onUpdateModalClose();
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <>
      {isUpdateModalOpen && (
        <div className="due-date-modal">
          <div className="form-control">
            <label htmlFor="">Start Date: </label>
            <input
              type="date"
              value={newStartDate}
              onChange={(e) => setNewStartDate(e.target.value)}
            />
          </div>
          <div className="form-control">
            <label htmlFor="">End Date: </label>
            <input
              type="date"
              value={newEndDate}
              onChange={(e) => setNewEndDate(e.target.value)}
            />
          </div>
          <div className="set-date-btns">
            <button className="btn" type="button" onClick={handleDateUpdate}>
              Save
            </button>
            <button
              title="cancel"
              className="btn"
              type="reset"
              onClick={onUpdateModalClose}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};
