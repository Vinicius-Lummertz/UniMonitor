import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';
import type { Theme } from '../types/database';
import { LogOut, Palette, User } from 'lucide-react';

const themes: { id: Theme; name: string; color: string }[] = [
    { id: 'default', name: 'Padrão', color: '#E8B897' },
    { id: 'red', name: 'Vermelho', color: '#EF4444' },
    { id: 'green', name: 'Verde', color: '#22C55E' },
    { id: 'blue', name: 'Azul', color: '#3B82F6' },
    { id: 'purple', name: 'Roxo', color: '#A855F7' },
    { id: 'orange', name: 'Laranja', color: '#F97316' },
    { id: 'teal', name: 'Azul-petróleo', color: '#14B8A6' },
];

export const SettingsPage: React.FC = () => {
    const { user, logout, setTheme } = useAuthStore();

    const handleThemeChange = (themeId: Theme) => {
        setTheme(themeId);
        // Update in database
        // TODO: Implement Supabase update
    };

    const handleLogout = () => {
        logout();
        window.location.href = '/login';
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-neutral-50">
            {/* Header */}
            <div className="bg-gradient-to-br from-theme-500 to-theme-600 text-white p-6 shadow-colored">
                <h1 className="text-2xl font-display font-bold mb-1">Configurações</h1>
                <p className="text-theme-100 text-sm">Personalize sua experiência</p>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto custom-scrollbar p-4">
                {/* User Info */}
                <Card variant="default" className="mb-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-theme-100 flex items-center justify-center">
                            <User size={28} className="text-theme-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-neutral-900">{user?.name || 'Usuário'}</h3>
                            <p className="text-sm text-neutral-500">@{user?.username}</p>
                        </div>
                    </div>
                </Card>

                {/* Theme Selector */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                        <Palette size={20} className="text-neutral-600" />
                        <h2 className="font-semibold text-neutral-900">Tema de Cores</h2>
                    </div>
                    <Card variant="default">
                        <p className="text-sm text-neutral-600 mb-4">
                            Escolha a paleta de cores do aplicativo
                        </p>
                        <div className="grid grid-cols-4 gap-3">
                            {themes.map((theme) => (
                                <button
                                    key={theme.id}
                                    onClick={() => handleThemeChange(theme.id)}
                                    className={`
                    relative flex flex-col items-center gap-2 p-3 rounded-xl
                    transition-all
                    ${user?.theme === theme.id
                                            ? 'bg-neutral-100 ring-2 ring-theme-500'
                                            : 'hover:bg-neutral-50'
                                        }
                  `}
                                >
                                    <div
                                        className="w-10 h-10 rounded-full shadow-soft"
                                        style={{ backgroundColor: theme.color }}
                                    />
                                    <span className="text-xs text-neutral-700">{theme.name}</span>
                                    {user?.theme === theme.id && (
                                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-theme-500 rounded-full flex items-center justify-center">
                                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Logout Button */}
                <Button
                    variant="danger"
                    onClick={handleLogout}
                    className="w-full"
                >
                    <LogOut size={20} className="mr-2" />
                    Sair da Conta
                </Button>

                {/* Version */}
                <p className="text-center text-neutral-400 text-xs mt-6">
                    UniMonitor v1.0.0
                </p>
            </div>
        </div>
    );
};
