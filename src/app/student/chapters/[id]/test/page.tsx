'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getQuestions, getChapter, createResult } from '@/lib/database';
import type { Question, Chapter } from '@/lib/database';

export default function TestPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user } = useAuth();

    const chapterId = params.id as string;
    const mode = searchParams.get('mode') || 'quick';
    const isExamMode = mode === 'exam';

    const [chapter, setChapter] = useState<Chapter | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
    const [showResult, setShowResult] = useState(false);
    const [timeLeft, setTimeLeft] = useState(isExamMode ? 60 : 0);
    const [testCompleted, setTestCompleted] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [chapterData, questionsData] = await Promise.all([
                    getChapter(chapterId),
                    getQuestions(chapterId)
                ]);
                setChapter(chapterData);
                setQuestions(questionsData);
            } catch (error) {
                console.error('Error fetching questions:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [chapterId]);

    const currentQuestion = questions[currentQuestionIndex];
    const hasAnswered = selectedAnswers[currentQuestionIndex] !== undefined;

    // Timer for exam mode
    useEffect(() => {
        if (isExamMode && !testCompleted && timeLeft > 0 && questions.length > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        handleNext();
                        return 60;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [isExamMode, testCompleted, timeLeft, currentQuestionIndex, questions.length]);

    const handleSelectAnswer = (optionIndex: number) => {
        if (hasAnswered && !isExamMode) return;
        if (testCompleted) return;

        setSelectedAnswers((prev) => ({
            ...prev,
            [currentQuestionIndex]: optionIndex,
        }));

        if (!isExamMode) {
            setShowResult(true);
        }
    };

    const handleNext = () => {
        setShowResult(false);

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
            if (isExamMode) setTimeLeft(60);
        } else {
            finishTest();
        }
    };

    const handlePrevious = () => {
        if (!isExamMode && currentQuestionIndex > 0) {
            setShowResult(false);
            setCurrentQuestionIndex((prev) => prev - 1);
        }
    };

    const calculateScore = () => {
        let correct = 0;
        Object.entries(selectedAnswers).forEach(([index, answer]) => {
            if (questions[parseInt(index)]?.correctAnswer === answer) {
                correct++;
            }
        });
        return correct;
    };

    const finishTest = async () => {
        setTestCompleted(true);
        const score = calculateScore();

        // Save result to database
        if (user && chapter) {
            try {
                const resultMode = mode === 'exam' ? 'exam' : 'quickrevise';
                console.log('Saving result:', { studentId: user.$id, examName: chapter.name, score, mode: resultMode });
                await createResult({
                    examId: chapterId,
                    examName: chapter.name,
                    studentId: user.$id,
                    studentName: user.name || 'Student',
                    mode: resultMode,
                    score: score,
                    totalQuestions: questions.length,
                    answers: [],
                    completedAt: new Date().toISOString(),
                    timeTaken: 0
                });
                console.log('Result saved successfully');
            } catch (error) {
                console.error('Error saving result:', error);
            }
        } else {
            console.log('Cannot save result - user:', !!user, 'chapter:', !!chapter);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50">
                <header className="bg-white shadow-sm">
                    <div className="max-w-4xl mx-auto px-4 h-16 flex items-center">
                        <button onClick={() => router.push(`/student/chapters/${chapterId}`)} className="text-gray-500 hover:text-gray-700">
                            ← Back
                        </button>
                    </div>
                </header>
                <div className="max-w-4xl mx-auto px-4 py-12 text-center">
                    <p className="text-gray-500 text-lg">No questions available for this chapter yet.</p>
                </div>
            </div>
        );
    }

    if (testCompleted) {
        const score = calculateScore();
        const percentage = Math.round((score / questions.length) * 100);

        return (
            <div className="min-h-screen bg-gray-50 p-4 pb-24">
                <div className="max-w-3xl mx-auto space-y-8">
                    {/* Score Card */}
                    <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                        <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center ${percentage >= 70 ? 'bg-green-100' : percentage >= 40 ? 'bg-yellow-100' : 'bg-red-100'
                            }`}>
                            <span className={`text-4xl font-bold ${percentage >= 70 ? 'text-green-600' : percentage >= 40 ? 'text-yellow-600' : 'text-red-600'
                                }`}>
                                {percentage}%
                            </span>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            {percentage >= 70 ? 'Great Job!' : percentage >= 40 ? 'Good Effort!' : 'Keep Practicing!'}
                        </h2>

                        <p className="text-gray-500 mb-6">
                            You got {score} out of {questions.length} questions correct
                        </p>

                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => router.push(`/student/chapters/${chapterId}`)}
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50"
                            >
                                Back to Chapter
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>

                    {/* Detailed Review */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-gray-800 px-2">Review Answers</h3>
                        {questions.map((question, qIndex) => {
                            const userAnswer = selectedAnswers[qIndex];
                            const isCorrect = userAnswer === question.correctAnswer;
                            const isSkipped = userAnswer === undefined;

                            return (
                                <div key={question.$id} className={`bg-white rounded-2xl shadow-sm p-6 border-l-4 ${isCorrect ? 'border-l-green-500' : isSkipped ? 'border-l-gray-300' : 'border-l-red-500'
                                    }`}>
                                    <div className="flex items-start gap-3 mb-4">
                                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-sm shrink-0 ${isCorrect ? 'bg-green-100 text-green-700' : isSkipped ? 'bg-gray-100 text-gray-500' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {qIndex + 1}
                                        </span>
                                        <div className="flex-1">
                                            <h4 className="text-gray-800 font-medium mb-1">{question.questionText}</h4>
                                            <span className={`text-xs font-medium px-2 py-0.5 rounded ${isCorrect ? 'bg-green-100 text-green-700' : isSkipped ? 'bg-gray-100 text-gray-600' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {isCorrect ? 'Correct' : isSkipped ? 'Skipped' : 'Incorrect'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-2 pl-11">
                                        {question.options.map((option, optIndex) => {
                                            const isSelected = userAnswer === optIndex;
                                            const isTheCorrectAnswer = question.correctAnswer === optIndex;

                                            let optionClass = "bg-gray-50 border-transparent text-gray-600";
                                            // Logic for highlighting
                                            if (isTheCorrectAnswer) {
                                                optionClass = "bg-green-50 border-green-500 text-green-700 font-medium";
                                            } else if (isSelected && !isTheCorrectAnswer) {
                                                optionClass = "bg-red-50 border-red-500 text-red-700";
                                            }

                                            return (
                                                <div
                                                    key={optIndex}
                                                    className={`p-3 rounded-xl border-2 text-sm flex items-center gap-3 ${optionClass}`}
                                                >
                                                    <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs border ${isTheCorrectAnswer ? 'bg-green-500 border-green-500 text-white' :
                                                            (isSelected && !isTheCorrectAnswer) ? 'bg-red-500 border-red-500 text-white' :
                                                                'bg-white border-gray-200 text-gray-500'
                                                        }`}>
                                                        {String.fromCharCode(65 + optIndex)}
                                                    </span>
                                                    <span className="flex-1">{option}</span>
                                                    {isTheCorrectAnswer && <span className="text-green-600 text-lg">✓</span>}
                                                    {isSelected && !isTheCorrectAnswer && <span className="text-red-500 text-lg">✗</span>}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    const isCorrectOption = (index: number) => index === currentQuestion?.correctAnswer;
    const isSelected = (index: number) => selectedAnswers[currentQuestionIndex] === index;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            {/* Minimal Control Bar */}
            <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                <button
                    onClick={() => router.push(`/student/chapters/${chapterId}`)}
                    className="text-gray-500 hover:text-gray-700"
                >
                    ← Exit
                </button>

                <div className="flex items-center gap-4">
                    <span className="text-gray-600 font-medium">
                        {currentQuestionIndex + 1} / {questions.length}
                    </span>
                    {isExamMode && (
                        <span className={`px-3 py-1 rounded-full font-mono ${timeLeft <= 10 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                            }`}>
                            {timeLeft}s
                        </span>
                    )}
                </div>
            </div>

            {/* Progress bar */}
            <div className="h-1 bg-gray-200 max-w-4xl mx-auto mb-8 rounded-full overflow-hidden">
                <div
                    className="h-full bg-emerald-500 transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                />
            </div>

            <main className="max-w-2xl mx-auto px-4 py-8">
                {/* Question */}
                <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                    <div className="flex items-start gap-3 mb-6">
                        <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-semibold text-sm">
                            {currentQuestionIndex + 1}
                        </span>
                        <h2 className="text-xl text-gray-800 font-medium leading-relaxed">
                            {currentQuestion?.questionText}
                        </h2>
                    </div>

                    {/* Options */}
                    <div className="space-y-3">
                        {currentQuestion?.options.map((option, index) => {
                            const showCorrectness = showResult && !isExamMode;

                            return (
                                <button
                                    key={index}
                                    onClick={() => handleSelectAnswer(index)}
                                    disabled={showResult && !isExamMode}
                                    className={`w-full p-4 rounded-xl text-left transition-all flex items-center gap-3 ${showCorrectness
                                        ? isCorrectOption(index)
                                            ? 'bg-green-100 border-2 border-green-500 text-green-800'
                                            : isSelected(index)
                                                ? 'bg-red-100 border-2 border-red-500 text-red-800'
                                                : 'bg-gray-50 border-2 border-transparent text-gray-500'
                                        : isSelected(index)
                                            ? 'bg-emerald-100 border-2 border-emerald-500 text-gray-800'
                                            : 'bg-gray-50 border-2 border-transparent text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-medium text-sm ${showCorrectness && isCorrectOption(index)
                                        ? 'bg-green-500 text-white'
                                        : showCorrectness && isSelected(index) && !isCorrectOption(index)
                                            ? 'bg-red-500 text-white'
                                            : isSelected(index)
                                                ? 'bg-emerald-500 text-white'
                                                : 'bg-gray-200 text-gray-600'
                                        }`}>
                                        {String.fromCharCode(65 + index)}
                                    </span>
                                    <span className="flex-1">{option}</span>
                                    {showCorrectness && isCorrectOption(index) && (
                                        <span className="text-green-500">✓</span>
                                    )}
                                    {showCorrectness && isSelected(index) && !isCorrectOption(index) && (
                                        <span className="text-red-500">✗</span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between">
                    {!isExamMode && (
                        <button
                            onClick={handlePrevious}
                            disabled={currentQuestionIndex === 0}
                            className="px-6 py-3 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                        >
                            ← Previous
                        </button>
                    )}

                    <button
                        onClick={handleNext}
                        disabled={!hasAnswered}
                        className={`px-8 py-3 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 disabled:opacity-50 ${isExamMode ? 'ml-auto' : ''}`}
                    >
                        {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next →'}
                    </button>
                </div>
            </main>
        </div>
    );
}
