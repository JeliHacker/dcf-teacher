import {
    Slider,
    SliderFilledTrack,
    SliderThumb,
    SliderTrack
} from '@chakra-ui/react';

import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { sendPrompt } from '../models/gemini';


function CashFlowProjectionsComponent() {
    const [data, setData] = useState('');

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

       setData(res);
    }

    useEffect(()=>{getData()}, []);

    return (
        <div>
            Free Cash flow:
            <Slider aria-label='slider-ex-1' defaultValue={30}>
                <SliderTrack>
                    <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
            </Slider>

            <p>
                <ReactMarkdown>
                    {data}
                </ReactMarkdown>
            </p>

        </div>
    );
}

export default CashFlowProjectionsComponent;