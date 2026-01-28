import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useSubjectsStore } from '../../store/subjectsStore';

const subjectSchema = z.object({
    name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    code: z.string().optional(),
    color: z.string().min(1, 'Cor é obrigatória'),
    semester: z.string().optional(),
    teacher: z.string().optional(),
    description: z.string().optional(),
});

type SubjectForm = z.infer<typeof subjectSchema>;

interface AddSubjectModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const colors = [
    '#FCA5A5', '#FDBA74', '#FDE047', '#86EFAC', '#67E8F9', '#93C5FD', '#C4B5FD', '#F0ABFC', // Pastel variants
    '#EF4444', '#F97316', '#EAB308', '#22C55E', '#06B6D4', '#3B82F6', '#A855F7', '#EC4899', // Vibrant variants
    '#E8B897', '#9CA3AF' // Theme/Neutral
];

export const AddSubjectModal: React.FC<AddSubjectModalProps> = ({ isOpen, onClose }) => {
    const addSubject = useSubjectsStore((state) => state.addSubject);
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<SubjectForm>({
        resolver: zodResolver(subjectSchema),
        defaultValues: {
            color: '#E8B897',
        },
    });

    const selectedColor = watch('color');

    const onSubmit = async (data: SubjectForm) => {
        setIsLoading(true);
        try {
            await addSubject(data);
            reset();
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Nova Matéria">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                    label="Nome da Matéria"
                    placeholder="Ex: Cálculo I"
                    error={errors.name?.message}
                    {...register('name')}
                />

                <Input
                    label="Professor(a)"
                    placeholder="Ex: Prof. Silva"
                    error={errors.teacher?.message}
                    {...register('teacher')}
                />

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Código (Opcional)"
                        placeholder="Ex: MAT101"
                        error={errors.code?.message}
                        {...register('code')}
                    />
                    <Input
                        label="Semestre (Opcional)"
                        placeholder="Ex: 2º"
                        error={errors.semester?.message}
                        {...register('semester')}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Descrição / Anotações
                    </label>
                    <textarea
                        className="w-full px-4 py-3 rounded-2xl bg-white border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-theme-400 min-h-[100px] resize-none"
                        placeholder="Informações adicionais sobre a matéria..."
                        {...register('description')}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Cor Identificadora
                    </label>
                    <div className="grid grid-cols-6 gap-2">
                        {colors.map((color) => (
                            <button
                                key={color}
                                type="button"
                                onClick={() => setValue('color', color)}
                                className={`
                  w-8 h-8 rounded-full border-2 transition-all
                  ${selectedColor === color ? 'border-neutral-900 scale-110' : 'border-transparent hover:scale-105'}
                `}
                                style={{ backgroundColor: color }}
                            />
                        ))}
                    </div>
                    {errors.color && <p className="text-red-500 text-sm mt-1">{errors.color.message}</p>}
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
