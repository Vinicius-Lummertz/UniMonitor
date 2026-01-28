import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useActivitiesStore } from '../../store/activitiesStore';
import { useSubjectsStore } from '../../store/subjectsStore';
import type { Activity } from '../../types/database';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Trash2, CheckCircle, XCircle } from 'lucide-react';
import { Input } from '../ui/Input';

interface EventDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    activity: Activity;
}

export const EventDetailsModal: React.FC<EventDetailsModalProps> = ({ isOpen, onClose, activity }) => {
    const { toggleComplete, deleteActivity, updateActivity } = useActivitiesStore();
    const { subjects } = useSubjectsStore();
    const [isEditing, setIsEditing] = useState(false);

    // State for quick editing grades/weight
    // Handle null values from DB by defaulting to empty string
    const [grade, setGrade] = useState(activity.grade?.toString() || '');
    const [weight, setWeight] = useState(activity.weight?.toString() || '');
    const [isSaving, setIsSaving] = useState(false);

    const subject = subjects.find(s => s.id === activity.subject_id);

    const handleDelete = async () => {
        if (confirm('Tem certeza que deseja excluir esta atividade?')) {
            await deleteActivity(activity.id);
            onClose();
        }
    };

    const handleToggleComplete = async () => {
        // Toggle the current completion status
        await toggleComplete(activity.id, !activity.completed);
    };

    const handleSaveDetails = async () => {
        setIsSaving(true);
        try {
            await updateActivity(activity.id, {
                grade: grade ? Number(grade) : null,
                weight: weight ? Number(weight) : null,
            });
            setIsEditing(false);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    // Formatar data com fallbacks de segurança
    let formattedDate = 'Data inválida';
    try {
        if (activity.due_date) {
            formattedDate = format(new Date(activity.due_date), "EEEE, d 'de' MMMM 'às' HH:mm", { locale: ptBR });
        }
    } catch (e) {
        console.error('Erro ao formatar data:', e);
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Detalhes da Atividade">
            <div className="space-y-6">
                {/* Header Info */}
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{
                            activity.type === 'prova' ? '📝' :
                                activity.type === 'trabalho' ? '💻' :
                                    activity.type === 'seminario' ? '🎤' :
                                        activity.type === 'projeto' ? '🚀' : '📌'
                        }</span>
                        <h2 className={`text-xl font-bold ${activity.completed ? 'line-through text-neutral-400' : 'text-neutral-900'}`}>
                            {activity.title}
                        </h2>
                    </div>

                    <div className="flex flex-wrap gap-2 text-sm">
                        {subject && (
                            <span
                                className="px-2 py-1 rounded-lg text-white font-medium"
                                style={{ backgroundColor: subject.color }}
                            >
                                {subject.name}
                            </span>
                        )}
                        <span className={`px-2 py-1 rounded-lg border border-neutral-200 capitalize ${activity.priority === 'urgente' ? 'text-red-500 bg-red-50 border-red-200' :
                            activity.priority === 'alta' ? 'text-orange-500 bg-orange-50 border-orange-200' :
                                activity.priority === 'media' ? 'text-yellow-600 bg-yellow-50 border-yellow-200' :
                                    'text-green-600 bg-green-50 border-green-200'
                            }`}>
                            Prioridade {activity.priority}
                        </span>
                    </div>

                    <p className="text-neutral-500 text-sm mt-3 capitalize">
                        {formattedDate}
                    </p>
                </div>

                {/* Description */}
                <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
                    <h3 className="text-sm font-semibold text-neutral-700 mb-2">Descrição</h3>
                    <p className="text-neutral-600 whitespace-pre-wrap">
                        {activity.description || 'Nenhuma descrição adicionada.'}
                    </p>
                </div>

                {/* Grades & Weight (Only for exams/works) */}
                {(activity.type === 'prova' || activity.type === 'trabalho') && (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white border border-neutral-200 p-3 rounded-2xl">
                            <span className="text-xs text-neutral-500 uppercase font-bold tracking-wider">Peso</span>
                            {isEditing ? (
                                <Input
                                    type="number"
                                    step="0.1"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                    className="mt-1 h-8 py-0"
                                />
                            ) : (
                                <p className="text-lg font-mono text-neutral-900 mt-1">
                                    {activity.weight !== undefined && activity.weight !== null ? activity.weight : '-'}
                                </p>
                            )}
                        </div>
                        <div className="bg-white border border-neutral-200 p-3 rounded-2xl">
                            <span className="text-xs text-neutral-500 uppercase font-bold tracking-wider">Nota</span>
                            {isEditing ? (
                                <Input
                                    type="number"
                                    step="0.1"
                                    value={grade}
                                    onChange={(e) => setGrade(e.target.value)}
                                    className="mt-1 h-8 py-0"
                                />
                            ) : (
                                <p className={`text-lg font-mono mt-1 ${(activity.grade || 0) >= 6 ? 'text-green-600' :
                                    (activity.grade || 0) > 0 ? 'text-red-500' : 'text-neutral-400'
                                    }`}>
                                    {activity.grade !== undefined && activity.grade !== null ? activity.grade : '-'}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-col gap-3 pt-4 border-t border-neutral-100">
                    {/* Primary Actions */}
                    <div className="flex gap-3">
                        <Button
                            onClick={handleToggleComplete}
                            className={`flex-1 ${activity.completed ? 'bg-neutral-200 text-neutral-700 shadow-none hover:bg-neutral-300' : ''}`}
                            size="md"
                        >
                            {activity.completed ? (
                                <><XCircle size={18} className="mr-2" /> Reabrir</>
                            ) : (
                                <><CheckCircle size={18} className="mr-2" /> Concluir</>
                            )}
                        </Button>

                        {(activity.type === 'prova' || activity.type === 'trabalho') && (
                            <Button
                                variant={isEditing ? "primary" : "secondary"}
                                onClick={() => isEditing ? handleSaveDetails() : setIsEditing(true)}
                                className="flex-1"
                                isLoading={isSaving}
                            >
                                {isEditing ? 'Salvar Notas' : 'Lançar Notas'}
                            </Button>
                        )}
                    </div>

                    {/* Secondary Actions */}
                    <div className="flex justify-between items-center mt-2">
                        <button
                            onClick={handleDelete}
                            className="text-red-500 text-sm hover:text-red-600 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
                        >
                            <Trash2 size={16} /> Excluir Atividade
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
