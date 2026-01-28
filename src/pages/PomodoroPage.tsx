import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export const PomodoroPage: React.FC = () => {
    const [minutes, setMinutes] = useState(25);
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isBreak, setIsBreak] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (isActive && (minutes > 0 || seconds > 0)) {
            interval = setInterval(() => {
                if (seconds === 0) {
                    if (minutes === 0) {
                        // Timer finished
                        setIsActive(false);
                        // Play notification sound here
                    } else {
                        setMinutes(minutes - 1);
                        setSeconds(59);
                    }
                } else {
                    setSeconds(seconds - 1);
                }
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, minutes, seconds]);

    const toggleTimer = () => {
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setIsActive(false);
        setMinutes(isBreak ? 5 : 25);
        setSeconds(0);
    };

    const switchMode = () => {
        setIsBreak(!isBreak);
        setMinutes(isBreak ? 25 : 5);
        setSeconds(0);
        setIsActive(false);
    };

    const progress = ((isBreak ? 5 : 25) * 60 - (minutes * 60 + seconds)) / ((isBreak ? 5 : 25) * 60);

    return (
        <div className="flex-1 flex flex-col h-full bg-gradient-to-br from-theme-50 via-neutral-50 to-theme-100">
            {/* Header */}
            <div className="bg-gradient-to-br from-theme-500 to-theme-600 text-white p-6 shadow-colored">
                <h1 className="text-2xl font-display font-bold mb-1">Pomodoro</h1>
                <p className="text-theme-100 text-sm">Foco e produtividade</p>
            </div>

            {/* Timer */}
            <div className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-md">
                    {/* Mode Switch */}
                    <div className="flex gap-2 mb-8">
                        <button
                            onClick={switchMode}
                            className={`
                flex-1 py-3 px-6 rounded-2xl font-medium transition-all
                ${!isBreak
                                    ? 'bg-theme-500 text-white shadow-colored'
                                    : 'bg-white text-neutral-600 hover:bg-neutral-100'
                                }
              `}
                        >
                            <Clock size={20} className="inline mr-2" />
                            Foco (25min)
                        </button>
                        <button
                            onClick={switchMode}
                            className={`
                flex-1 py-3 px-6 rounded-2xl font-medium transition-all
                ${isBreak
                                    ? 'bg-theme-500 text-white shadow-colored'
                                    : 'bg-white text-neutral-600 hover:bg-neutral-100'
                                }
              `}
                        >
                            <Clock size={20} className="inline mr-2" />
                            Pausa (5min)
                        </button>
                    </div>

                    {/* Timer Display */}
                    <Card variant="glass" className="text-center mb-8 relative overflow-hidden">
                        {/* Progress bar */}
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress * 100}%` }}
                            className="absolute top-0 left-0 h-1 bg-gradient-to-r from-theme-500 to-theme-600"
                        />

                        <div className="py-12">
                            <div className="text-7xl font-display font-bold text-neutral-900 mb-4">
                                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                            </div>
                            <p className="text-neutral-600">
                                {isActive ? (isBreak ? 'Descansando...' : 'Focado!') : 'Pronto para começar?'}
                            </p>
                        </div>
                    </Card>

                    {/* Controls */}
                    <div className="flex gap-4 justify-center">
                        <Button
                            onClick={toggleTimer}
                            size="lg"
                            className="w-32"
                        >
                            {isActive ? (
                                <>
                                    <Pause size={20} className="mr-2" />
                                    Pausar
                                </>
                            ) : (
                                <>
                                    <Play size={20} className="mr-2" />
                                    Iniciar
                                </>
                            )}
                        </Button>

                        <Button
                            onClick={resetTimer}
                            variant="ghost"
                            size="lg"
                        >
                            <RotateCcw size={20} />
                        </Button>
                    </div>

                    {/* Stats Card */}
                    <Card variant="colored" className="mt-8">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-theme-900 mb-1">0</div>
                            <p className="text-sm text-theme-700">Sessões hoje</p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
