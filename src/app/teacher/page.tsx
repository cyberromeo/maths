"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import {
    Chapter,
    ExamResult,
    Question,
    getAllStudents,
    getChapters,
    getQuestions,
    getResults,
} from "@/lib/database";
import {
    BadgeCheck,
    CalendarDays,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Clock3,
    FileQuestion,
    Languages,
    Loader2,
    Search,
    TrendingUp,
    Users,
    Activity,
    ListChecks
} from "lucide-react";

interface User {
    $id: string;
    name: string;
    email: string;
    medium?: "english" | "tamil" | string;
}

type MediumKey = "english" | "tamil";

function normalizeMedium(medium?: string): MediumKey {
    return medium?.toLowerCase() === "tamil" ? "tamil" : "english";
}

function calculatePercentage(score: number, total: number): number {
    if (!total || total <= 0) return 0;
    return Math.round((score / total) * 100);
}

function formatDateTime(dateValue: string | null): string {
    if (!dateValue) return "N/A";
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return "N/A";
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    })}`;
}

function formatDuration(seconds: number): string {
    if (!seconds || seconds <= 0) return "--";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
}

function getScoreTone(percentage: number): string {
    if (percentage >= 75) return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (percentage >= 40) return "bg-amber-100 text-amber-700 border-amber-200";
    return "bg-rose-100 text-rose-700 border-rose-200";
}

function getBarColor(percentage: number): string {
    if (percentage >= 75) return "bg-emerald-500";
    if (percentage >= 40) return "bg-amber-500";
    return "bg-rose-500";
}

export default function TeacherDashboard() {
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [students, setStudents] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    // Per-student lazy-loaded results
    const [studentResults, setStudentResults] = useState<Record<string, ExamResult[]>>({});
    const [loadingResults, setLoadingResults] = useState<Record<string, boolean>>({});
    const [expandedStudent, setExpandedStudent] = useState<string | null>(null);

    // Recent tests feed
    const [recentResults, setRecentResults] = useState<ExamResult[]>([]);
    const [recentLoading, setRecentLoading] = useState(false);
    const [recentLoaded, setRecentLoaded] = useState(false);
    const [recentPage, setRecentPage] = useState(0);
    const RECENT_PAGE_SIZE = 10;

    // Active tab: "students" or "recent"
    const [activeTab, setActiveTab] = useState<"students" | "recent">("students");

    useEffect(() => {
        async function loadData() {
            try {
                const [chaptersData, questionsData, studentsData] = await Promise.all([
                    getChapters(),
                    getQuestions(),
                    getAllStudents(),
                ]);
                setChapters(chaptersData || []);
                setQuestions(questionsData || []);
                setStudents((studentsData as unknown as User[]) || []);
            } catch (error) {
                console.error("Error loading dashboard data:", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const loadRecentResults = useCallback(async () => {
        if (recentLoaded) return;
        setRecentLoading(true);
        try {
            const allResults = await getResults();
            // Sort by completedAt descending
            allResults.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
            setRecentResults(allResults);
            setRecentLoaded(true);
        } catch (error) {
            console.error("Error loading recent results:", error);
        } finally {
            setRecentLoading(false);
        }
    }, [recentLoaded]);

    const handleStudentClick = useCallback(async (studentId: string) => {
        // Toggle expand/collapse
        if (expandedStudent === studentId) {
            setExpandedStudent(null);
            return;
        }

        setExpandedStudent(studentId);

        // If already fetched, don't re-fetch
        if (studentResults[studentId]) return;

        setLoadingResults((prev) => ({ ...prev, [studentId]: true }));
        try {
            const results = await getResults(studentId);
            setStudentResults((prev) => ({ ...prev, [studentId]: results }));
        } catch (error) {
            console.error("Error fetching results for student:", studentId, error);
            setStudentResults((prev) => ({ ...prev, [studentId]: [] }));
        } finally {
            setLoadingResults((prev) => ({ ...prev, [studentId]: false }));
        }
    }, [expandedStudent, studentResults]);

    const filteredStudents = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return students;
        return students.filter((s) => {
            const name = s.name?.toLowerCase() || "";
            const email = s.email?.toLowerCase() || "";
            return name.includes(query) || email.includes(query);
        });
    }, [students, searchQuery]);

    const groupedStudents = useMemo(() => {
        const grouped: Record<MediumKey, User[]> = { english: [], tamil: [] };
        filteredStudents.forEach((s) => {
            grouped[normalizeMedium(s.medium)].push(s);
        });
        return grouped;
    }, [filteredStudents]);

    const mediumTotals = useMemo(() => {
        const totals: Record<MediumKey, number> = { english: 0, tamil: 0 };
        students.forEach((s) => { totals[normalizeMedium(s.medium)] += 1; });
        return totals;
    }, [students]);

    const mediumSections: Array<{
        key: MediumKey;
        title: string;
        accent: string;
        badgeAccent: string;
    }> = [
            {
                key: "english",
                title: "English Medium",
                accent: "border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-white",
                badgeAccent: "bg-indigo-100 text-indigo-700 border-indigo-200",
            },
            {
                key: "tamil",
                title: "Tamil Medium",
                accent: "border-fuchsia-100 bg-gradient-to-br from-fuchsia-50/50 to-white",
                badgeAccent: "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200",
            },
        ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
                    <p className="text-sm font-medium text-slate-500 animate-pulse">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-12 font-sans">
            {/* Header */}
            <section className="relative overflow-hidden rounded-[2rem] border border-slate-100 bg-white p-6 sm:p-10 shadow-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-sky-50 opacity-50" />
                <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-2.5">
                        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/60 px-3 py-1 text-xs font-bold uppercase tracking-widest text-indigo-600 backdrop-blur-md">
                            <Activity className="h-3.5 w-3.5" /> Teacher Panel
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                            Student Reports
                        </h1>
                        <p className="max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
                            Click on any student to load their detailed exam results.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm font-semibold">
                        <Link href="/teacher/questions" className="flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-slate-700 shadow-sm ring-1 ring-slate-200 transition-all hover:-translate-y-0.5 hover:ring-indigo-300 hover:text-indigo-600">
                            <FileQuestion className="h-4 w-4" /> Questions
                        </Link>
                        <Link href="/teacher/exams" className="flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-slate-700 shadow-sm ring-1 ring-slate-200 transition-all hover:-translate-y-0.5 hover:ring-indigo-300 hover:text-indigo-600">
                            <CalendarDays className="h-4 w-4" /> Exams
                        </Link>
                        <Link href="/teacher/students" className="flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-slate-700 shadow-sm ring-1 ring-slate-200 transition-all hover:-translate-y-0.5 hover:ring-indigo-300 hover:text-indigo-600">
                            <Users className="h-4 w-4" /> Directory
                        </Link>
                    </div>
                </div>
            </section>

            {/* Quick Stats */}
            <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {[
                    { label: "Total Students", value: students.length, icon: Users, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100", sub: `En: ${mediumTotals.english} · Ta: ${mediumTotals.tamil}` },
                    { label: "Question Bank", value: questions.length, icon: FileQuestion, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100", sub: `${chapters.length} chapters` },
                    { label: "English Students", value: mediumTotals.english, icon: BadgeCheck, color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100", sub: "Registered users" },
                    { label: "Tamil Students", value: mediumTotals.tamil, icon: Languages, color: "text-fuchsia-600", bg: "bg-fuchsia-50", border: "border-fuchsia-100", sub: "Registered users" },
                ].map((stat, i) => (
                    <div key={i} className={`group flex flex-col justify-between rounded-3xl border ${stat.border} bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md`}>
                        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.bg} transition-transform group-hover:scale-110`}>
                            <stat.icon className={`h-6 w-6 ${stat.color}`} />
                        </div>
                        <div className="mt-4">
                            <h3 className="text-2xl font-black text-slate-900">{stat.value}</h3>
                            <p className="mt-1 font-medium text-slate-500 text-sm">{stat.label}</p>
                            <p className="mt-2 text-xs text-slate-400">{stat.sub}</p>
                        </div>
                    </div>
                ))}
            </section>

            {/* Tab Toggle: Students vs Recent Tests */}
            <section className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1.5 shadow-sm">
                <button
                    onClick={() => setActiveTab("students")}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition-all ${activeTab === "students"
                            ? "bg-white text-indigo-700 shadow-sm"
                            : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                        }`}
                >
                    <Users className="h-4 w-4" /> Student Reports
                </button>
                <button
                    onClick={() => {
                        setActiveTab("recent");
                        loadRecentResults();
                    }}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition-all ${activeTab === "recent"
                            ? "bg-white text-indigo-700 shadow-sm"
                            : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                        }`}
                >
                    <ListChecks className="h-4 w-4" /> Recent Tests
                </button>
            </section>

            {activeTab === "recent" ? (
                /* ========== RECENT TESTS TAB ========== */
                <section className="rounded-[2rem] border border-slate-100 bg-gradient-to-br from-sky-50/50 to-white p-4 sm:p-8 shadow-sm">
                    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-2xl font-extrabold text-slate-900">Recent Tests</h2>
                            <p className="mt-1 text-sm text-slate-600">Latest exam submissions across all students, newest first.</p>
                        </div>
                        {recentLoaded && (
                            <div className="inline-flex items-center rounded-xl border bg-white px-3 py-2 text-xs font-bold text-slate-600 border-slate-200">
                                {recentResults.length} total result{recentResults.length !== 1 ? "s" : ""}
                            </div>
                        )}
                    </div>

                    {recentLoading ? (
                        <div className="flex items-center justify-center py-12 gap-3">
                            <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
                            <span className="text-sm font-medium text-slate-500">Loading recent tests...</span>
                        </div>
                    ) : recentResults.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white/50 p-10 text-center">
                            <ListChecks className="mb-3 h-10 w-10 text-slate-300" />
                            <p className="text-sm font-semibold text-slate-500">No exam results found.</p>
                        </div>
                    ) : (
                        <div>
                            <div className="space-y-3">
                                {recentResults
                                    .slice(recentPage * RECENT_PAGE_SIZE, (recentPage + 1) * RECENT_PAGE_SIZE)
                                    .map((result) => {
                                        const percentage = calculatePercentage(result.score, result.totalQuestions);
                                        const width = Math.max(0, Math.min(100, percentage));
                                        return (
                                            <div key={result.$id} className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm transition hover:shadow-md">
                                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 text-sm font-black text-slate-700 shadow-inner">
                                                            {(result.studentName?.charAt(0) || "?").toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-slate-900">
                                                                {result.studentName || "Unknown Student"}
                                                            </h4>
                                                            <p className="text-xs font-medium text-slate-500">
                                                                {result.examName || "Untitled Exam"} • {result.mode === "exam" ? "Exam" : "Quick Revise"}
                                                            </p>
                                                            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                                                                <CalendarDays className="h-3 w-3" />
                                                                {formatDateTime(result.completedAt)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="text-right">
                                                            <div className="text-sm font-extrabold text-slate-800">
                                                                {result.score}/{result.totalQuestions}
                                                            </div>
                                                            <div className="text-xs text-slate-400 flex items-center gap-1 justify-end">
                                                                <Clock3 className="h-3 w-3" />
                                                                {formatDuration(result.timeTaken)}
                                                            </div>
                                                        </div>
                                                        <span className={`inline-flex items-center justify-center rounded-xl border px-3 py-1.5 text-sm font-black ${getScoreTone(percentage)}`}>
                                                            {percentage}%
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="mt-3 overflow-hidden rounded-full bg-slate-200">
                                                    <div
                                                        className={`h-2 rounded-full transition-all duration-700 ${getBarColor(percentage)}`}
                                                        style={{ width: `${width}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>

                            {/* Pagination Controls */}
                            {recentResults.length > RECENT_PAGE_SIZE && (
                                <div className="mt-6 flex items-center justify-between">
                                    <button
                                        onClick={() => setRecentPage((p) => Math.max(0, p - 1))}
                                        disabled={recentPage === 0}
                                        className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        <ChevronLeft className="h-4 w-4" /> Previous
                                    </button>
                                    <span className="text-sm font-semibold text-slate-500">
                                        Page {recentPage + 1} of {Math.ceil(recentResults.length / RECENT_PAGE_SIZE)}
                                    </span>
                                    <button
                                        onClick={() => setRecentPage((p) => Math.min(Math.ceil(recentResults.length / RECENT_PAGE_SIZE) - 1, p + 1))}
                                        disabled={(recentPage + 1) * RECENT_PAGE_SIZE >= recentResults.length}
                                        className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        Next <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </section>
            ) : (
                /* ========== STUDENTS TAB ========== */
                <>
                    {/* Search */}
                    <section className="rounded-3xl border border-slate-200 bg-white p-2 shadow-sm transition-all focus-within:border-indigo-300 focus-within:ring-4 focus-within:ring-indigo-50">
                        <div className="relative flex items-center">
                            <Search className="absolute left-4 h-5 w-5 text-slate-400" />
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search students by name or email..."
                                className="w-full bg-transparent py-4 pl-12 pr-4 text-sm font-medium text-slate-900 placeholder-slate-400 outline-none"
                            />
                        </div>
                    </section>

                    {searchQuery && (
                        <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-widest">
                            Found {filteredStudents.length} matching student(s)
                        </p>
                    )}

                    {/* Student Lists by Medium */}
                    {mediumSections.map((section) => {
                        const sectionStudents = groupedStudents[section.key];
                        return (
                            <section key={section.key} className={`rounded-[2rem] border ${section.accent} p-4 sm:p-8 shadow-sm`}>
                                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <h2 className="text-2xl font-extrabold text-slate-900">{section.title}</h2>
                                    <div className={`inline-flex items-center rounded-xl border px-3 py-2 text-xs font-bold ${section.badgeAccent}`}>
                                        {sectionStudents.length} student{sectionStudents.length !== 1 ? "s" : ""}
                                    </div>
                                </div>

                                {sectionStudents.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white/50 p-10 text-center">
                                        <Languages className="mb-3 h-10 w-10 text-slate-300" />
                                        <p className="text-sm font-semibold text-slate-500">No students in this category.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {sectionStudents.map((student, idx) => {
                                            const isExpanded = expandedStudent === student.$id;
                                            const results = studentResults[student.$id];
                                            const isLoading = loadingResults[student.$id];

                                            return (
                                                <div key={student.$id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
                                                    {/* Student Row - Click to expand */}
                                                    <button
                                                        onClick={() => handleStudentClick(student.$id)}
                                                        className="flex w-full items-center gap-4 p-4 sm:p-5 text-left transition-colors hover:bg-slate-50 focus:outline-none"
                                                    >
                                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 text-lg font-black text-slate-700 shadow-inner">
                                                            {(student.name?.charAt(0) || "?").toUpperCase()}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xs font-bold text-slate-400">#{idx + 1}</span>
                                                                <h3 className="truncate text-base font-bold text-slate-900 sm:text-lg">
                                                                    {student.name || "Unnamed"}
                                                                </h3>
                                                            </div>
                                                            <p className="truncate text-sm text-slate-500">{student.email || "No email"}</p>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {isLoading && <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />}
                                                            <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                                                        </div>
                                                    </button>

                                                    {/* Expanded Results */}
                                                    {isExpanded && (
                                                        <div className="border-t border-slate-100 bg-slate-50 p-4 sm:p-6">
                                                            {isLoading ? (
                                                                <div className="flex items-center justify-center py-8 gap-3">
                                                                    <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
                                                                    <span className="text-sm font-medium text-slate-500">Fetching results...</span>
                                                                </div>
                                                            ) : !results || results.length === 0 ? (
                                                                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center">
                                                                    <p className="text-sm font-semibold text-slate-500">No exam results found for this student.</p>
                                                                </div>
                                                            ) : (
                                                                <div>
                                                                    {/* Summary Row */}
                                                                    {(() => {
                                                                        let totalScore = 0;
                                                                        let totalQ = 0;
                                                                        let best = 0;
                                                                        results.forEach((r) => {
                                                                            totalScore += r.score || 0;
                                                                            totalQ += r.totalQuestions || 0;
                                                                            const p = calculatePercentage(r.score, r.totalQuestions);
                                                                            if (p > best) best = p;
                                                                        });
                                                                        const avg = calculatePercentage(totalScore, totalQ);
                                                                        return (
                                                                            <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                                                                                <div className="rounded-2xl bg-white border border-slate-100 p-3 text-center shadow-sm">
                                                                                    <p className="text-xs font-bold text-slate-400 uppercase">Attempts</p>
                                                                                    <p className="text-xl font-black text-slate-900">{results.length}</p>
                                                                                </div>
                                                                                <div className="rounded-2xl bg-white border border-slate-100 p-3 text-center shadow-sm">
                                                                                    <p className="text-xs font-bold text-slate-400 uppercase">Average</p>
                                                                                    <p className="text-xl font-black text-slate-900">{avg}%</p>
                                                                                </div>
                                                                                <div className="rounded-2xl bg-white border border-slate-100 p-3 text-center shadow-sm">
                                                                                    <p className="text-xs font-bold text-slate-400 uppercase">Best</p>
                                                                                    <p className="text-xl font-black text-slate-900">{best}%</p>
                                                                                </div>
                                                                                <div className="rounded-2xl bg-white border border-slate-100 p-3 text-center shadow-sm">
                                                                                    <p className="text-xs font-bold text-slate-400 uppercase">Marks</p>
                                                                                    <p className="text-xl font-black text-slate-900">{totalScore}/{totalQ}</p>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })()}

                                                                    {/* Individual Results */}
                                                                    <div className="space-y-3">
                                                                        {results.map((result) => {
                                                                            const percentage = calculatePercentage(result.score, result.totalQuestions);
                                                                            const width = Math.max(0, Math.min(100, percentage));
                                                                            return (
                                                                                <div key={result.$id} className="rounded-2xl border border-slate-100 bg-white p-4 transition hover:shadow-sm">
                                                                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                                                        <div>
                                                                                            <h4 className="font-bold text-slate-900">
                                                                                                {result.examName || "Untitled Exam"}
                                                                                            </h4>
                                                                                            <p className="mt-1 text-xs font-medium text-slate-500">
                                                                                                {result.mode === "exam" ? "Exam Mode" : "Quick Revision"} • {formatDateTime(result.completedAt)}
                                                                                            </p>
                                                                                        </div>
                                                                                        <div className="flex items-center gap-3">
                                                                                            <div className="text-right">
                                                                                                <div className="text-sm font-extrabold text-slate-800">
                                                                                                    {result.score}/{result.totalQuestions}
                                                                                                </div>
                                                                                                <div className="text-xs text-slate-400 flex items-center gap-1 justify-end">
                                                                                                    <Clock3 className="h-3 w-3" />
                                                                                                    {formatDuration(result.timeTaken)}
                                                                                                </div>
                                                                                            </div>
                                                                                            <span className={`inline-flex items-center justify-center rounded-xl border px-3 py-1.5 text-sm font-black ${getScoreTone(percentage)}`}>
                                                                                                {percentage}%
                                                                                            </span>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="mt-3 overflow-hidden rounded-full bg-slate-200">
                                                                                        <div
                                                                                            className={`h-2 rounded-full transition-all duration-700 ${getBarColor(percentage)}`}
                                                                                            style={{ width: `${width}%` }}
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </section>
                        );
                    })}
                </>
            )}
        </div>
    );
}
