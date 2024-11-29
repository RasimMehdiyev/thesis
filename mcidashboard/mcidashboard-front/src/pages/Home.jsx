import React, { useEffect } from 'react'
import { useState } from 'react'
// usenavigate is used to navigate to another page
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const [isResultsContactChecked, setIsResultsContactChecked] = useState(false);
    const [isUnderstandExpectationsChecked, setIsUnderstandExpectationsChecked] = useState(false);
    const [isParticipateTrialsChecked, setIsParticipateTrialsChecked] = useState(false);
    const [isRisksDiscomfortsChecked, setIsRisksDiscomfortsChecked] = useState(false);
    const [isBenefitsChecked, setIsBenefitsChecked] = useState(false);
    const [isRewardCompensationChecked, setIsRewardCompensationChecked] = useState(false);
    const [isVoluntaryParticipationChecked, setIsVoluntaryParticipationChecked] = useState(false);
    const [isRecordingsChecked, setIsRecordingsChecked] = useState(false);
    const [isSensitiveTopicsChecked, setIsSensitiveTopicsChecked] = useState(false);
    const [isGdprChecked, setIsGdprChecked] = useState(false);
    const [isEthicsApprovalChecked, setIsEthicsApprovalChecked] = useState(false);
    const [isDiscomfortContactChecked, setIsDiscomfortContactChecked] = useState(false);
    const [isQuestionsContact, setIsQuestionsContact] = useState(false);
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');

    const navigate = useNavigate();

    const handleEmailChange = (e) => {
        const emailInput = e.target.value;
        setEmail(emailInput);

        // Simple regex for basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput)) {
            setEmailError("Please enter a valid email address.");
        } else {
            setEmailError("");
        }
    };

    const allChecked = 
                       isUnderstandExpectationsChecked &&
                       isParticipateTrialsChecked &&
                       isRisksDiscomfortsChecked &&
                       isBenefitsChecked &&
                       isRewardCompensationChecked &&
                       isVoluntaryParticipationChecked &&
                       isRecordingsChecked &&
                       isSensitiveTopicsChecked &&
                       isGdprChecked &&
                       isEthicsApprovalChecked &&
                       isQuestionsContact &&
                       isDiscomfortContactChecked;

    useEffect(() => {
        console.log('All checked:', allChecked);
    }, [allChecked]);



    function getCookie(name){
        let cookieValue = null;
        if (document.cookie && document.cookie !== ''){
          const cookies = document.cookie.split(';');
          for (let i = 0; i < cookies.length; i++){
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')){
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
            }
          }
        }
        return cookieValue;
      }
    
    const csrftoken = getCookie('csrftoken');

    const submitForm = async () =>{
        localStorage.setItem('ICFConfirmed', true);
        let apiURL = '/dashboard/submit_email/';    

        console.log('Email submitted successfully');
        navigate('/overview');

        try {
            const response = await fetch(apiURL, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrftoken,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email }),
            });

            if (response.ok) {
                console.log('Email submitted successfully');
                navigate('/overview');
            } else {
                console.log('Failed to submit email');
            }
        } catch (error) {
            console.log('Failed to submit email');
        } 
    }

  return (
      <div className='home-container'>
        <div className="icf-container">
            <h2>Informed Consent</h2>
            <div className="title-research">
                <h3>Title of the research:</h3>
                <p>How can a web application effectively facilitate communication to healthcare professionals of 
                    machine-learning predictions for Mild Cognitive Impairment (MCI) diagnosis, based on digital 
                    biomarkers of cognitive performance derived from Klondike Solitaire patient gameplay, as a 
                    complementary tool to monitor and screen for MCI?
                </p>
            </div>
            <h3>Name + contact details of supervisor and researcher(s):</h3>   
            <div className="contact-details">
                <ul>
                    <li id='contact-title'><strong>Supervisor</strong></li>
                    <li id='contact-name'>Vero Vanden Abeele</li>
                    <li><a href="">vero.vandenabeele@kuleuven.be</a></li>
                    <li><a href="">+32 16 30 11 05</a></li>
                    <li>Mens-Machine Interactie (HCI), Campus Groep T Leuven</li>
                    <li>Andreas Vesaliusstraat 13/2600 - 3000 Leuven</li>
                </ul>
                <ul>
                    <li id='contact-title'><strong>Researchers</strong></li>
                    <li id='contact-name'>Penelope Rekkas</li>
                    <li><a href="">penelope.rekkas@student.kuleuven.be  </a></li>
                    <li>Electronics and ICT Engineering, Campus Groep T Leuven </li>
                    <li>Andreas Vesaliusstraat 13 - 3000 Leuven</li>
                </ul> 
                <ul>
                    <li id='contact-title'><strong>Co-supervisor</strong></li>
                    <li id='contact-name'>Yu Chen</li>
                    <li><a href="">yu.chen@kuleuven.be</a></li>
                    {/* <li><a href="">+32 16 30 11 05</a></li> */}
                    <li>Mens-Machine Interactie (HCI), Campus Groep T Leuven</li>
                    <li>Andreas Vesaliusstraat 13 - 3000 Leuven</li>
                </ul> 
                <ul>
                    <li style={{paddingTop: '35px'}} id='contact-name'>Rasim Mehdiyev</li>
                    <li><a href="">rasim.mehdiyev@student.kuleuven.be  </a></li>
                    <li>Electronics and ICT Engineering, Campus Groep T Leuven </li>
                    <li>Andreas Vesaliusstraat 13 - 3000 Leuven</li>
                </ul>

            </div>    
            <div className="goal-methodology">
                <h3>Goal and methodology of the research:</h3>
                <p>
                    This research focuses on developing a web application that leverages Explainable AI (XAI) techniques 
                    to present and clarify AI-generated predictions about Mild Cognitive Impairment (MCI) to healthcare 
                    professionals, based on patients' gameplay of the Klondike Solitaire card game. Users are asked to 
                    navigate the web application to locate and interpret specific information, after which they will assess 
                    the system’s usability, usefulness, understandability, and trustworthiness through a combination of 
                    validated questionnaires, an adapted questionnaire for the XAI context based on other validated 
                    tools, and open questions for explicit feedback.{" "}Participants can complete the tasks independently, 
                    while their screen and mouse activity on the web application will be recorded 
                    remotely. All results from their interaction will be used to refine and enhance the web application's 
                    design and functionality.
                </p>
            </div>     
            <div className='duration-exp'>
                <h3>Duration of the experiment: <strong>~60 minutes</strong></h3>
            </div>
            <div className="informed-consent">
                <form>
                    <div className='icf-items-div'>
                        <input type="checkbox" id="understand-expectations" name="understand-expectations" onChange={e=>setIsUnderstandExpectationsChecked(e.target.checked)}/>
                        <label htmlFor="understand-expectations">I understand what is expected of me during this research.</label>
                    </div>
                    <div className='icf-items-div'>
                        <input type="checkbox" id="participate-trials" name="participate-trials" onChange={e=>setIsParticipateTrialsChecked(e.target.checked)}/>
                        <label htmlFor="participate-trials">I know that I will participate in the following trials or tests:
                            <ul>
                                <li>Demographic questions (e.g., age range, education, professional background)</li>
                                <li>Exploration tasks to locate and interpret information on the web application, verbalize the thought process and report the correct answers.</li>
                                <li>AI Technology Acceptance Model</li>
                                <li>XAI Experience Quality Scale</li>
                                <li>Recommended Trust Scale for XAI</li>
                                <li>Open-ended questions to provide explicit feedback</li>
                            </ul>
                        </label>
                    </div>
                    <div className='icf-items-div'>
                        <input type="checkbox" id="risks-discomforts" name="risks-discomforts" onChange={e=>setIsRisksDiscomfortsChecked(e.target.checked)}/>
                        <label htmlFor="risks-discomforts">I know that my participation may be associated to risks or discomforts: 
                            <p>The potential risks include mental fatigue or cognitive overload and possible frustration if the web application is challenging to use.</p> 
                        </label>
                    </div>
                    <div className='icf-items-div'>
                        <input type="checkbox" id="benefits" name="benefits" onChange={e=>setIsBenefitsChecked(e.target.checked)}/>
                        <label htmlFor="benefits">
                                I or others can benefit from this research in the following ways:
                            <p>
                                As a participant, I can benefit from contributing to the development of a tool that improves 
                                the diagnosing process of MCI using machine learning and XAI, helping healthcare 
                                professionals diagnose MCI earlier and more accurately, which can lead to better patient 
                                outcomes.
                            </p>                
                        </label>
                    </div>
                    <div className='icf-items-div'>
                        <input type="checkbox" id="reward-compensation" name="reward-compensation" onChange={e=>setIsRewardCompensationChecked(e.target.checked)}/>
                        <label htmlFor="reward-compensation">I know that there will be a reward or compensation for my participation in the research: <strong>£12</strong>
                            <p>
                                If I quit participating before the end of the study or if my submission is deemed invalid after manual review (due to lack of effort or failure to meet the study requirements), 
                                none of my data will be retained and I will not receive compensation.
                            </p>
                            {/* <p>
                                If I engage in the optional think-aloud protocol with the assistance of the researchers, 
                                I will be awarded a <strong>bonus of £3</strong>.
                            </p> */}
                        </label>
                        </div>
                    <div className='icf-items-div'>
                        <input type="checkbox" id="voluntary-participation" name="voluntary-participation" onChange={e=>setIsVoluntaryParticipationChecked(e.target.checked)}/>
                        <label htmlFor="voluntary-participation">I understand that my participation to this study is voluntary. 
                            I have the right to stop participating at any time. 
                            I do not have to give a reason for this and I know that it will not have 
                            any negative repercussions for me. However, I understand that if I choose to withdraw before completing the study, I will not receive the reward as none of my data will be retained.
                        </label>
                    </div>
                    <div className='icf-items-div'>
                        <input type="checkbox" id="recordings" name="recordings" onChange={e=>setIsRecordingsChecked(e.target.checked)}/>
                        <label htmlFor="recordings">I know that recordings of me will be made in this study: 
                            <p>
                                As part of this study, we will use LogRocket to record your screen and mouse activity while 
                                you navigate the web application. LogRocket will capture data such as the pages you visit, 
                                the buttons you click, and how you interact with various features of the web application. It 
                                will not record any sensitive information, such as your keystrokes, passwords, or personal 
                                messages. 
                            </p>
                            <p>
                                You will engage in a <strong>think-aloud protocol</strong>, which involves 
                                scheduling a call with the researchers. During the call, you will be asked to share your screen 
                                and microphone to verbalize your thoughts while navigating the web application. 
                                The call will be recorded and stored in OneDrive linked to a KU Leuven account. 
                            </p>
                            <p>
                                This will allow us to gather additional information about how you interact with the features, 
                                including which areas you use most and any difficulties you may encounter, to help us further 
                                optimize the tool. 
                            </p>       
                        </label>
                    </div>
                    <div className='icf-items-div'>
                        <input type="checkbox" id="sensitive-topics" name="sensitive-topics" onChange={e=>setIsSensitiveTopicsChecked(e.target.checked)}/>
                        <label htmlFor="sensitive-topics">
                            I know that this research may involve topics or questions that are of a sensitive or personal nature: 
                            <p>
                                Demographic information such as age range and job title.
                            </p>
                        </label>
                    </div>
                    <div className='icf-items-div'>
                        <input type="checkbox" id="gdpr" name="gdpr" onChange={e=>setIsGdprChecked(e.target.checked)}/>
                        <label htmlFor="gdpr">
                            My personal data will be processed in line with the General Data Protection Regulation (GDPR). 
                            <p>
                                Only the data that are strictly necessary to achieve the research objectives will be processed. My data will be kept confidential at all times throughout the study and the researchers will take measures to protect my privacy. 
                                For example, my personal data will be pseudonymized, meaning that my data can no longer be linked to me without the use of additional information that is only accessible to the researchers. 
                                I understand that my pseudonymized data may be reused for other scientific research and possibly for teaching or academic lectures. More information about the processing of 
                                my personal data can be found in the <a href="https://bit.ly/solitairedss-informationletter-TA-P">information letter</a>.
                            </p>
                        </label>
                    </div>
                    <div className='icf-items-div'>
                        <input
                            type="checkbox"
                            id="results-contact"
                            name="results-contact"
                            onChange={e => setIsResultsContactChecked(e.target.checked)}
                        />
                        <label htmlFor="results-contact">
                            I would like to be informed about the results of this research. The researchers may contact me for this purpose using the following e-mail address.
                            {isResultsContactChecked && (
                                <div style={{display:'flex', flexDirection:"row", textAlign:'center', alignItems:"center" }}>
                                    <input 
                                        className='email-input' 
                                        type="text" 
                                        placeholder="Enter your email" 
                                        value={email} 
                                        onChange={handleEmailChange} 
                                    />
                                    {emailError && <span className='email-error' style={{ color: 'red' }}>{emailError}</span>}
                                </div>
                            )}
                        </label>
  
                        </div>
                    <div className='icf-items-div'>
                        <input type="checkbox" id="questions-contact" name="questions-contact" onChange={e=>setIsQuestionsContact(e.target.checked)} />
                        <label htmlFor="questions-contact">
                            In case of further questions about the research I know that I can contact: 
                            <p>
                                Rasim Mehdiyev (<a href="">rasim.mehdiyev@student.kuleuven.be</a>) or 
                               
                                Penelope Rekkas (<a href="">penelope.rekkas@student.kuleuven.be</a>)
                            </p>
                        </label>
                    </div>
                    <div className='icf-items-div'>
                        <input type="checkbox" id="ethics-approval" name="ethics-approval" onChange={e=>setIsEthicsApprovalChecked(e.target.checked)}/>
                        <label htmlFor="ethics-approval">
                            This study has been reviewed and approved by the Social and Societal Ethics Committee (SMEC) of KU Leuven 
                            (approval number: <i> G-2024-8397</i>). 
                            In case of complaints or other concerns with regard to the ethical aspects of this research I can contact SMEC: <a href=''>smec@kuleuven.be</a>
                        </label>
                    </div>
                    <div className='icf-items-div'>
                        <input type="checkbox" id="discomfort-contact" name="discomfort-contact" onChange={e=>setIsDiscomfortContactChecked(e.target.checked)}/>
                        <label htmlFor="discomfort-contact">
                            I know that I can contact the individuals/organizations below if I would experience any discomfort or difficulties as a result 
                            of some of the subjects that were the topic of this research: 
                            <p>
                                Rasim Mehdiyev (<a href="">rasim.mehdiyev@student.kuleuven.be</a>) or 
                               
                                Penelope Rekkas (<a href="">penelope.rekkas@student.kuleuven.be</a>)
                            </p>
                        </label>
                    </div>
                    <div className='submit-text'>
                        
                        By clicking on this button I confirm that I have read and understood the information in this document and I have received an 
                        answer to all your questions regarding this research. I give my consent to participate.
                        
                    </div>

                </form>
                <div className='button-container'>
                    <button onClick={submitForm} className={allChecked ? 'submit-form' : 'submit-form disabled'} disabled={!allChecked}>
                       Submit
                    </button>
                </div>
            </div>
        </div>
      </div>
  )
}

export default Home;