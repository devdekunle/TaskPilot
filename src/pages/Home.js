import React from 'react'
import homePageImg from '../assets/homepage-img.png'
import '../styles/homepage.css'

const Home = () => {
  return (
      <main className='homepage'> 
          <section className="homepage-img">
              <img src={homePageImg} alt="team work img" />
          </section>
          <section className='homepage-text'>
              <h3>WHY WORK ALONE, WHEN YOU HAVE A CO-PILOT</h3>
              <p>Task Manager...</p>
              <h1>FAST</h1>
              <button className="btn homepage-btn">Get Started</button>
          </section>
    </main>
  )
}

export default Home