import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          gap: 3,
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: 120, color: 'primary.main', opacity: 0.5 }} />

        <Typography
          variant="h1"
          sx={{ fontWeight: 'bold', color: 'text.primary', fontSize: '4rem' }}
        >
          404
        </Typography>

        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
          Página não encontrada
        </Typography>

        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
          Desculpe, a página que você está procurando não existe ou foi movida.
        </Typography>

        <Button variant="contained" size="large" onClick={() => navigate('/')}>
          Voltar para Home
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;
