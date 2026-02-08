"use client";

import React, { useState, useEffect } from "react";
// import { useAuth } from "@/context/AuthContext"; // Optional if we still want user info
import { Header } from "@/components/layout/Header";
// import { MobileNav } from "@/components/layout/MobileNav"; // Teacher portal might not need student nav

export default function TeacherLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const auth = sessionStorage.getItem("teacherAuth");
        if (auth === "true") {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === "Sri@1405") {
            setIsAuthenticated(true);
            sessionStorage.setItem("teacherAuth", "true");
            setError("");
        } else {
            setError("Incorrect password");
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">👨‍🏫</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800">Teacher Access</h1>
                        <p className="text-gray-500 mt-2">Enter password to continue</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-800 placeholder-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                            />
                            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-emerald-200"
                        >
                            Access Dashboard
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* We can keep a simplified header for the teacher view */}
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">👨‍🏫</span>
                        <span className="font-bold text-xl text-gray-800">Teacher Portal</span>
                    </div>
                    <button
                        onClick={() => {
                            setIsAuthenticated(false);
                            sessionStorage.removeItem("teacherAuth");
                        }}
                        className="text-sm font-medium text-gray-500 hover:text-red-500"
                    >
                        Logout
                    </button>
                </div>
            </header>
            <main className="container mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    );
}

