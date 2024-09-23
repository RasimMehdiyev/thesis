// Import React and useEffect hooks
import React from 'react'
// Import useEffect from React (though it's not really needed anymore after the change to static data)
import { useEffect } from 'react'

// Define the PersonalInformation component
const PersonalInformation = () => {

    // This useEffect hook is used to call printPatientInfo when the component mounts
    useEffect(() => {
        printPatientInfo()
    }, [])

    // This function would print the patient data in the console
    function printPatientInfo() {
        console.log(patient) // Now it prints the static patient data instead
    }

    // Static patient data, replacing the dynamic props that were passed before
    const patient = {
        username: "JohnDoe",
        gender: "Male",
        age: 45,
        mci: true
        // other fields have been commented out, as requested
    }

  // The return block renders the component UI
  return (
    <div className='personal-info-container'>
        <h2>Personal Information</h2>
        <div className='info'>
            <h3>Demographics</h3>
            <img src={process.env.PUBLIC_URL + "/static/assets/underline.svg"} alt="" />
            <ul>
                {/* Render static data instead of dynamic */}
                <li>Name: <span className='not-bold'>{patient.username}</span></li>
                <li>Gender: <span className='not-bold'>{patient.gender}</span></li>
                {/* Education field commented out */}
                {/* <li>Education: <span className='not-bold'>{patient.education}</span></li> */}
                <li>Age: <span className='not-bold'>{patient.age}</span></li>
                {/* Birthdate field commented out */}
                {/* <li>Birthdate: <span className='not-bold'>{patient.birth_date}</span></li> */}
            </ul>
        </div>
        <div className='info'>
            <h3>Neuropsychological Test Score</h3>
            <img src={process.env.PUBLIC_URL + "/static/assets/underline.svg"} alt="" />
            <ul>
                <li>Has MCI: 
                    <span>
                        {
                            patient.mci ? <span className='not-bold'>Yes</span> : <span className='not-bold'>No</span>
                        }
                    </span>
                </li>
                {/* MMSE and MoCA fields commented out */}
                {/* <li>MMSE: <span className='not-bold'>{patient.MMSE}</span></li> */}
                {/* <li>MoCA: <span className='not-bold'>{patient.MoCA}</span></li> */}
            </ul>
        </div>
        <div className='info'>
            <h3>Self-report Assessment</h3>
            <img src={process.env.PUBLIC_URL + "/static/assets/underline.svg"} alt="" />
            <ul>
                {/* Depression and Anxiety fields commented out */}
                {/* <li>Depression: <span className='not-bold'>{patient.has_depression ? 'Yes' : 'No'}</span></li> */}
                {/* <li>Anxiety: <span className='not-bold'>{patient.has_anxiety ? 'Yes' : 'No'}</span></li> */}
            </ul>
        </div>
    </div>
  )
}

// Export the component as default
export default PersonalInformation