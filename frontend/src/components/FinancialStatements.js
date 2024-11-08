import { Button, Spinner, Tab, Tabs, Text } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import gemini from '../models/gemini.js';


const test = () => {
    const cachedData = JSON.parse(localStorage.getItem(`financialDataAsText`));

    if (cachedData === null || cachedData === undefined) return;
    

    let prompt = "Can we calculate the discounted cash flow from the values in this map? Assume a discount rate of 9% and free cash flow growth rate of 10%, use the Statement of Cash Flow and Income statement to calculate free cash flow yourself. There are 15204137000 shares outstanding. Provide the intrinsic value per share. Keep in mind every number given is in millions\n";

    for (let i = 0; i < 4; i++) {
        if (i === 0) {
            prompt = prompt + `\n Financial Doc: Balance Sheet\n ${cachedData[i]}\n`;
        }

        if (i === 1) {
            prompt = prompt + `\n Financial Doc: Income Statement\n ${cachedData[i]}\n`;
        }

        if (i === 2) {
            prompt = prompt + `\n Financial Doc: CashFlows\n ${cachedData[i]}\n`;
        }

        if(i === 3)
        {
            prompt = prompt + "Years: "+cachedData[i];
        }
    }

    gemini.sendPrompt(prompt)
        .then((res) => {
            console.log("this is the result: " + res);
        })
        .catch((err) => {
            console.log("error: " + err);
        })

}

function FinancialStatements({ cik, accessionNumber, onComplete, ticker }) {
    const [loading, setLoading] = useState(true);
    const [selectedStatement, setSelectedStatement] = useState('Balance Sheet');
    const [financialData, setFinancialData] = useState({
        titles: {},
        income_statement: [],
        balance_sheet: [],
        cash_flow_statement: []
    });



    // Check localStorage for existing data to avoid re-fetching
    useEffect(() => {
        if (!ticker) return; // Exit early if no ticker is provided

        // Check localStorage for cached data
        // const cachedData = localStorage.getItem(`financialData_${ticker}`);
        // console.log("this is the cached data: " + localStorage.getItem(`financialData_${ticker}`));
        // if (cachedData) {
        //     setFinancialData(JSON.parse(cachedData));
        //     // test();
        //     setLoading(false);
        //     return;
        // }

        const apiUrl = process.env.REACT_APP_API_URL;

        // Fetch financial data if not in localStorage
        setLoading(true);
        axios.get(`${apiUrl}/api/financial-data?ticker=${ticker}`)
            .then(response => {
                setFinancialData(response.data.fin_dict);
                localStorage.setItem("financialDataAsText", JSON.stringify(response.data.original)); // Cache data in localStorage
                localStorage.setItem(`financialData_${ticker}`, JSON.stringify(response.data.fin_dict)); // Cache data in localStorage
                localStorage.setItem(`ticker`, ticker);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching financial data:', error);
                setLoading(false);
            });
    }, [ticker]);  // Re-fetch data every time the ticker changes

    // Helper function to render tables
    const renderTable = (title, data) => {
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
                <>
                    <Spinner size='xl' color='green.500' />
                    <br />
                    <Text>Fetching financial data...</Text>
                    <br />
                </>
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

                    {selectedStatement === 'Balance Sheet' && <span style={{ fontWeight: 'bold' }}>{financialData.titles['balance_sheet']}</span>}
                    {selectedStatement === 'Statement of Cash Flows' && <span style={{ fontWeight: 'bold' }}>{financialData.titles['cash_flow_statement']}</span>}
                    {selectedStatement === 'Income Statement' && <span style={{ fontWeight: 'bold' }}>{financialData.titles['income_statement']}</span>}

                    {/* Conditionally render the selected financial statement */}
                    {selectedStatement === 'Balance Sheet' && renderTable('Balance Sheet', financialData.balance_sheet)}
                    {selectedStatement === 'Statement of Cash Flows' && renderTable('Cash Flow Statement', financialData.cash_flow_statement)}
                    {selectedStatement === 'Income Statement' && renderTable('Income Statement', financialData.income_statement)}
                </>
            )}

            <div style={{padding: '20px'}}></div>
        </div>
    );
}

export default FinancialStatements;
