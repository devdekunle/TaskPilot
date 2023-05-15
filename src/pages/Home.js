import React from 'react';
import homePageImg from '../assets/homepage-img.png';
import '../styles/homepage.css';
import { motion } from 'framer-motion';


const Home = () => {  
  return (
      <main className='homepage'> 
        <motion.section className="homepage-img"
        initial={{ opacity: 0, y: '-20%' }}
        animate={{ opacity: 1, y: '0' }}
        exit={{ opacity: 0, y: '100%' }}
        transition={{ duration: 1.5 }}
      >
              <img src={homePageImg} alt="team work img" />
        </motion.section>
      
        <motion.section className='homepage-text'
         initial={{ opacity: 0, y: '20%' }}
        animate={{ opacity: 1, y: '0' }}
        exit={{ opacity: 0, y: '-100%' }}
        transition={{ duration: 1.5 }}
      >
              <h3>WHY WORK ALONE, WHEN YOU HAVE A CO-PILOT...</h3>
              <p>Your Ultimate co-pilot for task management - <span>Task Pilot</span></p>
              <button className="btn homepage-btn">Get Started</button>
          </motion.section>
    </main>
  )
}

export default Home