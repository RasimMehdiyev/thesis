const DataPreProcessing= () => {

    return (
        <div className="card data-preprocessing">
            <p className="ml-subtitle">Data pre-processing</p>
            <table className="datapreproc-table">
                <tr>
                    <p >Heavily correlated features (ρ &gt; 0.9)</p>
                    <td className="vertical-line-left"></td>
                    <p className="centered"><strong> 34/60 (56.6%)</strong></p>
                </tr>
                <tr>
                    <p>Scale method</p>
                    <td className="vertical-line-left"></td>
                    <p className="centered"><strong> Standard Scaler</strong></p>
                </tr>
                <tr>
                    <p>Cross validation</p>
                    <td className="vertical-line-left"></td>
                    <p className="centered"><strong> 5 folds</strong></p>
                </tr>
            </table>
        </div>
    )
    }
    export default DataPreProcessing