import React from "react";
import Accordion from "../components/Accordion";
import "../styles/tasks.css";
import TaskCard from "../components/TaskCard";

const Tasks = () => {

  
  return (
    <div className="tasks">
      <div>
        <Accordion title={"Pending"} total={2} >
          <div className="task_cards">
            <TaskCard/>
            <TaskCard/>
          </div>
        </Accordion>
      </div>
      <div>
        <Accordion title={"In Progress"} total={8}>
          <div className="task_cards"></div>
        </Accordion>
      </div>
      <div>
        <Accordion title={"Completed"} total={3}>
          <div className="task_cards">Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas laborum, fuga cupiditate omnis temporibus minus dolores consequatur assumenda excepturi inventore, deserunt voluptatibus rerum et expedita velit maiores dolorum amet labore!</div>
        </Accordion>
      </div>
      <div>
        <Accordion title={"Approved"} total={5}>
          <div className="task_cards"></div>
        </Accordion>
      </div>
    </div>
  );
};

export default Tasks;
