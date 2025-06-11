'use client';
import React, { useState } from 'react';

interface Answer {
    id: number;
    text: string;
    isCorrect: boolean;
}

interface Question {
    questionText: string;
    answers: Answer[];
}

export default function MultipleChoiceQuiz({ onSubmit }: { onSubmit: (question: Question) => void }) {
    const [isSaved, setIsSaved] = useState(false);
    const [question, setQuestion] = useState<Question>({
        questionText: '',
        answers: [
            { id: 1, text: '', isCorrect: false },
            { id: 2, text: '', isCorrect: false },
            { id: 3, text: '', isCorrect: false },
            { id: 4, text: '', isCorrect: false },
        ],
    });

    const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuestion({ ...question, questionText: e.target.value });
    };

    const handleAnswerChange = (id: number, text: string) => {
        setQuestion({
            ...question,
            answers: question.answers.map((answer) =>
                answer.id === id ? { ...answer, text } : answer
            ),
        });
    };

    const handleCorrectAnswerChange = (id: number) => {
        setQuestion({
            ...question,
            answers: question.answers.map((answer) =>
                answer.id === id
                    ? { ...answer, isCorrect: true }
                    : { ...answer, isCorrect: false }
            ),
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(question);
        setIsSaved(true);
        console.log('Submitted question:', question);
        // Here you can add logic to save the question
    };

    if (isSaved)
        return (
            <div className="flex flex-col items-center justify-center h-full gap-4 p-4 m-2 bg-white shadow-md rounded-md">
                <div>
                    <strong className='text-2xl'>Question: {question.questionText}</strong>
                </div>
                <div className='text-l'>
                    <strong>Answers:</strong>
                    {question.answers.map((answer) => (
                        <div key={answer.id}>
                            {answer.text} {answer.isCorrect && '(Correct)'}
                        </div>
                    ))}
                </div>
            </div>
        )

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4">
            <div className="mb-4">
                <label className="block mb-2 font-bold">Question:</label>
                <input
                    type="text"
                    value={question.questionText}
                    onChange={handleQuestionChange}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block mb-2 font-bold">Answers:</label>
                {question.answers.map((answer) => (
                    <div key={answer.id} className="flex items-center mb-2">
                        <input
                            type="text"
                            value={answer.text}
                            onChange={(e) => handleAnswerChange(answer.id, e.target.value)}
                            className="flex-1 p-2 border rounded mr-2"
                            required
                        />
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="correctAnswer"
                                checked={answer.isCorrect}
                                onChange={() => handleCorrectAnswerChange(answer.id)}
                                required
                            />
                            <span className="ml-2">Correct Answer</span>
                        </label>
                    </div>
                ))}
            </div>

            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Save Question
            </button>
        </form>
    );
}