import { Box, Button, Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useSessionDays } from '../hooks/useSessionDays';
import { useToast } from '../../../components/ToastProvider';
import { useEffect } from 'react';

const DashboardPage = () => {
  const { data = [], isLoading, isError } = useSessionDays();
  const { showToast } = useToast();

  useEffect(() => {
    if (isError) {
      showToast({ message: 'No se pudieron cargar los SessionDays.', severity: 'error' });
    }
  }, [isError, showToast]);

  return (
    <Stack spacing={3}>
      <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
        <Typography variant="h5">SessionDays</Typography>
        <Button variant="contained" component={Link} to="/session-days/new">
          Nuevo día
        </Button>
      </Box>
      {isLoading ? (
        <Typography color="text.secondary">Cargando sesiones...</Typography>
      ) : (
        <Grid container spacing={2}>
          {data.map((day) => (
            <Grid item xs={12} md={6} lg={4} key={day.id}>
              <Card component={Link} to={`/session-days/${day.id}`} sx={{ textDecoration: 'none' }}>
                <CardContent>
                  <Typography variant="h6">{day.trackName}</Typography>
                  <Typography color="text.secondary">{day.date}</Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Estado: {day.trackState ?? 'Sin datos'} | Grip: {day.grip ?? 'N/A'}
                  </Typography>
                  <Typography variant="body2">Tandas: {day.stintsCount ?? 0}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
          {data.length === 0 && (
            <Grid item xs={12}>
              <Typography color="text.secondary">Aún no hay SessionDays registrados.</Typography>
            </Grid>
          )}
        </Grid>
      )}
    </Stack>
  );
};

export default DashboardPage;
