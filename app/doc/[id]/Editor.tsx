'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import ShareModal from './ShareModal';

type Props = {
  docId: string;
  initialTitle: string;
  initialContent: string;
  isOwner: boolean;
  canEdit: boolean;
  currentUserId: string;
};

export default function Editor({
  docId,
  initialTitle,
  initialContent,
  isOwner,
  canEdit,
  currentUserId,
}: Props) {
  const [title, setTitle] = useState(initialTitle);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [shareOpen, setShareOpen] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: initialContent || '<p></p>',
    editable: canEdit,
    immediatelyRender: false,
  });

  async function saveNow() {
    if (!editor) return;
    setSaving(true);
    await fetch('/api/docs/' + docId, {
      method: 'PATCH',
      body: JSON.stringify({ title, content: editor.getHTML() }),
    });
    setSaving(false);
    setSavedAt(new Date().toLocaleTimeString());
  }

  useEffect(() => {
    if (!editor || !canEdit) return;
    const t = setTimeout(() => { saveNow(); }, 2000);
    return () => clearTimeout(t);
  }, [title, editor?.getHTML()]);

  if (!editor) return <div className="p-8">Loading editor…</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center gap-3">
          <Link href="/" className="text-sm text-gray-600 hover:text-black">← Back</Link>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={!canEdit}
            className="flex-1 text-lg font-medium border-none outline-none bg-transparent"
          />
          <span className="text-xs text-gray-500">
            {saving ? 'Saving…' : savedAt ? `Saved ${savedAt}` : ''}
          </span>
          {canEdit && (
            <button onClick={saveNow} className="text-sm bg-blue-600 text-white px-3 py-1 rounded">Save</button>
          )}
          {isOwner && (
            <button onClick={() => setShareOpen(true)} className="text-sm border px-3 py-1 rounded">Share</button>
          )}
        </div>

        {canEdit && (
          <div className="max-w-4xl mx-auto px-6 pb-2 flex gap-1 flex-wrap">
            <ToolBtn active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><b>B</b></ToolBtn>
            <ToolBtn active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><i>I</i></ToolBtn>
            <ToolBtn active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}><u>U</u></ToolBtn>
            <ToolBtn active={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</ToolBtn>
            <ToolBtn active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</ToolBtn>
            <ToolBtn active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>•</ToolBtn>
            <ToolBtn active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>1.</ToolBtn>
          </div>
        )}
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded border p-8 min-h-[60vh]">
          <EditorContent editor={editor} className="prose max-w-none" />
        </div>
      </main>

      {shareOpen && (
        <ShareModal docId={docId} currentUserId={currentUserId} onClose={() => setShareOpen(false)} />
      )}
    </div>
  );
}

function ToolBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} className={`px-3 py-1 rounded border text-sm ${active ? 'bg-blue-100 border-blue-400' : 'bg-white hover:bg-gray-50'}`}>
      {children}
    </button>
  );
}