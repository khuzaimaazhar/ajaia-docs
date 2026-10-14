'use client';

import { useEffect, useState } from 'react';

type User = { id: string; name: string; email: string };

export default function ShareModal({
  docId,
  currentUserId,
  onClose,
}: {
  docId: string;
  currentUserId: string;
  onClose: () => void;
}) {
  const [users, setUsers] = useState<User[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`/api/docs/${docId}/shares`)
      .then((r) => r.json())
      .then((d) => setUsers(d.candidates ?? []));
  }, [docId]);

  async function share(userId: string) {
    setBusy(userId);
    const res = await fetch(`/api/docs/${docId}/shares`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
    const data = await res.json();
    setBusy(null);
    if (data.ok) {
      setMessage('Shared!');
      setUsers((u) => u.filter((x) => x.id !== userId));
    } else {
      setMessage(data.error ?? 'Failed');
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-semibold mb-3">Share document</h2>
        {message && <p className="text-sm text-blue-600 mb-3">{message}</p>}
        <p className="text-sm text-gray-600 mb-3">Pick a user to share with (edit access):</p>
        <div className="space-y-2 mb-4">
          {users.length === 0 && <p className="text-sm text-gray-500">No other users available.</p>}
          {users.map((u) => (
            <button
              key={u.id}
              disabled={busy === u.id}
              onClick={() => share(u.id)}
              className="w-full text-left px-3 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
            >
              <div className="font-medium text-sm">{u.name}</div>
              <div className="text-xs text-gray-500">{u.email}</div>
            </button>
          ))}
        </div>
        <button onClick={onClose} className="text-sm border px-3 py-1 rounded w-full">Close</button>
      </div>
    </div>
  );
}