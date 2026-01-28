import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, BookOpen, Settings, BarChart3, Clock } from 'lucide-react';

interface NavItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    path: string;
}

const navItems: NavItem[] = [
    { id: 'calendar', label: 'Calendário', icon: <Calendar size={24} />, path: '/' },
    { id: 'subjects', label: 'Matérias', icon: <BookOpen size={24} />, path: '/subjects' },
    { id: 'pomodoro', label: 'Pomodoro', icon: <Clock size={24} />, path: '/pomodoro' },
    { id: 'stats', label: 'Stats', icon: <BarChart3 size={24} />, path: '/stats' },
    { id: 'settings', label: 'Config', icon: <Settings size={24} />, path: '/settings' },
];

export const BottomNav: React.FC = () => {
    const location = useLocation();

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-neutral-200 safe-bottom z-40">
            <div className="flex justify-around items-center h-16 px-2">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;

                    return (
                        <Link
                            key={item.id}
                            to={item.path}
                            className="relative flex flex-col items-center justify-center flex-1 h-full"
                        >
                            {/* Active indicator */}
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-x-2 top-1 h-1 bg-gradient-to-r from-theme-500 to-theme-600 rounded-full"
                                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                />
                            )}

                            {/* Icon */}
                            <motion.div
                                animate={{
                                    scale: isActive ? 1.1 : 1,
                                    color: isActive ? 'rgb(var(--theme-600))' : 'rgb(120, 113, 108)',
                                }}
                                className="transition-colors"
                            >
                                {item.icon}
                            </motion.div>

                            {/* Label */}
                            <span
                                className={`text-xs mt-1 transition-colors ${isActive ? 'text-theme-700 font-medium' : 'text-neutral-500'
                                    }`}
                            >
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};
