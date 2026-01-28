import React from 'react';
import { Card } from '../components/ui/Card';
import { TrendingUp, Target, Clock, Award } from 'lucide-react';

export const StatsPage: React.FC = () => {
    // Mock data
    const stats = {
        gpa: 0.0,
        completedActivities: 0,
        studyHours: 0,
        streak: 0,
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-neutral-50">
            {/* Header */}
            <div className="bg-gradient-to-br from-theme-500 to-theme-600 text-white p-6 shadow-colored">
                <h1 className="text-2xl font-display font-bold mb-1">Estatísticas</h1>
                <p className="text-theme-100 text-sm">Seu progresso acadêmico</p>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto custom-scrollbar p-4">
                <div className="grid grid-cols-2 gap-4 mb-6">
                    {/* GPA Card */}
                    <Card variant="colored">
                        <div className="flex flex-col items-center text-center">
                            <TrendingUp size={32} className="text-theme-600 mb-2" />
                            <div className="text-3xl font-bold text-theme-900 mb-1">
                                {stats.gpa.toFixed(2)}
                            </div>
                            <p className="text-sm text-theme-700">Média Geral</p>
                        </div>
                    </Card>

                    {/* Completed Activities */}
                    <Card variant="colored">
                        <div className="flex flex-col items-center text-center">
                            <Target size={32} className="text-theme-600 mb-2" />
                            <div className="text-3xl font-bold text-theme-900 mb-1">
                                {stats.completedActivities}
                            </div>
                            <p className="text-sm text-theme-700">Concluídas</p>
                        </div>
                    </Card>

                    {/* Study Hours */}
                    <Card variant="colored">
                        <div className="flex flex-col items-center text-center">
                            <Clock size={32} className="text-theme-600 mb-2" />
                            <div className="text-3xl font-bold text-theme-900 mb-1">
                                {stats.studyHours}h
                            </div>
                            <p className="text-sm text-theme-700">Horas de Estudo</p>
                        </div>
                    </Card>

                    {/* Streak */}
                    <Card variant="colored">
                        <div className="flex flex-col items-center text-center">
                            <Award size={32} className="text-theme-600 mb-2" />
                            <div className="text-3xl font-bold text-theme-900 mb-1">
                                {stats.streak}
                            </div>
                            <p className="text-sm text-theme-700">Dias Seguidos</p>
                        </div>
                    </Card>
                </div>

                {/* Empty state */}
                <Card variant="default">
                    <div className="text-center py-8">
                        <p className="text-neutral-600 mb-2">Suas estatísticas aparecerão aqui</p>
                        <p className="text-sm text-neutral-400">
                            Adicione matérias e atividades para começar
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
};
