import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../api/client';
import { Stint } from '../../../api/types';

export const useCreateStint = (sessionDayId?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Omit<Stint, 'id'>) => {
      const { data } = await api.post<Stint>(`/session-days/${sessionDayId}/stints`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessionDay', sessionDayId] });
    },
  });
};

export const useUpdateStint = (sessionDayId?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Stint) => {
      const { data } = await api.put<Stint>(`/session-days/${sessionDayId}/stints/${payload.id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessionDay', sessionDayId] });
    },
  });
};

export const useDuplicateLastStint = (sessionDayId?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post<Stint>(`/session-days/${sessionDayId}/stints/duplicate-last`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessionDay', sessionDayId] });
    },
  });
};
