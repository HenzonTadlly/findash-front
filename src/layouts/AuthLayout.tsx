import { Container, Box } from '@mui/material';
import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          minHeight: '100vh', // Garante que o container ocupe 100% da altura da tela
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center', // Centraliza o conteúdo verticalmente
        }}
      >
        {children} {/* Aqui é onde o conteúdo da página (Login/Cadastro) será renderizado */}
      </Box>
    </Container>
  );
}