import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Tabs, Tab } from '@chakra-ui/react'

function FinancialStatements({ cik, accessionNumber, onComplete, ticker }) {
    const [loading, setLoading] = useState(true);
    const [selectedStatement, setSelectedStatement] = useState('Balance Sheet');
    const [financialData, setFinancialData] = useState({
        income_statement: [],
        balance_sheet: [],
        cash_flow_statement: []
    });



    // Check localStorage for existing data to avoid re-fetching
    useEffect(() => {
        if (!ticker) return; // Exit early if no ticker is provided

        // Check localStorage for cached data
        const cachedData = localStorage.getItem(`financialData_${ticker}`);
        if (cachedData) {
            setFinancialData(JSON.parse(cachedData));
            setLoading(false);
            return;
        }

        const apiUrl = process.env.REACT_APP_API_URL;

        // Fetch financial data if not in localStorage
        setLoading(true);
        axios.get(`${apiUrl}/api/financial-data?ticker=${ticker}`)
            .then(response => {
                setFinancialData(response.data);
                localStorage.setItem(`financialData_${ticker}`, JSON.stringify(response.data)); // Cache data in localStorage
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching financial data:', error);
                setLoading(false);
            });
    }, [ticker]);  // Re-fetch data every time the ticker changes

    // Helper function to render tables
    const renderTable = (title, data) => {
        console.log(data);
        if (!data || data.length === 0) return <p>No data available for {title}</p>;

        const yearKeys = Object.keys(data[0]).filter(key => key !== 'Metric');
        
        // Sort the years in descending order (newest first)
        const sortedYears = yearKeys.sort((a, b) => {
            const yearA = new Date(a).getFullYear();
            const yearB = new Date(b).getFullYear();
            return yearB - yearA;
        });

        return (
            <div>
                {data && data.length > 0 ? (
                    <table border="1" style={{ width: '100%', textAlign: 'left' }}>
                        <thead>
                            <tr>
                                <th>Metric</th>
                                {sortedYears.map((year, index) => (
                                    <th key={index}>    {year}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, index) => (
                                <tr key={index}>
                                    <td>{row.Metric}</td>
                                    {sortedYears.map((year, idx) => (
                                        <td key={idx}>{row[year]}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>

                ) : (
                    <p>No data available for {title}</p>
                )}
            </div>
        );
    };

    // Render the tables only after the data is loaded
    return (
        <div style={{ position: 'relative', height: '80vh', width: '100%' }}>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                    <h1>Financial Statements for {ticker.toUpperCase()}</h1>

                    {/* Buttons to switch between statements */}
                    <Tabs
                        isFitted
                        variant="enclosed"
                        style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}
                    >
                        <Tab
                            onClick={() => setSelectedStatement('Balance Sheet')}
                            style={{
                                fontWeight: selectedStatement === 'Balance Sheet' ? 'bold' : 'normal',
                                backgroundColor: selectedStatement === 'Balance Sheet' ? '#EDF2F7' : 'white',
                                border: '1px solid #CBD5E0',
                                padding: '10px 20px',
                                cursor: 'pointer',
                                borderRadius: '5px',
                                transition: 'background-color 0.2s ease',
                            }}
                            _hover={{ backgroundColor: '#E2E8F0' }} // Hover effect
                        >
                            Balance Sheet
                        </Tab>
                        <Tab
                            onClick={() => setSelectedStatement('Statement of Cash Flows')}
                            style={{
                                fontWeight: selectedStatement === 'Statement of Cash Flows' ? 'bold' : 'normal',
                                backgroundColor: selectedStatement === 'Statement of Cash Flows' ? '#EDF2F7' : 'white',
                                border: '1px solid #CBD5E0',
                                padding: '10px 20px',
                                cursor: 'pointer',
                                borderRadius: '5px',
                                transition: 'background-color 0.2s ease',
                            }}
                            _hover={{ backgroundColor: '#E2E8F0' }} // Hover effect
                        >
                            Statement of Cash Flows
                        </Tab>
                        <Tab
                            onClick={() => setSelectedStatement('Income Statement')}
                            style={{
                                fontWeight: selectedStatement === 'Income Statement' ? 'bold' : 'normal',
                                backgroundColor: selectedStatement === 'Income Statement' ? '#EDF2F7' : 'white',
                                border: '1px solid #CBD5E0',
                                padding: '10px 20px',
                                cursor: 'pointer',
                                borderRadius: '5px',
                                transition: 'background-color 0.2s ease',
                            }}
                            _hover={{ backgroundColor: '#E2E8F0' }} // Hover effect
                        >
                            Income Statement
                        </Tab>
                    </Tabs>

                    {/* Conditionally render the selected financial statement */}
                    {selectedStatement === 'Balance Sheet' && renderTable('Balance Sheet', financialData.balance_sheet)}
                    {selectedStatement === 'Statement of Cash Flows' && renderTable('Cash Flow Statement', financialData.cash_flow_statement)}
                    {selectedStatement === 'Income Statement' && renderTable('Income Statement', financialData.income_statement)}
                </>
            )}

            <Button onClick={onComplete} style={{ marginTop: '20px' }}>
                Complete Step 2!
            </Button>
        </div>
    );
}

export default FinancialStatements;
