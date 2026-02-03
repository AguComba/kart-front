import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material';
import { Link, Route, Routes } from 'react-router-dom';
import DashboardPage from './features/sessionDays/pages/DashboardPage';
import SessionDayFormPage from './features/sessionDays/pages/SessionDayFormPage';
import SessionDayDetailPage from './features/sessionDays/pages/SessionDayDetailPage';
import StintFormPage from './features/stints/pages/StintFormPage';
import LibraryPage from './features/library/pages/LibraryPage';

const App = () => {
  return (
    <Box minHeight="100vh" bgcolor="grey.50">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Karting Session Logbook
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Dashboard
          </Button>
          <Button color="inherit" component={Link} to="/library">
            Biblioteca
          </Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ py: 3 }}>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/session-days/new" element={<SessionDayFormPage />} />
          <Route path="/session-days/:id" element={<SessionDayDetailPage />} />
          <Route path="/session-days/:id/stints/new" element={<StintFormPage />} />
          <Route path="/session-days/:id/stints/:stintId/edit" element={<StintFormPage />} />
          <Route path="/library" element={<LibraryPage />} />
        </Routes>
      </Container>
    </Box>
  );
};

export default App;
