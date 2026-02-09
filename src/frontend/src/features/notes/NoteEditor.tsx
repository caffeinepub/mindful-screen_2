import { useState, useEffect } from 'react';
import { useCreateNote, useUpdateNote } from '../../hooks/useNotes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Save, X } from 'lucide-react';
import { toast } from 'sonner';
import type { Note } from '../../backend';

interface NoteEditorProps {
  note: Note | null;
  isCreating: boolean;
  onClose: () => void;
}

export default function NoteEditor({ note, isCreating, onClose }: NoteEditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { mutate: createNote, isPending: isCreating_ } = useCreateNote();
  const { mutate: updateNote, isPending: isUpdating } = useUpdateNote();

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    } else if (isCreating) {
      setTitle('');
      setContent('');
    }
  }, [note, isCreating]);

  const handleSave = () => {
    if (!title.trim() && !content.trim()) {
      toast.error('Please add a title or content');
      return;
    }

    if (note) {
      updateNote(
        { noteId: note.id, title: title.trim(), content: content.trim() },
        {
          onSuccess: () => {
            toast.success('Note updated');
            onClose();
          },
          onError: () => {
            toast.error('Failed to update note');
          },
        }
      );
    } else {
      createNote(
        { title: title.trim(), content: content.trim() },
        {
          onSuccess: () => {
            toast.success('Note created');
            onClose();
          },
          onError: () => {
            toast.error('Failed to create note');
          },
        }
      );
    }
  };

  const isPending = isCreating_ || isUpdating;

  if (!note && !isCreating) {
    return (
      <Card className="h-[calc(100vh-16rem)]">
        <CardContent className="flex h-full items-center justify-center">
          <p className="text-sm text-muted-foreground">Select a note to view or create a new one</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[calc(100vh-16rem)]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{note ? 'Edit Note' : 'New Note'}</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onClose} disabled={isPending}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isPending}>
              <Save className="mr-2 h-4 w-4" />
              {isPending ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            placeholder="Note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isPending}
          />
        </div>
        <div className="space-y-2">
          <Textarea
            placeholder="Write your thoughts..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isPending}
            className="min-h-[400px] resize-none"
          />
        </div>
      </CardContent>
    </Card>
  );
}
