"use client";

import React, { useEffect, useState, useCallback } from "react";
import { clsx } from "clsx";

interface TimerProps {
    initialSeconds: number;
    onComplete?: () => void;
    onTick?: (seconds: number) => void;
    paused?: boolean;
    className?: string;
    size?: "sm" | "md" | "lg";
}

export function Timer({
    initialSeconds,
    onComplete,
    onTick,
    paused = false,
    className,
    size = "md",
}: TimerProps) {
    const [seconds, setSeconds] = useState(initialSeconds);

    useEffect(() => {
        setSeconds(initialSeconds);
    }, [initialSeconds]);

    useEffect(() => {
        if (paused || seconds <= 0) return;

        const interval = setInterval(() => {
            setSeconds((prev) => {
                const newValue = prev - 1;
                if (onTick) onTick(newValue);
                if (newValue <= 0 && onComplete) {
                    onComplete();
                }
                return newValue;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [paused, seconds, onComplete, onTick]);

    const formatTime = useCallback((totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
        }
        return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }, []);

    const isWarning = seconds <= 300 && seconds > 60; // Last 5 minutes
    const isDanger = seconds <= 60; // Last minute

    const sizeStyles = {
        sm: "text-sm",
        md: "text-lg",
        lg: "text-2xl",
    };

    return (
        <div
            className={clsx(
                "font-mono font-bold tabular-nums",
                sizeStyles[size],
                isWarning && "text-amber-500",
                isDanger && "text-red-500 animate-pulse",
                !isWarning && !isDanger && "text-gray-700",
                className
            )}
        >
            {formatTime(seconds)}
        </div>
    );
}

// Circular Timer variant
interface CircularTimerProps extends TimerProps {
    radius?: number;
    strokeWidth?: number;
}

export function CircularTimer({
    initialSeconds,
    onComplete,
    onTick,
    paused = false,
    radius = 45,
    strokeWidth = 8,
}: CircularTimerProps) {
    const [seconds, setSeconds] = useState(initialSeconds);
    const circumference = 2 * Math.PI * radius;
    const progress = seconds / initialSeconds;
    const offset = circumference * (1 - progress);

    useEffect(() => {
        setSeconds(initialSeconds);
    }, [initialSeconds]);

    useEffect(() => {
        if (paused || seconds <= 0) return;

        const interval = setInterval(() => {
            setSeconds((prev) => {
                const newValue = prev - 1;
                if (onTick) onTick(newValue);
                if (newValue <= 0 && onComplete) {
                    onComplete();
                }
                return newValue;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [paused, seconds, onComplete, onTick]);

    const formatTime = (totalSeconds: number) => {
        const minutes = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${minutes}:${secs.toString().padStart(2, "0")}`;
    };

    const isWarning = seconds <= 300 && seconds > 60;
    const isDanger = seconds <= 60;

    const strokeColor = isDanger
        ? "#ef4444"
        : isWarning
            ? "#f59e0b"
            : "#10b981";

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg
                width={(radius + strokeWidth) * 2}
                height={(radius + strokeWidth) * 2}
                className="-rotate-90"
            >
                {/* Background circle */}
                <circle
                    cx={radius + strokeWidth}
                    cy={radius + strokeWidth}
                    r={radius}
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth={strokeWidth}
                />
                {/* Progress circle */}
                <circle
                    cx={radius + strokeWidth}
                    cy={radius + strokeWidth}
                    r={radius}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-linear"
                />
            </svg>
            <div
                className={clsx(
                    "absolute font-mono font-bold",
                    isDanger && "text-red-500 animate-pulse",
                    isWarning && "text-amber-500",
                    !isDanger && !isWarning && "text-gray-700"
                )}
            >
                {formatTime(seconds)}
            </div>
        </div>
    );
}

