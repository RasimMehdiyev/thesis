import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBarComponent from './SearchBarComponent';
import Questionnaire from './Questionnaire';


const SidebarComponent = () => {

  // state
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isChatboxVisible, setIsChatboxVisible] = useState(false);
  const navigate = useNavigate();

  // useEffect
  useEffect(() => {
    fetchPatients();
  }, []);

  // Fetch patients function
  const fetchPatients = async () => {
    try {
      const response = await fetch('/dashboard/patients/');
      const data = await response.json();
      console.log('Fetched Data:', data);
      
      // Check if the data has patients
      if (data) {
        setPatients(data);
        console.log('Patients state updated:', data);
      } else {
        console.error('No patients data found in the response.');
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false); // Set loading to false after data is fetched
    }
  };

  // Function to handle patient selection
  const getPatient = async (id) => {
    console.log('get patient');
    try {
      const response = await fetch('/dashboard/patient/' + id + '/');
      const data = await response.json();
      console.log(data);
      
      // Pass patient data when navigating to /overview
      navigate('/overview', { state: { patient: data } });
    } catch (error) {
      console.error('Error fetching patient:', error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Filter patients based on search query
  const filteredPatients = patients.filter((patient) => {
    return patient.username.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // If loading, show a loading indicator
  if (loading) {
    return <div className='sidebar'>Loading...</div>; // Display a loading message or spinner
  }

  

  const toggleChatbox = () => {
    setIsChatboxVisible(!isChatboxVisible);
  };

  // Render the sidebar component once data is available
  return (
    <div className='sidebar'>
      <div className='logo'>
        <img src={process.env.PUBLIC_URL + "/static/solitairedss-logo.png"} alt="logo" />
        <p className='name'>Solitaire DSS</p>
      </div>
      <p className='player-list'>Player List</p>
      <SearchBarComponent searchQuery={searchQuery} handleSearchChange={handleSearchChange} />
      {/* List all patients */}
      <ul className='patients'>
        {filteredPatients.map((patient) => (
          <li onClick={() => getPatient(patient.id)} className='patient-item' key={patient.id}>
            <p>{patient.full_name}</p>
            <div className='chevron-right-icon'></div>
          </li>
        ))}
      </ul>
      <div className="floating-chat-icon">
            <img 
              src="/assets/chat_icon.svg" 
              alt="Chat Icon" 
              className="chat-icon" 
              onClick={toggleChatbox}
            />
        </div>
        {isChatboxVisible && <Questionnaire onClose={toggleChatbox}/>
        }
    </div>
  );
};

export default SidebarComponent;
