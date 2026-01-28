// TypeScript types for Supabase database

export type ActivityType = 'prova' | 'trabalho' | 'seminario' | 'projeto' | 'outro';
export type PriorityLevel = 'baixa' | 'media' | 'alta' | 'urgente';
export type DayOfWeek = 'segunda' | 'terca' | 'quarta' | 'quinta' | 'sexta' | 'sabado' | 'domingo';
export type MaterialType = 'pdf' | 'link' | 'video' | 'outros';
export type Theme = 'default' | 'red' | 'green' | 'blue' | 'purple' | 'orange' | 'teal';

export interface User {
    id: string;
    username: string;
    pin_hash: string;
    name: string;
    theme: Theme;
    first_login: boolean;
    created_at: string;
    updated_at: string;
}

export interface Subject {
    id: string;
    user_id: string;
    name: string;
    code?: string;
    color: string;
    semester?: string;
    credits?: number;
    professor_id?: string;
    notes?: string;
    created_at: string;
    updated_at: string;
}

export interface Professor {
    id: string;
    user_id: string;
    name: string;
    email?: string;
    phone?: string;
    department?: string;
    office?: string;
    notes?: string;
    created_at: string;
    updated_at: string;
}

export interface Activity {
    id: string;
    user_id: string;
    subject_id: string;
    title: string;
    description?: string;
    type: ActivityType;
    priority: PriorityLevel;
    due_date: string;
    completed: boolean;
    grade?: number;
    weight?: number;
    reminder_days: number;
    created_at: string;
    updated_at: string;
}

export interface Schedule {
    id: string;
    user_id: string;
    subject_id: string;
    day: DayOfWeek;
    start_time: string;
    end_time: string;
    room?: string;
    building?: string;
    notes?: string;
    created_at: string;
    updated_at: string;
}

export interface Note {
    id: string;
    user_id: string;
    subject_id?: string;
    title?: string;
    content: string;
    pinned: boolean;
    created_at: string;
    updated_at: string;
}

export interface Material {
    id: string;
    user_id: string;
    subject_id: string;
    title: string;
    type: MaterialType;
    file_path?: string;
    url?: string;
    description?: string;
    created_at: string;
    updated_at: string;
}

export interface PomodoroSession {
    id: string;
    user_id: string;
    subject_id?: string;
    duration_minutes: number;
    completed: boolean;
    session_date: string;
    created_at: string;
}

// Extended types with relations
export interface SubjectWithProfessor extends Subject {
    professor?: Professor;
}

export interface ActivityWithSubject extends Activity {
    subject?: Subject;
}

export interface ScheduleWithSubject extends Schedule {
    subject?: Subject;
}

export interface MaterialWithSubject extends Material {
    subject?: Subject;
}

// Database operations response types
export interface DatabaseResponse<T> {
    data: T | null;
    error: Error | null;
}
