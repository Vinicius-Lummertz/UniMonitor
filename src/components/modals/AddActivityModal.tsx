import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useActivitiesStore } from '../../store/activitiesStore';
import { useSubjectsStore } from '../../store/subjectsStore';
import type { PriorityLevel, ActivityType } from '../../types/database';

const activitySchema = z.object({
    title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
    type: z.enum(['prova', 'trabalho', 'seminario', 'projeto', 'outro']),
    priority: z.enum(['baixa', 'media', 'alta', 'urgente']),
    subject_id: z.string().min(1, 'Selecione uma matéria'),
    due_date: z.string(),
    due_time: z.string(),
    description: z.string().optional(),
    weight: z.string().optional(),
    grade: z.string().optional(),
});

type ActivityForm = z.infer<typeof activitySchema>;

interface AddActivityModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedDate?: Date;
}

const priorities: { value: PriorityLevel; label: string; color: string }[] = [
    { value: 'baixa', label: 'Baixa', color: '#10B981' },
    { value: 'media', label: 'Média', color: '#F59E0B' },
    { value: 'alta', label: 'Alta', color: '#F97316' },
    { value: 'urgente', label: 'Urgente', color: '#EF4444' },
];

const types: { value: ActivityType; label: string; emoji: string }[] = [
    { value: 'prova', label: 'Prova', emoji: '📝' },
    { value: 'trabalho', label: 'Trabalho', emoji: '💻' },
    { value: 'seminario', label: 'Seminário', emoji: '🎤' },
    { value: 'projeto', label: 'Projeto', emoji: '🚀' },
    { value: 'outro', label: 'Outro', emoji: '📌' },
];

export const AddActivityModal: React.FC<AddActivityModalProps> = ({ isOpen, onClose, selectedDate }) => {
    const addActivity = useActivitiesStore((state) => state.addActivity);
    const { subjects, fetchSubjects } = useSubjectsStore();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) fetchSubjects();
    }, [isOpen]);

    const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<ActivityForm>({
        resolver: zodResolver(activitySchema),
        defaultValues: {
            priority: 'media',
            type: 'prova',
            due_date: selectedDate ? selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            due_time: '12:00',
        },
    });

    // Update date if selectedDate changes from props
    useEffect(() => {
        if (selectedDate) {
            setValue('due_date', selectedDate.toISOString().split('T')[0]);
        }
    }, [selectedDate, setValue]);

    const selectedPriority = watch('priority');
    const selectedType = watch('type');

    const onSubmit = async (data: ActivityForm) => {
        setIsLoading(true);
        try {
            // Combine date and time
            const datetime = new Date(`${data.due_date}T${data.due_time}:00`);

            await addActivity({
                title: data.title,
                type: data.type,
                priority: data.priority,
                subject_id: data.subject_id,
                due_date: datetime.toISOString(),
                completed: false,
                reminder_days: 1,
                description: data.description,
                weight: data.weight ? Number(data.weight) : undefined,
                grade: data.grade ? Number(data.grade) : undefined,
            });
            reset();
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Nova Atividade">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                    label="Título"
                    placeholder="Ex: P1 de Cálculo"
                    error={errors.title?.message}
                    {...register('title')}
                />

                {/* Subject Select */}
                <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Matéria
                    </label>
                    <select
                        {...register('subject_id')}
                        className="w-full px-4 py-3 rounded-2xl bg-white border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-theme-400"
                    >
                        <option value="">Selecione...</option>
                        {subjects.map((subject) => (
                            <option key={subject.id} value={subject.id}>
                                {subject.name}
                            </option>
                        ))}
                    </select>
                    {errors.subject_id && (
                        <p className="text-red-500 text-sm mt-1">{errors.subject_id.message}</p>
                    )}
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Data"
                        type="date"
                        {...register('due_date')}
                    />
                    <Input
                        label="Hora"
                        type="time"
                        {...register('due_time')}
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Descrição
                    </label>
                    <textarea
                        className="w-full px-4 py-3 rounded-2xl bg-white border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-theme-400 min-h-[80px] resize-none"
                        placeholder="Detalhes sobre a atividade..."
                        {...register('description')}
                    />
                </div>

                {/* Weight (Only for exams/works) */}
                {(selectedType === 'prova' || selectedType === 'trabalho') && (
                    <div>
                        <Input
                            label="Peso (0-10)"
                            type="number"
                            step="0.1"
                            placeholder="Ex: 2.5"
                            {...register('weight')}
                        />
                    </div>
                )}

                {/* Type Selection */}
                <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Tipo</label>
                    <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                        {types.map((type) => (
                            <button
                                key={type.value}
                                type="button"
                                onClick={() => setValue('type', type.value)}
                                className={`
                  flex items-center gap-1 px-3 py-2 rounded-xl text-sm whitespace-nowrap border transition-all
                  ${selectedType === type.value
                                        ? 'bg-theme-100 border-theme-500 text-theme-900 shadow-sm'
                                        : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                                    }
                `}
                            >
                                <span>{type.emoji}</span>
                                {type.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Priority Selection */}
                <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Prioridade</label>
                    <div className="grid grid-cols-4 gap-2">
                        {priorities.map((priority) => (
                            <button
                                key={priority.value}
                                type="button"
                                onClick={() => setValue('priority', priority.value)}
                                className={`
                  flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all
                  ${selectedPriority === priority.value
                                        ? 'bg-opacity-10 border-current scale-105'
                                        : 'border-transparent bg-neutral-50 hover:bg-neutral-100 grayscale hover:grayscale-0'
                                    }
                `}
                                style={{
                                    color: selectedPriority === priority.value ? priority.color : undefined,
                                    borderColor: selectedPriority === priority.value ? priority.color : 'transparent'
                                }}
                            >
                                <div
                                    className="w-3 h-3 rounded-full mb-1"
                                    style={{ backgroundColor: priority.color }}
                                />
                                <span className="text-xs font-medium">{priority.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                    <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
                        Cancelar
                    </Button>
                    <Button type="submit" isLoading={isLoading} className="flex-1">
                        Salvar
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
