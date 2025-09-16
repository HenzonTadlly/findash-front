import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import api from '../api';
import {
  Avatar, Box, Button, TextField, Typography, Grid, Link, Snackbar, Alert, Paper,
} from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const response = await api.post('/sessions', { email, password });
      const { token } = response.data;
      localStorage.setItem('authToken', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      navigate('/dashboard');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Erro desconhecido';
      setSnackbarMessage(errorMessage);
      setOpenSnackbar(true);
    }
  }

  return (
    <>
      <Paper 
        elevation={6}
        sx={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          p: 4, borderRadius: 2, width: '100%',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 56, height: 56 }}>
          <AttachMoneyIcon />
        </Avatar>
        <Typography component="h1" variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
          FinDash
        </Typography>
        <Typography component="h2" variant="h6">Entrar</Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField margin="normal" required fullWidth id="email" label="Endereço de Email" name="email" autoComplete="email" autoFocus value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextField margin="normal" required fullWidth name="password" label="Senha" type="password" id="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Entrar</Button>
          <Grid container justifyContent="flex-end">
            <Grid> {/* <-- CORRIGIDO AQUI */}
              <Link component={RouterLink} to="/cadastro" variant="body2">
                Não tem uma conta? Cadastre-se
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="error" sx={{ width: '100%' }}>{snackbarMessage}</Alert>
      </Snackbar>
    </>
  );
}