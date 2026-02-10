"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
    const router = useRouter();
    const { register, user, loading: authLoading } = useAuth();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [medium, setMedium] = useState<"english" | "tamil">("english");
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

        if (password.length < 8) {
            setError(medium === "english" ? "Password must be at least 8 characters" : "கடவுச்சொல் குறைந்தது 8 எழுத்துக்கள் இருக்க வேண்டும்");
            return;
        }

        if (!email.toLowerCase().endsWith("@gmail.com")) {
            setError(medium === "english" ? "Please use a valid Gmail address (@gmail.com)" : "சரியான Gmail முகவரியைப் பயன்படுத்தவும் (@gmail.com)");
            return;
        }

        setLoading(true);

        try {
            await register(email, password, name, "student", medium);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Signup failed");
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

            <h1 className="text-3xl font-bold text-gray-800 mb-8">
                {medium === "english" ? "Create Account" : "கணக்கை உருவாக்க"}
            </h1>

            {/* Medium Selector */}
            <div className="flex gap-4 mb-8 w-full max-w-sm">
                <button
                    type="button"
                    onClick={() => setMedium("english")}
                    className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${medium === "english"
                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                        : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                        }`}
                >
                    English Medium
                </button>
                <button
                    type="button"
                    onClick={() => setMedium("tamil")}
                    className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${medium === "tamil"
                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                        : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                        }`}
                >
                    தமிழ் வழி
                </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                        {error}
                    </div>
                )}

                <input
                    type="text"
                    placeholder={medium === "english" ? "Your Name" : "உங்கள் பெயர்"}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl text-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />

                <input
                    type="email"
                    placeholder={medium === "english" ? "Email" : "மின்னஞ்சல்"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl text-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />

                <input
                    type="password"
                    placeholder={medium === "english" ? "Password (8+ characters)" : "கடவுச்சொல் (8+ எழுத்துக்கள்)"}
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
                    {loading
                        ? (medium === "english" ? "Creating..." : "உருவாக்குகிறது...")
                        : (medium === "english" ? "Create Account" : "கணக்கை உருவாக்க")}
                </button>
            </form>

            <p className="mt-6 text-gray-500">
                {medium === "english" ? "Already have an account?" : "ஏற்கனவே கணக்கு உள்ளதா?"}{" "}
                <Link href="/login" className="text-emerald-600 font-medium">
                    {medium === "english" ? "Login" : "உள்நுழைய"}
                </Link>
            </p>
        </div>
    );
}
