import { useState } from 'react';
import axios from 'axios';

function useQuestion() {
    const [isLoading, setIsLoading] = useState(false);
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [questionData, setQuestionData] = useState(null);
    const [evaluationResult, setEvaluationResult] = useState(null);

    // Function to generate a question
    const generateQuestion = async (topic) => {
        setIsLoading(true);
        try {
            const response = await axios.post('http://localhost:8000/api/generate_question', { prompt: topic });
            
            // Assuming the response contains the question and possible answers
            setQuestionData(response.data);
        } catch (error) {
            console.error('Error generating question:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const submitAnswer = async (question, answer) => {
        console.log("Submit Answer", question, answer);
        setIsEvaluating(true);
        try {
            const response = await axios.post('http://localhost:8000/api/submit_answer', { question, answer });

            setEvaluationResult(response.data);
        } catch (error) {
            console.error('Error submitting or evaluating answer:', error);
        } finally {
            setIsEvaluating(false);
        }
    };

    return {
        generateQuestion,
        isLoading, // Track loading state
        questionData, // Return the generated question
        isEvaluating,
        evaluationResult,
        submitAnswer,
    };
}

export default useQuestion;
