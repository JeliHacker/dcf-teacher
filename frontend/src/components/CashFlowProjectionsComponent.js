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
                            const val = parseFloat(e.target.value);
                            if (!isNaN(val) && val >= 0) {
                                setDiscount(val); 
                            }
                        }}
                        mb={4} 
                    />
                    <Slider
                        value={discountRate}
                        min={-10}
                        max={50}
                        onChange={(val) => { setDiscount(val); }}
                    >
                        <SliderMark value={-10} {...labelStyles}>
                            -10%
                        </SliderMark>
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
                                setGrowth(val);
                            }
                        }}
                        mb={4}
                    />
                    <Slider
                        defaultValue={0}
                        value={growthRate}
                        min={-50}
                        max={100}
                        onChange={(val) => { setGrowth(val); }}
                    >
                        <SliderMark value={-50} {...labelStyles}>
                            -50%
                        </SliderMark>
                        <SliderMark value={-10} {...labelStyles}>
                            -10%
                        </SliderMark>
                        <SliderMark value={0} {...labelStyles}>
                            0%
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

            <Flex justifyContent='space-around' align='center' gap='20px'>
                {cashFlows.length > 0 && (
                    <table style={{ width: '50%' }}>
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
                <div style={{ width: '50%', height: '400px' }}>
                    <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
            </Flex>
        </div>
    );
}

export default CashFlowProjectionsComponent;