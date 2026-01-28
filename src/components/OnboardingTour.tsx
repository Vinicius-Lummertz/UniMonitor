import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from './ui/Button';
import { useAuthStore } from '../store/authStore';

interface TourStep {
    title: string;
    description: string;
    image?: string;
}

const tourSteps: TourStep[] = [
    {
        title: '📅 Bem-vindo ao UniMonitor!',
        description: 'Sua nova ferramenta para gerenciar a vida universitária de forma simples e visual.',
    },
    {
        title: '🎨 Calendário Visual',
        description: 'Adicione provas, trabalhos e eventos com cores por prioridade. O calendário é sua tela principal!',
    },
    {
        title: '📚 Organize suas Matérias',
        description: 'Cadastre suas disciplinas, professores e horários de aula em um só lugar.',
    },
    {
        title: '⏱️ Pomodoro Timer',
        description: 'Mantenha o foco com sessões de estudo cronometradas. Acompanhe sua produtividade!',
    },
    {
        title: '🎯 Personalize o Tema',
        description: 'Nas configurações, escolha entre 7 temas de cores para deixar o app com sua cara.',
    },
    {
        title: '✨ Pronto para começar!',
        description: 'Explore as funcionalidades e comece a organizar sua rotina universitária agora.',
    },
];

export const OnboardingTour: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const markTourCompleted = useAuthStore((state) => state.markTourCompleted);

    const handleNext = () => {
        if (currentStep < tourSteps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleFinish();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSkip = () => {
        setIsVisible(false);
        setTimeout(() => markTourCompleted(), 300);
    };

    const handleFinish = () => {
        setIsVisible(false);
        setTimeout(() => markTourCompleted(), 300);
    };

    const step = tourSteps[currentStep];

    return (
        <AnimatePresence>
            {isVisible && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Tour Modal */}
                    <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="w-full max-w-md bg-white rounded-3xl shadow-soft-lg overflow-hidden"
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-br from-theme-500 to-theme-600 text-white p-6 relative">
                                <button
                                    onClick={handleSkip}
                                    className="absolute top-4 right-4 p-2 rounded-xl hover:bg-white/20 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                                <div className="text-center">
                                    <div className="text-6xl mb-3">
                                        {step.title.split(' ')[0]}
                                    </div>
                                    <h2 className="text-2xl font-display font-bold">
                                        {step.title.substring(step.title.indexOf(' ') + 1)}
                                    </h2>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <p className="text-neutral-700 text-center mb-6 leading-relaxed">
                                    {step.description}
                                </p>

                                {/* Progress dots */}
                                <div className="flex justify-center gap-2 mb-6">
                                    {tourSteps.map((_, index) => (
                                        <motion.div
                                            key={index}
                                            className={`h-2 rounded-full transition-all ${index === currentStep
                                                    ? 'w-8 bg-theme-500'
                                                    : 'w-2 bg-neutral-300'
                                                }`}
                                            animate={{
                                                scale: index === currentStep ? 1.2 : 1,
                                            }}
                                        />
                                    ))}
                                </div>

                                {/* Navigation */}
                                <div className="flex gap-3">
                                    {currentStep > 0 && (
                                        <Button
                                            variant="ghost"
                                            onClick={handlePrev}
                                            className="flex-1"
                                        >
                                            <ChevronLeft size={20} className="mr-1" />
                                            Voltar
                                        </Button>
                                    )}

                                    <Button
                                        onClick={handleNext}
                                        className="flex-1"
                                    >
                                        {currentStep === tourSteps.length - 1 ? 'Começar!' : 'Próximo'}
                                        {currentStep < tourSteps.length - 1 && (
                                            <ChevronRight size={20} className="ml-1" />
                                        )}
                                    </Button>
                                </div>

                                {/* Skip button */}
                                {currentStep < tourSteps.length - 1 && (
                                    <button
                                        onClick={handleSkip}
                                        className="w-full mt-3 text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
                                    >
                                        Pular tutorial
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};
