"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getResults } from "@/lib/database";
import type { ExamResult } from "@/lib/database";

export default function StudentResultsPage() {
    const { user } = useAuth();
    const [results, setResults] = useState<ExamResult[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchResults() {
            if (!user) return;
            try {
                const data = await getResults(user.$id);
                setResults(data);
            } catch (error) {
                console.error("Error fetching results:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchResults();
    }, [user]);

    const getScoreColor = (score: number, total: number) => {
        const percentage = (score / total) * 100;
        if (percentage >= 80) return "bg-green-100 text-green-700";
        if (percentage >= 60) return "bg-yellow-100 text-yellow-700";
        return "bg-red-100 text-red-700";
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Simple back button */}
            <div className="p-4 max-w-4xl mx-auto">
                <Link href="/student" className="text-gray-500 hover:text-gray-700">
                    ← Back
                </Link>
            </div>

            <main className="max-w-4xl mx-auto px-4 py-8">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">My Results</h1>
                    <p className="text-gray-500">Your test history</p>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm animate-pulse">
                                <div className="h-6 w-48 bg-gray-200 rounded" />
                            </div>
                        ))}
                    </div>
                ) : results.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 shadow-sm text-center">
                        <p className="text-gray-500 text-lg mb-4">No results yet!</p>
                        <Link href="/student">
                            <button className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600">
                                Start Practicing
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {results.map((result) => (
                            <div key={result.$id} className="bg-white rounded-2xl p-6 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-800">
                                            {result.examName}
                                        </h3>
                                        <p className="text-gray-500">
                                            {new Date(result.completedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className={`px-4 py-2 rounded-xl font-bold text-lg ${getScoreColor(result.score, result.totalQuestions)}`}>
                                        {result.score}/{result.totalQuestions}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
