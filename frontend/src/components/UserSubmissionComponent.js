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
    <div className="user-input-section">
      {currentSection === 0 && (
        <>
          <div style={{ textAlign: 'left', paddingLeft: '10px', paddingRight: '10px' }}>
            Look for the icon below on the right side of your screen to ask questions.
            <div className='chat-tag-instructions'
              tabIndex="0"
              style={{ marginBottom: '20px' }}
            >
              <i className="fas fa-comments"></i> {/* Chat icon */}
            </div>
          </div>
          <div className='instructions-section'>
            <span style={{ fontWeight: 'bold', marginLeft: '10px', fontSize: '18px', borderBottom: '2px solid rgba(0, 0,0, 0.2)' }}>Instructions</span>
          </div>
          <div style={{ textAlign: 'left', paddingLeft: '10px' }}>
            <br />
            When you're finished reading the introduction, press the "Next" button or use the guide above to move on.
          </div>
        </>
      )}

      {currentSection === 1 && (
        <>
          <div>
            Read the article about Discounted Cash Flow analysis.
          </div>
        </>
      )}

      {currentSection === 2 && (
        <>
          <div style={{ textAlign: 'left', padding: '10px' }}>
            <h3 style={{ fontSize: '28px' }}>Select a company to value.</h3>
            Some companies are better suited to discounted cash flow valuation than others.
            A DCF is more helpful when a company has a long history of being profitable.
            <br />
            <br />
            For this tutorial, we've selected three iconic companies in different industries who have been around for a while (more than 10 years) and have a history of profitability.
            Choose one and let's take a look at their financial statements!
          </div>
        </>
      )}

      {currentSection === 3 && (
        <>
          <div style={{ textAlign: 'left', padding: '10px' }}>
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
            Sometimes it will be listed under "capital expenditures", but most of the time it falls under "payments to acquire property, plant, and equipment".
            <br /><br />
          </div>

          <div className='instructions-section' style={{ border: '1px solid black', borderRadius: '20px' }}>
            <div style={{ textAlign: 'left', borderBottom: '1px solid black', borderTopLeftRadius: '20px', borderTopRightRadius: '20px', backgroundColor: '#fef3b2', fontSize: '28px' }}>
              <span style={{ fontWeight: 'bold', marginLeft: '10px' }}>Instructions</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center', padding: '5px' }}>
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

                  setSectionCompleted(currentSection, true);

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
          </div>
        </>
      )}

      {currentSection === 4 && (
        <>
          <div style={{ textAlign: 'left', marginTop: '10px', padding: '10px' }}>
            <h3 style={{ fontSize: '28px', fontWeight: 'bold' }}>Discount and Growth Rate</h3>

            The important thing to remember about discounted cash flow analysis is that it is built on assumptions, and these assumptions may or not be true.
            No one knows for certain what a company's future growth rate will be.
            But one reason DCF analysis is still useful because it shows us how fast a company will have to grow to justify a certain price.
            <br />
            <br />
            There are three inputs you can explore in this section:
            <br />The first is the initial amount of free cash flow.
            The default is the most recent year's FCF.
            <br />
            The second is the discount rate. We've set this to 9% by default, but you should move it up and down to see how it affects the company's valuation.
            <br />
            The third is the growth rate. We've set this to 10% by default. See how the growth rate affects the valuation of the company.
            Bonus points if you check the price of the stock and come back to see what growth rate needs to be achieved to justify the current price!


          </div>
        </>
      )}
    </div>

  );
}

export default UserInputComponent;
