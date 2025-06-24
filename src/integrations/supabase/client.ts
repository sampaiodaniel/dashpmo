import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Usar variáveis de ambiente se disponíveis, senão usar valores padrão
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://dzgxpcealclptocyjmjd.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6Z3hwY2VhbGNscHRvY3lqbWpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5NDY0OTcsImV4cCI6MjA2NTUyMjQ5N30.m0-AKPsYR02w89_2riAxYr1-jt2ZraTu8nIVAKWVC8s";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
});

// Log das configurações (apenas em desenvolvimento)
if (import.meta.env.DEV) {
  console.log('🔧 Supabase URL:', SUPABASE_URL);
  console.log('🔑 Usando variáveis de ambiente:', !!import.meta.env.VITE_SUPABASE_URL);
}
