"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getAllStudents, getResults, ExamResult } from "@/lib/database";
import { ArrowLeft, Search, User, TrendingUp, Clock } from "lucide-react";

interface Student {
    $id: string;
    name: string;
    email: string;
}

interface StudentWithStats extends Student {
    attempts: number;
    avgScore: number;
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
                    const studentResults = resultsData.filter(r => r.studentId === student.$id);
                    const avgScore = studentResults.length > 0
                        ? Math.round(studentResults.reduce((sum, r) => sum + (r.score / r.totalQuestions) * 100, 0) / studentResults.length)
                        : 0;
                    return {
                        ...student,
                        attempts: studentResults.length,
                        avgScore
                    };
                });

                setStudents(studentsWithStats);
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
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <Link
                    href="/teacher"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to dashboard
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Students</h1>
                <p className="text-gray-500 mt-1">{students.length} registered students</p>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search students..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                />
            </div>

            {/* Students List */}
            <div className="space-y-3">
                {filteredStudents.length === 0 ? (
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
                        <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">
                            {searchQuery ? "No students found matching your search" : "No students registered yet"}
                        </p>
                    </div>
                ) : (
                    filteredStudents.map((student) => (
                        <div key={student.$id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                                        <span className="text-emerald-600 font-bold text-lg">
                                            {student.name?.charAt(0).toUpperCase() || '?'}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">{student.name}</h3>
                                        <p className="text-sm text-gray-500">{student.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6 text-right">
                                    <div>
                                        <p className="text-sm text-gray-500">Attempts</p>
                                        <p className="font-semibold text-gray-800 flex items-center gap-1 justify-end">
                                            <Clock className="w-4 h-4 text-gray-400" />
                                            {student.attempts}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Avg Score</p>
                                        <p className={`font-semibold flex items-center gap-1 justify-end ${student.avgScore >= 70 ? 'text-green-600' : student.avgScore >= 40 ? 'text-yellow-600' : 'text-gray-600'
                                            }`}>
                                            {student.attempts > 0 ? `${student.avgScore}%` : '-'}
                                            {student.avgScore >= 70 && <TrendingUp className="w-4 h-4" />}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
