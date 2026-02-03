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
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import GearRatioForm from '../../../components/GearRatioForm';
import SetupSelect from '../../../components/SetupSelect';
import TireSetSelect from '../../../components/TireSetSelect';
import { useToast } from '../../../components/ToastProvider';
import { useCreateKartSetup } from '../../library/hooks/useKartSetups';
import { useCreateTireSet } from '../../library/hooks/useTireSets';
import { useSessionDayDetail } from '../../sessionDays/hooks/useSessionDays';
import { useCreateStint, useUpdateStint } from '../hooks/useStints';
import { formatMs, parseTimeToMs } from '../../../utils/time';

const stintSchema = z.object({
  stintNumber: z.coerce.number().min(1, 'Número requerido'),
  gearRatio: z.object({
    crown: z.coerce.number().min(1, 'Corona requerida'),
    pinion: z.coerce.number().min(1, 'Piñón requerido'),
  }),
  tireSetId: z.string().optional(),
  kartSetupId: z.string().optional(),
  bestLap: z.string().optional(),
  notes: z.string().optional(),
});

type StintFormValues = z.infer<typeof stintSchema>;

const quickNameSchema = z.object({
  name: z.string().min(2, 'Nombre requerido'),
  description: z.string().optional(),
});

type QuickNameForm = z.infer<typeof quickNameSchema>;

const StintFormPage = () => {
  const { id, stintId } = useParams<{ id: string; stintId?: string }>();
  const { data: sessionDay } = useSessionDayDetail(id);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [tireModalOpen, setTireModalOpen] = useState(false);
  const [setupModalOpen, setSetupModalOpen] = useState(false);

  const { mutateAsync: createStint, isPending: isCreating } = useCreateStint(id);
  const { mutateAsync: updateStint, isPending: isUpdating } = useUpdateStint(id);
  const { mutateAsync: createTireSet } = useCreateTireSet();
  const { mutateAsync: createKartSetup } = useCreateKartSetup();

  const existingStint = useMemo(() => sessionDay?.stints.find((stint) => stint.id === stintId), [sessionDay, stintId]);

  const defaultValues = useMemo<StintFormValues>(
    () => ({
      stintNumber: existingStint?.stintNumber ?? (sessionDay?.stints.length ?? 0) + 1,
      gearRatio: {
        crown: existingStint?.gearRatio.crown ?? 82,
        pinion: existingStint?.gearRatio.pinion ?? 12,
      },
      tireSetId: existingStint?.tireSetId ?? '',
      kartSetupId: existingStint?.kartSetupId ?? '',
      bestLap: formatMs(existingStint?.bestLapMs),
      notes: existingStint?.notes ?? '',
    }),
    [existingStint, sessionDay]
  );

  const form = useForm<StintFormValues>({
    resolver: zodResolver(stintSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const quickTireForm = useForm<QuickNameForm>({
    resolver: zodResolver(quickNameSchema),
    defaultValues: { name: '', description: '' },
  });
  const quickSetupForm = useForm<QuickNameForm>({
    resolver: zodResolver(quickNameSchema),
    defaultValues: { name: '', description: '' },
  });

  const onSubmit = async (values: StintFormValues) => {
    const bestLapMs = values.bestLap ? parseTimeToMs(values.bestLap) : undefined;
    if (values.bestLap && bestLapMs === undefined) {
      showToast({ message: 'Formato de tiempo inválido (mm:ss.mmm)', severity: 'warning' });
      return;
    }

    const payload = {
      ...values,
      bestLapMs,
      tireSetId: values.tireSetId || undefined,
      kartSetupId: values.kartSetupId || undefined,
    };

    try {
      if (existingStint) {
        await updateStint({ ...payload, id: existingStint.id });
        showToast({ message: 'Tanda actualizada', severity: 'success' });
      } else {
        await createStint(payload);
        showToast({ message: 'Tanda creada', severity: 'success' });
      }
      navigate(`/session-days/${id}`);
    } catch (error) {
      showToast({ message: 'No se pudo guardar la tanda.', severity: 'error' });
    }
  };

  const handleCreateTireSet = async (values: QuickNameForm) => {
    try {
      const created = await createTireSet({
        name: values.name,
        notes: values.description,
      });
      showToast({ message: 'Juego de gomas creado', severity: 'success' });
      setTireModalOpen(false);
      quickTireForm.reset({ name: '', description: '' });
      form.setValue('tireSetId', created.id);
    } catch (error) {
      showToast({ message: 'No se pudo crear el juego de gomas.', severity: 'error' });
    }
  };

  const handleCreateSetup = async (values: QuickNameForm) => {
    try {
      const created = await createKartSetup({
        name: values.name,
        description: values.description,
      });
      showToast({ message: 'Setup creado', severity: 'success' });
      setSetupModalOpen(false);
      quickSetupForm.reset({ name: '', description: '' });
      form.setValue('kartSetupId', created.id);
    } catch (error) {
      showToast({ message: 'No se pudo crear el setup.', severity: 'error' });
    }
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h5">{existingStint ? 'Editar tanda' : 'Nueva tanda'}</Typography>
      <Box component="form" onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Número de tanda"
              type="number"
              {...form.register('stintNumber', { valueAsNumber: true })}
              error={Boolean(form.formState.errors.stintNumber)}
              helperText={form.formState.errors.stintNumber?.message}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <GearRatioForm control={form.control} name="gearRatio" />
          </Grid>
          <Grid item xs={12} md={6}>
            <TireSetSelect control={form.control} name="tireSetId" onCreate={() => setTireModalOpen(true)} />
          </Grid>
          <Grid item xs={12} md={6}>
            <SetupSelect control={form.control} name="kartSetupId" onCreate={() => setSetupModalOpen(true)} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Best lap (mm:ss.mmm)"
              placeholder="01:03.456"
              {...form.register('bestLap')}
              error={Boolean(form.formState.errors.bestLap)}
              helperText={form.formState.errors.bestLap?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Notas"
              multiline
              minRows={3}
              {...form.register('notes')}
              error={Boolean(form.formState.errors.notes)}
              helperText={form.formState.errors.notes?.message}
            />
          </Grid>
        </Grid>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3 }}>
          <Button variant="contained" type="submit" disabled={isCreating || isUpdating}>
            Guardar
          </Button>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Cancelar
          </Button>
        </Stack>
      </Box>

      <Dialog open={tireModalOpen} onClose={() => setTireModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Crear juego de gomas</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Nombre"
              fullWidth
              {...quickTireForm.register('name')}
              error={Boolean(quickTireForm.formState.errors.name)}
              helperText={quickTireForm.formState.errors.name?.message}
            />
            <TextField label="Notas" fullWidth {...quickTireForm.register('description')} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTireModalOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={quickTireForm.handleSubmit(handleCreateTireSet)}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={setupModalOpen} onClose={() => setSetupModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Crear setup</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Nombre"
              fullWidth
              {...quickSetupForm.register('name')}
              error={Boolean(quickSetupForm.formState.errors.name)}
              helperText={quickSetupForm.formState.errors.name?.message}
            />
            <TextField label="Descripción" fullWidth {...quickSetupForm.register('description')} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSetupModalOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={quickSetupForm.handleSubmit(handleCreateSetup)}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default StintFormPage;
