import React from 'react'
import SearchBarComponent from './SearchBarComponent'

const SidebarComponent = () => {
  return (
    <div className='sidebar'>
        <div className='logo'>
            <img src={process.env.PUBLIC_URL + "solitairedss-logo.png"}  alt="" />
            <p className='name'>SOLITAIRE DSS</p>
        </div>
        <p className='player-list'>
            Player List
        </p>
        <SearchBarComponent />
    </div>
  )
}

export default SidebarComponent