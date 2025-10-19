import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type SessionType = 'work' | 'short_break' | 'long_break';

export interface PomodoroSession {
  id: string;
  user_id: string | null;
  session_type: SessionType;
  duration_minutes: number;
  completed_at: string;
  interrupted: boolean;
  created_at: string;
}

export interface UserSettings {
  id: string;
  user_id: string | null;
  work_duration: number;
  short_break_duration: number;
  long_break_duration: number;
  sessions_until_long_break: number;
  updated_at: string;
  created_at: string;
}
