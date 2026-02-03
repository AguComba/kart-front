import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from '../../../components/ToastProvider';
import { KartSetup, TireSet, Track } from '../../../api/types';
import { useCreateKartSetup, useDeleteKartSetup, useKartSetups, useUpdateKartSetup } from '../hooks/useKartSetups';
import { useCreateTireSet, useDeleteTireSet, useTireSets, useUpdateTireSet } from '../hooks/useTireSets';
import { useCreateTrack, useDeleteTrack, useTracks, useUpdateTrack } from '../hooks/useTracks';

const LibraryPage = () => {
  const { showToast } = useToast();
  const tracksQuery = useTracks();
  const tireSetsQuery = useTireSets();
  const setupsQuery = useKartSetups();

  const trackForm = useForm<{ name: string; location?: string }>({
    defaultValues: { name: '', location: '' },
  });
  const tireForm = useForm<{ name: string; compound?: string; notes?: string }>({
    defaultValues: { name: '', compound: '', notes: '' },
  });
  const setupForm = useForm<{ name: string; description?: string }>({
    defaultValues: { name: '', description: '' },
  });

  const { mutateAsync: createTrack } = useCreateTrack();
  const { mutateAsync: updateTrack } = useUpdateTrack();
  const { mutateAsync: deleteTrack } = useDeleteTrack();

  const { mutateAsync: createTireSet } = useCreateTireSet();
  const { mutateAsync: updateTireSet } = useUpdateTireSet();
  const { mutateAsync: deleteTireSet } = useDeleteTireSet();

  const { mutateAsync: createKartSetup } = useCreateKartSetup();
  const { mutateAsync: updateKartSetup } = useUpdateKartSetup();
  const { mutateAsync: deleteKartSetup } = useDeleteKartSetup();

  const [editingTrack, setEditingTrack] = useState<Track | null>(null);
  const [editingTire, setEditingTire] = useState<TireSet | null>(null);
  const [editingSetup, setEditingSetup] = useState<KartSetup | null>(null);

  const handleCreateTrack = async (values: { name: string; location?: string }) => {
    try {
      await createTrack(values);
      showToast({ message: 'Circuito creado', severity: 'success' });
      trackForm.reset();
    } catch (error) {
      showToast({ message: 'No se pudo crear el circuito.', severity: 'error' });
    }
  };

  const handleCreateTire = async (values: { name: string; compound?: string; notes?: string }) => {
    try {
      await createTireSet(values);
      showToast({ message: 'Juego de gomas creado', severity: 'success' });
      tireForm.reset();
    } catch (error) {
      showToast({ message: 'No se pudo crear el juego de gomas.', severity: 'error' });
    }
  };

  const handleCreateSetup = async (values: { name: string; description?: string }) => {
    try {
      await createKartSetup(values);
      showToast({ message: 'Setup creado', severity: 'success' });
      setupForm.reset();
    } catch (error) {
      showToast({ message: 'No se pudo crear el setup.', severity: 'error' });
    }
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h5">Biblioteca</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Circuitos</Typography>
              <Stack spacing={2} sx={{ mt: 2 }}>
                <Box component="form" onSubmit={trackForm.handleSubmit(handleCreateTrack)}>
                  <Stack spacing={2}>
                    <TextField label="Nombre" fullWidth {...trackForm.register('name', { required: true })} />
                    <TextField label="Ubicación" fullWidth {...trackForm.register('location')} />
                    <Button variant="contained" type="submit">
                      Agregar
                    </Button>
                  </Stack>
                </Box>
                <Stack spacing={1}>
                  {tracksQuery.data?.map((track) => (
                    <Card key={track.id} variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1">{track.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {track.location ?? 'Sin ubicación'}
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                          <Button size="small" onClick={() => setEditingTrack(track)}>
                            Editar
                          </Button>
                          <Button size="small" color="error" onClick={() => deleteTrack(track.id)}>
                            Eliminar
                          </Button>
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Juegos de gomas</Typography>
              <Stack spacing={2} sx={{ mt: 2 }}>
                <Box component="form" onSubmit={tireForm.handleSubmit(handleCreateTire)}>
                  <Stack spacing={2}>
                    <TextField label="Nombre" fullWidth {...tireForm.register('name', { required: true })} />
                    <TextField label="Compuesto" fullWidth {...tireForm.register('compound')} />
                    <TextField label="Notas" fullWidth {...tireForm.register('notes')} />
                    <Button variant="contained" type="submit">
                      Agregar
                    </Button>
                  </Stack>
                </Box>
                <Stack spacing={1}>
                  {tireSetsQuery.data?.map((tire) => (
                    <Card key={tire.id} variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1">{tire.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {tire.compound ?? 'Sin compuesto'}
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                          <Button size="small" onClick={() => setEditingTire(tire)}>
                            Editar
                          </Button>
                          <Button size="small" color="error" onClick={() => deleteTireSet(tire.id)}>
                            Eliminar
                          </Button>
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Setups</Typography>
              <Stack spacing={2} sx={{ mt: 2 }}>
                <Box component="form" onSubmit={setupForm.handleSubmit(handleCreateSetup)}>
                  <Stack spacing={2}>
                    <TextField label="Nombre" fullWidth {...setupForm.register('name', { required: true })} />
                    <TextField label="Descripción" fullWidth {...setupForm.register('description')} />
                    <Button variant="contained" type="submit">
                      Agregar
                    </Button>
                  </Stack>
                </Box>
                <Stack spacing={1}>
                  {setupsQuery.data?.map((setup) => (
                    <Card key={setup.id} variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1">{setup.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {setup.description ?? 'Sin descripción'}
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                          <Button size="small" onClick={() => setEditingSetup(setup)}>
                            Editar
                          </Button>
                          <Button size="small" color="error" onClick={() => deleteKartSetup(setup.id)}>
                            Eliminar
                          </Button>
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={Boolean(editingTrack)} onClose={() => setEditingTrack(null)} fullWidth maxWidth="sm">
        <DialogTitle>Editar circuito</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Nombre"
              fullWidth
              value={editingTrack?.name ?? ''}
              onChange={(event) => setEditingTrack((prev) => (prev ? { ...prev, name: event.target.value } : prev))}
            />
            <TextField
              label="Ubicación"
              fullWidth
              value={editingTrack?.location ?? ''}
              onChange={(event) => setEditingTrack((prev) => (prev ? { ...prev, location: event.target.value } : prev))}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingTrack(null)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={async () => {
              if (!editingTrack) return;
              await updateTrack(editingTrack);
              showToast({ message: 'Circuito actualizado', severity: 'success' });
              setEditingTrack(null);
            }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(editingTire)} onClose={() => setEditingTire(null)} fullWidth maxWidth="sm">
        <DialogTitle>Editar juego de gomas</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Nombre"
              fullWidth
              value={editingTire?.name ?? ''}
              onChange={(event) => setEditingTire((prev) => (prev ? { ...prev, name: event.target.value } : prev))}
            />
            <TextField
              label="Compuesto"
              fullWidth
              value={editingTire?.compound ?? ''}
              onChange={(event) => setEditingTire((prev) => (prev ? { ...prev, compound: event.target.value } : prev))}
            />
            <TextField
              label="Notas"
              fullWidth
              value={editingTire?.notes ?? ''}
              onChange={(event) => setEditingTire((prev) => (prev ? { ...prev, notes: event.target.value } : prev))}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingTire(null)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={async () => {
              if (!editingTire) return;
              await updateTireSet(editingTire);
              showToast({ message: 'Juego de gomas actualizado', severity: 'success' });
              setEditingTire(null);
            }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(editingSetup)} onClose={() => setEditingSetup(null)} fullWidth maxWidth="sm">
        <DialogTitle>Editar setup</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Nombre"
              fullWidth
              value={editingSetup?.name ?? ''}
              onChange={(event) => setEditingSetup((prev) => (prev ? { ...prev, name: event.target.value } : prev))}
            />
            <TextField
              label="Descripción"
              fullWidth
              value={editingSetup?.description ?? ''}
              onChange={(event) => setEditingSetup((prev) => (prev ? { ...prev, description: event.target.value } : prev))}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingSetup(null)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={async () => {
              if (!editingSetup) return;
              await updateKartSetup(editingSetup);
              showToast({ message: 'Setup actualizado', severity: 'success' });
              setEditingSetup(null);
            }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default LibraryPage;
