import { supabase } from './supabase';

export async function getAllUsers() {
  const { data } = await supabase.from('users').select('*').order('name');
  return data ?? [];
}