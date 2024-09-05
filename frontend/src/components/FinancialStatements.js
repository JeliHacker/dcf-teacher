import React, { useState, useEffect } from 'react';
import axios from 'axios';

function FinancialStatements({ cik, accessionNumber, onComplete }) {
    const [loading, setLoading] = useState(true);
    const [financialData, setFinancialData] = useState([]);

    useEffect(() => {
        // Fetch financial data from the backend API
        axios.get('http://localhost:8000/api/financial-data')  // Adjust this to your actual API endpoint
            .then(response => {
                console.log(response.status);
                setFinancialData(response.data);  // Set the data
                setLoading(false);  // Mark loading as false once data is loaded
            })
            .catch(error => {
                console.error('Error fetching financial data:', error);
                setLoading(false);  // Even on error, stop showing the loading spinner
            });
    }, []);  // Runs once when the component mounts

    // Render the table only after the data is loaded
    return (
        <div style={{ position: 'relative', height: '80vh', width: '100%' }}>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <table border="1" style={{ width: '100%', textAlign: 'left' }}>
                    <thead>
                        <tr>
                            <th>Metric</th>
                            <th>Sep. 30, 2023</th>
                            <th>Sep. 24, 2022</th>
                            <th>Sep. 25, 2021</th>
                        </tr>
                    </thead>
                    <tbody>
                        {financialData.map((row, index) => (
                            <tr key={index}>
                                <td>{row.Metric}</td>
                                <td>{row["Sep. 30, 2023"]}</td>
                                <td>{row["Sep. 24, 2022"]}</td>
                                <td>{row["Sep. 25, 2021"]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <button onClick={onComplete} style={{ marginTop: '20px' }}>
                Complete Step 2!
            </button>
        </div>
    );
}

export default FinancialStatements;
