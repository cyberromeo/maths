'use client';

import { clsx } from 'clsx';
import { forwardRef } from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'glass' | 'bordered' | 'elevated';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    hover?: boolean;
    glow?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    (
        {
            className,
            variant = 'default',
            padding = 'md',
            hover = false,
            glow = false,
            children,
            ...props
        },
        ref
    ) => {
        const baseStyles = 'rounded-2xl transition-all duration-300';

        const variants = {
            default: 'bg-slate-800/50 border border-slate-700/50',
            glass: 'bg-slate-800/30 backdrop-blur-xl border border-slate-700/30',
            bordered: 'bg-transparent border-2 border-slate-700',
            elevated: 'bg-slate-800 shadow-xl shadow-black/20',
        };

        const paddings = {
            none: '',
            sm: 'p-4',
            md: 'p-6',
            lg: 'p-8',
        };

        const hoverStyles = hover
            ? 'hover:bg-slate-700/50 hover:border-slate-600/50 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30 cursor-pointer'
            : '';

        const glowStyles = glow
            ? 'shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20'
            : '';

        return (
            <div
                ref={ref}
                className={clsx(
                    baseStyles,
                    variants[variant],
                    paddings[padding],
                    hoverStyles,
                    glowStyles,
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = 'Card';

// Card sub-components
const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={clsx('mb-4', className)} {...props} />
    )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => (
        <h3
            ref={ref}
            className={clsx('text-xl font-bold text-white', className)}
            {...props}
        />
    )
);
CardTitle.displayName = 'CardTitle';

const CardDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => (
        <p
            ref={ref}
            className={clsx('text-sm text-slate-400 mt-1', className)}
            {...props}
        />
    )
);
CardDescription.displayName = 'CardDescription';

const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={clsx('', className)} {...props} />
    )
);
CardContent.displayName = 'CardContent';

const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={clsx('mt-6 pt-4 border-t border-slate-700/50', className)}
            {...props}
        />
    )
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
export type { CardProps };
