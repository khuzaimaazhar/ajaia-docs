'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type User = { id: string; name: string; email: string };

export default function LoginPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    supabase.from('users').select('*').order('name').then(({ data }) => {
      setUsers(data ?? []);
      setLoading(false);
    });
  }, []);

  async function login(id: string) {
    await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ id }),
    });
    router.push('/');
    router.refresh();
  }

  if (loading) return <div className="p-8">Loading…</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow max-w-md w-full">
        <h1 className="text-2xl font-bold mb-2">Ajaia Docs</h1>
        <p className="text-gray-500 mb-6 text-sm">Choose a user to continue (mock auth for demo)</p>
        <div className="space-y-3">
          {users.map((u) => (
            <button
              key={u.id}
              onClick={() => login(u.id)}
              className="w-full text-left px-4 py-3 border rounded hover:bg-gray-100"
            >
              <div className="font-medium">{u.name}</div>
              <div className="text-xs text-gray-500">{u.email}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}