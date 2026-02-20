"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getAllStudents, getResults, ExamResult } from "@/lib/database";
import { ArrowLeft, Search, User, TrendingUp, Clock, Activity, CalendarDays } from "lucide-react";

interface Student {
    $id: string;
    name: string;
    email: string;
    medium?: string;
}

interface StudentWithStats extends Student {
    attempts: number;
    avgScore: number;
    bestScore: number;
    lastAttempt: string | null;
}

function calculatePercentage(score: number, total: number): number {
    if (!total || total <= 0) return 0;
    return Math.round((score / total) * 100);
}

function formatShortDate(dateStr: string | null) {
    if (!dateStr) return "Never";
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return "Unknown";
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function StudentsPage() {
    const [students, setStudents] = useState<StudentWithStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        async function loadData() {
            try {
                const [studentsData, resultsData] = await Promise.all([
                    getAllStudents(),
                    getResults()
                ]);

                // Calculate stats for each student
                const studentsWithStats = (studentsData as unknown as Student[]).map(student => {
                    const studentResults = resultsData.filter(r => r.studentId === student.$id)
                        .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());

                    let totalScore = 0;
                    let totalQuestions = 0;
                    let bestScore = 0;

                    studentResults.forEach(r => {
                        const s = r.score || 0;
                        const t = r.totalQuestions || 0;
                        totalScore += s;
                        totalQuestions += t;
                        const p = calculatePercentage(s, t);
                        if (p > bestScore) bestScore = p;
                    });

                    const avgScore = totalQuestions > 0 ? calculatePercentage(totalScore, totalQuestions) : 0;

                    return {
                        ...student,
                        attempts: studentResults.length,
                        avgScore,
                        bestScore,
                        lastAttempt: studentResults.length > 0 ? studentResults[0].completedAt : null
                    };
                });

                setStudents(studentsWithStats.sort((a, b) => b.attempts - a.attempts || (a.name || "").localeCompare(b.name || "")));
            } catch (error) {
                console.error("Error loading students:", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const filteredStudents = students.filter(
        (s) =>
            s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
                    <p className="text-sm font-medium text-slate-500 animate-pulse">Loading student directory...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-12 font-sans animate-in fade-in duration-500">
            {/* Header Banner */}
            <section className="relative overflow-hidden rounded-[2rem] border border-slate-100 bg-white p-6 sm:p-10 shadow-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-sky-50 opacity-50" />
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
                            Student Directory
                        </h1>
                        <p className="max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
                            View and search through all {students.length} registered students across the platform.
                        </p>
                    </div>
                </div>
            </section>

            {/* Global Search Tool */}
            <section className="rounded-3xl border border-slate-200 bg-white p-2 shadow-sm transition-all focus-within:border-indigo-300 focus-within:ring-4 focus-within:ring-indigo-50">
                <div className="relative flex items-center">
                    <Search className="absolute left-4 h-5 w-5 text-slate-400" />
                    <input
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        placeholder="Search students by name or email address..."
                        className="w-full bg-transparent py-4 pl-12 pr-4 text-sm font-medium text-slate-900 placeholder-slate-400 outline-none"
                    />
                </div>
            </section>

            {searchQuery && (
                <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-widest">
                    Found {filteredStudents.length} matching student(s)
                </p>
            )}

            {/* Students List */}
            <div className="space-y-3">
                {filteredStudents.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
                        <User className="h-12 w-12 text-slate-300" />
                        <h3 className="mt-4 text-lg font-semibold text-slate-900">No Students Found</h3>
                        <p className="mt-2 text-sm text-slate-500 max-w-sm">
                            {searchQuery ? "No students match your search criteria. Try a different name or email." : "No students are currently registered on the platform."}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredStudents.map((student) => (
                            <article key={student.$id} className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md">
                                <div className="flex items-start gap-4 mb-5">
                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-sky-100 text-xl font-black text-indigo-700 shadow-inner group-hover:scale-105 transition-transform duration-300">
                                        {student.name?.charAt(0).toUpperCase() || '?'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="truncate text-lg font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                                            {student.name || "Unnamed"}
                                        </h3>
                                        <p className="truncate text-sm font-medium text-slate-500">{student.email}</p>
                                        <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                                            <CalendarDays className="h-3.5 w-3.5" />
                                            {formatShortDate(student.lastAttempt)}
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 mt-auto">
                                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 text-center transition-colors group-hover:bg-indigo-50/50">
                                        <div className="flex items-center justify-center gap-1 text-slate-500 mb-1">
                                            <Activity className="h-3.5 w-3.5" />
                                            <span className="text-xs font-bold uppercase tracking-wider">Attempts</span>
                                        </div>
                                        <span className="text-xl font-black text-slate-800">{student.attempts}</span>
                                    </div>
                                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 text-center transition-colors group-hover:bg-indigo-50/50">
                                        <div className="flex items-center justify-center gap-1 text-slate-500 mb-1">
                                            <TrendingUp className="h-3.5 w-3.5" />
                                            <span className="text-xs font-bold uppercase tracking-wider">Avg</span>
                                        </div>
                                        <span className={`text-xl font-black ${student.avgScore >= 75 ? 'text-emerald-600' : student.avgScore >= 40 ? 'text-amber-600' : 'text-slate-800'}`}>
                                            {student.attempts > 0 ? `${student.avgScore}%` : '-'}
                                        </span>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
