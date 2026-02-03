import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../../api/client';
import { SessionDay, SessionDayDetail } from '../../../api/types';

const sessionDaysKey = ['sessionDays'];

export const useSessionDays = () => {
  return useQuery({
    queryKey: sessionDaysKey,
    queryFn: async () => {
      const { data } = await api.get<SessionDay[]>('/session-days');
      return data;
    },
  });
};

export const useSessionDayDetail = (id?: string) => {
  return useQuery({
    queryKey: ['sessionDay', id],
    queryFn: async () => {
      const { data } = await api.get<SessionDayDetail>(`/session-days/${id}`);
      return data;
    },
    enabled: Boolean(id),
  });
};

export const useCreateSessionDay = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Omit<SessionDay, 'id' | 'trackName' | 'stintsCount'>) => {
      const { data } = await api.post<SessionDay>('/session-days', payload);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: sessionDaysKey }),
  });
};
