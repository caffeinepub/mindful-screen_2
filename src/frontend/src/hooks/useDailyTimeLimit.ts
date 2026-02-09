import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useDailyTimeLimit() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<number | null>({
    queryKey: ['dailyTimeLimit'],
    queryFn: async () => {
      if (!actor) return null;
      const limit = await actor.getDailyTimeLimit();
      return limit !== null ? Number(limit) : null;
    },
    enabled: !!actor && !actorFetching,
  });

  return {
    dailyLimitMinutes: query.data,
    isLoading: query.isLoading,
  };
}

export function useSetDailyTimeLimit() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (minutes: number) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setDailyTimeLimit(BigInt(minutes));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyTimeLimit'] });
    },
  });
}
