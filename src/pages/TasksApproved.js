import React, { useEffect } from "react";
import "../styles/tasks.css";
import TaskCard from "../components/TaskCard";
import { useSelector, useDispatch } from "react-redux";
import { CardSkeleton } from "../components/ProjectCard";
import { selectFilteredTasks, fetchTasks } from "../store/slices/taskSlice";
import { useParams } from "react-router-dom";

const TasksApproved = () => {
  const approvedTask = useSelector(selectFilteredTasks("approved"));
  const { isLoading, tasks } = useSelector((state) => state.tasks);
  const { id: projectId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!tasks || tasks.length === 0) {
      dispatch(fetchTasks({ projectId, token }));
    }
  }, [dispatch, projectId, token]);

  return (
    <div className="tasks task_flex_container">
      <div className="task_cards">
        {approvedTask ? (
          approvedTask.map((card) => (
            <TaskCard
              btnText="Approved"
              key={card.id}
              {...card}
              projectId={projectId}
            />
          ))
        ) : (
          <h2>No Approved Tasks</h2>
        )}
      </div>
    </div>
  );
};

export default TasksApproved;
