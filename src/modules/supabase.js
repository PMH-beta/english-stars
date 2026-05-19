// src/modules/supabase.js
// Supabase Client - zentrale Verbindung zur Datenbank/Auth
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('[supabase] Fehlende Umgebungs-Variablen — siehe .env.example');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Quick-Check ob Verbindung steht
export async function testConnection() {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error('[supabase] Verbindungsfehler:', error.message);
    return false;
  }
  console.log('[supabase] Verbunden ✓ Session:', data.session ? 'aktiv' : 'keine');
  return true;
}