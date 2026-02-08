"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
    LayoutDashboard,
    BookOpen,
    ClipboardList,
    FileQuestion,
    Users,
    Trophy
} from "lucide-react";
import { clsx } from "clsx";

export function MobileNav() {
    const { user } = useAuth();
    const pathname = usePathname();

    if (!user) return null;

    const teacherLinks = [
        { href: "/teacher", label: "Home", icon: LayoutDashboard },
        { href: "/teacher/questions", label: "Questions", icon: FileQuestion },
        { href: "/teacher/exams", label: "Exams", icon: ClipboardList },
        { href: "/teacher/students", label: "Students", icon: Users },
    ];

    const studentLinks = [
        { href: "/student", label: "Home", icon: LayoutDashboard },
        { href: "/student/chapters", label: "Practice", icon: BookOpen },
        { href: "/student/results", label: "Results", icon: ClipboardList },
        { href: "/student/leaderboard", label: "Rankings", icon: Trophy },
        { href: "/student/custom-test", label: "Custom", icon: FileQuestion },
    ];

    const links = user.role === "teacher" ? teacherLinks : studentLinks;

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 md:hidden safe-area-pb">
            <div className="flex items-center justify-around py-2">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={clsx(
                                "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all min-w-[68px]",
                                isActive
                                    ? "text-emerald-600"
                                    : "text-gray-400"
                            )}
                        >
                            <Icon className={clsx("w-5 h-5", isActive && "text-emerald-500")} />
                            <span className="text-xs font-medium">{link.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}

