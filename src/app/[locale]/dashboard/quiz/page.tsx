'use client'
import MultipleChoiceQuiz from '@/app/_components/quiz/multiple-choice-quiz';
import RelationQuiz from '@/app/_components/quiz/relation-quiz';
import { FamilySelector } from '@/components/family-selector';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getPaternalLineageNames } from '@/server/actions/family-actions';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

// Quizzes to implement:
//      Fact and Fiction(True or False): is Ahmed Hamed the father of Ali?
//      Guessing Quiz: Who is Ahmed Hamed Uncle? 1. Ali , 2. Khalid ...
//      Generation Quiz: How many generation are you from Ahmed Hamed? 1. (2), 2. (7)...

interface Quiz {
    id: string;
    title: string;
    questions: Array<{
        type: string;
    }>;
}

export default function QuizPage() {
    const t = useTranslations('QuizPage');
    const [familyId, setFamilyId] = useState<number>(0);
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newQuiz, setNewQuiz] = useState<Partial<Quiz>>({
        title: '',
        questions: [],
    });
    const { data } = useQuery<{ name: string; gender: string; id: number }[]>({
        queryKey: ["fathers", familyId],
        queryFn: () => getPaternalLineageNames(familyId)
    });
    const handleCreateQuiz = () => {
        setIsCreating(true);
    };

    const handleSaveQuiz = () => {
        if (newQuiz.title && newQuiz.questions?.length) {
            setQuizzes([
                ...quizzes,
                {
                    id: Date.now().toString(),
                    title: newQuiz.title,
                    questions: newQuiz.questions,
                },
            ]);
            setIsCreating(false);
            setNewQuiz({ title: '', questions: [] });
        }
    };

    return (

        <div className="container h-screen w-screen">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold mb-4">{t('family-tree')}</h1>
                <div className="flex gap-4">
                    <FamilySelector onChange={value => setFamilyId(parseInt(value))} />
                </div>
            </div>
            <div className="flex w-full h-full justify-center items-center">

                {!isCreating ? (
                    <div>
                        <Button onClick={handleCreateQuiz} className="mb-4">
                            Create New Quiz
                        </Button>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {quizzes.map((quiz) => (
                                <Card key={quiz.id} className="p-4">
                                    <h2 className="text-xl font-semibold">{quiz.title}</h2>
                                    <p className="text-gray-600">
                                        {quiz.questions.length} questions
                                    </p>
                                    <Button variant="outline" className="mt-2">
                                        View Quiz
                                    </Button>
                                </Card>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="max-w-2xl">
                        <h2 className="text-xl font-semibold mb-4">Create New Quiz</h2>
                        <input
                            type="text"
                            placeholder="Quiz Title"
                            className="w-full p-2 border rounded mb-4"
                            value={newQuiz.title}
                            onChange={(e) =>
                                setNewQuiz({ ...newQuiz, title: e.target.value })
                            }
                        />
                        <div className="mb-4">
                            <Button onClick={() => setNewQuiz(prev => ({
                                ...prev,
                                questions: [...(prev.questions ?? []), { question: '', options: [], correctAnswer: '', type: 'relation' }]
                            }))}>
                                Add Question
                            </Button>
                            {newQuiz.questions?.map((question, index) => (
                                <div key={index} className="mt-4 p-4 border rounded">
                                    <div className="flex flex-col items-center justify-between gap-4">
                                        <select
                                            className="p-2 border rounded"
                                            value={question.type}
                                            onChange={(e) => {
                                                const updatedQuestions = [...newQuiz.questions!];
                                                updatedQuestions[index] = { ...updatedQuestions[index], type: e.target.value };
                                                setNewQuiz({ ...newQuiz, questions: updatedQuestions });
                                            }}
                                        >
                                            <option value="relation">Relation Quiz</option>
                                            <option value="multiple-choice">Multiple Choice</option>
                                            <option value="fact-fiction">Fact and Fiction</option>
                                            <option value="guess">Guessing Quiz</option>
                                            <option value="generation">Generation Quiz</option>
                                        </select>

                                    </div>
                                    {question.type === 'relation' && (
                                        <RelationQuiz
                                            people={data ?? []}
                                            onSelect={(person1, person2) => {
                                                const updatedQuestions = [...newQuiz.questions!];
                                                updatedQuestions[index] = {
                                                    ...updatedQuestions[index]
                                                };
                                                setNewQuiz({ ...newQuiz, questions: updatedQuestions });
                                            }}
                                        />
                                    )
                                    }


                                    {question.type === 'multiple-choice' && (
                                        <MultipleChoiceQuiz onSubmit={(question) => {
                                            const updatedQuestions = [...newQuiz.questions!];
                                            updatedQuestions[index] = question;
                                            console.log(question)
                                        }} />

                                    )}

                                    <Button variant="outline" onClick={() => {
                                        setNewQuiz(prev => ({
                                            ...prev,
                                            questions: prev.questions?.filter((_, i) => i !== index)
                                        }));
                                    }}>
                                        Remove
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={handleSaveQuiz}>Save Quiz</Button>
                            <Button
                                variant="outline"
                                onClick={() => setIsCreating(false)}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}