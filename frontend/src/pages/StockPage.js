import {
    Flex,
    Slider,
    SliderFilledTrack,
    SliderMark,
    SliderThumb,
    SliderTrack,
    Spinner,
    Text,
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
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';


// Register the required Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);


function StockPage() {
    const { ticker } = useParams();
    const [growthRate, setGrowth] = useState(10);
    const [discountRate, setDiscount] = useState(9);

    const [initialFCF, setInitialFCF] = useState(0);
    const [cashFlows, setCashFlows] = useState([]);

    // New state to store the past 10 years of operating cash flow data
    const [operatingCashFlows, setOperatingCashFlows] = useState([]);
    const [freeCashFlows, setFreeCashFlows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [totalValue, setTotalValue] = useState(0);
    const [outstandingShares, setOutstandingShares] = useState(0);

    const projectCashFlows = () => {
        const years = 20;
        const projectedCashFlows = [];
        let sumDiscountedFCF = 0;

        for (let year = 1; year <= years; year++) {
            const futureFCF = initialFCF * Math.pow(1 + growthRate / 100, year);
            const discountedFCF = futureFCF / Math.pow(1 + discountRate / 100, year);

            sumDiscountedFCF += discountedFCF;

            projectedCashFlows.push({
                year,
                futureFCF: futureFCF.toFixed(2),
                discountedFCF: discountedFCF.toFixed(2),
            });
        }

        setCashFlows(projectedCashFlows);
        setTotalValue(sumDiscountedFCF);
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

    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchFinancialData = async () => {
            try {
                setLoading(true);
                const data = [];
                const freeCashFlowData = []; // Temp array to hold FCF calculations
                const currentYear = new Date().getFullYear();
                let currTotalValue = 0;

                for (let i = 1; i < 20; i++) {
                    const year = currentYear - i;

                    // Fetch both operating cash flows and capital expenditures
                    const [cashFlowResponse, capexResponse] = await Promise.all([
                        axios.get(`${apiUrl}/api/sec_api?ticker=${ticker.ticker}&year=${year}&category=cash_flows_from_operations`),
                        axios.get(`${apiUrl}/api/sec_api?ticker=${ticker.ticker}&year=${year}&category=capital_expenditures`)
                    ]);

                    const operatingCashFlows = cashFlowResponse.data['cash_flows_from_operations'];
                    const capitalExpenditures = capexResponse.data['capital_expenditures'];
                    const freeCashFlow = operatingCashFlows - capitalExpenditures;
                    currTotalValue += freeCashFlow;

                    data.push({
                        year,
                        operatingCashFlows: operatingCashFlows,
                        capitalExpenditures: capitalExpenditures,
                        freeCashFlow: freeCashFlow
                    });

                    freeCashFlowData.push(freeCashFlow);
                }

                setOperatingCashFlows(data);
                setFreeCashFlows(freeCashFlowData);

                // Set the initial FCF input to the most recent year's FCF
                if (freeCashFlowData.length > 0) {
                    setInitialFCF(freeCashFlowData[0]); // 2023 FCF
                } else {
                    console.log("line 124, freeCashFlowData is empty");
                }

                let shares = await axios.get(`${apiUrl}/api/sec_api?ticker=${ticker.ticker}&year=${new Date().getFullYear() - 1}&category=shares_outstanding`);
                setOutstandingShares(shares.data['shares_outstanding']);

            } catch (err) {
                console.log(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFinancialData();
    }, [ticker]);

    useEffect(() => {
        projectCashFlows();
    }, [initialFCF, discountRate, growthRate]);

    const labelStyles = {
        mt: '2',
        ml: '-2.5',
        fontSize: 'sm',
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', paddingLeft: '10px', paddingRight: '10px' }}>
            <Flex justifyContent='space-around' align='center' gap='20px' >
                <Flex flexDirection='column' align='center' width={'45%'}>


                    {loading && <Spinner size='xl' color='green.500' />}
                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                        <h2>Free Cash Flow History for {ticker.toUpperCase()}</h2>
                        <table style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th>Year</th>
                                    <th>Operating Cash Flow</th>
                                    <th>Capital Expenditures</th>
                                    <th>Free Cash Flow</th>
                                </tr>
                            </thead>
                            <tbody>
                                {operatingCashFlows
                                    .filter(entry => entry.year <= new Date().getFullYear() - 1)
                                    .reverse()
                                    .map((entry, index, array) => {
                                        const currentFreeCashFlow = entry.operatingCashFlows && entry.capitalExpenditures
                                            ? entry.operatingCashFlows - entry.capitalExpenditures
                                            : null;

                                        const previousEntry = array[index + 1]; // The next entry in the reversed array is the previous year
                                        const previousFreeCashFlow = previousEntry?.operatingCashFlows && previousEntry.capitalExpenditures
                                            ? previousEntry.operatingCashFlows - previousEntry.capitalExpenditures
                                            : null;

                                        const growthRate = previousFreeCashFlow && currentFreeCashFlow
                                            ? ((currentFreeCashFlow - previousFreeCashFlow) / previousFreeCashFlow) * 100
                                            : null;

                                        return (
                                            <tr key={entry.year}>
                                                <td>{entry.year}</td>
                                                <td>{entry.operatingCashFlows ? `$${entry.operatingCashFlows.toLocaleString()}` : '-'}</td>
                                                <td>{entry.capitalExpenditures ? `$${entry.capitalExpenditures.toLocaleString()}` : '-'}</td>
                                                <td>{currentFreeCashFlow !== null ? `$${currentFreeCashFlow.toLocaleString()}` : '-'}</td>
                                                <td>{growthRate !== null ? `${growthRate.toFixed(2)}%` : '-'}</td> {/* Growth rate column */}
                                            </tr>
                                        );
                                    })}
                            </tbody>

                        </table>
                    </div>

                    {error && <div>Error: {error}</div>}

                    <Flex width='100%' justifyContent={'center'} alignItems={'center'} gap={4} mt={4} mb={4}>
                        <Text fontSize="lg" fontWeight="bold">Free Cash Flow:</Text>

                        <Input
                            value={initialFCF}
                            onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                if (!isNaN(val) && val >= 0) {
                                    setInitialFCF(val);
                                }
                            }}
                            width="200px"  // Control input width
                            textAlign="center"
                        />

                    </Flex>

                    {cashFlows.length > 0 && (
                        <table style={{ width: '100%' }}>
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
                                        <td>${Number(flow.futureFCF).toLocaleString()}</td>
                                        <td>${Math.ceil(Number(flow.discountedFCF)).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}




                </Flex>


                <Flex flexDirection="column" justifyContent='flex-start' width="50%">
                    <Flex direction="column" width={'100%'} gap={4} mt={4} mb={4}>

                        <Flex alignItems="center" justifyContent="space-between" bg="lightblue" p={2} borderRadius="md">
                            <Text fontSize="lg" fontWeight="bold">Total Value of Discounted Cash Flows:</Text>
                            <Text fontSize="lg" fontWeight="bold">${totalValue.toLocaleString()}</Text>  {/* Format the number with commas */}
                        </Flex>

                        <Flex alignItems="center" justifyContent="space-between" bg="lightgreen" p={2} borderRadius="md">
                            <Text fontSize="lg" fontWeight="bold">Outstanding Shares:</Text>
                            <Text fontSize="lg" fontWeight="bold">${outstandingShares.toLocaleString()}</Text>  {/* Format the number with commas */}
                        </Flex>

                        <Flex alignItems="center" justifyContent="space-between" bg="lightcoral" p={2} borderRadius="md">
                            <Text fontSize="lg" fontWeight="bold">Intrinsic Value per Share:</Text>
                            <Text fontSize="lg" fontWeight="bold">${(totalValue / outstandingShares).toFixed(2).toLocaleString()}</Text>  {/* Calculate and format */}
                        </Flex>

                    </Flex>
                    <Flex flexDirection="column" width='100%' mb={12}>
                        <Text fontSize="lg" fontWeight="bold">Terminal Growth Rate:</Text>
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
                            <SliderMark value={0} {...labelStyles}>
                                0%
                            </SliderMark>
                            <SliderMark value={100} {...labelStyles}>
                                100%
                            </SliderMark>
                            <SliderTrack bg='green.100'>
                                <SliderFilledTrack bg='green' />
                            </SliderTrack>
                            <SliderThumb boxSize={6} />
                        </Slider>
                    </Flex>

                    <Flex flexDirection="column" width='100%' mb={12}>
                        <Text fontSize="lg" fontWeight="bold">Discount Rate:</Text>
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


                    <div style={{ width: '100%', height: '400px' }}>
                        <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                </Flex>

            </Flex>
        </div>
    );
}

export default StockPage;