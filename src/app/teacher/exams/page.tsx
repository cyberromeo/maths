"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Clock, FileQuestion, ChevronRight, Calendar, Activity } from "lucide-react";
import { getExams, Exam } from "@/lib/database";

export default function ExamsPage() {
    const [exams, setExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadExams() {
            try {
                const fetchedExams = await getExams();
                setExams(fetchedExams);
            } catch (error) {
                console.error("Error loading exams:", error);
            } finally {
                setLoading(false);
            }
        }
        loadExams();
    }, []);

    const getExamStatus = (exam: Exam) => {
        if (!exam.isActive) return "inactive";
        const now = new Date();
        if (exam.startTime && new Date(exam.startTime) > now) return "upcoming";
        if (exam.endTime && new Date(exam.endTime) < now) return "completed";
        return "active";
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "active":
                return "bg-emerald-100 text-emerald-700 border-emerald-200";
            case "upcoming":
                return "bg-sky-100 text-sky-700 border-sky-200";
            case "completed":
                return "bg-slate-100 text-slate-700 border-slate-200";
            case "inactive":
                return "bg-rose-100 text-rose-700 border-rose-200";
            default:
                return "bg-slate-100 text-slate-700 border-slate-200";
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-400 border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-6">
            {/* Header section with premium gradient */}
            <section className="overflow-hidden rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-indigo-50 p-5 sm:p-7 shadow-sm">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <Link
                            href="/teacher"
                            className="mb-3 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-sky-700 transition hover:text-sky-800"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Return to Dashboard
                        </Link>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                            Exam Management
                        </h1>
                        <p className="mt-1 text-sm text-slate-600 sm:text-base">
                            Create, view, and manage practice and live tests.
                        </p>
                    </div>
                    <Link
                        href="/teacher/exams/new"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                    >
                        <Plus className="h-5 w-5" />
                        Create New Exam
                    </Link>
                </div>
            </section>

            {/* Exams List */}
            <div className="space-y-3">
                {exams.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
                        <Activity className="h-12 w-12 text-slate-300" />
                        <h3 className="mt-4 text-lg font-semibold text-slate-900">No Exams Found</h3>
                        <p className="mt-2 text-sm text-slate-500 max-w-sm">
                            You haven't created any live or practice exams yet. Click the "Create New Exam" button above to get started.
                        </p>
                    </div>
                ) : (
                    exams.map((exam) => {
                        const status = getExamStatus(exam);
                        const statusStyle = getStatusStyles(status);
                        const isLive = exam.type === "live";

                        return (
                            <Link key={exam.$id} href={`/teacher/exams/${exam.$id}`}>
                                <article className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:border-sky-300 hover:shadow-md">
                                    <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                                        <div className="flex items-start gap-4">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 group-hover:bg-indigo-100 transition">
                                                <Calendar className="h-6 w-6 text-indigo-600" />
                                            </div>
                                            <div>
                                                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                                    <h3 className="text-base font-bold text-slate-900 sm:text-lg group-hover:text-sky-700 transition">
                                                        {exam.name}
                                                    </h3>
                                                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${statusStyle}`}>
                                                        {status}
                                                    </span>
                                                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${isLive ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                                                        {exam.type}
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 sm:text-sm">
                                                    {exam.startTime && (
                                                        <span className="flex items-center gap-1.5">
                                                            <Calendar className="h-4 w-4" />
                                                            {new Date(exam.startTime).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                    <span className="flex items-center gap-1.5">
                                                        <Clock className="h-4 w-4" />
                                                        {exam.durationMinutes} mins
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <FileQuestion className="h-4 w-4" />
                                                        {exam.questionIds?.length || 0} Questions
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex justify-end sm:shrink-0">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition group-hover:bg-sky-50 group-hover:text-sky-600">
                                                <ChevronRight className="h-5 w-5" />
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        );
                    })
                )}
            </div>
        </div>
    );
}

