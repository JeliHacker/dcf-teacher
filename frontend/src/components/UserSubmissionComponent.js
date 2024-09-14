import React, { useState } from 'react';
import './UserSubmissionComponent.css';
import useQuestion from '../hooks/useQuestion';
import ReactMarkdown from 'react-markdown';

function UserInputComponent({ currentSection, onSubmit }) {
  const [hasFocused, setHasFocused] = useState(false);

  // Destructure from useQuestion to get question data, loading state, etc.
  const { generateQuestion, submitAnswer, questionData, isLoading, isEvaluating, evaluationResult } = useQuestion();
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

  // Handle answer submission
  const handleAnswerSubmit = () => {
    if (selectedAnswer) {
      submitAnswer(selectedAnswer); // Submit the selected answer to backend
    }
  };

  // Handle selecting an answer (A, B, C, or D)
  const handleSelectAnswer = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleFocus = () => {
    setHasFocused(true);
  };

  return (
    <div className="user-input-section" style={{ animation: hasFocused ? 'none' : 'glow 1s infinite alternate' }}>
      {currentSection === 0 && (
        <>
          <div>
            <h3>Click below to generate a question:</h3>
            <button onClick={handleGenerateQuestion} disabled={isLoading}>
              {isLoading ? 'Generating...' : 'Generate Question'}
            </button>
          </div>

          {/* Display the generated question */}
          {questionData && (
            <>
              <div>
                <h3>Answer the following question:</h3>
                <ReactMarkdown>{questionData}</ReactMarkdown>
              </div>

              <div class="choice-buttons">
                <button>A</button>
                <button>B</button>
                <button>C</button>
                <button>D</button>
              </div>

              <button
                onClick={handleAnswerSubmit}
                disabled={!selectedAnswer || isEvaluating}
              >
                {isEvaluating ? 'Submitting...' : 'Submit Answer'}
              </button>
            </>
          )}

          {/* Show evaluation result */}
          {evaluationResult && (
            <div>
              <h3>Result:</h3>
              <p>{evaluationResult}</p>
            </div>
          )}
        </>
      )}

      {currentSection === 1 && (
        <>
          <h3>Find the following data for 2023:</h3>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <label style={{ display: 'flex', alignItems: 'center' }}>
              Operating cash flows:
            </label>
            <input
              type="text"
              value={operatingCashFlow}
              onChange={(e) => setOperatingCashFlow(e.target.value)}
              onFocus={handleFocus} // Disable glow on focus
              style={{ marginLeft: '10px', width: '80px' }}
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
              style={{ marginLeft: '10px', width: '80px' }}
            />
          </div>
          <button
            onClick={handleAnswerSubmit}
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

      {currentSection === 2 && (
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
              style={{ marginLeft: '10px', width: '80px' }}
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
              style={{ marginLeft: '10px', width: '80px' }}
            />
          </div>
          <button
            onClick={handleAnswerSubmit}
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
