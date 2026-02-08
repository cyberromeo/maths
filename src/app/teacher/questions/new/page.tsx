"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, Button, Input } from "@/components/ui";
import { CHAPTERS } from "@/data/chapters";
import { ArrowLeft, Plus, Trash2, Check } from "lucide-react";
import { clsx } from "clsx";

export default function NewQuestionPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        chapterId: "",
        questionText: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
    });

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...formData.options];
        newOptions[index] = value;
        setFormData({ ...formData, options: newOptions });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Validate
        if (!formData.chapterId || !formData.questionText || formData.options.some(o => !o.trim())) {
            alert("Please fill in all fields");
            setLoading(false);
            return;
        }

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setSuccess(true);
        setLoading(false);

        // Reset form after short delay
        setTimeout(() => {
            setSuccess(false);
            setFormData({
                chapterId: formData.chapterId, // Keep chapter for adding more questions
                questionText: "",
                options: ["", "", "", ""],
                correctAnswer: 0,
            });
        }, 1500);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-in">
            {/* Header */}
            <div>
                <Link
                    href="/teacher/questions"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to questions
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Add New Question</h1>
                <p className="text-gray-600 mt-1">Create a new MCQ for your question bank</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
                <Card className="bg-white">
                    <CardContent className="p-6 space-y-6">
                        {/* Chapter Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Chapter
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {CHAPTERS.map((chapter) => (
                                    <button
                                        key={chapter.id}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, chapterId: chapter.id })}
                                        className={clsx(
                                            "p-3 rounded-xl border-2 text-left transition-all",
                                            formData.chapterId === chapter.id
                                                ? "border-emerald-500 bg-emerald-50"
                                                : "border-gray-200 hover:border-gray-300"
                                        )}
                                    >
                                        <span className="text-xl mb-1 block">{chapter.icon}</span>
                                        <span className="text-sm font-medium text-gray-900">{chapter.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Question Text */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Question
                            </label>
                            <textarea
                                value={formData.questionText}
                                onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                                placeholder="Enter your question here..."
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                required
                            />
                        </div>

                        {/* Options */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Options (click to mark as correct)
                            </label>
                            <div className="space-y-3">
                                {formData.options.map((option, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, correctAnswer: idx })}
                                            className={clsx(
                                                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all",
                                                formData.correctAnswer === idx
                                                    ? "bg-green-500 text-white"
                                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                            )}
                                        >
                                            {formData.correctAnswer === idx ? (
                                                <Check className="w-5 h-5" />
                                            ) : (
                                                String.fromCharCode(65 + idx)
                                            )}
                                        </button>
                                        <Input
                                            type="text"
                                            placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                                            value={option}
                                            onChange={(e) => handleOptionChange(idx, e.target.value)}
                                            required
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Submit Button */}
                <div className="flex gap-3 mt-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/teacher/questions")}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        isLoading={loading}
                        className={clsx("flex-1", success && "bg-green-500 hover:bg-green-600")}
                    >
                        {success ? (
                            <>
                                <Check className="w-4 h-4" />
                                Added!
                            </>
                        ) : (
                            <>
                                <Plus className="w-4 h-4" />
                                Add Question
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}

