import { useDeleteNote } from '../../hooks/useNotes';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import type { Note } from '../../backend';

interface DeleteNoteConfirmDialogProps {
  note: Note;
  onClose: () => void;
}

export default function DeleteNoteConfirmDialog({ note, onClose }: DeleteNoteConfirmDialogProps) {
  const { mutate: deleteNote, isPending } = useDeleteNote();

  const handleDelete = () => {
    deleteNote(note.id, {
      onSuccess: () => {
        toast.success('Note deleted');
        onClose();
      },
      onError: () => {
        toast.error('Failed to delete note');
      },
    });
  };

  return (
    <AlertDialog open={true} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Note</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this note? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isPending}>
            {isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
