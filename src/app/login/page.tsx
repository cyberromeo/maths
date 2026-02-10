"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
    const router = useRouter();
    const { login, user, loading: authLoading } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    React.useEffect(() => {
        if (!authLoading && user) {
            router.push("/student");
        }
    }, [user, authLoading, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email.toLowerCase().endsWith("@gmail.com")) {
            setError("Please use a valid Gmail address (@gmail.com)");
            return;
        }

        setLoading(true);

        try {
            await login(email, password);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Login failed");
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
            {/* Back */}
            <Link href="/" className="absolute top-4 left-4 text-gray-500 hover:text-gray-700">
                ← Back
            </Link>

            {/* Logo */}
            <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center mb-6">
                <span className="text-white font-bold text-3xl">M</span>
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-8">Login</h1>

            {/* Form */}
            <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                        {error}
                    </div>
                )}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl text-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl text-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white text-xl font-semibold rounded-xl disabled:opacity-50"
                >
                    {loading ? "Loading..." : "Login"}
                </button>
            </form>

            <p className="mt-6 text-gray-500">
                No account?{" "}
                <Link href="/signup" className="text-emerald-600 font-medium">
                    Create one
                </Link>
            </p>
        </div>
    );
}
