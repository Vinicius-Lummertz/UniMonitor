import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
    children: React.ReactNode;
    variant?: 'default' | 'glass' | 'colored';
    className?: string;
    onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
    children,
    variant = 'default',
    className = '',
    onClick,
}) => {
    const variantClasses = {
        default: 'bg-white border border-neutral-200 shadow-soft',
        glass: 'glass shadow-soft-lg',
        colored: 'bg-gradient-to-br from-theme-100 to-theme-50 border border-theme-200 shadow-colored',
    };

    const Component = onClick ? motion.button : motion.div;

    return (
        <Component
            whileHover={onClick ? { scale: 1.02 } : {}}
            whileTap={onClick ? { scale: 0.98 } : {}}
            onClick={onClick}
            className={`
        rounded-2xl p-6
        transition-all duration-300
        ${variantClasses[variant]}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
        >
            {children}
        </Component>
    );
};
