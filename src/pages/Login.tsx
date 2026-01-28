import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, User as UserIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

import { useNavigate } from 'react-router-dom';

export const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, isAuthenticated } = useAuthStore((state) => state);
    const navigate = useNavigate();

    // Se já estiver logado, redirecionar
    React.useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const handlePinInput = (digit: string) => {
        if (pin.length < 4) {
            setPin(pin + digit);
        }
    };

    const handleBackspace = () => {
        setPin(pin.slice(0, -1));
    };

    const handleLogin = async () => {
        if (!username || pin.length !== 4) {
            setError('Preencha o usuário e PIN de 4 dígitos');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // Buscar usuário no Supabase
            const { data, error: dbError } = await supabase
                .from('users')
                .select('*')
                .eq('username', username)
                .single();

            if (dbError || !data) {
                setError('Usuário não encontrado');
                setIsLoading(false);
                return;
            }

            // Verificar PIN (em produção, usar hash)
            // Para simplicidade, assumindo que pin_hash é o próprio PIN
            if (data.pin_hash !== pin) {
                setError('PIN incorreto');
                setIsLoading(false);
                return;
            }

            // Login bem-sucedido
            login(data);
            navigate('/');
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.message || 'Erro ao fazer login. Verifique o console.');
        } finally {
            setIsLoading(false);
        }
    };

    const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary-50 via-secondary-50 to-primary-100">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                {/* Logo/Title */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', delay: 0.2 }}
                        className="inline-block p-4 bg-gradient-to-br from-theme-400 to-theme-600 rounded-3xl mb-4 shadow-colored"
                    >
                        <Lock size={40} className="text-white" />
                    </motion.div>
                    <h1 className="text-4xl font-display font-bold text-neutral-900 mb-2">
                        UniMonitor
                    </h1>
                    <p className="text-neutral-600">Gerencie sua vida universitária</p>
                </div>

                {/* Login Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/90 backdrop-blur-md rounded-3xl shadow-soft-lg p-8"
                >
                    <Input
                        label="Usuário"
                        type="text"
                        placeholder="Digite seu usuário"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        icon={<UserIcon size={20} />}
                        className="mb-6"
                    />

                    {/* PIN Display */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-neutral-700 mb-3">
                            PIN de 4 dígitos
                        </label>
                        <div className="flex justify-center gap-3 mb-4">
                            {[0, 1, 2, 3].map((i) => (
                                <motion.div
                                    key={i}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.4 + i * 0.05 }}
                                    className={`
                    w-14 h-14 rounded-2xl flex items-center justify-center
                    border-2 transition-all duration-200
                    ${pin[i]
                                            ? 'border-theme-500 bg-theme-50'
                                            : 'border-neutral-200 bg-neutral-50'
                                        }
                  `}
                                >
                                    {pin[i] && (
                                        <div className="w-3 h-3 rounded-full bg-theme-600" />
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Number Pad */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        {digits.map((digit, index) => (
                            <motion.button
                                key={digit}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + index * 0.03 }}
                                onClick={() => handlePinInput(digit)}
                                disabled={pin.length === 4}
                                className="
                  h-14 rounded-2xl
                  bg-neutral-100 hover:bg-neutral-200
                  text-neutral-900 font-semibold text-lg
                  transition-all duration-200
                  active:scale-95
                  disabled:opacity-50
                "
                            >
                                {digit}
                            </motion.button>
                        ))}

                        {/* Backspace button */}
                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + 10 * 0.03 }}
                            onClick={handleBackspace}
                            className="
                col-span-3 h-14 rounded-2xl
                bg-secondary-100 hover:bg-secondary-200
                text-secondary-900 font-semibold
                transition-all duration-200
                active:scale-95
              "
                        >
                            ← Apagar
                        </motion.button>
                    </div>

                    {error && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-red-500 text-sm text-center mb-4"
                        >
                            {error}
                        </motion.p>
                    )}

                    <Button
                        onClick={handleLogin}
                        isLoading={isLoading}
                        disabled={!username || pin.length !== 4}
                        className="w-full"
                        size="lg"
                    >
                        Entrar
                    </Button>

                    <p className="text-center text-neutral-500 text-sm mt-4">
                        Não tem uma conta?{' '}
                        <a
                            href="/register"
                            className="text-theme-600 hover:text-theme-700 font-medium"
                        >
                            Criar conta
                        </a>
                    </p>
                </motion.div>

                <p className="text-center text-neutral-500 text-sm mt-6">
                    Acesso exclusivo para usuários cadastrados
                </p>
            </motion.div>
        </div>
    );
};
