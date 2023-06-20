import React, { useEffect, useState } from "react";
import "../styles/subtask.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchSubTasks } from "../store/slices/subTaskSlice";
import {
  CheckSubTaskBox,
  CreateSubTask,
  RichTexteditor,
} from "./forms/subTaskForm";

const SubTaskBody = ({
  taskTitle,
  description,
  taskId,
  taskCompleteHandler,
  taskStatus,
}) => {
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

      if (subTasksLength === 0) {
        setSubTaskProgress(0);
      } else {
        setSubTaskProgress((completedTasksCount / subTasksLength) * 100);
        taskCompleteHandler(subTaskProgress);
      }
    }
  };

  // Fetch Task on Render
  useEffect(() => {
    dispatch(fetchSubTasks({ taskId, token }));
  }, [dispatch, token]);

  useEffect(() => {
    handleTaskProgress();
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
          Task Progress -{" "}
          <span>{`${subTaskProgress.toPrecision(3) || 0}%`}</span>
        </h3>
        <div className="task-progress-bar">
          <span style={{ width: `${subTaskProgress || 0}%` }}></span>
        </div>
      </div>

      {/* ADDED TASK */}
      <div className="check-sub-task">
        {subTasks.map((subtask) => {
          return (
            <CheckSubTaskBox
              {...subtask}
              key={subtask.id}
              token={token}
              taskStatus={taskStatus}
            />
          );
        })}
      </div>

      {/* Add Task */}

      <CreateSubTask
        userId={userId}
        token={token}
        taskId={taskId}
        taskStatus={taskStatus}
      />
    </div>
  );
};

export default SubTaskBody;
