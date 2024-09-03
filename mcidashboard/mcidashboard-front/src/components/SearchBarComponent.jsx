import React from 'react'

const SearchBarComponent = () => {
  return (
    <div className="search-bar-container">
        <img src={process.env.PUBLIC_URL + "/assets/search_icon_1.svg"}  alt="" />
        <input className="search-bar" type="text" placeholder="Search"/>
    </div>
  )
}

export default SearchBarComponent