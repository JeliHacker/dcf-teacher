import React, { useState, useEffect } from 'react';
import useQuestion from '../hooks/useQuestion';
import ReactMarkdown from 'react-markdown';
import { Button } from '@chakra-ui/react';

function MultipleChoiceQuestion({ topic }) {
    const { generateQuestion, isLoading, questionData, isEvaluating, evaluationResult, submitMultipleChoiceAnswer, submitOpenResponseAnswer } = useQuestion();
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const handleSelectAnswer = async (answer) => {
        await setSelectedAnswer(answer);
        console.log('Selected answer:', selectedAnswer);
        if (answer) {
            submitMultipleChoiceAnswer(questionData, answer); // Submit the selected answer to backend
        }
    };

    useEffect(() => {
        generateQuestion(topic);
    }, []); // Empty array ensures this runs only on component mount    

    return (
        <div className="multiple-choice-question">
            <div className="multiple-choice-question-header">
                <h1><b>A Question for You...</b></h1>
                <Button colorScheme='blue' onClick={() => {
                    generateQuestion(topic);
                    setSelectedAnswer('');
                }}>
                    <i className="fa-solid fa-arrows-rotate"></i>
                    <span style={{ marginLeft: '5px' }}>Generate Question</span>
                </Button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: '20px', paddingRight: '20px' }}>
                {questionData && (
                    <>
                        <div>
                            <ReactMarkdown>{questionData}</ReactMarkdown>
                        </div>

                        <div className="choice-buttons">
                            <Button onClick={() => handleSelectAnswer('A')}
                                className={selectedAnswer === 'A' ? 'highlight' : ''}>A</Button>
                            <Button onClick={() => handleSelectAnswer('B')}
                                className={selectedAnswer === 'B' ? 'highlight' : ''}>B</Button>
                            <Button onClick={() => handleSelectAnswer('C')}
                                className={selectedAnswer === 'C' ? 'highlight' : ''}>C</Button>
                            <Button onClick={() => handleSelectAnswer('D')}
                                className={selectedAnswer === 'D' ? 'highlight' : ''}>D</Button>
                        </div>
                    </>
                )}
                {/* Show evaluation result */}
                {evaluationResult && (
                    <div>
                        <h3>Result:</h3>
                        <ReactMarkdown>{evaluationResult}</ReactMarkdown>
                    </div>
                )}
            </div>
        </div>
    )
}

export default MultipleChoiceQuestion;