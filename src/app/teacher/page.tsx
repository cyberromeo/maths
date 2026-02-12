"use client";

import React, { useEffect, useMemo, useState } from "react";
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
    BookOpen,
    CalendarDays,
    Clock3,
    FileQuestion,
    GraduationCap,
    Languages,
    Search,
    TrendingUp,
    Users,
} from "lucide-react";

interface User {
    $id: string;
    name: string;
    email: string;
    medium?: "english" | "tamil" | string;
}

interface StudentReport {
    student: User;
    attempts: number;
    averagePercentage: number;
    bestPercentage: number;
    totalScore: number;
    totalQuestions: number;
    latestExamName: string | null;
    latestCompletedAt: string | null;
    recentResults: ExamResult[];
}

type MediumKey = "english" | "tamil";

function normalizeMedium(medium?: string): MediumKey {
    return medium?.toLowerCase() === "tamil" ? "tamil" : "english";
}

function calculatePercentage(score: number, total: number): number {
    if (!total) return 0;
    return Math.round((score / total) * 100);
}

function formatDateTime(dateValue: string | null): string {
    if (!dateValue) return "No attempts yet";
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return "Date unavailable";
    return `${date.toLocaleDateString()} | ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    })}`;
}

function formatDuration(seconds: number): string {
    if (!seconds || seconds <= 0) return "Time not tracked";
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

export default function TeacherDashboard() {
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [results, setResults] = useState<ExamResult[]>([]);
    const [students, setStudents] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const [chaptersData, questionsData, resultsData, studentsData] = await Promise.all([
                    getChapters(),
                    getQuestions(),
                    getResults(),
                    getAllStudents(),
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

    const reports = useMemo<StudentReport[]>(() => {
        const resultsByStudent = new Map<string, ExamResult[]>();

        results.forEach((result) => {
            const existing = resultsByStudent.get(result.studentId) || [];
            existing.push(result);
            resultsByStudent.set(result.studentId, existing);
        });

        return students
            .map((student) => {
                const studentResults = [...(resultsByStudent.get(student.$id) || [])].sort(
                    (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
                );

                const attempts = studentResults.length;
                const totalScore = studentResults.reduce((sum, result) => sum + result.score, 0);
                const totalQuestions = studentResults.reduce(
                    (sum, result) => sum + result.totalQuestions,
                    0
                );
                const percentages = studentResults.map((result) =>
                    calculatePercentage(result.score, result.totalQuestions)
                );

                const averagePercentage =
                    percentages.length > 0
                        ? Math.round(
                            percentages.reduce((sum, percentage) => sum + percentage, 0) /
                            percentages.length
                        )
                        : 0;

                const bestPercentage = percentages.length > 0 ? Math.max(...percentages) : 0;

                return {
                    student,
                    attempts,
                    averagePercentage,
                    bestPercentage,
                    totalScore,
                    totalQuestions,
                    latestExamName: studentResults[0]?.examName || null,
                    latestCompletedAt: studentResults[0]?.completedAt || null,
                    recentResults: studentResults.slice(0, 5),
                };
            })
            .sort((a, b) => {
                if (b.attempts !== a.attempts) return b.attempts - a.attempts;
                if (b.averagePercentage !== a.averagePercentage) {
                    return b.averagePercentage - a.averagePercentage;
                }
                return (a.student.name || "").localeCompare(b.student.name || "");
            });
    }, [results, students]);

    const filteredReports = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return reports;

        return reports.filter((report) => {
            const name = report.student.name?.toLowerCase() || "";
            const email = report.student.email?.toLowerCase() || "";
            return name.includes(query) || email.includes(query);
        });
    }, [reports, searchQuery]);

    const groupedReports = useMemo(() => {
        const grouped: Record<MediumKey, StudentReport[]> = {
            english: [],
            tamil: [],
        };

        filteredReports.forEach((report) => {
            grouped[normalizeMedium(report.student.medium)].push(report);
        });

        return grouped;
    }, [filteredReports]);

    const mediumTotals = useMemo(() => {
        const totals: Record<MediumKey, number> = { english: 0, tamil: 0 };
        students.forEach((student) => {
            totals[normalizeMedium(student.medium)] += 1;
        });
        return totals;
    }, [students]);

    const overallTotals = useMemo(() => {
        const totalScore = results.reduce((sum, result) => sum + result.score, 0);
        const totalQuestions = results.reduce((sum, result) => sum + result.totalQuestions, 0);
        const averageScore = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;
        const strongAttempts = results.filter(
            (result) => calculatePercentage(result.score, result.totalQuestions) >= 75
        ).length;

        return {
            totalScore,
            totalQuestions,
            averageScore,
            strongAttempts,
        };
    }, [results]);

    const mediumSections: Array<{
        key: MediumKey;
        title: string;
        subtitle: string;
        accent: string;
    }> = [
            {
                key: "english",
                title: "English Medium Students",
                subtitle: "Performance and marks report for English-medium students",
                accent: "border-sky-200 bg-sky-50 text-sky-700",
            },
            {
                key: "tamil",
                title: "Tamil Medium Students",
                subtitle: "Performance and marks report for Tamil-medium students",
                accent: "border-orange-200 bg-orange-50 text-orange-700",
            },
        ];

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-400 border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-6">
            <section className="overflow-hidden rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-amber-50 p-5 sm:p-7">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">
                            Teacher Report Center
                        </p>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                            Complete student report dashboard
                        </h1>
                        <p className="max-w-2xl text-sm text-slate-600 sm:text-base">
                            Mobile-first, light-mode dashboard with separate English and Tamil medium student lists, detailed marks, and recent attempt reports.
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs sm:text-sm">
                        <Link
                            href="/teacher/questions"
                            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-center font-semibold text-slate-700 transition hover:border-sky-200 hover:text-sky-700"
                        >
                            Questions
                        </Link>
                        <Link
                            href="/teacher/exams"
                            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-center font-semibold text-slate-700 transition hover:border-sky-200 hover:text-sky-700"
                        >
                            Exams
                        </Link>
                        <Link
                            href="/teacher/students"
                            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-center font-semibold text-slate-700 transition hover:border-sky-200 hover:text-sky-700"
                        >
                            All Students
                        </Link>
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-sky-100 p-2.5">
                            <Users className="h-5 w-5 text-sky-700" />
                        </div>
                        <div>
                            <p className="text-lg font-bold text-slate-900">{students.length}</p>
                            <p className="text-xs text-slate-500">Total students</p>
                        </div>
                    </div>
                    <p className="mt-3 text-xs text-slate-500">
                        English: {mediumTotals.english} | Tamil: {mediumTotals.tamil}
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-indigo-100 p-2.5">
                            <FileQuestion className="h-5 w-5 text-indigo-700" />
                        </div>
                        <div>
                            <p className="text-lg font-bold text-slate-900">{questions.length}</p>
                            <p className="text-xs text-slate-500">Question bank</p>
                        </div>
                    </div>
                    <p className="mt-3 text-xs text-slate-500">{chapters.length} chapters configured</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-emerald-100 p-2.5">
                            <TrendingUp className="h-5 w-5 text-emerald-700" />
                        </div>
                        <div>
                            <p className="text-lg font-bold text-slate-900">{overallTotals.averageScore}%</p>
                            <p className="text-xs text-slate-500">Average marks</p>
                        </div>
                    </div>
                    <p className="mt-3 text-xs text-slate-500">
                        {overallTotals.totalScore}/{overallTotals.totalQuestions} total marks scored
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-amber-100 p-2.5">
                            <BadgeCheck className="h-5 w-5 text-amber-700" />
                        </div>
                        <div>
                            <p className="text-lg font-bold text-slate-900">{results.length}</p>
                            <p className="text-xs text-slate-500">Total attempts</p>
                        </div>
                    </div>
                    <p className="mt-3 text-xs text-slate-500">{overallTotals.strongAttempts} strong attempts (75%+)</p>
                </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        placeholder="Search by student name or email"
                        className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                    />
                </div>
                <p className="mt-3 text-xs text-slate-500">
                    Showing {filteredReports.length} of {students.length} students
                </p>
            </section>

            {mediumSections.map((section) => {
                const mediumReports = groupedReports[section.key];
                const mediumTotalScore = mediumReports.reduce((sum, report) => sum + report.totalScore, 0);
                const mediumTotalQuestions = mediumReports.reduce(
                    (sum, report) => sum + report.totalQuestions,
                    0
                );
                const mediumAverage =
                    mediumTotalQuestions > 0
                        ? Math.round((mediumTotalScore / mediumTotalQuestions) * 100)
                        : 0;
                const mediumAttempts = mediumReports.reduce((sum, report) => sum + report.attempts, 0);

                return (
                    <section key={section.key} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div className="space-y-1">
                                <h2 className="text-xl font-bold text-slate-900">{section.title}</h2>
                                <p className="text-sm text-slate-500">{section.subtitle}</p>
                            </div>
                            <div className="grid w-full grid-cols-2 gap-2 sm:w-auto sm:min-w-[260px] sm:grid-cols-2">
                                <div className={`rounded-xl border px-3 py-2 text-xs font-semibold ${section.accent}`}>
                                    Students: {mediumReports.length}
                                </div>
                                <div className={`rounded-xl border px-3 py-2 text-xs font-semibold ${section.accent}`}>
                                    Attempts: {mediumAttempts}
                                </div>
                                <div className={`rounded-xl border px-3 py-2 text-xs font-semibold ${section.accent}`}>
                                    Avg marks: {mediumAverage}%
                                </div>
                                <div className={`rounded-xl border px-3 py-2 text-xs font-semibold ${section.accent}`}>
                                    Registered: {mediumTotals[section.key]}
                                </div>
                            </div>
                        </div>

                        {mediumReports.length === 0 ? (
                            <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                                <Languages className="mx-auto h-8 w-8 text-slate-400" />
                                <p className="mt-2 text-sm font-medium text-slate-600">
                                    No students found for this medium
                                </p>
                            </div>
                        ) : (
                            <div className="mt-5 space-y-4">
                                {mediumReports.map((report, index) => (
                                    <article key={report.student.$id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                            <div className="flex items-start gap-3">
                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-sm font-bold text-slate-700 shadow-sm">
                                                    {(report.student.name?.charAt(0) || "?").toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-base font-semibold text-slate-900">
                                                        #{index + 1} {report.student.name || "Unnamed student"}
                                                    </p>
                                                    <p className="text-sm text-slate-500">{report.student.email || "No email"}</p>
                                                    <p className="mt-1 inline-flex items-center gap-1 text-xs text-slate-500">
                                                        <CalendarDays className="h-3.5 w-3.5" />
                                                        Latest: {report.latestExamName || "No exam yet"} | {formatDateTime(report.latestCompletedAt)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${section.accent}`}>
                                                {section.key === "english" ? "English Medium" : "Tamil Medium"}
                                            </div>
                                        </div>

                                        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                                            <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                                                <p className="text-xs text-slate-500">Attempts</p>
                                                <p className="text-sm font-semibold text-slate-900">{report.attempts}</p>
                                            </div>
                                            <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                                                <p className="text-xs text-slate-500">Average %</p>
                                                <p className="text-sm font-semibold text-slate-900">{report.averagePercentage}%</p>
                                            </div>
                                            <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                                                <p className="text-xs text-slate-500">Best %</p>
                                                <p className="text-sm font-semibold text-slate-900">{report.bestPercentage}%</p>
                                            </div>
                                            <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                                                <p className="text-xs text-slate-500">Marks</p>
                                                <p className="text-sm font-semibold text-slate-900">
                                                    {report.totalScore}/{report.totalQuestions}
                                                </p>
                                            </div>
                                        </div>

                                        <details className="mt-4 rounded-xl border border-slate-200 bg-white p-3">
                                            <summary className="cursor-pointer list-none text-sm font-semibold text-slate-800">
                                                Detailed report ({report.recentResults.length} recent attempts)
                                            </summary>
                                            <div className="mt-3 space-y-2">
                                                {report.recentResults.length === 0 ? (
                                                    <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-500">
                                                        No attempts available for this student yet.
                                                    </p>
                                                ) : (
                                                    report.recentResults.map((result) => {
                                                        const percentage = calculatePercentage(result.score, result.totalQuestions);
                                                        const width = Math.max(0, Math.min(100, percentage));
                                                        return (
                                                            <div key={result.$id} className="rounded-xl border border-slate-200 p-3">
                                                                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                                                    <div>
                                                                        <p className="text-sm font-semibold text-slate-900">
                                                                            {result.examName || "Exam"}
                                                                        </p>
                                                                        <p className="text-xs text-slate-500">
                                                                            {result.mode === "exam" ? "Exam Mode" : "Quick Revise"} | {formatDateTime(result.completedAt)}
                                                                        </p>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${getScoreTone(percentage)}`}>
                                                                            {percentage}%
                                                                        </span>
                                                                        <span className="text-sm font-semibold text-slate-700">
                                                                            {result.score}/{result.totalQuestions}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="mt-2 h-1.5 rounded-full bg-slate-100">
                                                                    <div
                                                                        className={`h-1.5 rounded-full ${
                                                                            percentage >= 75
                                                                                ? "bg-emerald-500"
                                                                                : percentage >= 40
                                                                                    ? "bg-amber-500"
                                                                                    : "bg-rose-500"
                                                                            }`}
                                                                        style={{ width: `${width}%` }}
                                                                    />
                                                                </div>
                                                                <p className="mt-2 inline-flex items-center gap-1 text-xs text-slate-500">
                                                                    <Clock3 className="h-3.5 w-3.5" />
                                                                    {formatDuration(result.timeTaken)}
                                                                </p>
                                                            </div>
                                                        );
                                                    })
                                                )}
                                            </div>
                                        </details>
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>
                );
            })}

            <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="mb-2 flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-slate-600" />
                        <h3 className="text-sm font-semibold text-slate-900">Chapter coverage</h3>
                    </div>
                    <div className="space-y-2">
                        {chapters.length === 0 ? (
                            <p className="text-sm text-slate-500">No chapters configured yet.</p>
                        ) : (
                            chapters.slice(0, 6).map((chapter) => (
                                <div key={chapter.$id} className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
                                    <p className="truncate pr-3 text-sm text-slate-700">{chapter.name}</p>
                                    <span className="text-xs font-semibold text-slate-500">{chapter.questionCount} Q</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="mb-2 flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-slate-600" />
                        <h3 className="text-sm font-semibold text-slate-900">Report summary</h3>
                    </div>
                    <div className="space-y-2 text-sm text-slate-600">
                        <p>Total students tracked: {students.length}</p>
                        <p>Total exam attempts recorded: {results.length}</p>
                        <p>Overall marks scored: {overallTotals.totalScore}/{overallTotals.totalQuestions}</p>
                        <p>Current overall average: {overallTotals.averageScore}%</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
