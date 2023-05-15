import React, {useState, useEffect} from 'react'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faXmark, faBars} from '@fortawesome/free-solid-svg-icons'
import '../styles/navbar.css'

const Navbar = () => {
    // Navbar open or close
    const [navOpen, setNavOpen] = useState(false);
    const [mobileView, setMobileView] = useState(true);

    // handleNavbar
    const toogleNav = () => setNavOpen(!navOpen);

    
    
    useEffect(() => {
        const screenWidth = () => { window.innerWidth >= '756' ? setMobileView(false) : setMobileView(true) };
        window.addEventListener("resize", screenWidth);
        return () => window.removeEventListener('resize', screenWidth);
   }, []);
    
    return (
        <div className='navbar'>
            <nav className={` ${(navOpen && mobileView) ? 'navbar-open' : 'navbar-closed'} navbar-desktop`}>
              <p className="logo">LOGO <FontAwesomeIcon className='close-icon' onClick={toogleNav} icon={faXmark}/></p>
          <ul>
              <li>
                  <NavLink to='/' onClick={toogleNav}>Home</NavLink>
              </li>
              <li>
                  <NavLink to='/contact' onClick={toogleNav}>Contact</NavLink>
              </li>
              <li>
                  <NavLink to={'/about'} onClick={toogleNav}>About</NavLink>
              </li>
              <li>
                  <NavLink to={'/dev'} onClick={toogleNav}>Dev</NavLink>
              </li>
          </ul> 

          <div className='navbar-login'>
              <span>login/ sign up</span>
          </div>
            </nav>
            <div className='navbar-isClosed'>
                <FontAwesomeIcon onClick={toogleNav} className='menu-bars' icon={faBars}/>
                <p className='logo'>LOGO</p>
            </div>
</div>
  )
}

export default Navbar