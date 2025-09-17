import { Container, Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    // O Container já é responsivo por natureza
    <Container component="main" maxWidth="xs"> 
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: { xs: 2, sm: 0 }, // Adiciona um padding vertical em telas pequenas (py = padding y-axis)
        }}
      >
        <Outlet /> 
      </Box>
    </Container>
  );
}