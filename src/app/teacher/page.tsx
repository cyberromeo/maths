"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getChapters, getQuestions, getResults, getAllStudents, Chapter, Question, ExamResult } from "@/lib/database";
import {
    Users,
    FileQuestion,
    BookOpen,
    TrendingUp,
    ChevronRight,
    Award,
    Clock
} from "lucide-react";

interface User {
    $id: string;
    name: string;
    email: string;
    medium?: "english" | "tamil";
}

export default function TeacherDashboard() {
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [results, setResults] = useState<ExamResult[]>([]);
    const [students, setStudents] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const [chaptersData, questionsData, resultsData, studentsData] = await Promise.all([
                    getChapters(),
                    getQuestions(),
                    getResults(),
                    getAllStudents()
                ]);
                setChapters(chaptersData);
                setQuestions(questionsData);
                setResults(resultsData);
                setStudents(studentsData as unknown as User[]);
            } catch (error) {
                console.error("Error loading dashboard data:", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    // Calculate stats
    const stats = {
        totalStudents: students.length,
        totalQuestions: questions.length,
        totalChapters: chapters.length,
        totalAttempts: results.length,
    };

    // Get recent results (last 5)
    const recentResults = results.slice(0, 5);

    // Calculate average score
    const avgScore = results.length > 0
        ? Math.round(results.reduce((sum, r) => sum + (r.score / r.totalQuestions) * 100, 0) / results.length)
        : 0;

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white">
                <h1 className="text-2xl font-bold mb-2">
                    Teacher Dashboard 👨‍🏫
                </h1>
                <p className="text-emerald-100">
                    Manage chapters, questions, and track student performance
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                            <Users className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-gray-800">{stats.totalStudents}</p>
                            <p className="text-sm text-gray-500">Students</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center">
                            <FileQuestion className="w-6 h-6 text-pink-600" />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-gray-800">{stats.totalQuestions}</p>
                            <p className="text-sm text-gray-500">Questions</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-gray-800">{stats.totalChapters}</p>
                            <p className="text-sm text-gray-500">Chapters</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-gray-800">{avgScore}%</p>
                            <p className="text-sm text-gray-500">Avg Score</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chapters Overview */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Chapters</h2>
                    <Link href="/teacher/questions" className="text-sm text-emerald-600 font-medium hover:text-emerald-700">
                        Manage Questions →
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {chapters.map((chapter) => (
                        <div key={chapter.$id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl">{chapter.icon}</span>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">{chapter.name}</h3>
                                        <p className="text-sm text-gray-500">{chapter.description}</p>
                                    </div>
                                </div>
                                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                                    {chapter.questionCount} Q
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
                    <span className="text-sm text-gray-500">{results.length} total attempts</span>
                </div>

                {recentResults.length === 0 ? (
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
                        <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No student attempts yet</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {recentResults.map((result) => {
                            const percentage = Math.round((result.score / result.totalQuestions) * 100);
                            return (
                                <div key={result.$id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${percentage >= 70 ? 'bg-green-100' : percentage >= 40 ? 'bg-yellow-100' : 'bg-red-100'
                                                }`}>
                                                <Award className={`w-6 h-6 ${percentage >= 70 ? 'text-green-600' : percentage >= 40 ? 'text-yellow-600' : 'text-red-600'
                                                    }`} />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-800">{result.studentName}</h3>
                                                <p className="text-sm text-gray-500">
                                                    {result.examName} • {result.mode === 'exam' ? 'Exam Mode' : 'Quick Revise'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-xl font-bold ${percentage >= 70 ? 'text-green-600' : percentage >= 40 ? 'text-yellow-600' : 'text-red-600'
                                                }`}>
                                                {percentage}%
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {result.score}/{result.totalQuestions}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Students List */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Students</h2>
                    <Link href="/teacher/students" className="text-sm text-emerald-600 font-medium hover:text-emerald-700">
                        View All →
                    </Link>
                </div>

                {students.length === 0 ? (
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
                        <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No students signed up yet</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100">
                        {students.slice(0, 5).map((student) => (
                            <div key={student.$id} className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                        <span className="text-emerald-600 font-semibold">
                                            {student.name?.charAt(0).toUpperCase() || '?'}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">{student.name}</p>
                                        <p className="text-sm text-gray-500">
                                            {student.email} • <span className="capitalize">{student.medium || "english"}</span>
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
