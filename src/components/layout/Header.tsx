"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import {
    LogOut,
    User,
    BookOpen,
    LayoutDashboard,
    FileQuestion,
    Users,
    ClipboardList,
    Menu,
    X,
    Trophy
} from "lucide-react";
import { clsx } from "clsx";
import { t } from "@/lib/translations";

export function Header() {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    const teacherLinks = [
        { href: "/teacher", label: "Dashboard", icon: LayoutDashboard },
        { href: "/teacher/questions", label: "Questions", icon: FileQuestion },
        { href: "/teacher/exams", label: "Exams", icon: ClipboardList },
        { href: "/teacher/students", label: "Students", icon: Users },
    ];

    const studentLinks = [
        { href: "/student", label: t(user?.medium, "nav_home"), icon: LayoutDashboard },
        { href: "/student/chapters", label: t(user?.medium, "nav_practice"), icon: BookOpen },
        { href: "/student/results", label: t(user?.medium, "nav_results"), icon: ClipboardList },
        { href: "/student/leaderboard", label: t(user?.medium, "nav_leaderboard"), icon: Trophy },
        { href: "/student/custom-test", label: t(user?.medium, "nav_custom"), icon: FileQuestion },
    ];

    const links = user?.role === "teacher" ? teacherLinks : studentLinks;

    const handleLogout = async () => {
        await logout();
        window.location.href = "/";
    };

    return (
        <header className="hidden md:block sticky top-0 z-40 bg-slate-900/80 backdrop-blur-lg border-b border-slate-700/50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href={user ? (user.role === "teacher" ? "/teacher" : "/student") : "/"} className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                            <span className="text-white font-bold text-lg">M</span>
                        </div>
                        <span className="text-xl font-bold text-white">Maths Test</span>
                    </Link>

                    {/* Desktop Navigation */}
                    {user && (
                        <nav className="hidden md:flex items-center gap-1">
                            {links.map((link) => {
                                const Icon = link.icon;
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={clsx(
                                            "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                                            isActive
                                                ? "bg-emerald-500/10 text-emerald-400"
                                                : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                        )}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {link.label}
                                    </Link>
                                );
                            })}
                        </nav>
                    )}

                    {/* User Menu */}
                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                <div className="hidden sm:flex items-center gap-2 text-sm text-slate-400">
                                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                                        <User className="w-4 h-4 text-emerald-400" />
                                    </div>
                                    <div className="hidden lg:block">
                                        <p className="font-medium text-white">{user.name}</p>
                                        <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 rounded-xl text-slate-500 hover:bg-slate-800 hover:text-white transition-colors"
                                    title="Logout"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link
                                    href="/login"
                                    className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/signup"
                                    className="px-4 py-2 text-sm font-medium text-white bg-emerald-500 rounded-xl hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/30"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Toggle */}
                        {user && (
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-800 hover:text-white"
                            >
                                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        )}
                    </div>
                </div>

                {/* Mobile Navigation */}
                {user && mobileMenuOpen && (
                    <nav className="md:hidden py-4 border-t border-slate-700/50">
                        {links.map((link) => {
                            const Icon = link.icon;
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={clsx(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                                        isActive
                                            ? "bg-emerald-500/10 text-emerald-400"
                                            : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                    )}
                                >
                                    <Icon className="w-5 h-5" />
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>
                )}
            </div>
        </header>
    );
}

