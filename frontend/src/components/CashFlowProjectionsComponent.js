import {
    Button,
    Flex,
    Slider,
    SliderFilledTrack,
    SliderMark,
    SliderThumb,
    SliderTrack,
    Input
} from '@chakra-ui/react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { sendPrompt } from '../models/gemini';


// Register the required Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);


function CashFlowProjectionsComponent() {
    const [cashFlow, setCashFlow] = useState('');
    const [growthRate, setGrowth] = useState(10);
    const [discountRate, setDiscount] = useState(9);
    const [dcf, setDCF] = useState('');

    const [initialFCF, setInitialFCF] = useState(1000);
    const [cashFlows, setCashFlows] = useState([]);

    const projectCashFlows = () => {
        const years = 20;
        const projectedCashFlows = [];

        for (let year = 1; year <= years; year++) {
            const futureFCF = initialFCF * Math.pow(1 + growthRate / 100, year);
            const discountedFCF = futureFCF / Math.pow(1 + discountRate / 100, year);

            projectedCashFlows.push({
                year,
                futureFCF: futureFCF.toFixed(2),
                discountedFCF: discountedFCF.toFixed(2),
            });
        }

        setCashFlows(projectedCashFlows);
    };

    const chartData = {
        labels: cashFlows.map((flow) => `Year ${flow.year}`), // X axis: Year 1, Year 2, etc.
        datasets: [
            {
                label: 'Future FCF',
                data: cashFlows.map((flow) => flow.futureFCF), // Y axis: Future Free Cash Flow
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
            },
            {
                label: 'Discounted FCF',
                data: cashFlows.map((flow) => flow.discountedFCF), // Y axis: Discounted Free Cash Flow
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: true,
            },
        ],
    };

    // const getData = async () => {
    //     const cachedData = JSON.parse(localStorage.getItem('financialDataAsText'));
    //     let historyText = `history: `;

    //     for (let i = 0; i < 4; i++) {
    //         if (i === 0) {
    //             historyText += `\n Financial Doc: Balance Sheet\n ${cachedData[i]}\n`;
    //         }

    //         if (i === 1) {
    //             historyText += `\n Financial Doc: Income Statement\n ${cachedData[i]}\n`;
    //         }

    //         if (i === 2) {
    //             historyText += `\n Financial Doc: CashFlows\n ${cachedData[i]}\n`;
    //         }

    //         if (i === 3) {
    //             historyText += `\n Years: \n ${cachedData[i]}\n`;
    //         }
    //     }

    //     const finalMessage = `Using Statement of Cash Flows (use all 3 years) ${historyText}\n\nCalculate Free Cash Flow  using the Operating Cash Flows & Capital Expenditures. Give the final final of Free Cash Flow from sections within the required documents and only use the years that are considered from within the specific financial document used. Please only give the final result of cash flow values `;

    //     console.log(finalMessage);

    //     const res = await sendPrompt(finalMessage);

    //     setCashFlow(res);
    // }


    // const getDiscountedCashFlow = async () => {
    //     const res = await sendPrompt(`Based on the discount rate: ${discountRate}, the most recent Free Cash Flows: ${cashFlow}, and the Terminal Growth rate: ${growthRate} calculate the discounted cash flow projecting over the next 20 years and give the final numeric result`);
    //     setDCF(res);
    // }

    // useEffect(() => {
    //     getData();
    //     getDiscountedCashFlow();
    // }, [discountRate, growthRate]);

    useEffect(() => {
        projectCashFlows();
    }, [discountRate, growthRate]);

    const labelStyles = {
        mt: '2',
        ml: '-2.5',
        fontSize: 'sm',
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <Flex justify='space-around' align='center' width='100%' marginTop='20px' marginBottom='35px'>
                <Flex flexDirection='column' align='center' width='45%'>
                    Discount Rate:
                    <Input
                        value={discountRate}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val === "") {
                                setDiscount("");  // Temporarily set the value to an empty string
                            } else {
                                const parsedVal = parseFloat(val);
                                if (!isNaN(parsedVal) && parsedVal <= 99) {
                                    setDiscount(parsedVal);  // Set state only if value is a valid number
                                }
                            }
                        }}
                        mb={4} // Margin bottom for spacing
                        max={99}
                    />
                    <Slider
                        value={discountRate}
                        min={-10}
                        max={50}
                        onChange={(val) => { setDiscount(val); }}
                    >
                        <SliderMark value={0} {...labelStyles}>
                            0%
                        </SliderMark>
                        <SliderMark value={10} {...labelStyles}>
                            10%
                        </SliderMark>
                        <SliderMark value={20} {...labelStyles}>
                            20%
                        </SliderMark>
                        <SliderMark value={30} {...labelStyles}>
                            30%
                        </SliderMark>
                        <SliderMark value={40} {...labelStyles}>
                            40%
                        </SliderMark>
                        <SliderMark value={50} {...labelStyles}>
                            50%+
                        </SliderMark>
                        <SliderTrack bg='red.100'>
                            <SliderFilledTrack bg='tomato' />
                        </SliderTrack>
                        <SliderThumb boxSize={6} />
                    </Slider>
                </Flex>

                <Flex flexDirection="column" align="center" width="45%">
                    Terminal Growth Rate:
                    <Input
                        value={growthRate}
                        onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            if (!isNaN(val) && val >= 0) {
                                setGrowth(val); // Syncing Input with Slider
                            }
                        }}
                        mb={4} // Margin bottom for spacing
                    />
                    <Slider
                        defaultValue={0}
                        min={0}
                        max={15}
                        onChange={(val) => { setGrowth(val); }}
                    >
                        <SliderMark value={3} {...labelStyles}>
                            3%
                        </SliderMark>
                        <SliderMark value={6} {...labelStyles}>
                            6%
                        </SliderMark>
                        <SliderMark value={9} {...labelStyles}>
                            9%
                        </SliderMark>
                        <SliderMark value={12} {...labelStyles}>
                            12%
                        </SliderMark>
                        <SliderMark value={15} {...labelStyles}>
                            15%
                        </SliderMark>
                        <SliderTrack bg='green.100'>
                            <SliderFilledTrack bg='green' />
                        </SliderTrack>
                        <SliderThumb boxSize={6} />
                    </Slider>
                </Flex>
            </Flex>

            <Flex justifyContent='space-around' align='center'>
                {cashFlows.length > 0 && (
                    <table>
                        <thead>
                            <tr>
                                <th>Year</th>
                                <th>Future FCF</th>
                                <th>Discounted FCF</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cashFlows.map((flow) => (
                                <tr key={flow.year}>
                                    <td>{flow.year}</td>
                                    <td>${flow.futureFCF}</td>
                                    <td>${flow.discountedFCF}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {/* Chart for Cash Flows */}
                <div style={{ width: '50%' }}>
                    <Line data={chartData} options={{ responsive: true }} />
                </div>
            </Flex>
        </div>
    );
}

export default CashFlowProjectionsComponent;