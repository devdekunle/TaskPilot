import React, { useEffect } from "react";
import Accordion from "../components/Accordion";
import "../styles/tasks.css";
import TaskCard from "../components/TaskCard";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, selectFilteredTasks } from "../store/slices/taskSlice";
import { useParams } from "react-router-dom";
import { CardSkeleton } from "../components/ProjectCard";

const Tasks = () => {
  const { id: projectId } = useParams();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { isLoading, isError } = useSelector((state) => state.tasks);
  const pendingTask = useSelector(selectFilteredTasks("pending"));
  const ongoingTask = useSelector(selectFilteredTasks("ongoing"));
  const completedTask = useSelector(selectFilteredTasks("completed"));
  const approvedTask = useSelector(selectFilteredTasks("approved"));

  useEffect(() => {
    if (projectId) {
      dispatch(fetchTasks({ projectId, token }));
    }
    if (isError) {
      toast.error("An error occured while fetching your Tasks");
    }
  }, [dispatch, token, projectId]);

  return (
    <>
      <div className="tasks">
        <div>
          <Accordion title={"Pending"} total={pendingTask.length || 0}>
            <div className="task_cards">
              {isLoading ? (
                <CardSkeleton cards={6} />
              ) : (
                <>
                  {pendingTask ? (
                    pendingTask.map((card) => (
                      <TaskCard
                        btnText="Move to In Progress"
                        key={card.id}
                        {...card}
                      />
                    ))
                  ) : (
                    <h2>No Pending Tasks</h2>
                  )}
                </>
              )}
            </div>
          </Accordion>
        </div>
        <div>
          <Accordion title={"On Going"} total={ongoingTask.length || 0}>
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
          </Accordion>
        </div>
        <div>
          <Accordion title={"Completed"} total={completedTask.length}>
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
          </Accordion>
        </div>
        <div>
          <Accordion title={"Approved"} total={approvedTask.length}>
            <div className="task_cards">
              {isLoading ? (
                <CardSkeleton cards={6} />
              ) : (
                <>
                  {approvedTask ? (
                    approvedTask.map((card) => (
                      <TaskCard
                        btnText="Back to Pending"
                        btnTextNext="Move to Completed"
                        key={card.id}
                        {...card}
                      />
                    ))
                  ) : (
                    <h2>No Approved Tasks</h2>
                  )}
                </>
              )}
            </div>
          </Accordion>
        </div>
      </div>
    </>
  );
};

export default Tasks;
