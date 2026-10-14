import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { data: doc } = await supabase.from('documents').select('owner_id').eq('id', id).single();
  if (!doc || doc.owner_id !== user.id) return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  const { data: existing } = await supabase.from('shares').select('shared_with_user_id').eq('document_id', id);
  const already = new Set((existing ?? []).map((s) => s.shared_with_user_id));

  const { data: all } = await supabase.from('users').select('*');
  const candidates = (all ?? []).filter((u) => u.id !== user.id && !already.has(u.id));

  return NextResponse.json({ candidates });
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { data: doc } = await supabase.from('documents').select('owner_id').eq('id', id).single();
  if (!doc || doc.owner_id !== user.id) return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  const { userId } = await req.json();
  const { error } = await supabase.from('shares').insert({
    document_id: id,
    shared_with_user_id: userId,
    permission: 'edit',
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}