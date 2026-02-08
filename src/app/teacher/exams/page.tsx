"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, Button } from "@/components/ui";
import { ArrowLeft, Plus, Clock, Users, ChevronRight, Calendar, MoreVertical } from "lucide-react";

export default function ExamsPage() {
    // Mock exams data
    const exams = [
        {
            id: "1",
            name: "Algebra Mid-Term",
            type: "live",
            date: "Feb 10, 2025",
            time: "10:00 AM",
            duration: 60,
            questions: 30,
            students: 32,
            status: "upcoming",
        },
        {
            id: "2",
            name: "Geometry Quiz",
            type: "live",
            date: "Feb 8, 2025",
            time: "2:00 PM",
            duration: 30,
            questions: 20,
            students: 28,
            status: "active",
        },
        {
            id: "3",
            name: "Trigonometry Test",
            type: "live",
            date: "Feb 5, 2025",
            time: "11:00 AM",
            duration: 45,
            questions: 25,
            students: 35,
            status: "completed",
        },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active":
                return "bg-green-100 text-green-700";
            case "upcoming":
                return "bg-blue-100 text-blue-700";
            case "completed":
                return "bg-gray-100 text-gray-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="space-y-6 animate-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <Link
                        href="/teacher"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to dashboard
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Exams</h1>
                    <p className="text-gray-600 mt-1">Manage your live tests and exams</p>
                </div>
                <Link href="/teacher/exams/new">
                    <Button>
                        <Plus className="w-4 h-4" />
                        Create Exam
                    </Button>
                </Link>
            </div>

            {/* Exams List */}
            <div className="space-y-3">
                {exams.map((exam) => (
                    <Link key={exam.id} href={`/teacher/exams/${exam.id}`}>
                        <Card className="bg-white" hover>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                                            <Calendar className="w-6 h-6 text-emerald-600" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-semibold text-gray-900">{exam.name}</h3>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(exam.status)}`}>
                                                    {exam.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {exam.date}, {exam.time}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {exam.duration} min
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Users className="w-3.5 h-3.5" />
                                                    {exam.students}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-400" />
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}

