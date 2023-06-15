import React, {useEffect} from "react";
import "../styles/tasks.css";
import TaskCard from "../components/TaskCard";
import { CardSkeleton } from "../components/ProjectCard";
import { selectFilteredTasks, fetchTasks } from "../store/slices/taskSlice";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

const TasksInProgress = () => {
  const ongoingTask = useSelector(selectFilteredTasks("ongoing"));
  const { id: projectId } = useParams();
  const { isLoading, tasks } = useSelector((state) => state.tasks);
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
        {isLoading ? (
          <CardSkeleton cards={6} />
        ) : (
          <>
            {ongoingTask ? (
              ongoingTask.map((card) => (
                <TaskCard
                  btnText="Back to Pending"
                  btnTextNext="Move to Completed"
                  key={card.id}
                  {...card}
                />
              ))
            ) : (
              <h2>No On-Going Tasks</h2>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TasksInProgress;
