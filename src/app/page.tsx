'use client';

import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex flex-col items-center justify-center p-8">
      {/* Logo */}
      <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-8 shadow-2xl">
        <span className="text-white font-bold text-5xl">M</span>
      </div>

      {/* Title */}
      <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4 text-center">
        Maths Test
      </h1>
      <p className="text-xl text-gray-500 mb-12 text-center">
        Practice maths and have fun! 🎉
      </p>

      {/* Buttons */}
      <div className="flex flex-col gap-4 w-full max-w-sm">
        <Link href="/login">
          <button className="w-full py-4 px-8 bg-emerald-500 hover:bg-emerald-600 text-white text-xl font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all">
            Login
          </button>
        </Link>
        <Link href="/signup">
          <button className="w-full py-4 px-8 bg-white hover:bg-gray-50 text-emerald-600 text-xl font-semibold rounded-2xl shadow-lg hover:shadow-xl border-2 border-emerald-500 transition-all">
            Create Account
          </button>
        </Link>
      </div>
    </div>
  );
}
