import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import DeleteNoteConfirmDialog from './DeleteNoteConfirmDialog';
import { Trash2, FileText } from 'lucide-react';
import type { Note } from '../../backend';

interface NotesListProps {
  notes: Note[];
  isLoading: boolean;
  selectedNote: Note | null;
  onSelectNote: (note: Note) => void;
}

export default function NotesList({ notes, isLoading, selectedNote, onSelectNote }: NotesListProps) {
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp));
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getPreview = (note: Note) => {
    return note.title || note.content.slice(0, 50) || 'Untitled note';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="h-[calc(100vh-16rem)]">
        <CardHeader>
          <CardTitle>Your Notes ({notes.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-20rem)]">
            {notes.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <FileText className="mb-3 h-12 w-12 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">No notes yet. Create your first note!</p>
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {notes.map((note) => (
                  <div
                    key={note.id.toString()}
                    className={`group flex items-start gap-2 rounded-lg border p-3 transition-colors hover:bg-accent ${
                      selectedNote?.id === note.id ? 'border-primary bg-accent' : 'border-transparent'
                    }`}
                  >
                    <button
                      onClick={() => onSelectNote(note)}
                      className="flex-1 text-left"
                    >
                      <p className="line-clamp-2 text-sm font-medium">{getPreview(note)}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{formatDate(note.timestamp)}</p>
                    </button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={() => setNoteToDelete(note)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {noteToDelete && (
        <DeleteNoteConfirmDialog
          note={noteToDelete}
          onClose={() => setNoteToDelete(null)}
        />
      )}
    </>
  );
}
