import { NextResponse } from 'next/server';
import { setCurrentUser } from '@/lib/auth';

export async function POST(req: Request) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'missing id' }, { status: 400 });
  await setCurrentUser(id);
  return NextResponse.json({ ok: true });
}