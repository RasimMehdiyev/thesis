import React from 'react'
import SearchBarComponent from './SearchBarComponent'
// useState
// useEffect
// fetch
import { useState, useEffect } from 'react'

const SidebarComponent = () => {

  // state
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)

  // useEffect
  useEffect(() => {
    fetchPatients()
  }, [])
  // fetch patients
  const fetchPatients = async () => {
    try {
      const response = await fetch('/dashboard/patients/')
      const data = await response.json()
      console.log(data.patients)
      setPatients(data.patients)
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <div className='sidebar'>
        <div className='logo'>
            <img src={process.env.PUBLIC_URL + "/static/solitairedss-logo.png"}  alt="logo" />
            <p className='name'>SOLITAIRE DSS</p>
        </div>
        <p className='player-list'>
            Player List
        </p>
        <SearchBarComponent />
              {/* list all patients */}
          <ul className='patients'>
              {patients.map(patient => (
              <li className='patient-item' key={patient.id}>
                 <p>{patient.first_name} {patient.last_name}</p>
                 <div className='chevron-right-icon'></div>
              </li>
              ))}              
              {/* <li className='patient-item'>
                  <p>Rasim Mehdiyev</p>
                 <img src={process.env.PUBLIC_URL + "/assets/chevron-right.svg"} alt="arrow-right" />
              </li> */}

          </ul>
    </div>
  )
}

export default SidebarComponent