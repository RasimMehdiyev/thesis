import React, { useEffect } from 'react'

const CategorizedBiomarkers = ({biomarker_type}) => {
    // print the biomarker_type object
    // console.log(biomarker_type)
    useEffect(() => {
        console.log(biomarker_type)
    }
    , [])

    if (biomarker_type === undefined || biomarker_type.length === 0) {
        return <div>No biomarkers found</div>
    }
    return (
        <div className='biomarker-item'>
            <h1>{biomarker_type.name}</h1>
            <ul className='biomarkers'>
                {biomarker_type.biomarkers.map(
                    biomarker => <li key={biomarker.id}> <b>{biomarker.name}</b> - {biomarker.unit} </li>
                )}
            </ul>
        </div>
    )
}

export default CategorizedBiomarkers