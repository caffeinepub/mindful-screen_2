import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetAllNotes } from '../hooks/useNotes';
import NotesList from '../features/notes/NotesList';
import NoteEditor from '../features/notes/NoteEditor';
import AuthGate from '../components/auth/AuthGate';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import type { Note } from '../backend';

export default function NotesPage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { notes, isLoading } = useGetAllNotes();
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateNew = () => {
    setSelectedNote(null);
    setIsCreating(true);
  };

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
    setIsCreating(false);
  };

  const handleCloseEditor = () => {
    setSelectedNote(null);
    setIsCreating(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Notes</h2>
          <p className="text-muted-foreground">Store your thoughts and daily activities</p>
        </div>
        <AuthGate feature="notes" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Notes</h2>
          <p className="text-muted-foreground">Store your thoughts and daily activities</p>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className="mr-2 h-4 w-4" />
          New Note
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[350px_1fr]">
        <NotesList
          notes={notes || []}
          isLoading={isLoading}
          selectedNote={selectedNote}
          onSelectNote={handleSelectNote}
        />
        <NoteEditor
          note={selectedNote}
          isCreating={isCreating}
          onClose={handleCloseEditor}
        />
      </div>
    </div>
  );
}
