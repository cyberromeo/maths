"use client";

import React, { useEffect, useState } from "react";
import { getAllStudents, getResults, ExamResult } from "@/lib/database";
import { useAuth } from "@/context/AuthContext";
import { Trophy, Medal, Award, TrendingUp, Search } from "lucide-react";

interface RankItem {
    studentId: string;
    studentName: string;
    totalScore: number;
    testsTaken: number;
    averageScore: number;
    rank: number;
}

export default function LeaderboardPage() {
    const { user } = useAuth();
    const [rankings, setRankings] = useState<RankItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                // Fetch all data
                const [studentsData, resultsData] = await Promise.all([
                    getAllStudents(), // Get student names
                    getResults()      // Get all exam results
                ]);

                // user map for quick lookup
                const userMap = new Map();
                // @ts-ignore
                studentsData.forEach((s: any) => userMap.set(s.$id, s.name));

                // Process results to aggregate scores
                const studentStats = new Map<string, { score: number, count: number, name: string }>();

                resultsData.forEach((result) => {
                    const current = studentStats.get(result.studentId) || {
                        score: 0,
                        count: 0,
                        name: result.studentName || userMap.get(result.studentId) || 'Unknown'
                    };

                    studentStats.set(result.studentId, {
                        score: current.score + result.score,
                        count: current.count + 1,
                        name: current.name
                    });
                });

                // Convert to array and sort
                const rankList: RankItem[] = Array.from(studentStats.entries()).map(([studentId, stats]) => ({
                    studentId,
                    studentName: stats.name,
                    totalScore: stats.score,
                    testsTaken: stats.count,
                    averageScore: Math.round(stats.score / stats.count), // simplified average, assumes comparable max scores or just raw points
                    rank: 0
                }));

                // Sort by Total Score Descending because "Ranking" usually means points
                rankList.sort((a, b) => b.totalScore - a.totalScore);

                // Assign ranks (handle ties if needed, but simple index for now)
                const top10 = rankList.slice(0, 10).map((item, index) => ({
                    ...item,
                    rank: index + 1
                }));

                setRankings(top10);
            } catch (error) {
                console.error("Error loading leaderboard:", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-24 md:pb-8">
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Trophy className="w-6 h-6 text-yellow-500" />
                        Leaderboard
                    </h1>
                </div>
            </header>

            <main className="container mx-auto px-4 py-6 max-w-2xl">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 text-white mb-8 shadow-lg">
                    <h2 className="text-2xl font-bold mb-2">Top Performers 🏆</h2>
                    <p className="text-emerald-100 opacity-90">
                        Competing for the highest total score in Mathematics
                    </p>
                </div>

                <div className="space-y-4">
                    {rankings.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
                            <Trophy className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">No rankings yet. Be the first to take a test!</p>
                        </div>
                    ) : (
                        rankings.map((item) => {
                            const isMe = user?.$id === item.studentId;
                            let rankIcon;
                            let rankColor = "bg-white border-gray-100";

                            if (item.rank === 1) {
                                rankColor = "bg-yellow-50 border-yellow-200";
                                rankIcon = <Medal className="w-6 h-6 text-yellow-500" />;
                            } else if (item.rank === 2) {
                                rankColor = "bg-gray-50 border-gray-200";
                                rankIcon = <Medal className="w-6 h-6 text-gray-400" />;
                            } else if (item.rank === 3) {
                                rankColor = "bg-orange-50 border-orange-200";
                                rankIcon = <Award className="w-6 h-6 text-orange-500" />;
                            }

                            return (
                                <div
                                    key={item.studentId}
                                    className={`relative flex items-center p-4 rounded-2xl border-2 shadow-sm transition-transform hover:scale-[1.01] ${rankColor} ${isMe ? 'ring-2 ring-emerald-500 ring-offset-2' : ''}`}
                                >
                                    {/* Rank */}
                                    <div className="w-12 flex-shrink-0 flex flex-col items-center justify-center font-bold text-gray-700">
                                        {rankIcon || <span className="text-lg">#{item.rank}</span>}
                                    </div>

                                    {/* Avatar */}
                                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xl mr-4 flex-shrink-0">
                                        {item.studentName.charAt(0).toUpperCase()}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-gray-800 truncate flex items-center gap-2">
                                            {item.studentName}
                                            {isMe && <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">You</span>}
                                        </h3>
                                        <p className="text-xs text-gray-500">
                                            {item.testsTaken} tests taken
                                        </p>
                                    </div>

                                    {/* Score */}
                                    <div className="text-right pl-4">
                                        <div className="font-black text-xl text-gray-800">
                                            {item.totalScore}
                                        </div>
                                        <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                                            Points
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </main>
        </div>
    );
}
