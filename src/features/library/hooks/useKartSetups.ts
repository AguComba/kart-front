import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../../api/client';
import { KartSetup } from '../../../api/types';

const kartSetupsKey = ['kartSetups'];

export const useKartSetups = () => {
  return useQuery({
    queryKey: kartSetupsKey,
    queryFn: async () => {
      const { data } = await api.get<KartSetup[]>('/kart-setups');
      return data;
    },
  });
};

export const useCreateKartSetup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Omit<KartSetup, 'id'>) => {
      const { data } = await api.post<KartSetup>('/kart-setups', payload);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: kartSetupsKey }),
  });
};

export const useUpdateKartSetup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: KartSetup) => {
      const { data } = await api.put<KartSetup>(`/kart-setups/${payload.id}`, payload);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: kartSetupsKey }),
  });
};

export const useDeleteKartSetup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (kartSetupId: string) => {
      await api.delete(`/kart-setups/${kartSetupId}`);
      return kartSetupId;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: kartSetupsKey }),
  });
};
