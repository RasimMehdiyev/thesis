const Models = () => {
    return (
      <div className="card models">
        <p className="ml-subtitle">Models</p>
        <p> Number of trained models: <strong>19</strong></p>
        <table className="models-table">
          <tbody>
            <tr>
              <td> <p> <strong>Best performance models:</strong></p> </td>
              <td className="vertical-line-left"></td>
              <td className="centered" style={{ padding: '10px' }}> <p> <strong>Accuracy</strong></p> </td>
            </tr>  
            <tr>
              <td>
                <ul className="no-margin" style={{ paddingRight: '20px' }}> {/* Add padding-right here */}
                  <li>Nu-Support Vector</li>
                </ul>
              </td>
              <td className="vertical-line-left"></td>
              <td className="centered"> <strong>83.3% </strong></td>
            </tr>
            <tr>
              <td>
                <ul className="no-margin" style={{ paddingRight: '20px' }}> {/* Add padding-right here */}
                  <li>Gradient Boosting Classifier</li>
                </ul>
              </td>
              <td className="vertical-line-left"></td>
              <td className="centered"> 80.6% </td>
            </tr>
            <tr>
              <td>
                <ul className="no-margin" style={{ paddingRight: '20px' }}> {/* Add padding-right here */}
                  <li>Extra Trees Classifier</li>
                </ul>
              </td>
              <td className="vertical-line-left"></td>
              <td className="centered"> 80.6% </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };
  
  export default Models;