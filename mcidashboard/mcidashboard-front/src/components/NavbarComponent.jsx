import React from 'react'
import { useLocation } from 'react-router-dom'

const NavbarComponent = () => {
  const location = useLocation()


  const currentPath = location.pathname.replace(/\/$/, "")

  return (
    <div className='navbar'>
      <ul className='navbar-list'>
        <li>
          <a 
            href="/overview" 
            className={currentPath === '/overview' ? 'active' : ''}
          >
            Overview
          </a>
        </li>
        <li>
          <a 
            href="/digital-biomarkers"
            className={currentPath === '/digital-biomarkers' ? 'active' : ''}
          >
            Digital Biomarkers Details
          </a>
        </li>
        <li>
          <a 
            href="/machine-learning"
            className={currentPath === '/machine-learning' ? 'active' : ''}
          >
            Machine Learning Details
          </a>
        </li>
      </ul>
    </div>
  )
}

export default NavbarComponent
