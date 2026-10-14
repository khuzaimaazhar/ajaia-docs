import { cookies } from 'next/headers';
import { supabase } from './supabase';

const COOKIE = 'ajaia_user_id';

export async function getCurrentUser() {
  const c = await cookies();
  const id = c.get(COOKIE)?.value;
  if (!id) return null;
  const { data } = await supabase.from('users').select('*').eq('id', id).single();
  return data;
}

export async function setCurrentUser(id: string) {
  const c = await cookies();
  c.set(COOKIE, id, { path: '/', httpOnly: true, maxAge: 60 * 60 * 24 * 7 });
}

export async function clearCurrentUser() {
  const c = await cookies();
  c.delete(COOKIE);
}