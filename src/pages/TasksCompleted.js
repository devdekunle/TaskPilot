import React, { useEffect } from "react";
import "../styles/tasks.css";
import TaskCard from "../components/TaskCard";
import { useSelector, useDispatch } from "react-redux";
import { CardSkeleton } from "../components/ProjectCard";
import { selectFilteredTasks, fetchTasks } from "../store/slices/taskSlice";
import { useParams } from "react-router-dom";

const TasksCompleted = () => {
  const completedTask = useSelector(selectFilteredTasks("completed"));
  const { id: projectId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const { isLoading, tasks } = useSelector((state) => state.tasks);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!tasks || tasks.length === 0) {
      dispatch(fetchTasks({ projectId, token }));
    }
  }, [dispatch, projectId, token]);

  return (
    <div className="tasks task_flex_container">
      <div className="task_cards">
        {isLoading ? (
          <CardSkeleton cards={6} />
        ) : (
          <>
            {completedTask ? (
              completedTask.map((card) => (
                <TaskCard
                  btnText="Back to on Going"
                  btnTextNext="Approve Task"
                  key={card.id}
                  {...card}
                />
              ))
            ) : (
              <h2>No Completed Tasks</h2>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TasksCompleted;
