import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { faMessage } from "@fortawesome/free-regular-svg-icons";
import {BsTrash, BsPen} from 'react-icons/bs'
import "../styles/project-card.css";

const ProjectCard = ({ title, owner, created_at, message, team}) => {
  return (
    <div className="project-card">
      <h2 className="header">{ title}</h2>
      <p>
        Owner: <span>{owner}</span>
      </p>
      <p>
        Created AT: <span>{ created_at }</span>
      </p>

      <div className="form-action">

        <p>
          <FontAwesomeIcon icon={faUsers} className="card_icon" />
          <span>{ team}</span>

        </p>
        <p>
          <FontAwesomeIcon icon={faMessage} className="card_icon" />
          <span>{ message}</span>
        </p>

        <p>
          <BsTrash className="card_icon"/>
        </p>
        <p>
          <BsPen className="card_icon" />
        </p>
      </div>
    </div>
  );
};

export default ProjectCard;
