import React from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
import Home from '../pages/Home'
import Contact from '../pages/Contact'
import About from '../pages/About'
import { Auth } from '../pages/Auth'
import '../styles/landing-page.css'

const LandingPage = () => {
    return (
        <div className='landing-page'>
            <Routes>
                <Route path='/' element={<Home/>} />
                <Route path='/contact' element={<Contact/>} />
                <Route path='/about' element={<About />} />
                <Route path="/auth" element={<Auth/>} />
            </Routes>
            <Outlet />
      </div>
      )
}

export default LandingPage