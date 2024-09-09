import React from 'react'
import SearchBarComponent from './SearchBarComponent'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const SidebarComponent = () => {

  // state
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

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

  const getPatient = async (id) => {
    console.log('get patient');
    try {
      const response = await fetch('/dashboard/patient/' + id + '/');
      const data = await response.json();
      console.log(data);
      
      // Pass patient data when navigating to /overview
      navigate('/overview', { state: { patient: data } });
    } catch (error) {
      console.log(error);
    }
  };
  

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
                <li onClick={() => getPatient(patient.id)} className='patient-item' key={patient.id}>
                <p>{patient.first_name} {patient.last_name}</p>
                 <div className='chevron-right-icon'></div>
              </li>
              ))}              
          </ul>
    </div>
  )
}

export default SidebarComponent