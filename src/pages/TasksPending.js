import React, { useEffect } from "react";
import "../styles/tasks.css";
import TaskCard from "../components/TaskCard";
import { useSelector, useDispatch } from "react-redux";
import { CardSkeleton } from "../components/ProjectCard";
import { selectFilteredTasks, fetchTasks } from "../store/slices/taskSlice";
import { useParams } from "react-router-dom";

const TasksPending = () => {
  const { id: projectId } = useParams();
  const { isLoading, tasks } = useSelector((state) => state.tasks);
  const pendingTask = useSelector(selectFilteredTasks("pending"));
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
        {/* {isLoading ? (
          <CardSkeleton cards={6} />
        ) : (
          <> */}
        {pendingTask ? (
          pendingTask.map((card) => (
            <TaskCard btnText="Move to On Going" key={card.id} {...card} />
          ))
        ) : (
          <h2>No Pending Tasks</h2>
        )}
        {/* </>
        )} */}
      </div>
    </div>
  );
};

export default TasksPending;
