'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getQuestions, getChapter } from '@/lib/database';
import type { Chapter, Question } from '@/lib/database';
import { useAuth } from '@/context/AuthContext';
import { t } from '@/lib/translations';

type Mode = 'exam' | 'quick';

export default function ChapterDetailPage() {
    const { user } = useAuth();
    const params = useParams();
    const chapterId = params.id as string;
    const [chapter, setChapter] = useState<Chapter | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [selectedMode, setSelectedMode] = useState<Mode>('quick');
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
                console.error('Error fetching chapter:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [chapterId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    if (!chapter) {
        return (
            <div className="min-h-screen bg-gray-50">
                <header className="bg-white shadow-sm">
                    <div className="max-w-4xl mx-auto px-4 h-16 flex items-center">
                        <Link href="/student" className="text-gray-500 hover:text-gray-700">
                            ← {t(user?.medium, "back")}
                        </Link>
                    </div>
                </header>
                <div className="max-w-4xl mx-auto px-4 py-12 text-center">
                    <p className="text-gray-500 text-lg">{t(user?.medium, "chapter_not_found")}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Simple back button */}
            <div className="p-4 max-w-4xl mx-auto">
                <Link href="/student" className="text-gray-500 hover:text-gray-700">
                    ← {t(user?.medium, "back")}
                </Link>
            </div>

            <main className="max-w-4xl mx-auto px-4 py-8">
                {/* Chapter Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{chapter.name}</h1>
                    <p className="text-gray-500">{questions.length} {t(user?.medium, "questions_count")}</p>
                </div>

                {/* Mode Selection */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">{t(user?.medium, "choose_mode")}</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Exam Mode */}
                        <button
                            onClick={() => setSelectedMode('exam')}
                            className={`p-6 rounded-2xl text-left transition-all ${selectedMode === 'exam'
                                ? 'bg-emerald-500 text-white shadow-lg'
                                : 'bg-white text-gray-800 shadow-sm hover:shadow-md'
                                }`}
                        >
                            <div className="text-2xl mb-2">⏱️</div>
                            <h3 className="text-xl font-semibold mb-2">{t(user?.medium, "exam_mode")}</h3>
                            <p className={selectedMode === 'exam' ? 'text-emerald-100' : 'text-gray-500'}>
                                {t(user?.medium, "exam_mode_desc_short")}
                            </p>
                        </button>

                        {/* Quick Revise Mode */}
                        <button
                            onClick={() => setSelectedMode('quick')}
                            className={`p-6 rounded-2xl text-left transition-all ${selectedMode === 'quick'
                                ? 'bg-emerald-500 text-white shadow-lg'
                                : 'bg-white text-gray-800 shadow-sm hover:shadow-md'
                                }`}
                        >
                            <div className="text-2xl mb-2">⚡</div>
                            <h3 className="text-xl font-semibold mb-2">{t(user?.medium, "quick_revise")}</h3>
                            <p className={selectedMode === 'quick' ? 'text-emerald-100' : 'text-gray-500'}>
                                {t(user?.medium, "quick_revise_desc_short")}
                            </p>
                        </button>
                    </div>
                </div>

                {/* Start Button */}
                <div className="text-center">
                    <Link href={`/student/chapters/${chapterId}/test?mode=${selectedMode}`}>
                        <button className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white text-xl font-semibold rounded-2xl shadow-lg">
                            {selectedMode === 'exam' ? t(user?.medium, "start_exam") : t(user?.medium, "start_practice")}
                        </button>
                    </Link>
                </div>
            </main>
        </div>
    );
}
