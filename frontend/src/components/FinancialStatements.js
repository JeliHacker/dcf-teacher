import React, { useState } from 'react';

function FinancialStatements({ cik, accessionNumber, onComplete }) {
    const [loading, setLoading] = useState(true);

    const accessionNumberNoDashes = accessionNumber.replace(/-/g, '');
    const cikNoLeadingZeros = parseInt(cik, 10); // removes leading zeros
    // const url = `https://www.sec.gov/Archives/edgar/data/${cikNoLeadingZeros}/${accessionNumberNoDashes}/${accessionNumber}.html`;
    // const url = 'https://www.sec.gov/Archives/edgar/data/320193/000032019323000106/aapl-20230930.htm';
    const url = '/backend/aapl-20230930.html';
    return (
        <div style={{ position: 'relative', height: '80vh', width: '100%' }}>
            {loading && <div>Loading...</div>}
            <button onClick={onComplete} style={{ marginTop: '20px' }}>
                Complete Step 2!
            </button>
            {url}
        </div>
    );
}

export default FinancialStatements;
