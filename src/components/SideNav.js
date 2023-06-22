import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import { FaPowerOff, FaTimes } from "react-icons/fa";
import {
  faCalendar,
  faBell,
  faFileText,
  faBarChart,
} from "@fortawesome/free-regular-svg-icons";
import { HiOutlineUsers } from "react-icons/hi";
import "../styles/side-nav.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../store/slices/authSlice";

const SideNav = ({ mobileSideBar, setMobileSideBar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, isAuthenticated: user } = useSelector((state) => state?.auth);

  const logout = async () => {
    localStorage.removeItem("user_details");
    localStorage.removeItem("auth_token");
    try {
      dispatch(logoutUser);
    } catch (error) {
      console.log(error.message);
    } finally {
      navigate("/");
    }
  };

  const closeSidebar = () => {
    setMobileSideBar(false);
  };

  useEffect(() => {
    console.log(user);
  }, [dispatch]);

  return (
    <div className={`side-nav ${mobileSideBar && "open-sidebar"}`}>
      <div className="side-nav-contents">
        <div className="logo-container">
          <p>
            Task<span>Pilot</span>
          </p>
          <div
            className="close-sidebar"
            onClick={() => setMobileSideBar(false)}
          >
            <FaTimes />
          </div>
        </div>

        <ul>
          <li onClick={closeSidebar}>
            <NavLink to="/user/">
              <FontAwesomeIcon icon={faBarChart} className="navlink_icon" />
              Dashboard
            </NavLink>
          </li>
          <li onClick={closeSidebar}>
            <NavLink to="/user/projects">
              <FontAwesomeIcon icon={faFileText} className="navlink_icon" />
              Projects
            </NavLink>
          </li>
          <li onClick={closeSidebar}>
            <NavLink to="calendar">
              <FontAwesomeIcon icon={faCalendar} className="navlink_icon" />
              Calendar
            </NavLink>
          </li>
          <li onClick={closeSidebar}>
            <NavLink to="notifications">
              <FontAwesomeIcon icon={faBell} className="navlink_icon" />
              Notifications
            </NavLink>
          </li>
          <li onClick={closeSidebar}>
            <NavLink to="members">
              <HiOutlineUsers className="navlink_icon" />
              Team
            </NavLink>
          </li>
          <li onClick={closeSidebar}>
            <NavLink to="settings">
              <FontAwesomeIcon icon={faCog} className="navlink_icon" />
              Settings
            </NavLink>
          </li>
        </ul>

        <div className="logout btn" onClick={logout}>
          <FaPowerOff />
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
};

export default SideNav;
