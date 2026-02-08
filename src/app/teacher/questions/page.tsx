"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getChapters, getQuestions, Chapter, Question } from "@/lib/database";
import { ArrowLeft, Plus, Search, FileQuestion } from "lucide-react";

export default function QuestionsPage() {
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedChapter, setSelectedChapter] = useState<string | null>(null);

    useEffect(() => {
        async function loadData() {
            try {
                const [chaptersData, questionsData] = await Promise.all([
                    getChapters(),
                    getQuestions()
                ]);
                setChapters(chaptersData);
                setQuestions(questionsData);
            } catch (error) {
                console.error("Error loading questions:", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    // Filter questions based on search and chapter
    const filteredQuestions = questions.filter((q) => {
        const matchesSearch = q.questionText.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesChapter = !selectedChapter || q.chapterId === selectedChapter;
        return matchesSearch && matchesChapter;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <Link
                        href="/teacher"
                        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to dashboard
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800">Question Bank</h1>
                    <p className="text-gray-500 mt-1">{questions.length} total questions</p>
                </div>
                <Link href="/teacher/questions/new">
                    <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl flex items-center gap-2 transition-colors">
                        <Plus className="w-4 h-4" />
                        Add Question
                    </button>
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search questions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                    />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
                    <button
                        onClick={() => setSelectedChapter(null)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${!selectedChapter
                                ? "bg-emerald-500 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                    >
                        All
                    </button>
                    {chapters.map((chapter) => (
                        <button
                            key={chapter.$id}
                            onClick={() => setSelectedChapter(chapter.$id)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${selectedChapter === chapter.$id
                                    ? "bg-emerald-500 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            {chapter.icon} {chapter.name.replace('Unit ', '').split(':')[0]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Questions List */}
            {filteredQuestions.length > 0 ? (
                <div className="space-y-3">
                    {filteredQuestions.map((question) => {
                        const chapter = chapters.find((c) => c.$id === question.chapterId);
                        return (
                            <div key={question.$id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="px-3 py-1 rounded-lg text-xs font-medium bg-emerald-100 text-emerald-700">
                                                {chapter?.name || 'Unknown Chapter'}
                                            </span>
                                        </div>
                                        <p className="text-gray-800 font-medium mb-4">
                                            {question.questionText}
                                        </p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {question.options.map((option, optIdx) => (
                                                <div
                                                    key={optIdx}
                                                    className={`text-sm px-3 py-2 rounded-lg ${optIdx === question.correctAnswer
                                                            ? "bg-green-100 text-green-700 font-medium"
                                                            : "bg-gray-100 text-gray-600"
                                                        }`}
                                                >
                                                    {String.fromCharCode(65 + optIdx)}. {option}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
                    <FileQuestion className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">
                        {searchQuery || selectedChapter ? "No questions found matching your filters" : "No questions added yet"}
                    </p>
                </div>
            )}
        </div>
    );
}
