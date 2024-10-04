import React, { useEffect } from 'react';

const CategorizedBiomarkers = ({ biomarker_type }) => {
  // Log the biomarker_type object for debugging
  useEffect(() => {
    console.log(biomarker_type);
  }, [biomarker_type]);

  if (biomarker_type === undefined || biomarker_type.length === 0) {
    return <div>No biomarkers found</div>;
  }

  // Helper function to convert description text
  const processDescription = (description) => {
    if (!description) {
      return <p>No description available</p>; // Handle case where description is null or undefined
    }
  
    // Split by '*' for bullet points
    const parts = description.split('*');
  
    return (
      <div>
        {/* First part (before the first *) is treated as regular text */}
        {parts[0].trim() && (
          <p>
            {parts[0].split(':').map((segment, index) => (
              index % 2 === 1
                ? <strong key={index}>{segment}</strong>
                : segment
            ))}
          </p>
        )}
  
        {/* Rest of the parts are bullet points */}
        {parts.length > 1 && (
          <ul>
            {parts.slice(1).filter(part => part.trim() !== '').map((part, index) => (
              <li key={index}>
                {part.split(':').map((segment, i) => (
                  i % 2 === 1
                    ? <strong key={i}>{segment}</strong>
                    : segment
                ))}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };
  

  return (
    <div className='biomarker-item'>
      <h1>{biomarker_type.name}</h1>
      <ul className='biomarkers'>
        {biomarker_type.biomarkers.map(biomarker => (
          <div style={{borderBottom:" 1px solid #e5e5e5", marginBottom: '20px'}} key={biomarker.id}>
            <li>
              <b>{biomarker.name}</b> - {biomarker.unit}
            </li>
            <div className='biomarker-desc'>
              {processDescription(biomarker.description)} {/* Safely process the description */}
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default CategorizedBiomarkers;
