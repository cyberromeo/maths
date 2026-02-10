"use client";

import React, { useEffect, useState } from "react";
import { getChapters, Chapter } from "@/lib/database";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Save, CheckSquare, Square, Play } from "lucide-react";
import { t } from "@/lib/translations";

export default function CustomTestPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
    const [mode, setMode] = useState<"exam" | "quickrevise">("exam");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
            return;
        }

        async function loadChapters() {
            if (user?.medium) {
                const data = await getChapters(user.medium);
                setChapters(data);
                setLoading(false);
            }
        }
        loadChapters();
    }, [user, authLoading, router]);

    const toggleChapter = (id: string) => {
        setSelectedChapters(prev =>
            prev.includes(id)
                ? prev.filter(c => c !== id)
                : [...prev, id]
        );
    };

    const toggleAll = () => {
        if (selectedChapters.length === chapters.length) {
            setSelectedChapters([]);
        } else {
            setSelectedChapters(chapters.map(c => c.$id));
        }
    };

    const handleStartTest = () => {
        if (selectedChapters.length === 0) return;

        localStorage.setItem("customTestChapters", JSON.stringify(selectedChapters));
        localStorage.setItem("customTestMode", mode);
        router.push("/student/custom-test/run");
    };

    if (loading || authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-24 md:pb-8">
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-gray-800">{t(user?.medium, "create_custom_test")}</h1>
                </div>
            </header>

            <main className="container mx-auto px-4 py-6 max-w-2xl">
                <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-800">{t(user?.medium, "select_chapters")}</h2>
                        <button
                            onClick={toggleAll}
                            className="text-emerald-600 font-medium text-sm hover:text-emerald-700"
                        >
                            {selectedChapters.length === chapters.length ? t(user?.medium, "deselect_all") : t(user?.medium, "select_all")}
                        </button>
                    </div>

                    <div className="space-y-3">
                        {chapters.map((chapter) => {
                            const isSelected = selectedChapters.includes(chapter.$id);
                            return (
                                <div
                                    key={chapter.$id}
                                    onClick={() => toggleChapter(chapter.$id)}
                                    className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${isSelected
                                        ? "border-emerald-500 bg-emerald-50"
                                        : "border-gray-100 hover:border-emerald-200"
                                        }`}
                                >
                                    <div className={`w-6 h-6 rounded-md border flex items-center justify-center mr-4 transition-colors ${isSelected
                                        ? "bg-emerald-500 border-emerald-500 text-white"
                                        : "border-gray-300 bg-white"
                                        }`}>
                                        {isSelected && <CheckSquare className="w-4 h-4" />}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-800">{chapter.name}</h3>
                                        <p className="text-sm text-gray-500">{chapter.questionCount} {t(user?.medium, "questions_count")}</p>
                                    </div>
                                    <div className="text-2xl">{chapter.icon}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Mode Selection */}
                <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">{t(user?.medium, "select_mode")}</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => setMode("exam")}
                            className={`p-4 rounded-xl border-2 text-left transition-all ${mode === "exam"
                                ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200"
                                : "border-gray-100 hover:border-emerald-200"
                                }`}
                        >
                            <div className="font-bold text-gray-800 mb-1">📝 {t(user?.medium, "exam_mode")}</div>
                            <p className="text-xs text-gray-500">{t(user?.medium, "exam_mode_desc")}</p>
                        </button>

                        <button
                            onClick={() => setMode("quickrevise")}
                            className={`p-4 rounded-xl border-2 text-left transition-all ${mode === "quickrevise"
                                ? "border-amber-500 bg-amber-50 ring-2 ring-amber-200"
                                : "border-gray-100 hover:border-amber-200"
                                }`}
                        >
                            <div className="font-bold text-gray-800 mb-1">⚡ {t(user?.medium, "quick_revise")}</div>
                            <p className="text-xs text-gray-500">{t(user?.medium, "quick_revise_desc")}</p>
                        </button>
                    </div>
                </div>

                <div className="fixed bottom-[68px] left-0 right-0 p-4 bg-white/95 backdrop-blur-sm border-t border-gray-200 z-30 md:relative md:bottom-auto md:bg-transparent md:border-0 md:p-0 md:z-auto">
                    <div className="max-w-2xl mx-auto">
                        <button
                            onClick={handleStartTest}
                            disabled={selectedChapters.length === 0}
                            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${selectedChapters.length > 0
                                ? "bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/20"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                }`}
                        >
                            <Play className="w-5 h-5 fill-current" />
                            {t(user?.medium, "start_test")} ({selectedChapters.length})
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
