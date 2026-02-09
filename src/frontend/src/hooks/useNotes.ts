import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Note } from '../backend';

export function useGetAllNotes() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<Note[]>({
    queryKey: ['notes'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllNotesSortedByTimestamp();
    },
    enabled: !!actor && !actorFetching,
  });

  return {
    notes: query.data,
    isLoading: query.isLoading,
  };
}

export function useCreateNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, content }: { title: string; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      const timestamp = BigInt(Date.now());
      return actor.createNote(title, content, timestamp);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
}

export function useUpdateNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ noteId, title, content }: { noteId: bigint; title: string; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateNote(noteId, title, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
}

export function useDeleteNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (noteId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteNote(noteId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
}
