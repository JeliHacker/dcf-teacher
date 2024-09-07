import React, { useState } from 'react';
import './UserSubmissionComponent.css';
import FinancialStatements from './FinancialStatements';

function UserInputComponent({ onSubmit }) {
  const [operatingCashFlow, setOperatingCashFlow] = useState('');
  const [capitalExpenditures, setCapitalExpenditures] = useState('');

  const handleSubmit = () => {
    onSubmit({ operatingCashFlow, capitalExpenditures });
  };

  return (
    <div className="user-input-section">
      <h3>Find the following data:</h3>
      <label>
        Operating cash flows:
        <input
          type="text"
          value={operatingCashFlow}
          onChange={(e) => setOperatingCashFlow(e.target.value)}
        />
      </label>
      <label>
        Capital expenditures:
        <input
          type="text"
          value={capitalExpenditures}
          onChange={(e) => setCapitalExpenditures(e.target.value)}
        />
      </label>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default UserInputComponent;
