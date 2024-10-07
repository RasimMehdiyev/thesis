import React from 'react'
import { useLocation } from 'react-router-dom'

const NavbarComponent = ({ onHelpIconClick }) => { // Accept onHelpIconClick as a prop
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
      <div className='help-icon-container'>
        <img
          src='/assets/help_icon.svg'
          alt='Help Icon'
          className='help-icon'
          style={{ cursor: 'pointer' }}
          onClick={onHelpIconClick} // Trigger tutorial on click
        />
      </div>
    </div>
  )
}

export default NavbarComponent
