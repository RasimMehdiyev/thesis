import React from 'react';

const Models = ({ topModels, model_names, total_models }) => {
  console.log("Top Models in Models modal: ", topModels);

  return (
    <div className="card models">
      <p className="ml-subtitle">Models</p>
      <p style={{ color: '#585858' }}> Number of trained models: <strong style={{ color: 'black' }}>{total_models}</strong></p>
      <table className="models-table">
        <tbody>
          <tr>
            <td ><p><strong style={{ color: 'black' }}>Best performance models</strong></p></td>
            <td style={{paddingRight: '20px'}} className="vertical-line-left"></td>
            <td className="centered" style={{ padding: '10px' }}>
              <p >
                <strong style={{ color: 'black' }}>Accuracy</strong>
              </p>
              </td>
          </tr>
          {topModels.map((model, index) => (
            <tr key={index}>
              <td>
                <ul className="no-margin" style={{ paddingRight: '20px' }}>
                  <li>
                      {
                        index === 0 ?<strong>{model_names[model.model_name]}</strong> : <span> {model_names[model.model_name]} </span>
                      }
                  </li>
                </ul>
              </td>
              <td className="vertical-line-left"></td>
              <td className="centered">
                {
                  index === 0 ? <strong>{Math.round(model.max_score*100*10)/10}%</strong> : <span>{Math.round(model.max_score*100*10)/10}%</span>
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Models;
