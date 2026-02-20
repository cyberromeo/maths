"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getChapters, getQuestions, Chapter, Question } from "@/lib/database";
import { ArrowLeft, Plus, Search, FileQuestion, BookOpen, Layers } from "lucide-react";

export default function QuestionsPage() {
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
    const [selectedMedium, setSelectedMedium] = useState<"english" | "tamil" | null>(null);

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            try {
                const [chaptersData, questionsData] = await Promise.all([
                    getChapters(selectedMedium || undefined),
                    getQuestions()
                ]);
                setChapters(chaptersData || []);
                setQuestions(questionsData || []);
                // Reset selected chapter if it's no longer in the list (due to medium change)
                if (selectedChapter && chaptersData && !chaptersData.find(c => c.$id === selectedChapter)) {
                    setSelectedChapter(null);
                }
            } catch (error) {
                console.error("Error loading questions:", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [selectedMedium]);

    const filteredQuestions = questions.filter((q) => {
        const matchesSearch = q.questionText.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesChapter = !selectedChapter || q.chapterId === selectedChapter;
        const matchesMedium = !selectedMedium || chapters.some(c => c.$id === q.chapterId && c.medium === selectedMedium);

        return matchesSearch && matchesChapter && matchesMedium;
    });

    return (
        <div className="space-y-6 pb-12 font-sans animate-in fade-in duration-500">
            {/* Header Banner */}
            <section className="relative overflow-hidden rounded-[2rem] border border-slate-100 bg-white p-6 sm:p-10 shadow-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-emerald-50 opacity-50" />
                <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-2.5">
                        <Link
                            href="/teacher"
                            className="mb-2 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-indigo-600 transition hover:text-indigo-800"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Return to Dashboard
                        </Link>
                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                            Question Bank
                        </h1>
                        <p className="max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
                            Browse, search, and manage all your platform questions across different mediums and chapters.
                        </p>
                    </div>
                    <div>
                        <Link href="/teacher/questions/new" className="inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-2xl bg-indigo-600 px-6 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                            <Plus className="h-5 w-5" />
                            Add Question
                        </Link>
                    </div>
                </div>
            </section>

            {/* Controls & Filters */}
            <section className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search questions by exact text or keyword..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-4 text-sm font-medium text-slate-900 shadow-sm outline-none transition-all focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                        />
                    </div>
                    {/* Medium Filter Toggle */}
                    <div className="flex shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-1 shadow-sm h-14">
                        <button
                            onClick={() => setSelectedMedium(null)}
                            className={`flex flex-1 items-center justify-center h-full px-5 rounded-xl text-sm font-bold transition-all ${!selectedMedium ? "bg-white text-indigo-700 shadow shadow-slate-200/50" : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"}`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setSelectedMedium("english")}
                            className={`flex flex-1 items-center justify-center h-full px-5 rounded-xl text-sm font-bold transition-all ${selectedMedium === "english" ? "bg-white text-indigo-700 shadow shadow-slate-200/50" : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"}`}
                        >
                            English
                        </button>
                        <button
                            onClick={() => setSelectedMedium("tamil")}
                            className={`flex flex-1 items-center justify-center h-full px-5 rounded-xl text-sm font-bold transition-all ${selectedMedium === "tamil" ? "bg-white text-indigo-700 shadow shadow-slate-200/50" : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"}`}
                        >
                            Tamil
                        </button>
                    </div>
                </div>

                {/* Chapter Pills */}
                <div className="overflow-x-auto pb-2 -mx-2 px-2 sm:mx-0 sm:px-0 scrollbar-hide">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setSelectedChapter(null)}
                            className={`shrink-0 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${!selectedChapter
                                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                                }`}
                        >
                            <Layers className="h-4 w-4" /> All Chapters
                        </button>
                        {chapters.map((chapter) => (
                            <button
                                key={chapter.$id}
                                onClick={() => setSelectedChapter(chapter.$id)}
                                className={`shrink-0 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${selectedChapter === chapter.$id
                                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                                    }`}
                            >
                                <span className="text-base leading-none">{chapter.icon}</span>
                                {chapter.name.replace('Unit ', '').split(':')[0]}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600 mb-4" />
                    <p className="text-sm font-medium text-slate-500 animate-pulse">Loading question database...</p>
                </div>
            ) : filteredQuestions.length > 0 ? (
                <div className="space-y-4">
                    <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-widest">
                        Showing {filteredQuestions.length} matching question(s)
                    </p>
                    {filteredQuestions.map((question, idx) => {
                        const chapter = chapters.find((c) => c.$id === question.chapterId);
                        return (
                            <article key={question.$id} className="group overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md">
                                <div className="mb-4 flex flex-wrap items-center gap-2">
                                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700">
                                        <BookOpen className="h-3.5 w-3.5" />
                                        {chapter?.name || 'Unknown Chapter'}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
                                        Q{idx + 1}
                                    </span>
                                </div>

                                <h3 className="mb-6 text-lg font-bold text-slate-900 sm:text-xl leading-snug">
                                    {question.questionText}
                                </h3>

                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    {question.options.map((option, optIdx) => {
                                        const isCorrect = optIdx === question.correctAnswer;
                                        return (
                                            <div
                                                key={optIdx}
                                                className={`relative flex items-center rounded-2xl border p-4 transition-colors ${isCorrect
                                                        ? "border-emerald-200 bg-emerald-50 shadow-sm"
                                                        : "border-slate-100 bg-slate-50 group-hover:bg-slate-100"
                                                    }`}
                                            >
                                                <div className={`mr-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-black ${isCorrect ? "bg-emerald-200 text-emerald-800" : "bg-white text-slate-500 shadow-sm"
                                                    }`}>
                                                    {String.fromCharCode(65 + optIdx)}
                                                </div>
                                                <span className={`text-sm font-medium ${isCorrect ? "text-emerald-900" : "text-slate-700"}`}>
                                                    {option}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </article>
                        );
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-slate-300 bg-white p-16 text-center shadow-sm">
                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-50">
                        <FileQuestion className="h-10 w-10 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">No Questions Found</h3>
                    <p className="mt-2 max-w-sm text-sm text-slate-500">
                        {searchQuery || selectedChapter || selectedMedium
                            ? "Try adjusting your filters or search terms to find what you're looking for."
                            : "Your question bank is currently empty. Start by adding a new question."}
                    </p>
                    {!(searchQuery || selectedChapter || selectedMedium) && (
                        <Link href="/teacher/questions/new" className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-700">
                            <Plus className="h-5 w-5" /> Add First Question
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}
