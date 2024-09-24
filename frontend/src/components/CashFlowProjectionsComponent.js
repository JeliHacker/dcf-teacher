import {
    Slider,
    SliderFilledTrack,
    SliderMark,
    SliderThumb,
    SliderTrack
} from '@chakra-ui/react';

import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { sendPrompt } from '../models/gemini';


function CashFlowProjectionsComponent() {
    const [cashFlow, setCashFlow] = useState('');
    const [growthRate, setGrowth] = useState(0);
    const [discountRate, setDiscount] = useState(0);
    const [dcf , setDCF] = useState('');

    const getData = async() =>
    {
        const cachedData = JSON.parse(localStorage.getItem('financialDataAsText'));
        let historyText = `history: `;

        for (let i = 0; i < 4; i++) {
            if (i === 0) {
                historyText += `\n Financial Doc: Balance Sheet\n ${cachedData[i]}\n`;
            }

            if (i === 1) {
                historyText += `\n Financial Doc: Income Statement\n ${cachedData[i]}\n`;
            }

            if (i === 2) {
                historyText += `\n Financial Doc: CashFlows\n ${cachedData[i]}\n`;
            }

            if (i === 3) {
                historyText += `\n Years: \n ${cachedData[i]}\n`;
            }
        }

        const finalMessage = `Using Statement of Cash Flows (use all 3 years) ${historyText}\n\nCalculate Free Cash Flow  using the Operating Cash Flows & Capital Expenditures. Give the final final of Free Cash Flow from sections within the required documents and only use the years that are considered from within the specific financial document used. Please only give the final result of cash flow values `;

        console.log(finalMessage);

        const res = await sendPrompt(finalMessage);

       setCashFlow(res);
    }


    const getDiscountedCashFlow = async() =>
    {
        const res = await sendPrompt(`Based on the discount rate: ${discountRate}, the most recent Free Cash Flows: ${cashFlow}, and the Terminal Growth rate: ${growthRate} calculate the discounted cash flow projecting over the next 20 years and give the final numeric result`);
        setDCF(res);
    }

    useEffect(()=>{
        getData();
        getDiscountedCashFlow();
    }, [discountRate, growthRate]);

    const labelStyles = {
        mt: '2',
        ml: '-2.5',
        fontSize: 'sm',
      }

    return (
        <div>
            Discount Rate:
            <Slider defaultValue={0} min={0} max={15} step={3}onChange={(val) => 
                {
                    setDiscount(val);
                }}>
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
                <SliderTrack bg='red.100'>
                    <SliderFilledTrack bg='tomato' />
                </SliderTrack>
                <SliderThumb boxSize={6} />
            </Slider>

            Terminal Growth Rate:
            <Slider defaultValue={0} min={0} max={15} step={3} onChange={(val) => 
                {
                    setGrowth(val);
                }}>
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

                <SliderTrack bg='red.100'>
                    <SliderFilledTrack bg='tomato' />
                </SliderTrack>
                <SliderThumb boxSize={6} />
            </Slider>

                <p>
                    <br/><br/>Free Cash flow:
                    <ReactMarkdown>
                        {cashFlow}
                    </ReactMarkdown>
                    
                    <br/><br/>DCF:
                    <ReactMarkdown>
                        {dcf}
                    </ReactMarkdown>
                </p>

        </div>
    );
}

export default CashFlowProjectionsComponent;