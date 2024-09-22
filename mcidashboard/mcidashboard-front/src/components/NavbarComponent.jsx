import React from 'react'

const NavbarComponent = () => {
  return (
    <div className='navbar'>
        <ul className='navbar-list'>
            <li><a href="/overview/">Overview</a></li>
            <li><a href="/digital-biomarkers/">Digital Biomarkers Details</a></li>
            <li><a href="/machine-learning/">Machine Learning Details</a></li>
        </ul>
    </div>
  )
}

export default NavbarComponent