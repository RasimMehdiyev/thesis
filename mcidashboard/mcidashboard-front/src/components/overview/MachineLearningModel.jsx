import Tooltip from '../Tooltip';
import React, { useState } from 'react';
import { useEffect } from 'react';

const MachineLearningModel = ({ patient }) => {
    const [isDatasetTooltipVisible, setIsDatasetTooltipVisible] = useState(false);
    const [isPredictionTooltipVisible, setIsPredictionTooltipVisible] = useState(false);
    const [machineLearningData, setMachineLearningData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [MCI, setMCI] = useState('');
    const [error, setError] = useState(null);

    const showDatasetTooltip = () => {
        setIsDatasetTooltipVisible(true);
    };

    const hideDatasetTooltip = () => {
        setIsDatasetTooltipVisible(false);
    };

    const showPredictionTooltip = () => {
        setIsPredictionTooltipVisible(true);
    };

    const hidePredictionTooltip = () => {
        setIsPredictionTooltipVisible(false);
    };

    const getLatestMci = (mciData) => {
        const keys = Object.keys(mciData);
        const latestKey = keys[keys.length - 1];
        return mciData[latestKey] === 1 ? 'MCI' : 'healthy';
    };

    const fetchJSON = async (url) => {
        const response = await fetch(url);
        if (response.ok) {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return response.json();
            } else {
                throw new Error(`Invalid JSON response from ${url}`);
            }
        } else {
            throw new Error(`Failed to fetch data from ${url}: ${response.statusText}`);
        }
    };

    const fetchAllData = async (id) => {
        setLoading(true);
        setError(null);

        const machineLearningApiUrl = '/dashboard/machine-learning-data/';
        const mciApiUrl = `/dashboard/game/history/${id}/30/`;

        try {
            const [mlData, mciData] = await Promise.all([
                fetchJSON(machineLearningApiUrl),
                fetchJSON(mciApiUrl),
            ]);

            if (mlData) {
                setMachineLearningData(mlData);
            }
            if (mciData) {
                setMCI(getLatestMci(mciData));
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData(patient.id);
    }, [patient.id]);

    if (loading) {
        return <p>Loading...</p>;
    }

    // if (!machineLearningData) {
    //     return <div className="card" id="ml-card">
    //         <p className="ml-subtitle" id="ml-p">Machine learning model</p>
    //     </div>;
    // }

    return (
        <div className="card" id="ml-card">
            <p className="ml-subtitle" id="ml-p">Machine learning model</p>
            <div className="info">
                <div className="personal-info-h" style={{ position: 'relative' }}>
                    <h3>Dataset information</h3>
                    <img
                        src="/static/assets/info_icon.svg"
                        alt="Info Icon"
                        className="icon"
                        onMouseEnter={showDatasetTooltip}
                        onMouseLeave={hideDatasetTooltip}
                        style={{ cursor: 'pointer', marginBottom: 5 }}
                    />

                    <Tooltip
                        content="The machine learning models used data from <strong>46</strong> participants, which is a good starting point for initial research, though for the best results, similar models typically benefit from data from <strong>hundreds or thousands</strong> of participants."
                        isVisible={isDatasetTooltipVisible}
                        top={-70}
                        left={270}
                    />
                </div>

                <hr className="horizontal-line" />

                {machineLearningData?.patients ? (
                    <div className="demographics-list">
                        <p>
                            <strong>{machineLearningData?.patients.mci + machineLearningData?.patients.healthy} </strong>
                            participants in total
                        </p>
                        <ul>
                            <li>
                                <strong>{machineLearningData?.patients.healthy}</strong>{' '}
                                <span style={{ color: '#21AEEE' }}>healthy participants </span>
                                with an average age of{' '}
                                <strong>{machineLearningData?.patients.healthy_avg_age}</strong>{' '}
                            </li>
                            <ul>
                                <em
                                    style={{
                                        listStyleType: 'disc',
                                        marginTop: 0,
                                        fontSize: 16,
                                    }}
                                >
                                    Recruited from senior groups and labeled as healthy based on cognitive assessments
                                    (MMSE, MoCA).
                                </em>
                            </ul>
                            <li style={{ marginTop: 10 }}>
                                <strong>{machineLearningData?.patients.mci}</strong>{' '}
                                <span style={{ color: '#FA5D5D' }}>MCI participants</span> with an average age of{' '}
                                <strong>{machineLearningData?.patients.mci_avg_age}</strong>
                            </li>
                            <ul>
                                <em
                                    style={{
                                        listStyleType: 'disc',
                                        marginTop: 0,
                                        fontSize: 16,
                                    }}
                                >
                                    Recruited from two leading memory clinics in Belgium where they had already been
                                    diagnosed with MCI.
                                </em>
                            </ul>
                        </ul>
                    </div>
                ) : (
                    <p>Participants data is unavailable</p>
                )}

                <hr className="horizontal-line" />

                {machineLearningData?.total_games !== undefined ? (
                    <p className="demographics-list">
                        <strong>{machineLearningData?.total_games}</strong> game rounds,{' '}
                        <strong>{machineLearningData?.total_moves}</strong> player moves and{' '}
                        <strong>{machineLearningData?.total_game_time}</strong> minutes of gameplay
                    </p>
                ) : (
                    <p>Gameplay data is unavailable</p>
                )}

                <hr className="horizontal-line" />
                <p className="demographics-list">
                    <strong>19</strong> models trained with <strong>26</strong>/61 potential digital biomarkers
                </p>
            </div>

            <div className="test-scores">
                <div className="personal-info-h" style={{ position: 'relative' }}>
                    <p id="prediction-title">Solitaire DSS prediction:</p>
                    <img
                        src="/static/assets/info_icon.svg"
                        alt="Info Icon"
                        className="icon"
                        onMouseEnter={showPredictionTooltip}
                        onMouseLeave={hidePredictionTooltip}
                        style={{ cursor: 'pointer', marginBottom: 15 }}
                    />

                    <Tooltip
                        content="The system distinguishes between healthy individuals and those with MCI but doesn’t assess MCI severity or predict its progression to dementia, limiting its use for prognosis or treatment guidance."
                        isVisible={isPredictionTooltipVisible}
                        top={-70}
                        left={370}
                    />
                </div>

                <p id="prediction-text">
                    The <span style={{ textDecoration: 'underline' }}>most accurate</span> machine learning model predicts
                    that the patient is{' '}
                    <span
                        id={MCI === 'MCI' ? 'prediction-result-mci' : 'prediction-result-healthy'}
                        style={{
                            color: MCI === 'MCI' ? '#FA5D5D' : '#21AEEE',
                        }}
                    >
                        {MCI}
                    </span>{' '}
                    with a probability of <span id="confidence">{Math.round(patient.ml_probability * 10)/10}%</span>.
                </p>
            </div>

            <div className="accuracy">
                <a
                    id="more"
                    href="/machine-learning/"
                    style={{
                        textDecoration: 'underline',
                        color: '#5A21EB',
                        fontWeight: 600,
                        marginTop: -30,
                    }}
                >
                    More
                </a>
            </div>
        </div>
    );
};

export default MachineLearningModel;
