import React from 'react'
import { useEffect } from 'react'
const PersonalInformation = ({ patient }) => {

    useEffect(() => {
        printPatientInfo()
    }, [])
    function printPatientInfo() {
        console.log(patient)
    }


  return (
    <div className='personal-info-container'>
        <h2>Personal Information</h2>
        <div className='info'>
            <h3>Demographics</h3>
            <img src={process.env.PUBLIC_URL + "/static/assets/underline.svg"} alt="" />
            <ul>
                <li>Name: <span className='not-bold'>{patient.first_name} {patient.last_name}</span></li>
                <li>Gender: <span className='not-bold'>{patient.gender}</span></li>
                <li>Education: <span className='not-bold'>{patient.education}</span></li>
                <li>Age: <span className='not-bold'>{patient.age}</span></li>
                <li>Birthdate: <span className='not-bold'>{patient.birth_date}</span></li>
            </ul>
        </div>
        <div className='info'>
            <h3>Neuropsychological Test Score</h3>
            <img src={process.env.PUBLIC_URL + "/static/assets/underline.svg"} alt="" />
            <ul>
                <li>MMSE: <span className='not-bold'>{patient.MMSE}</span></li>
                <li>MoCA: <span className='not-bold'>{patient.MoCA}</span></li>
            </ul>
        </div>
        <div className='info'>
            <h3>Self-report Assessment</h3>
            <img src={process.env.PUBLIC_URL + "/static/assets/underline.svg"} alt="" />
            <ul>
                <li>Depression: <span className='not-bold'>{patient.has_depression ? 'Yes' : 'No'}</span></li>
                <li>Anxiety: <span className='not-bold'>{patient.has_anxiety ? 'Yes' : 'No'}</span></li>
            </ul>
        </div>
    </div>
  )
}

export default PersonalInformation