import { Container, Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <Container component="main" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ width: '100%', maxWidth: '450px' }}>
         <Outlet /> {/* As páginas de Login e Cadastro serão renderizadas aqui */}
      </Box>
    </Container>
  );
}