import React, {useState} from 'react'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faXmark, faBars} from '@fortawesome/free-solid-svg-icons'
import '../styles/navbar.css'

const Navbar = () => {
    // Navbar open or close
    const [navOpen, setNavOpen] = useState(false);

    // handleNavbar
    const toogleNav = () => setNavOpen(!navOpen);
    return (
        <div className='navbar'>
            <nav className={navOpen ? 'navbar-open' : 'navbar-closed'}>
          <p className="logo">LOGO <FontAwesomeIcon onClick={toogleNav} icon={faXmark}/></p>
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