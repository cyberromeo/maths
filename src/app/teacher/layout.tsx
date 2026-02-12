"use client";

import React, { useState } from "react";
import { GraduationCap, LockKeyhole, LogOut } from "lucide-react";

export default function TeacherLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        if (typeof window === "undefined") {
            return false;
        }
        return sessionStorage.getItem("teacherAuth") === "true";
    });
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (password === "Sri@1405") {
            setIsAuthenticated(true);
            sessionStorage.setItem("teacherAuth", "true");
            setError("");
            return;
        }

        setError("Incorrect password");
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-slate-100 px-4 py-8 sm:py-14">
                <div className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="mb-7 text-center">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100">
                            <LockKeyhole className="h-7 w-7 text-sky-700" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900">Teacher Access</h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Enter password to open the report dashboard.
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                placeholder="Enter password"
                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                            />
                            {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-xl bg-sky-600 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
                        >
                            Access dashboard
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100">
            <header className="border-b border-slate-200 bg-white/95 backdrop-blur">
                <div className="container flex h-16 items-center justify-between">
                    <div className="inline-flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100">
                            <GraduationCap className="h-5 w-5 text-sky-700" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-900">Teacher Portal</p>
                            <p className="text-xs text-slate-500">Light mode analytics</p>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            setIsAuthenticated(false);
                            sessionStorage.removeItem("teacherAuth");
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-rose-200 hover:text-rose-600"
                    >
                        <LogOut className="h-3.5 w-3.5" />
                        Logout
                    </button>
                </div>
            </header>

            <main className="container py-5 sm:py-8">{children}</main>
        </div>
    );
}
