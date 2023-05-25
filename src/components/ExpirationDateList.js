import React from 'react';
import '../styles/dashboard.css';

const ExpirationDateList = ({sN, taskName, endDate, priority}) => {
  return (
    <>
      <li className="list_item">
              <span className="serial_num">{sN}</span>
              <span className="task_name">{ taskName}</span>
              <span className="end_date">{ endDate}</span>
              <span className={`priority-${priority}`}>{priority}</span>
      </li>
    </>
  );
}

export default ExpirationDateList