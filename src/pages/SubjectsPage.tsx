import React, { useEffect, useState } from 'react';
import type { Subject } from '../types/database';
import { Plus, BookOpen, Trash2, Edit2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';
import { useSubjectsStore } from '../store/subjectsStore';
import { AddSubjectModal } from '../components/modals/AddSubjectModal';

export const SubjectsPage: React.FC = () => {
    const { subjects, fetchSubjects, deleteSubject, isLoading } = useSubjectsStore();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchSubjects();
    }, [fetchSubjects]);

    const handleDelete = async (id: string) => {
        if (confirm('Tem certeza que deseja excluir esta matéria?')) {
            await deleteSubject(id);
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-neutral-50">
            {/* Header */}
            <div className="bg-gradient-to-br from-theme-500 to-theme-600 text-white p-6 shadow-colored">
                <h1 className="text-2xl font-display font-bold mb-1">Matérias</h1>
                <p className="text-theme-100 text-sm">Gerencie suas disciplinas</p>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto custom-scrollbar p-4">
                {isLoading && subjects.length === 0 ? (
                    <div className="flex justify-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-theme-600"></div>
                    </div>
                ) : subjects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center px-6">
                        <div className="w-20 h-20 rounded-full bg-theme-100 flex items-center justify-center mb-4">
                            <BookOpen size={40} className="text-theme-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                            Nenhuma matéria ainda
                        </h3>
                        <p className="text-neutral-600 mb-6">
                            Adicione suas matérias para começar a organizar sua rotina
                        </p>
                        <Button onClick={() => setIsModalOpen(true)}>
                            <Plus size={20} className="mr-2" />
                            Adicionar Matéria
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {subjects.map((subject) => (
                            <Card key={subject.id} variant="default">
                                <div className="flex items-start gap-4">
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shadow-sm"
                                        style={{ backgroundColor: subject.color }}
                                    >
                                        {subject.code?.substring(0, 2) || subject.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-neutral-900">{subject.name}</h3>
                                        <div className="flex gap-2 text-sm text-neutral-500">
                                            {subject.code && <span>{subject.code}</span>}
                                            {subject.semester && <span>• {subject.semester}</span>}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="p-2 rounded-xl hover:bg-neutral-100 transition-colors">
                                            <Edit2 size={18} className="text-neutral-600" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(subject.id)}
                                            className="p-2 rounded-xl hover:bg-red-50 transition-colors"
                                        >
                                            <Trash2 size={18} className="text-red-500" />
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* FAB */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsModalOpen(true)}
                className="
          fixed bottom-24 right-6
          w-14 h-14 rounded-full
          bg-gradient-to-r from-theme-500 to-theme-600
          text-white shadow-colored
          flex items-center justify-center
          z-30
        "
            >
                <Plus size={24} />
            </motion.button>

            <AddSubjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};
