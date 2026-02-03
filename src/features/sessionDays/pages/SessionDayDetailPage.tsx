import { Box, Button, Card, CardContent, Divider, Grid, Stack, Typography } from '@mui/material';
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useToast } from '../../../components/ToastProvider';
import { formatMs } from '../../../utils/time';
import { useSessionDayDetail } from '../hooks/useSessionDays';
import { useDuplicateLastStint } from '../../stints/hooks/useStints';

const SessionDayDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useSessionDayDetail(id);
  const { mutateAsync: duplicateLast, isPending } = useDuplicateLastStint(id);
  const { showToast } = useToast();

  useEffect(() => {
    if (isError) {
      showToast({ message: 'No se pudo cargar el detalle.', severity: 'error' });
    }
  }, [isError, showToast]);

  const handleDuplicate = async () => {
    try {
      await duplicateLast();
      showToast({ message: 'Última tanda duplicada', severity: 'success' });
    } catch (error) {
      showToast({ message: 'No se pudo duplicar la tanda.', severity: 'error' });
    }
  };

  if (isLoading) {
    return <Typography color="text.secondary">Cargando detalle...</Typography>;
  }

  if (!data) {
    return <Typography color="text.secondary">No se encontró el SessionDay.</Typography>;
  }

  return (
    <Stack spacing={3}>
      <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
        <Box>
          <Typography variant="h5">{data.trackName}</Typography>
          <Typography color="text.secondary">{data.date}</Typography>
          <Typography variant="body2">
            Estado: {data.trackState ?? 'Sin datos'} | Grip: {data.grip ?? 'N/A'}
          </Typography>
        </Box>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Button variant="outlined" onClick={handleDuplicate} disabled={isPending}>
            Duplicar última tanda
          </Button>
          <Button variant="contained" component={Link} to={`/session-days/${data.id}/stints/new`}>
            Nueva tanda
          </Button>
        </Stack>
      </Box>
      <Divider />
      <Grid container spacing={2}>
        {data.stints.map((stint) => (
          <Grid item xs={12} md={6} key={stint.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">Tanda #{stint.stintNumber}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Relación: {stint.gearRatio.crown}/{stint.gearRatio.pinion}
                </Typography>
                <Typography variant="body2">Gomas: {stint.tireSetName ?? 'Sin datos'}</Typography>
                <Typography variant="body2">Setup: {stint.kartSetupName ?? 'Sin datos'}</Typography>
                <Typography variant="body2">Best lap: {formatMs(stint.bestLapMs) || 'N/A'}</Typography>
                {stint.notes && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {stint.notes}
                  </Typography>
                )}
                <Button
                  size="small"
                  component={Link}
                  to={`/session-days/${data.id}/stints/${stint.id}/edit`}
                  sx={{ mt: 2 }}
                >
                  Editar
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
        {data.stints.length === 0 && (
          <Grid item xs={12}>
            <Typography color="text.secondary">Aún no hay tandas registradas.</Typography>
          </Grid>
        )}
      </Grid>
    </Stack>
  );
};

export default SessionDayDetailPage;
