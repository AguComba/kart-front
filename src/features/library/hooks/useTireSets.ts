import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../../api/client';
import { TireSet } from '../../../api/types';

const tireSetsKey = ['tireSets'];

export const useTireSets = () => {
  return useQuery({
    queryKey: tireSetsKey,
    queryFn: async () => {
      const { data } = await api.get<TireSet[]>('/tire-sets');
      return data;
    },
  });
};

export const useCreateTireSet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Omit<TireSet, 'id'>) => {
      const { data } = await api.post<TireSet>('/tire-sets', payload);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tireSetsKey }),
  });
};

export const useUpdateTireSet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: TireSet) => {
      const { data } = await api.put<TireSet>(`/tire-sets/${payload.id}`, payload);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tireSetsKey }),
  });
};

export const useDeleteTireSet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (tireSetId: string) => {
      await api.delete(`/tire-sets/${tireSetId}`);
      return tireSetId;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tireSetsKey }),
  });
};
