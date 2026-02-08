"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, Button, Input } from "@/components/ui";
import { CHAPTERS, SAMPLE_QUESTIONS } from "@/data/chapters";
import { ArrowLeft, Plus, Calendar, Clock, Check, ChevronDown, ChevronUp } from "lucide-react";
import { clsx } from "clsx";

export default function NewExamPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [expandedChapter, setExpandedChapter] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        date: "",
        startTime: "",
        duration: 60,
        selectedQuestions: [] as number[],
    });

    const handleQuestionToggle = (questionIndex: number) => {
        setFormData((prev) => ({
            ...prev,
            selectedQuestions: prev.selectedQuestions.includes(questionIndex)
                ? prev.selectedQuestions.filter((i) => i !== questionIndex)
                : [...prev.selectedQuestions, questionIndex],
        }));
    };

    const handleSelectAllFromChapter = (chapterId: string) => {
        const chapterQuestionIndices = SAMPLE_QUESTIONS
            .map((q, idx) => (q.chapterId === chapterId ? idx : -1))
            .filter((idx) => idx !== -1);

        const allSelected = chapterQuestionIndices.every((idx) =>
            formData.selectedQuestions.includes(idx)
        );

        if (allSelected) {
            setFormData((prev) => ({
                ...prev,
                selectedQuestions: prev.selectedQuestions.filter(
                    (idx) => !chapterQuestionIndices.includes(idx)
                ),
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                selectedQuestions: [
                    ...new Set([...prev.selectedQuestions, ...chapterQuestionIndices]),
                ],
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.selectedQuestions.length === 0) {
            alert("Please select at least one question");
            return;
        }

        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setLoading(false);
        router.push("/teacher/exams");
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-in">
            {/* Header */}
            <div>
                <Link
                    href="/teacher/exams"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to exams
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Create Live Exam</h1>
                <p className="text-gray-600 mt-1">Set up a new exam for your students</p>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Exam Details */}
                <Card className="bg-white mb-6">
                    <CardContent className="p-6 space-y-4">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Exam Details</h2>

                        <Input
                            label="Exam Name"
                            placeholder="e.g., Algebra Mid-Term Test"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                type="date"
                                label="Date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                required
                                icon={<Calendar className="w-4 h-4" />}
                            />
                            <Input
                                type="time"
                                label="Start Time"
                                value={formData.startTime}
                                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                required
                                icon={<Clock className="w-4 h-4" />}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Duration (minutes)
                            </label>
                            <div className="flex items-center gap-3">
                                {[30, 45, 60, 90, 120].map((mins) => (
                                    <button
                                        key={mins}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, duration: mins })}
                                        className={clsx(
                                            "px-4 py-2 rounded-xl text-sm font-medium transition-colors",
                                            formData.duration === mins
                                                ? "bg-emerald-500 text-white"
                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        )}
                                    >
                                        {mins} min
                                    </button>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Question Selection */}
                <Card className="bg-white mb-6">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Select Questions</h2>
                            <span className="text-sm text-gray-500">
                                {formData.selectedQuestions.length} selected
                            </span>
                        </div>

                        <div className="space-y-3">
                            {CHAPTERS.map((chapter) => {
                                const chapterQuestions = SAMPLE_QUESTIONS.filter(
                                    (q) => q.chapterId === chapter.id
                                );
                                const chapterQuestionIndices = SAMPLE_QUESTIONS
                                    .map((q, idx) => (q.chapterId === chapter.id ? idx : -1))
                                    .filter((idx) => idx !== -1);
                                const selectedCount = chapterQuestionIndices.filter((idx) =>
                                    formData.selectedQuestions.includes(idx)
                                ).length;
                                const isExpanded = expandedChapter === chapter.id;

                                return (
                                    <div key={chapter.id} className="border border-gray-200 rounded-xl overflow-hidden">
                                        <button
                                            type="button"
                                            onClick={() => setExpandedChapter(isExpanded ? null : chapter.id)}
                                            className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-xl">{chapter.icon}</span>
                                                <div className="text-left">
                                                    <h3 className="font-medium text-gray-900">{chapter.name}</h3>
                                                    <p className="text-sm text-gray-500">
                                                        {selectedCount} of {chapterQuestions.length} selected
                                                    </p>
                                                </div>
                                            </div>
                                            {isExpanded ? (
                                                <ChevronUp className="w-5 h-5 text-gray-400" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 text-gray-400" />
                                            )}
                                        </button>

                                        {isExpanded && (
                                            <div className="border-t border-gray-200 p-4 bg-gray-50">
                                                <button
                                                    type="button"
                                                    onClick={() => handleSelectAllFromChapter(chapter.id)}
                                                    className="text-sm text-emerald-600 font-medium mb-3 hover:text-emerald-700"
                                                >
                                                    {selectedCount === chapterQuestions.length
                                                        ? "Deselect All"
                                                        : "Select All"}
                                                </button>
                                                <div className="space-y-2">
                                                    {chapterQuestions.map((question, qIdx) => {
                                                        const globalIndex = SAMPLE_QUESTIONS.findIndex(
                                                            (q) =>
                                                                q.chapterId === question.chapterId &&
                                                                q.questionText === question.questionText
                                                        );
                                                        const isSelected = formData.selectedQuestions.includes(globalIndex);

                                                        return (
                                                            <button
                                                                key={qIdx}
                                                                type="button"
                                                                onClick={() => handleQuestionToggle(globalIndex)}
                                                                className={clsx(
                                                                    "w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all",
                                                                    isSelected
                                                                        ? "bg-emerald-100 border-2 border-emerald-500"
                                                                        : "bg-white border-2 border-gray-200 hover:border-gray-300"
                                                                )}
                                                            >
                                                                <div
                                                                    className={clsx(
                                                                        "w-6 h-6 rounded-lg flex items-center justify-center shrink-0",
                                                                        isSelected
                                                                            ? "bg-emerald-500 text-white"
                                                                            : "bg-gray-200"
                                                                    )}
                                                                >
                                                                    {isSelected && <Check className="w-4 h-4" />}
                                                                </div>
                                                                <span className="text-sm text-gray-900 line-clamp-1">
                                                                    {question.questionText}
                                                                </span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Submit */}
                <div className="flex gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/teacher/exams")}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                    <Button type="submit" isLoading={loading} className="flex-1">
                        <Plus className="w-4 h-4" />
                        Create Exam
                    </Button>
                </div>
            </form>
        </div>
    );
}

