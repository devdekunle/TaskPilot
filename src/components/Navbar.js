import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faBars,
  faSignIn,
  faHome,
  faPhoneSquare,
  faFileCode,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import "../styles/navbar.css";

const Navbar = () => {
  // Navbar open or close
  const [navOpen, setNavOpen] = useState(false);
  const [mobileView, setMobileView] = useState(true);

  // handleNavbar
  const toogleNav = () => setNavOpen(!navOpen);

  useEffect(() => {
    const screenWidth = () => {
      window.innerWidth >= "756" ? setMobileView(false) : setMobileView(true);
    };
    window.addEventListener("resize", screenWidth);
    return () => window.removeEventListener("resize", screenWidth);
  }, []);

  return (
    <div className="navbar">
      <nav
        className={` ${
          navOpen && mobileView ? "navbar-open" : "navbar-closed"
        } navbar-desktop`}
      >
        <p className="logo">
          <p>
            Task<span>Pilot</span>
          </p>
          <FontAwesomeIcon
            className="close-icon"
            onClick={toogleNav}
            icon={faXmark}
          />
        </p>
        <ul>
          <li>
            <NavLink to="/" onClick={toogleNav}>
              <FontAwesomeIcon icon={faHome} className="navlink_icon" />
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" onClick={toogleNav}>
              <FontAwesomeIcon icon={faPhoneSquare} className="navlink_icon" />
              Contact
            </NavLink>
          </li>
          <li>
            <NavLink to={"/about"} onClick={toogleNav}>
              <FontAwesomeIcon icon={faInfoCircle} className="navlink_icon" />
              About
            </NavLink>
          </li>
          <li>
            <NavLink to={"/dev"} onClick={toogleNav}>
              <FontAwesomeIcon icon={faFileCode} className="navlink_icon" />
              Dev
            </NavLink>
          </li>
        </ul>

        <div className="navbar-login">
          <NavLink to={"/authenticate"} onClick={toogleNav}>
            <FontAwesomeIcon icon={faSignIn} className="navlink_icon" />
            login / sign up
          </NavLink>
        </div>
      </nav>
      <div className="navbar-isClosed">
        <FontAwesomeIcon
          onClick={toogleNav}
          className="menu-bars"
          icon={faBars}
        />
        <p className="logo">LOGO</p>
      </div>
    </div>
  );
};

export default Navbar;
