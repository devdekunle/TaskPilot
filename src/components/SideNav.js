import React from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import {
  faCalendar,
  faBell,
  faFileText,
  faBarChart,
} from "@fortawesome/free-regular-svg-icons";
import { HiOutlineUsers } from "react-icons/hi";
import "../styles/side-nav.css";

const SideNav = () => {
  return (
    <div className="side-nav">
      <div className="side-nav-contents">
        <div className="logo-container">
          <p>
            Task<span>Pilot</span>
          </p>
        </div>

        <ul>
          <li>
            <NavLink to="/user/">
              <FontAwesomeIcon icon={faBarChart} className="navlink_icon" />
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/user/projects">
              <FontAwesomeIcon icon={faFileText} className="navlink_icon" />
              Projects
            </NavLink>
          </li>
          <li>
            <NavLink to="calendar">
              <FontAwesomeIcon icon={faCalendar} className="navlink_icon" />
              Calendar
            </NavLink>
          </li>
          <li>
            <NavLink to="notifications">
              <FontAwesomeIcon icon={faBell} className="navlink_icon" />
              Notifications
            </NavLink>
          </li>
          <li>
            <NavLink to="members">
              <HiOutlineUsers className="navlink_icon" />
              Team
            </NavLink>
          </li>
          <li>
            <NavLink to="settings">
              <FontAwesomeIcon icon={faCog} className="navlink_icon" />
              Settings
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideNav;
