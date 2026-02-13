"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { getQuestionsForChapters, Question, createResult } from "@/lib/database";
import { ChevronLeft, ChevronRight, CheckCircle, XCircle, Timer } from "lucide-react";
import { t } from "@/lib/translations";

export default function CustomTestRunnerPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
    const [mode, setMode] = useState<"exam" | "quickrevise">("exam");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [startTime] = useState(Date.now());
    const [timeLeft, setTimeLeft] = useState(0); // in seconds
    const [timeElapsed, setTimeElapsed] = useState(0); // for quick revise
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        if (!user) return;

        const loadTest = async () => {
            try {
                const storedChapters = localStorage.getItem("customTestChapters");
                const storedMode = localStorage.getItem("customTestMode") as "exam" | "quickrevise";

                if (!storedChapters) {
                    router.push("/student/custom-test");
                    return;
                }

                setMode(storedMode || "exam");

                const chapterIds = JSON.parse(storedChapters);
                const fetchedQuestions = await getQuestionsForChapters(chapterIds);

                // Shuffle questions
                const shuffled = fetchedQuestions.sort(() => Math.random() - 0.5);
                setQuestions(shuffled);

                // Set time limit for exam mode
                if (!storedMode || storedMode === "exam") {
                    const duration = shuffled.length * 1.5 * 60;
                    setTimeLeft(duration);
                }
            } catch (error) {
                console.error("Error loading custom test:", error);
            } finally {
                setLoading(false);
            }
        };

        loadTest();
    }, [user, router]);

    // Timer logic
    useEffect(() => {
        if (loading || isFinished) return;

        const timer = setInterval(() => {
            if (mode === "exam") {
                if (timeLeft <= 0) return;
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        handleSubmit();
                        return 0;
                    }
                    return prev - 1;
                });
            } else {
                setTimeElapsed(prev => prev + 1);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [loading, isFinished, timeLeft, mode]);

    const handleAnswer = (optionIndex: number) => {
        if (isFinished) return;
        setSelectedAnswers((prev) => ({
            ...prev,
            [currentQuestionIndex]: optionIndex
        }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prev) => prev - 1);
        }
    };

    const calculateScore = () => {
        let score = 0;
        let correctCount = 0;

        questions.forEach((q, index) => {
            if (selectedAnswers[index] === q.correctAnswer) {
                score++;
                correctCount++;
            }
        });

        return { score, correctCount };
    };

    const handleSubmit = async () => {
        if (submitting || isFinished) return;
        setSubmitting(true);

        try {
            const { score, correctCount } = calculateScore();
            const timeTaken = Math.round((Date.now() - startTime) / 1000); // in seconds

            await createResult({
                examId: "custom-test",
                examName: mode === "exam" ? t(user?.medium, "custom_practice_exam") : t(user?.medium, "quick_revision_session"),
                studentId: user!.$id,
                studentName: user!.name,
                mode: mode,
                score: correctCount,
                totalQuestions: questions.length,
                answers: questions.map((q, i) => ({
                    questionId: q.$id,
                    selected: selectedAnswers[i] !== undefined ? selectedAnswers[i] : -1,
                    correct: q.correctAnswer,
                    isCorrect: selectedAnswers[i] === q.correctAnswer
                })),
                completedAt: new Date().toISOString(),
                timeTaken: mode === "exam" ? Math.round((Date.now() - startTime) / 1000) : timeElapsed
            });

            setIsFinished(true);
        } catch (error) {
            console.error("Error submitting test:", error);
            alert("Failed to submit test. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    if (isFinished) {
        const { score, correctCount } = calculateScore();
        const percentage = Math.round((score / questions.length) * 100);

        return (
            <div className="min-h-screen bg-gray-50 p-4 pb-24">
                <div className="max-w-3xl mx-auto space-y-8">
                    {/* Score Card */}
                    <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                        <div className="mb-6">
                            <span className="text-6xl">{percentage >= 70 ? '🎉' : '📚'}</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">{t(user?.medium, "test_completed")}</h2>
                        <p className="text-gray-500 mb-8">{t(user?.medium, "performance_summary")}</p>

                        <div className="grid grid-cols-3 gap-4 mb-8">
                            <div className="p-4 bg-emerald-50 rounded-xl">
                                <div className="text-3xl font-bold text-emerald-600">{percentage}%</div>
                                <div className="text-sm text-emerald-800 font-medium">{t(user?.medium, "score")}</div>
                            </div>
                            <div className="p-4 bg-blue-50 rounded-xl">
                                <div className="text-3xl font-bold text-blue-600">{correctCount}/{questions.length}</div>
                                <div className="text-sm text-blue-800 font-medium">{t(user?.medium, "correct")}</div>
                            </div>
                            <div className="p-4 bg-purple-50 rounded-xl">
                                <div className="text-3xl font-bold text-purple-600">{formatTime(Math.round((Date.now() - startTime) / 1000))}</div>
                                <div className="text-sm text-blue-800 font-medium">{t(user?.medium, "time")}</div>
                            </div>
                        </div>

                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => router.push("/student")}
                                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                            >
                                {t(user?.medium, "back_dashboard")}
                            </button>
                            <button
                                onClick={() => router.push("/student/custom-test")}
                                className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 shadow-lg shadow-emerald-500/30 transition-all"
                            >
                                {t(user?.medium, "create_new_test")}
                            </button>
                        </div>
                    </div>

                    {/* Detailed Review */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-gray-800 px-2">{t(user?.medium, "review_answers")}</h3>
                        {questions.map((question, qIndex) => {
                            const userAnswer = selectedAnswers[qIndex];
                            const isCorrect = userAnswer === question.correctAnswer;
                            const isSkipped = userAnswer === undefined;

                            return (
                                <div key={question.$id} className={`bg-white rounded-2xl shadow-sm p-6 border-l-4 ${isCorrect ? 'border-l-green-500' : isSkipped ? 'border-l-gray-300' : 'border-l-red-500'
                                    }`}>
                                    <div className="flex items-start gap-3 mb-4">
                                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-sm shrink-0 ${isCorrect ? 'bg-green-100 text-green-700' : isSkipped ? 'bg-gray-100 text-gray-500' : 'bg-red-100 text-red-700'
                                            }`}>{qIndex + 1}</span>
                                        <div className="flex-1">
                                            <h4 className="text-gray-800 font-medium mb-1">{question.questionText}</h4>
                                            <span className={`text-xs font-medium px-2 py-0.5 rounded ${isCorrect ? 'bg-green-100 text-green-700' : isSkipped ? 'bg-gray-100 text-gray-600' : 'bg-red-100 text-red-700'
                                                }`}>{isCorrect ? t(user?.medium, "correct") : isSkipped ? t(user?.medium, "skipped") : t(user?.medium, "incorrect")}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2 pl-11">
                                        {question.options.map((option, optIndex) => {
                                            const isSelected = userAnswer === optIndex;
                                            const isTheCorrectAnswer = question.correctAnswer === optIndex;

                                            let optionClass = "bg-gray-50 border-transparent text-gray-600";
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
                                                        }`}>{String.fromCharCode(65 + optIndex)}</span>
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

    const question = questions[currentQuestionIndex];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
                            <ChevronLeft className="w-6 h-6 text-gray-500" />
                        </button>
                        <div>
                            <h1 className="font-bold text-gray-800">{t(user?.medium, "custom_test_header")}</h1>
                            <p className="text-xs text-gray-500">{t(user?.medium, "question")} {currentQuestionIndex + 1} / {questions.length}</p>
                        </div>
                    </div>

                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono font-medium ${mode === "exam"
                        ? (timeLeft < 60 ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600')
                        : 'bg-emerald-50 text-emerald-600'
                        }`}>
                        <Timer className="w-4 h-4" />
                        {mode === "exam" ? formatTime(timeLeft) : formatTime(timeElapsed)}
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="h-1 bg-gray-100 w-full">
                    <div
                        className="h-full bg-emerald-500 transition-all duration-300"
                        style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                    />
                </div>
            </header>

            {/* Question Area */}
            <main className="flex-1 container mx-auto px-4 py-6 max-w-3xl flex flex-col">
                <div className="bg-white rounded-2xl shadow-sm p-6 mb-20 md:mb-6 flex-1">
                    <div className="mb-8">
                        <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full mb-4">
                            {question.chapterName}
                        </span>
                        <h2 className="text-xl font-medium text-gray-800 leading-relaxed">
                            {question.questionText}
                        </h2>
                    </div>

                    <div className="space-y-3">
                        {question.options.map((option, index) => {
                            const isSelected = selectedAnswers[currentQuestionIndex] === index;

                            // For Quick Revise: Check correctness immediately
                            const isCorrectAnswer = question.correctAnswer === index;
                            const showFeedback = mode === "quickrevise" && selectedAnswers[currentQuestionIndex] !== undefined;

                            let buttonClass = "border-gray-100 hover:border-emerald-200 hover:bg-gray-50";
                            let iconClass = "border-gray-300 text-gray-400";
                            let textClass = "text-gray-600";

                            if (isSelected) {
                                if (mode === "exam") {
                                    buttonClass = "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200 ring-offset-1";
                                    iconClass = "border-emerald-500 bg-emerald-500 text-white";
                                    textClass = "text-emerald-900 font-medium";
                                } else {
                                    // Quick Revise Logic
                                    if (isCorrectAnswer) {
                                        buttonClass = "border-green-500 bg-green-50 ring-2 ring-green-200";
                                        iconClass = "border-green-500 bg-green-500 text-white";
                                        textClass = "text-green-900 font-medium";
                                    } else {
                                        buttonClass = "border-red-500 bg-red-50 ring-2 ring-red-200";
                                        iconClass = "border-red-500 bg-red-500 text-white";
                                        textClass = "text-red-900 font-medium";
                                    }
                                }
                            } else if (showFeedback && isCorrectAnswer) {
                                // Show correct answer if wrong one was picked
                                buttonClass = "border-green-500 bg-green-50 border-2";
                                iconClass = "border-green-500 bg-green-500 text-white";
                                textClass = "text-green-900 font-medium";
                            }

                            return (
                                <button
                                    key={index}
                                    onClick={() => handleAnswer(index)}
                                    disabled={mode === "quickrevise" && selectedAnswers[currentQuestionIndex] !== undefined}
                                    className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-start gap-4 ${buttonClass}`}
                                >
                                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${iconClass}`}>
                                        {isSelected && mode === "exam" && <div className="w-2 h-2 bg-white rounded-full" />}
                                        {(isSelected || (showFeedback && isCorrectAnswer)) && mode === "quickrevise" && (
                                            isCorrectAnswer ? "✓" : "✗"
                                        )}
                                    </div>
                                    <span className={`text-base ${textClass}`}>
                                        {option}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </main>

            {/* Navigation Footer */}
            <footer className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 z-50 md:relative md:bg-transparent md:border-0 md:p-0 md:mb-8">
                <div className="container mx-auto max-w-3xl flex items-center justify-between gap-4">
                    <button
                        onClick={handlePrev}
                        disabled={currentQuestionIndex === 0}
                        className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors ${currentQuestionIndex === 0
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        <ChevronLeft className="w-5 h-5" />
                        {t(user?.medium, "previous")}
                    </button>

                    {currentQuestionIndex === questions.length - 1 ? (
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className={`px-8 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 shadow-lg shadow-emerald-500/30 transition-all flex items-center gap-2 ${submitting ? "opacity-70 cursor-wait" : ""
                                }`}
                        >
                            {submitting ? t(user?.medium, "submitting") : t(user?.medium, "submit_test")}
                            <CheckCircle className="w-5 h-5" />
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            className="px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 shadow-lg shadow-slate-900/20 transition-all flex items-center gap-2"
                        >
                            {t(user?.medium, "next")}
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </footer>
        </div>
    );
}
