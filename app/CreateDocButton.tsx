'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CreateDocButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function create() {
    setBusy(true);
    const res = await fetch('/api/docs', { method: 'POST' });
    const data = await res.json();
    if (data.id) router.push(`/doc/${data.id}`);
    else setBusy(false);
  }

  return (
    <button
      onClick={create}
      disabled={busy}
      className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
    >
      {busy ? 'Creating…' : '+ New Document'}
    </button>
  );
}