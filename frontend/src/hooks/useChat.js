import { useState } from 'react';
import { sendPrompt } from '../models/gemini';

function useChat() {
    const [chatHistory, setChatHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [userMessage, setUserMessage] = useState('');


    const sendMessage = async (message, ticker) => {
        if (message.trim() === '') return;

        setIsLoading(true);
        const apiUrl = process.env.REACT_APP_API_URL;
        console.log("ticker: "+ticker);

        try {
            // Make request to your Flask API instead of Gemini directly
            const cachedData = JSON.parse(localStorage.getItem(`financialDataAsText`))

            let historyText =  `${ticker} history: `;

            for (let i = 0; i < 4; i++) {
                if (i === 0) {
                    historyText = historyText + `\n Financial Doc: Balance Sheet\n ${cachedData[i]}\n`;
                }
        
                if (i === 1) {
                    historyText = historyText + `\n Financial Doc: Income Statement\n ${cachedData[i]}\n`;
                }
        
                if (i === 2) {
                    historyText = historyText + `\n Financial Doc: CashFlows\n ${cachedData[i]}\n`;
                }

                if(i == 3)
                {
                    historyText = historyText + `\n Years: \n ${cachedData[i]}\n`;
                }
            }

            const finalMessage = "For Income Statement and Statement of Cash Flows use all 3 years and the first 2 for the Balance Sheet"+historyText+" \n\n"+message+"\n\n only answer based on the number columns given";

            console.log(finalMessage);

            const response = await sendPrompt(finalMessage);
            console.log("res: "+response);
             
            //const response = await axios.post(`${apiUrl}/api/ask`, { prompt: message });

            // Add both user's message and bot's response to the chat history at once
            const newMessage = { sender: 'user', text: message };
            const botResponse = { sender: 'bot', text: response };

            setChatHistory(prevHistory => [...prevHistory, newMessage, botResponse]);
        } catch (error) {
            console.error('Error fetching response from Gemini API:', error);
            
            const newMessage = { sender: 'user', text: message };
            setChatHistory(prevHistory => [
                ...prevHistory,
                newMessage,
                { sender: 'bot', text: `Error fetching response. ${JSON.stringify(error)} ${error.message} ${error.response}` }
            ]);
        } finally {
            setIsLoading(false);
            setUserMessage('');
        }
    };

    return {
        chatHistory,
        isLoading,
        userMessage,
        setUserMessage,
        sendMessage,
        setChatHistory, // You might need this if you want to manipulate history externally
    };
}

export default useChat;
