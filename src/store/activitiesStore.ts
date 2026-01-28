import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Activity } from '../types/database';

interface ActivitiesStore {
    activities: Activity[];
    isLoading: boolean;
    error: string | null;
    fetchActivities: () => Promise<void>;
    addActivity: (activity: Omit<Activity, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => Promise<void>;
    deleteActivity: (id: string) => Promise<void>;
    toggleComplete: (id: string, isCompleted: boolean) => Promise<void>;
    updateActivity: (id: string, updates: Partial<Activity>) => Promise<void>;
}

export const useActivitiesStore = create<ActivitiesStore>((set, get) => ({
    activities: [],
    isLoading: false,
    error: null,

    fetchActivities: async () => {
        set({ isLoading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('activities')
                .select('*');

            if (error) throw error;
            set({ activities: data as Activity[] });
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    addActivity: async (newActivity) => {
        set({ isLoading: true, error: null });
        try {
            // Get user id manually as discussed
            // NOTE: This relies on the same "local auth" workaround as subjectsStore
            const storedAuth = localStorage.getItem('unimonitor-auth');
            let userId = null;
            if (storedAuth) {
                const parsed = JSON.parse(storedAuth);
                userId = parsed.state.user?.id;
            }

            if (!userId) throw new Error('Usuário não autenticado');

            const { data, error } = await supabase
                .from('activities')
                .insert([{ ...newActivity, user_id: userId }])
                .select()
                .single();

            if (error) throw error;
            set((state) => ({ activities: [...state.activities, data as Activity] }));
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    deleteActivity: async (id) => {
        // Optimistic update
        const previousActivities = get().activities;
        set((state) => ({ activities: state.activities.filter((a) => a.id !== id) }));

        try {
            const { error } = await supabase
                .from('activities')
                .delete()
                .eq('id', id);

            if (error) throw error;
        } catch (error: any) {
            // Rollback
            set({ activities: previousActivities, error: error.message });
        }
    },

    toggleComplete: async (id, isCompleted) => {
        // Optimistic update
        set((state) => ({
            activities: state.activities.map((a) =>
                a.id === id ? { ...a, completed: isCompleted } : a
            ),
        }));

        try {
            const { error } = await supabase
                .from('activities')
                .update({ completed: isCompleted })
                .eq('id', id);

            if (error) throw error;
        } catch (error: any) {
            set({ error: error.message });
        }
    },

    updateActivity: async (id, updates) => {
        // Optimistic update
        set((state) => ({
            activities: state.activities.map((a) =>
                a.id === id ? { ...a, ...updates } : a
            ),
        }));

        try {
            const { error } = await supabase
                .from('activities')
                .update(updates)
                .eq('id', id);

            if (error) throw error;
        } catch (error: any) {
            set({ error: error.message });
            // Should probably revert here too but simplified for now
        }
    },
}));
