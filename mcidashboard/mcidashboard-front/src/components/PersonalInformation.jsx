import React from 'react'

const PersonalInformation = () => {
  return (
    <div className='personal-info-container'>
        <h2>Personal Information</h2>
        <div className='info'>
            <h3>Demographics</h3>
            <img src={process.env.PUBLIC_URL + "/static/assets/underline.svg"} alt="" />
            <ul>
                <li>Name:</li>
                <li>Gender:</li>
                <li>Education:</li>
                <li>Age:</li>
                <li>Birthdate:</li>
            </ul>
        </div>
        <div className='info'>
            <h3>Neuropsychological Test Score</h3>
            <img src={process.env.PUBLIC_URL + "/static/assets/underline.svg"} alt="" />
            <ul>
                <li>MMSE:</li>
                <li>MoCA:</li>
            </ul>
        </div>
        <div className='info'>
            <h3>Self-report Assessment</h3>
            <img src={process.env.PUBLIC_URL + "/static/assets/underline.svg"} alt="" />
            <ul>
                <li>Depression:</li>
                <li>Anxiety:</li>
            </ul>
        </div>
    </div>
  )
}

export default PersonalInformation