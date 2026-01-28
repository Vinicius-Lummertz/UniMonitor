import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Lock, User as UserIcon, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { supabase } from '../lib/supabase';

export const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [pin, setPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async () => {
        setError('');

        // Validações
        if (!username || !name || !pin || !confirmPin) {
            setError('Preencha todos os campos');
            return;
        }

        if (pin.length !== 4) {
            setError('O PIN deve ter exatamente 4 dígitos');
            return;
        }

        if (!/^\d+$/.test(pin)) {
            setError('O PIN deve conter apenas números');
            return;
        }

        if (pin !== confirmPin) {
            setError('Os PINs não coincidem');
            return;
        }

        if (username.length < 3) {
            setError('O usuário deve ter pelo menos 3 caracteres');
            return;
        }

        setIsLoading(true);

        try {
            // Verificar se o username já existe
            const { data: existingUser } = await supabase
                .from('users')
                .select('id')
                .eq('username', username)
                .single();

            if (existingUser) {
                setError('Este nome de usuário já está em uso');
                setIsLoading(false);
                return;
            }

            // Criar novo usuário
            const { error: insertError } = await supabase
                .from('users')
                .insert({
                    username,
                    name,
                    pin_hash: pin, // Em produção, usar hash (bcrypt)
                    theme: 'default',
                    first_login: true,
                });

            if (insertError) {
                throw insertError;
            }

            // Redirecionar para login
            alert('Conta criada com sucesso! Faça login para continuar.');
            navigate('/login');
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Erro ao criar conta');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary-50 via-secondary-50 to-primary-100">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                {/* Back button */}
                <button
                    onClick={() => navigate('/login')}
                    className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-6 transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span className="text-sm">Voltar para login</span>
                </button>

                {/* Logo/Title */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', delay: 0.2 }}
                        className="inline-block p-4 bg-gradient-to-br from-theme-400 to-theme-600 rounded-3xl mb-4 shadow-colored"
                    >
                        <UserPlus size={40} className="text-white" />
                    </motion.div>
                    <h1 className="text-4xl font-display font-bold text-neutral-900 mb-2">
                        Criar Conta
                    </h1>
                    <p className="text-neutral-600">Junte-se ao UniMonitor</p>
                </div>

                {/* Register Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/90 backdrop-blur-md rounded-3xl shadow-soft-lg p-8"
                >
                    <div className="space-y-4">
                        <Input
                            label="Nome completo"
                            type="text"
                            placeholder="Ex: João Silva"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            icon={<UserIcon size={20} />}
                        />

                        <Input
                            label="Nome de usuário"
                            type="text"
                            placeholder="Ex: joao123"
                            value={username}
                            onChange={(e) => setUsername(e.target.value.toLowerCase())}
                            icon={<UserIcon size={20} />}
                        />

                        <Input
                            label="PIN de 4 dígitos"
                            type="password"
                            placeholder="••••"
                            maxLength={4}
                            value={pin}
                            onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                            icon={<Lock size={20} />}
                        />

                        <Input
                            label="Confirmar PIN"
                            type="password"
                            placeholder="••••"
                            maxLength={4}
                            value={confirmPin}
                            onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                            icon={<Lock size={20} />}
                        />
                    </div>

                    {error && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-red-500 text-sm mt-4"
                        >
                            {error}
                        </motion.p>
                    )}

                    <Button
                        onClick={handleRegister}
                        isLoading={isLoading}
                        disabled={!username || !name || !pin || !confirmPin}
                        className="w-full mt-6"
                        size="lg"
                    >
                        <UserPlus size={20} className="mr-2" />
                        Criar Conta
                    </Button>

                    <p className="text-center text-neutral-500 text-sm mt-4">
                        Já tem uma conta?{' '}
                        <button
                            onClick={() => navigate('/login')}
                            className="text-theme-600 hover:text-theme-700 font-medium"
                        >
                            Fazer login
                        </button>
                    </p>
                </motion.div>

                <p className="text-center text-neutral-400 text-xs mt-6">
                    ⚠️ Este é um projeto pessoal. Use PINs simples que você vai lembrar.
                </p>
            </motion.div>
        </div>
    );
};
