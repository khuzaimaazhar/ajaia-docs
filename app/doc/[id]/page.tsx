import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import Editor from './Editor';

export default async function DocPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const { data: doc } = await supabase
    .from('documents')
    .select('*')
    .eq('id', id)
    .single();

  if (!doc) notFound();

  const isOwner = doc.owner_id === user.id;

  let canEdit = isOwner;
  if (!isOwner) {
    const { data: share } = await supabase
      .from('shares')
      .select('permission')
      .eq('document_id', id)
      .eq('shared_with_user_id', user.id)
      .single();
    canEdit = share?.permission === 'edit';
  }

  if (!isOwner && !canEdit) {
    return <div className="p-8">You don't have access to this document.</div>;
  }

  return (
    <Editor
      docId={doc.id}
      initialTitle={doc.title}
      initialContent={doc.content ?? ''}
      isOwner={isOwner}
      canEdit={canEdit}
      currentUserId={user.id}
    />
  );
}