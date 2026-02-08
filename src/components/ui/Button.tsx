'use client';

import { clsx } from 'clsx';
import { forwardRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    glow?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant = 'primary',
            size = 'md',
            isLoading = false,
            leftIcon,
            rightIcon,
            children,
            disabled,
            glow = false,
            ...props
        },
        ref
    ) => {
        const baseStyles = `
      inline-flex items-center justify-center font-semibold
      rounded-xl transition-all duration-300 ease-out
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900
      disabled:opacity-50 disabled:cursor-not-allowed
      active:scale-[0.98]
    `;

        const variants = {
            primary: `
        bg-gradient-to-r from-emerald-500 to-emerald-600 text-white
        hover:from-emerald-400 hover:to-emerald-500
        focus:ring-emerald-500
        ${glow ? 'shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40' : ''}
      `,
            secondary: `
        bg-slate-700 text-slate-100
        hover:bg-slate-600
        focus:ring-slate-500
        border border-slate-600
      `,
            outline: `
        bg-transparent text-emerald-400
        border-2 border-emerald-500
        hover:bg-emerald-500/10 hover:text-emerald-300
        focus:ring-emerald-500
      `,
            ghost: `
        bg-transparent text-slate-300
        hover:bg-slate-800 hover:text-white
        focus:ring-slate-500
      `,
            danger: `
        bg-gradient-to-r from-red-500 to-red-600 text-white
        hover:from-red-400 hover:to-red-500
        focus:ring-red-500
        ${glow ? 'shadow-lg shadow-red-500/30' : ''}
      `,
        };

        const sizes = {
            sm: 'px-4 py-2 text-sm gap-1.5',
            md: 'px-6 py-3 text-base gap-2',
            lg: 'px-8 py-4 text-lg gap-2.5',
        };

        return (
            <button
                ref={ref}
                className={clsx(baseStyles, variants[variant], sizes[size], className)}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading ? (
                    <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                ) : (
                    <>
                        {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
                        {children}
                        {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
                    </>
                )}
            </button>
        );
    }
);

Button.displayName = 'Button';

export { Button };
export type { ButtonProps };
