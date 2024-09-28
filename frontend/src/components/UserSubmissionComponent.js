import { Button } from '@chakra-ui/react';
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import useQuestion from '../hooks/useQuestion';
import './UserSubmissionComponent.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function UserInputComponent({ currentSection, onSubmit, setSectionCompleted }) {
  const [hasFocused, setHasFocused] = useState(false);

  // Destructure from useQuestion to get question data, loading state, etc.
  const { generateQuestion, isLoading, questionData, isEvaluating, evaluationResult, submitMultipleChoiceAnswer, submitOpenResponseAnswer } = useQuestion();
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [topic, setTopic] = useState('');
  const [operatingCashFlow, setOperatingCashFlow] = useState('');
  const [capitalExpenditures, setCapitalExpenditures] = useState('');

  // Set the topic and call generateQuestion
  const handleGenerateQuestion = async () => {
    if (currentSection === 0) {
      setTopic('discounted cash flow valuation');
    }
    await generateQuestion('discounted cash flow valuation');
  };

  /**
   * Handle answer submission for all types of questions
   * @param {string} type The type of answer submitted (e.g. multiple choice, open response)
   */
  const handleMultipleChoiceAnswerSubmit = (type) => {
    if (selectedAnswer) {
      if (type === 'multiple choice') {
        submitMultipleChoiceAnswer(questionData, selectedAnswer);
      } else if (type === 'open response') {
        submitOpenResponseAnswer(questionData);
      }
    }
  };

  const handleOpenResponseAnswerSubmit = (type, question, answerAsJSON) => {
    const cachedData = JSON.parse(localStorage.getItem(`financialDataAsText`));
    let financial_data = '';

    for (let i = 0; i < 4; i++) {
      if (i === 0) {
        financial_data = financial_data + `\n Financial Doc: Balance Sheet\n ${cachedData[i]}\n`;
      }

      if (i === 1) {
        financial_data = financial_data + `\n Financial Doc: Income Statement\n ${cachedData[i]}\n`;
      }

      if (i === 2) {
        financial_data = financial_data + `\n Financial Doc: CashFlows\n ${cachedData[i]}\n`;
      }

      if (i === 3) {
        financial_data = financial_data + "Years: " + cachedData[i];
      }
    }

    console.log('Answer submitted:', selectedAnswer, type, financial_data);
    submitOpenResponseAnswer(question, answerAsJSON, financial_data);
  };

  // Handle selecting an answer (A, B, C, or D)
  const handleSelectAnswer = async (answer) => {
    await setSelectedAnswer(answer);
    console.log('Selected answer:', selectedAnswer);
    if (answer) {
      submitMultipleChoiceAnswer(questionData, answer); // Submit the selected answer to backend
    }
  };

  const handleFocus = () => {
    setHasFocused(true);
  };

  return (
    <div className="user-input-section" style={{ animation: hasFocused ? 'none' : 'glow 1s infinite alternate' }}>
      {currentSection === 0 && (
        <>
          <div style={{ marginTop: '20px' }}>
            <h3 style={{ fontSize: '28px', textAlign: 'left' }}>When you're finished reading the introduction, click the 'Next' button or use the guide above to move on.</h3>
            
            You can also use the chat box below to ask questions.
            <div className='chat-tag-instructions'
              tabIndex="0"
            >
            
              <i className="fas fa-comments"></i> {/* Chat icon */}
            </div>
          </div>
        </>
      )}

      {currentSection === 1 && (
        <>
          <div>
            <h3>Click below to generate a question:</h3>
            <Button
              onClick={handleGenerateQuestion}
              disabled={isLoading}
              fontWeight={'normal'}
              colorScheme={'blue'}
            >
              {isLoading ? 'Generating...' : 'Generate Question'}
            </Button>
          </div>

          {/* Display the generated question */}
          {questionData && (
            <>
              <div>
                <h3>Answer the following question:</h3>
                <ReactMarkdown>{questionData}</ReactMarkdown>
              </div>

              <div className="choice-buttons">
                <button onClick={() => handleSelectAnswer('A')}
                  className={selectedAnswer === 'A' ? 'highlight' : ''}>A</button>
                <button onClick={() => handleSelectAnswer('B')}
                  className={selectedAnswer === 'B' ? 'highlight' : ''}>B</button>
                <button onClick={() => handleSelectAnswer('C')}
                  className={selectedAnswer === 'C' ? 'highlight' : ''}>C</button>
                <button onClick={() => handleSelectAnswer('D')}
                  className={selectedAnswer === 'D' ? 'highlight' : ''}>D</button>
              </div>
            </>
          )}

          {/* Show evaluation result */}
          {evaluationResult && (
            <div>
              <h3>Result:</h3>
              <ReactMarkdown>{evaluationResult}</ReactMarkdown>
            </div>
          )}
        </>
      )}

      {currentSection === 2 && (
        <>
          <div>
            <h3 style={{ fontSize: '28px', textAlign: 'center' }}>Select a company to value.</h3>
          </div>
        </>
      )}

      {currentSection === 3 && (
        <>
          <div style={{ textAlign: 'left', marginTop: '10px' }}>
            <h3 style={{ fontSize: '28px', fontWeight: 'bold' }}>Free Cash Flow</h3>

            <a href='https://www.investopedia.com/terms/f/freecashflow.asp'>Investopedia</a> defines Free Cash Flow (FCF) as "the cash that a company generates after accounting for cash outflows to support its operations and maintain its capital assets."
            <br /><br />
            FCF is a useful metric because it shows how profitable a company is.
            If the company is going to pay dividends, it will come out of free cash flow (assuming the company is healthy).
            <br /><br />
            <div style={{ textAlign: 'center' }}>
              The formula for FCF is: <br />
              <span style={{ fontWeight: 'bold', }}>Operating Cash Flows - Capital Expenditures</span>
            </div>
            <br />
            We can find both of these numbers in the statement of cash flows.
            For operating cash flows, you're looking for the cash flows generated from operating activities.
            Capital expenditures will be found in the "cash flows from investing" section.
            Sometimes it will be listed under "capital expenditures", but most of the time it falls under "payments to acquire property, plant, and equiment".
            <br /><br />
          </div>
          <div style={{ textAlign: 'left', border: '1px solid black', backgroundColor: '#fef3b2', fontSize: '28px' }}>
            <span style={{ fontWeight: 'bold', marginLeft: '10px' }}>Instructions</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center', border: '1px solid black', padding: '5px' }}>
            <h3>Find the following data for 2023:</h3>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center' }}>
                Operating cash flows:
              </label>
              <input
                type="text"
                value={operatingCashFlow}
                onChange={(e) => setOperatingCashFlow(e.target.value)}
                className='input-box'
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center' }}>
                Capital expenditures:
              </label>
              <input
                type="text"
                value={capitalExpenditures}
                onChange={(e) => setCapitalExpenditures(e.target.value)}
                className='input-box'
              />
            </div>
            <button
              onClick={() => {
                handleOpenResponseAnswerSubmit(
                  'open response',
                  'Find the following data for 2023: Operating Cash Flows and Capital Expenditures',
                  {
                    'operatingCashFlow': operatingCashFlow,
                    'capitalExpenditures': capitalExpenditures
                  });

                setSectionCompleted(true);
              }}
              style={{
                backgroundColor: 'green',
                color: 'white',
                padding: '5px 10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '4px',
                transition: 'background-color 0.3s ease',
                fontWeight: 'bold',
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#005500'} // Darker green on hover
              onMouseLeave={(e) => e.target.style.backgroundColor = 'green'} // Back to original green
            >
              Submit

            </button>


            {evaluationResult && (
              <div style={{ textAlign: 'left' }}>
                <ReactMarkdown>{evaluationResult}</ReactMarkdown>
              </div>
            )}
          </div>
        </>
      )}

      {currentSection === 4 && (
        <>
          <h3>Now, get the OCF and CapEx for each of the past 6 years.</h3>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <label style={{ display: 'flex', alignItems: 'center' }}>
              Operating cash flows:
            </label>
            <input
              type="text"
              value={operatingCashFlow}
              onChange={(e) => setOperatingCashFlow(e.target.value)}
              onFocus={handleFocus} // Disable glow on focus
              className='input-box'
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <label style={{ display: 'flex', alignItems: 'center' }}>
              Capital expenditures:
            </label>
            <input
              type="text"
              value={capitalExpenditures}
              onChange={(e) => setCapitalExpenditures(e.target.value)}
              onFocus={handleFocus} // Disable glow on focus
              className='input-box'
            />
          </div>
          <button
            onClick={() => {
              handleOpenResponseAnswerSubmit('open response', {
                'operatingCashFlow': operatingCashFlow,
                'capitalExpenditures': capitalExpenditures
              });

              setSectionCompleted(true);
            }}
            style={{
              backgroundColor: 'green',
              color: 'white',
              padding: '5px 10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '4px',
              transition: 'background-color 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#005500'} // Darker green on hover
            onMouseLeave={(e) => e.target.style.backgroundColor = 'green'} // Back to original green
          >
            Submit
            <span style={{ marginLeft: '5px' }}>▶</span>
          </button>
        </>
      )}
    </div>

  );
}

export default UserInputComponent;
