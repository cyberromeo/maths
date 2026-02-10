'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getChapters } from '@/lib/database';

import type { Chapter } from '@/lib/database';
import { useAuth } from '@/context/AuthContext';
import { t } from '@/lib/translations';

export default function ChaptersPage() {
    const { user } = useAuth();
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchChapters() {
            if (!user) return;
            try {
                const data = await getChapters(user.medium);
                setChapters(data);
            } catch (error) {
                console.error('Error fetching chapters:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchChapters();
    }, [user]);

    const colors = [
        'bg-pink-500',
        'bg-violet-500',
        'bg-blue-500',
        'bg-emerald-500',
        'bg-amber-500',
        'bg-red-500',
        'bg-indigo-500',
        'bg-teal-500',
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Simple back button */}
            <div className="p-4 max-w-4xl mx-auto">
                <Link href="/student" className="text-gray-500 hover:text-gray-700">
                    ← {t(user?.medium, "back")}
                </Link>
            </div>

            <main className="max-w-4xl mx-auto px-4 py-8">
                {/* Page Title */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{t(user?.medium, "nav_practice")}</h1>
                    <p className="text-gray-500">{t(user?.medium, "choose_chapter")}</p>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm animate-pulse">
                                <div className="h-6 w-48 bg-gray-200 rounded" />
                            </div>
                        ))}
                    </div>
                ) : chapters.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 shadow-sm text-center">
                        <p className="text-gray-500 text-lg">{t(user?.medium, "no_chapters")}</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {chapters.map((chapter, index) => (
                            <Link key={chapter.$id} href={`/student/chapters/${chapter.$id}`}>
                                <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 cursor-pointer">
                                    <div className={`w-14 h-14 ${colors[index % colors.length]} rounded-xl flex items-center justify-center`}>
                                        <span className="text-white text-2xl font-bold">
                                            {chapter.icon || index + 1}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-gray-800">
                                            {chapter.name}
                                        </h3>
                                        <p className="text-gray-500">
                                            {chapter.questionCount} {t(user?.medium, "questions_count")}
                                        </p>
                                    </div>
                                    <div className="text-emerald-500 text-2xl">→</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
