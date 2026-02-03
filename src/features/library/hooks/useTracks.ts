import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../../api/client';
import { Track } from '../../../api/types';

const tracksKey = ['tracks'];

export const useTracks = () => {
  return useQuery({
    queryKey: tracksKey,
    queryFn: async () => {
      const { data } = await api.get<Track[]>('/tracks');
      return data;
    },
  });
};

export const useCreateTrack = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Omit<Track, 'id'>) => {
      const { data } = await api.post<Track>('/tracks', payload);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tracksKey }),
  });
};

export const useUpdateTrack = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Track) => {
      const { data } = await api.put<Track>(`/tracks/${payload.id}`, payload);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tracksKey }),
  });
};

export const useDeleteTrack = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (trackId: string) => {
      await api.delete(`/tracks/${trackId}`);
      return trackId;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tracksKey }),
  });
};
