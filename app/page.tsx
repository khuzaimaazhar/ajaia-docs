import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import LogoutButton from './LogoutButton';
import CreateDocButton from './CreateDocButton';

/* export const dynamic = 'force-dynamic'; */

export default async function Home() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const { data: owned } = await supabase
    .from('documents')
    .select('*')
    .eq('owner_id', user.id)
    .order('updated_at', { ascending: false });

  const { data: sharedRows } = await supabase
    .from('shares')
    .select('document_id, documents(*)')
    .eq('shared_with_user_id', user.id);

  const shared = (sharedRows ?? []).map((r: any) => r.documents).filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Ajaia Docs</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user.name}</span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">My Documents</h2>
          <CreateDocButton />
        </div>
        <div className="space-y-2 mb-10">
          {owned?.length ? (
            owned.map((d) => (
              <Link
                key={d.id}
                href={`/doc/${d.id}`}
                className="block bg-white p-4 rounded border hover:border-blue-400"
              >
                <div className="font-medium">{d.title}</div>
                <div className="text-xs text-gray-500">
                  Updated {new Date(d.updated_at).toLocaleString()}
                </div>
              </Link>
            ))
          ) : (
            <p className="text-sm text-gray-500">No documents yet. Create one.</p>
          )}
        </div>

        <h2 className="text-lg font-semibold mb-4">Shared with me</h2>
        <div className="space-y-2">
          {shared.length ? (
            shared.map((d: any) => (
              <Link
                key={d.id}
                href={`/doc/${d.id}`}
                className="block bg-white p-4 rounded border hover:border-blue-400"
              >
                <div className="font-medium">{d.title}</div>
                <div className="text-xs text-gray-500">Shared document</div>
              </Link>
            ))
          ) : (
            <p className="text-sm text-gray-500">Nothing shared with you yet.</p>
          )}
        </div>
      </main>
    </div>
  );
}