import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Paper,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Church as ChurchIcon,
  MenuBook as MenuBookIcon,
  People as PeopleIcon,
  BarChart as BarChartIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Login as LoginIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const LandingPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');
  const navigate = useNavigate();

  // Verificar se existe usuário no primeiro acesso
  useEffect(() => {
    const checkFirstAccess = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/exists');
        const data = await response.json();
        if (!data.hasUser) {
          setShowRegisterModal(true);
        }
      } catch (error) {
        console.error('Erro ao verificar primeiro acesso:', error);
      }
    };
    checkFirstAccess();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await authAPI.login(email, password);
      localStorage.setItem('token', res.data.token);
      navigate('/admin');
    } catch {
      setError('Credenciais inválidas. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');
    setRegisterSuccess('');

    if (!registerUsername || !registerPassword) {
      setRegisterError('Por favor, preencha todos os campos.');
      return;
    }

    if (registerPassword.length < 6) {
      setRegisterError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    try {
      await authAPI.register(registerUsername, registerPassword);
      setRegisterSuccess('Conta criada com sucesso! Faça login para continuar.');
      setTimeout(() => {
        setShowRegisterModal(false);
        setEmail(registerUsername);
        setRegisterUsername('');
        setRegisterPassword('');
        setRegisterSuccess('');
      }, 2000);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error && 'response' in error
          ? (error as { response?: { data?: { error?: string } } }).response?.data?.error
          : 'Erro ao criar conta. Tente novamente.';
      setRegisterError(errorMessage || 'Erro ao criar conta. Tente novamente.');
    }
  };

  const features = [
    {
      icon: MenuBookIcon,
      title: 'Cursos Avaliados',
      desc: 'Gerencie pesquisas para cada curso',
    },
    {
      icon: PeopleIcon,
      title: 'Feedback dos Alunos',
      desc: 'Colete opiniões de forma simples',
    },
    {
      icon: BarChartIcon,
      title: 'Métricas Claras',
      desc: 'Acompanhe o NPS de cada curso',
    },
  ];

  return (
    <Box
      className="animate-fade-in"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: { xs: 'column', lg: 'row' },
      }}
    >
      {/* Left Panel - Login */}
      <Box
        sx={{
          width: { xs: '100%', lg: '50%' },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          px: { xs: 4, lg: 8 },
          py: { xs: 6, lg: 12 },
          backgroundColor: 'background.paper',
        }}
      >
        <Box sx={{ maxWidth: 448, mx: 'auto', width: '100%' }}>
          {/* Logo and Title */}
          <Box
            className="animate-fade-in"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              mb: 4,
            }}
          >
            <Box
              sx={{
                p: 1.5,
                background:
                  'linear-gradient(135deg, hsl(213, 52%, 24%) 0%, hsl(213, 52%, 34%) 100%)',
                borderRadius: 3,
                boxShadow: '0 2px 12px -2px hsl(213 52% 24% / 0.3)',
              }}
            >
              <ChurchIcon sx={{ fontSize: 32, color: 'white' }} />
            </Box>
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontFamily: 'Merriweather, serif',
                  fontWeight: 700,
                  color: 'text.primary',
                }}
              >
                Sistema NPS
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  fontFamily: 'Open Sans, sans-serif',
                }}
              >
                Igreja Presbiteriana
              </Typography>
            </Box>
          </Box>

          {/* Welcome Text */}
          <Box className="animate-fade-in" sx={{ mb: 4, animationDelay: '0.1s' }}>
            <Typography
              variant="h3"
              sx={{
                fontFamily: 'Merriweather, serif',
                fontWeight: 700,
                color: 'text.primary',
                mb: 1,
                fontSize: { xs: '2rem', md: '2.5rem' },
              }}
            >
              Bem-vindo de volta
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                fontFamily: 'Open Sans, sans-serif',
              }}
            >
              Acesse sua conta para gerenciar as avaliações dos cursos de teologia.
            </Typography>
          </Box>

          {/* Login Form */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            className="animate-slide-up"
            sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
          >
            <Box>
              <Typography
                component="label"
                htmlFor="email"
                sx={{
                  display: 'block',
                  mb: 1,
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  fontFamily: 'Open Sans, sans-serif',
                  color: 'text.primary',
                }}
              >
                E-mail
              </Typography>
              <TextField
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    fontFamily: 'Open Sans, sans-serif',
                  },
                }}
              />
            </Box>

            <Box>
              <Typography
                component="label"
                htmlFor="password"
                sx={{
                  display: 'block',
                  mb: 1,
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  fontFamily: 'Open Sans, sans-serif',
                  color: 'text.primary',
                }}
              >
                Senha
              </Typography>
              <TextField
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                inputProps={{ minLength: 6 }}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    fontFamily: 'Open Sans, sans-serif',
                  },
                }}
              />
            </Box>

            {error && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isLoading}
              fullWidth
              sx={{
                py: 1.5,
                borderRadius: 2,
                fontSize: '1rem',
                fontWeight: 600,
                fontFamily: 'Open Sans, sans-serif',
                boxShadow: '0 2px 12px -2px hsl(213 52% 24% / 0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 30px -8px hsl(213 52% 24% / 0.4)',
                },
              }}
            >
              {isLoading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      border: '2px solid white',
                      borderTopColor: 'transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                      '@keyframes spin': {
                        '0%': { transform: 'rotate(0deg)' },
                        '100%': { transform: 'rotate(360deg)' },
                      },
                    }}
                  />
                  <span>Entrando...</span>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LoginIcon sx={{ fontSize: 20 }} />
                  <span>Entrar</span>
                </Box>
              )}
            </Button>

            <Typography
              variant="body2"
              sx={{
                textAlign: 'center',
                color: 'text.secondary',
                fontFamily: 'Open Sans, sans-serif',
              }}
            >
              Sistema exclusivo para administradores autorizados
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Right Panel - Hero */}
      <Box
        sx={{
          display: { xs: 'none', lg: 'flex' },
          width: '50%',
          background:
            'linear-gradient(135deg, hsl(213, 52%, 24%) 0%, hsl(213, 52%, 34%) 50%, hsl(28, 52%, 28%) 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Pattern Background */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            opacity: 0.3,
          }}
        />

        <Box
          sx={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            px: { xs: 6, xl: 8 },
          }}
        >
          <Box sx={{ maxWidth: 560 }}>
            <Typography
              className="animate-slide-up"
              variant="h2"
              sx={{
                fontFamily: 'Merriweather, serif',
                fontWeight: 700,
                color: 'white',
                mb: 3,
                fontSize: { xs: '2.5rem', xl: '3rem' },
              }}
            >
              Avalie e Melhore a Qualidade dos Cursos
            </Typography>
            <Typography
              className="animate-slide-up"
              variant="h6"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                mb: 5,
                fontFamily: 'Open Sans, sans-serif',
                lineHeight: 1.6,
                animationDelay: '0.1s',
              }}
            >
              Com o sistema NPS, colete feedback valioso dos alunos e aperfeiçoe continuamente os
              cursos de teologia da igreja.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {features.map((item, i) => {
                const Icon = item.icon;
                return (
                  <Paper
                    key={item.title}
                    className="animate-slide-up"
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 2,
                      p: 2,
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(12px)',
                      borderRadius: 3,
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      animationDelay: `${0.2 + i * 0.1}s`,
                    }}
                  >
                    <Box
                      sx={{
                        p: 1,
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon sx={{ fontSize: 20, color: 'white' }} />
                    </Box>
                    <Box>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 600,
                          color: 'white',
                          fontFamily: 'Open Sans, sans-serif',
                        }}
                      >
                        {item.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontFamily: 'Open Sans, sans-serif',
                        }}
                      >
                        {item.desc}
                      </Typography>
                    </Box>
                  </Paper>
                );
              })}
            </Box>
          </Box>
        </Box>

        {/* Decorative elements */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: 256,
            height: 256,
            background: 'rgba(255, 255, 255, 0.05)',
            borderTopLeftRadius: '100%',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 80,
            right: 80,
            width: 128,
            height: 128,
            background: 'hsl(44, 81%, 56%, 0.2)',
            borderRadius: '50%',
            filter: 'blur(60px)',
          }}
        />
      </Box>

      {/* Modal de Primeiro Acesso */}
      <Dialog
        open={showRegisterModal}
        onClose={() => {}}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 30px -8px hsl(213 52% 24% / 0.2)',
          },
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: 'Merriweather, serif',
            fontWeight: 700,
            color: 'primary.main',
            fontSize: '1.75rem',
            pb: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <PersonAddIcon sx={{ fontSize: 32 }} />
            Primeiro Acesso
          </Box>
        </DialogTitle>

        <form onSubmit={handleRegister}>
          <DialogContent>
            <Typography
              variant="body1"
              sx={{
                mb: 3,
                fontFamily: 'Open Sans, sans-serif',
                color: 'text.secondary',
              }}
            >
              Bem-vindo ao sistema NPS! Crie sua conta de administrador para começar.
            </Typography>

            {registerError && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                {registerError}
              </Alert>
            )}

            {registerSuccess && (
              <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
                {registerSuccess}
              </Alert>
            )}

            <TextField
              fullWidth
              label="Nome de Usuário"
              variant="outlined"
              value={registerUsername}
              onChange={(e) => setRegisterUsername(e.target.value)}
              sx={{ mb: 2.5 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: 'primary.main' }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Senha"
              type="password"
              variant="outlined"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              helperText="Mínimo 6 caracteres"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: 'primary.main' }} />
                  </InputAdornment>
                ),
              }}
            />
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={!registerUsername || !registerPassword}
              sx={{
                py: 1.5,
                borderRadius: 2,
                fontFamily: 'Open Sans, sans-serif',
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '1rem',
                boxShadow: '0 2px 12px -2px hsl(213 52% 24% / 0.3)',
                '&:hover': {
                  boxShadow: '0 8px 30px -8px hsl(213 52% 24% / 0.4)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Criar Conta
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default LandingPage;
