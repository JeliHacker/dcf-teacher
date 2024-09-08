import React, { useState } from 'react';
import './UserSubmissionComponent.css';

function UserInputComponent({ onSubmit }) {
  const [hasFocused, setHasFocused] = useState(false);

  const handleFocus = () => {
    setHasFocused(true);
  };
  const [operatingCashFlow, setOperatingCashFlow] = useState('');
  const [capitalExpenditures, setCapitalExpenditures] = useState('');

  const handleSubmit = () => {
    onSubmit({ operatingCashFlow, capitalExpenditures });
  };

  return (
    <div className="user-input-section" style={{
      animation: hasFocused ? 'none' : 'glow 1s infinite alternate', // Disable animation on focus
    }}>
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
        onClick={handleSubmit}
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
    </div>
  );
}

export default UserInputComponent;
