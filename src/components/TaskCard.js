import React from "react";
import { BsArrowRight, BsPen, BsClock } from "react-icons/bs";

const TaskCard = () => {
  return (
    <div className="task_card">
      <h3 className="task_title">Task title</h3>
          <div className="priority">Highing</div>
          <div className="task_card_body">
              <div className="details">
                  <div className="desc">
                      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quo, sint...
                  </div>
                  <div className="date">
                      May 16 2023 - Jun 5 2023
                  </div>
              </div>
              <div className="action_btns">
                  <BsPen title="Edit Task Name" />
                  <BsClock title="Set deadline" /> 
                  <span>3</span>
              </div>
          </div>

      <div className="btn task_card_btn">
        <p>Move To In Progress</p>
        <span>
          <BsArrowRight />
        </span>
      </div>
    </div>
  );
};

export default TaskCard;
