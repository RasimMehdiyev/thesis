import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBarComponent from './SearchBarComponent';


const SidebarComponent = ({tutorialOpen}) => {

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const [selectedPatientId, setSelectedPatientId] = useState(
    parseInt(localStorage.getItem('selectedPatientId'), 10)
  );


  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await fetch('/dashboard/patients/');
      const data = await response.json();
      console.log('Fetched Data:', data);

      
      if (data) {
        setPatients(data);
        if ((window.location.pathname === '/overview' || window.location.pathname === '/overview/') && localStorage.getItem('selectedPatientId')) {
          getPatient(localStorage.getItem('selectedPatientId'));
        }else if((window.location.pathname === '/overview' || window.location.pathname === '/overview/') && localStorage.getItem('selectedPatientId') === null){
          getPatient(data[0].id);
        }
      } else {
        console.error('No patients data found in the response.');
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false); 
    }
  };

  const getPatient = async (id) => {
    setSelectedPatientId(id);
    localStorage.setItem('selectedPatientId', id.toString());
    console.log('get patient');
    try {
      const response = await fetch('/dashboard/patient/' + id + '/');
      const data = await response.json();
      console.log(data);
      
      navigate('/overview', { state: { patient: data } });
      
    } catch (error) {
      console.error('Error fetching patient:', error);
    }
  };
  

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredPatients = patients.filter((patient) => {
    const query = searchQuery.toLowerCase();
    return (
      patient.full_name.toLowerCase().includes(query) || 
      patient.id.toString().includes(query)
    );
  });

  if (loading) {
    return <div className='sidebar'>Loading...</div>;
  }

  return (
    <div className='sidebar'>
      <div className='logo'>
        <img src={process.env.PUBLIC_URL + "/static/solitairedss-logo.png"} alt="logo" />
        <p className='name'>Solitaire DSS</p>
      </div>
      <p className='player-list'>Player List</p>
      <SearchBarComponent searchQuery={searchQuery} handleSearchChange={handleSearchChange} />
      <ul className='patients'>
        {filteredPatients.map((patient) => {
        return(
          <li onClick={() => getPatient(patient.id)} className={`patient-item ${Number(selectedPatientId) === patient.id? 'selected-patient' : ''}`} key={patient.id}>
            <p>{patient.full_name}</p>
              <div className='chevron-right-icon'></div>
          </li>
        )})}
      </ul>

    </div>
  );
};

export default SidebarComponent;
