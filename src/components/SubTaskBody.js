import React, { useEffect, useState } from "react";
import "../styles/subtask.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchTask } from "../store/slices/taskSlice";
import { createSubTask, fetchSubTasks } from "../store/slices/subTaskSlice";
import {
  CheckSubTaskBox,
  CreateSubTask,
  RichTexteditor,
} from "./forms/subTaskForm";
import { progress } from "framer-motion";

const SubTaskBody = ({ taskTitle, description, taskId }) => {
  const [subTaskProgress, setSubTaskProgress] = useState(0);
  const dispatch = useDispatch();
  const { userData, token } = useSelector((state) => state?.auth);
  const { subTasks } = useSelector((state) => state?.subTasks);
  const { id: userId } = userData;

  const handleTaskProgress = () => {
    if (subTasks) {
      const subTasksLength = subTasks.length;
      const completedTasksCount = subTasks.filter(
        (subTask) => subTask.completed
      ).length;

      setSubTaskProgress((completedTasksCount / subTasksLength) * 100);
    }
  };

  // Fetch Task on Render
  useEffect(() => {
    dispatch(fetchSubTasks({ taskId, token }));
  }, [dispatch, token]);

  useEffect(() => {
    handleTaskProgress();
    // console.log(subTaskProgress);
  }, [dispatch, token, subTasks, subTaskProgress]);

  return (
    <div className="sub-task">
      <h2 className="sub-task-heading">{taskTitle}</h2>

      <RichTexteditor
        taskId={taskId}
        userId={userId}
        token={token}
        description={description}
      />

      {/* Task Progress */}
      <div className="task-progress">
        <h3>
          Task Progress - <span>{`${subTaskProgress.toPrecision(3)}%`}</span>
        </h3>
        <div className="task-progress-bar">
          <span style={{ width: `${subTaskProgress}%` }}></span>
        </div>
      </div>

      {/* ADDED TASK */}
      <div className="check-sub-task">
        {subTasks.map((subtask) => {
          return (
            <CheckSubTaskBox {...subtask} key={subtask.id} token={token} />
          );
        })}
      </div>

      {/* Add Task */}

      <CreateSubTask userId={userId} token={token} taskId={taskId} />
    </div>
  );
};

export default SubTaskBody;
