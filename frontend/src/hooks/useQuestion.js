import { useState } from 'react';
import axios from 'axios';

function useQuestion() {
    const [isLoading, setIsLoading] = useState(false);
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [questionData, setQuestionData] = useState(null);
    const [evaluationResult, setEvaluationResult] = useState(null);

    const apiUrl = process.env.REACT_APP_API_URL;

    // Function to generate a question
    const generateQuestion = async (topic) => {
        setIsLoading(true);
        try {
            const response = await axios.post(`${apiUrl}/api/generate_question`, { prompt: topic });
            
            // Assuming the response contains the question and possible answers
            setQuestionData(response.data);
        } catch (error) {
            console.error('Error generating question:', error);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Submits a multiple-choice answer to the server for evaluation
     * @param {object} question The question object containing the question and possible answers
     * @param {string} answer The user's answer
     */
    const submitMultipleChoiceAnswer = async (question, answer) => {
        setIsEvaluating(true);
        try {
            const response = await axios.post(`${apiUrl}/api/submit_multiple_choice_answer`, { question, answer });

            // Assuming the response contains an evaluation result
            setEvaluationResult(response.data);
        } catch (error) {
            console.error('Error submitting or evaluating answer:', error);
        } finally {
            setIsEvaluating(false);
        }
    };

    const submitOpenResponseAnswer = async (question, answer, financial_data) => {
        console.log("Submit Answer", question, answer, financial_data);
        setIsEvaluating(true);
        try {
            const response = await axios.post(`${apiUrl}/api/submit_open_response_answer`, { question, answer, financial_data });

            // Assuming the response contains an evaluation result
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
        submitMultipleChoiceAnswer,
        submitOpenResponseAnswer
    };
}

export default useQuestion;
