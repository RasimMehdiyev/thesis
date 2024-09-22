import React from 'react'

const SearchBarComponent = ({searchQuery, handleSearchChange}) => {
  return (
    <div className="search-bar-container">
        <img src={process.env.PUBLIC_URL + "/static/assets/search_icon_1.svg"}  alt="" />
        <input 
          className="search-bar" 
          type="text" 
          placeholder="Search"
          value={searchQuery}
          onChange={handleSearchChange}/>
    </div>
  )
}

export default SearchBarComponent