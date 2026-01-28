import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Theme } from '../types/database';
import { supabase } from '../lib/supabase';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    login: (user: User) => void;
    logout: () => void;
    setTheme: (theme: Theme) => void;
    markTourCompleted: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,

            login: (user) => set({ user, isAuthenticated: true }),

            logout: () => set({ user: null, isAuthenticated: false }),

            setTheme: (theme) => set((state) => ({
                user: state.user ? { ...state.user, theme } : null,
            })),

            markTourCompleted: async () => {
                const { user } = get();
                if (!user) return;

                // Update local state immediately for UX
                set((state) => ({
                    user: state.user ? { ...state.user, first_login: false } : null,
                }));

                // Update in Supabase
                try {
                    const { error } = await supabase
                        .from('users')
                        .update({ first_login: false })
                        .eq('id', user.id);

                    if (error) throw error;
                } catch (err) {
                    console.error('Failed to update first_login status:', err);
                }
            },
        }),
        {
            name: 'unimonitor-auth',
        }
    )
);
