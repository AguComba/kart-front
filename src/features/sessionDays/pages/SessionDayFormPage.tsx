import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import TrackSelect from '../../../components/TrackSelect';
import { useToast } from '../../../components/ToastProvider';
import { useCreateSessionDay } from '../hooks/useSessionDays';
import { useCreateTrack } from '../../library/hooks/useTracks';

const sessionDaySchema = z.object({
  trackId: z.string().min(1, 'Selecciona un circuito'),
  date: z.string().min(1, 'Selecciona una fecha'),
  trackState: z.string().optional(),
  grip: z.string().optional(),
  ambientTemp: z.coerce.number().optional(),
  trackTemp: z.coerce.number().optional(),
  notes: z.string().optional(),
});

type SessionDayFormValues = z.infer<typeof sessionDaySchema>;

const trackSchema = z.object({
  name: z.string().min(2, 'Nombre requerido'),
  location: z.string().optional(),
});

type TrackFormValues = z.infer<typeof trackSchema>;

const SessionDayFormPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [trackModalOpen, setTrackModalOpen] = useState(false);

  const { mutateAsync: createSessionDay, isPending } = useCreateSessionDay();
  const { mutateAsync: createTrack } = useCreateTrack();

  const defaultValues = useMemo<SessionDayFormValues>(
    () => ({
      trackId: '',
      date: new Date().toISOString().slice(0, 10),
      trackState: '',
      grip: '',
      ambientTemp: undefined,
      trackTemp: undefined,
      notes: '',
    }),
    []
  );

  const { control, register, handleSubmit, formState, reset } = useForm<SessionDayFormValues>({
    resolver: zodResolver(sessionDaySchema),
    defaultValues,
  });

  const trackForm = useForm<TrackFormValues>({
    resolver: zodResolver(trackSchema),
    defaultValues: { name: '', location: '' },
  });

  const onSubmit = async (values: SessionDayFormValues) => {
    try {
      const created = await createSessionDay(values);
      showToast({ message: 'SessionDay creado', severity: 'success' });
      reset(defaultValues);
      navigate(`/session-days/${created.id}`);
    } catch (error) {
      showToast({ message: 'No se pudo guardar el SessionDay.', severity: 'error' });
    }
  };

  const onCreateTrack = async (values: TrackFormValues) => {
    try {
      const created = await createTrack(values);
      showToast({ message: 'Circuito creado', severity: 'success' });
      trackForm.reset({ name: '', location: '' });
      setTrackModalOpen(false);
      reset({ ...defaultValues, trackId: created.id });
    } catch (error) {
      showToast({ message: 'No se pudo crear el circuito.', severity: 'error' });
    }
  };

  useEffect(() => {
    if (!trackModalOpen) {
      trackForm.reset({ name: '', location: '' });
    }
  }, [trackModalOpen, trackForm]);

  return (
    <Stack spacing={3}>
      <Typography variant="h5">Crear SessionDay</Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TrackSelect control={control} name="trackId" onCreateTrack={() => setTrackModalOpen(true)} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              type="date"
              fullWidth
              label="Fecha"
              InputLabelProps={{ shrink: true }}
              {...register('date')}
              error={Boolean(formState.errors.date)}
              helperText={formState.errors.date?.message}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Estado de pista"
              {...register('trackState')}
              error={Boolean(formState.errors.trackState)}
              helperText={formState.errors.trackState?.message}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Grip"
              {...register('grip')}
              error={Boolean(formState.errors.grip)}
              helperText={formState.errors.grip?.message}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Temp. ambiente"
              type="number"
              {...register('ambientTemp', { valueAsNumber: true })}
              error={Boolean(formState.errors.ambientTemp)}
              helperText={formState.errors.ambientTemp?.message}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Temp. pista"
              type="number"
              {...register('trackTemp', { valueAsNumber: true })}
              error={Boolean(formState.errors.trackTemp)}
              helperText={formState.errors.trackTemp?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Notas"
              multiline
              minRows={3}
              {...register('notes')}
              error={Boolean(formState.errors.notes)}
              helperText={formState.errors.notes?.message}
            />
          </Grid>
        </Grid>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3 }}>
          <Button variant="contained" type="submit" disabled={isPending}>
            Guardar
          </Button>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Cancelar
          </Button>
        </Stack>
      </Box>

      <Dialog open={trackModalOpen} onClose={() => setTrackModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Crear circuito</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Nombre"
              fullWidth
              {...trackForm.register('name')}
              error={Boolean(trackForm.formState.errors.name)}
              helperText={trackForm.formState.errors.name?.message}
            />
            <TextField
              label="Ubicación"
              fullWidth
              {...trackForm.register('location')}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTrackModalOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={trackForm.handleSubmit(onCreateTrack)}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default SessionDayFormPage;
