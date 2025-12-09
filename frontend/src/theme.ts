import { createTheme } from '@mui/material/styles';

// Design system matching Lovable/shadcn theme
// Colors based on HSL values from Lovable index.css
const theme = createTheme({
  palette: {
    mode: 'light',
    // Primary: Navy (hsl(213 52% 24%))
    primary: {
      main: 'hsl(213, 52%, 24%)',
      light: 'hsl(213, 40%, 35%)',
      dark: 'hsl(213, 60%, 15%)',
      contrastText: 'hsl(40, 30%, 98%)',
    },
    // Secondary: Brown (hsl(28 52% 28%))
    secondary: {
      main: 'hsl(28, 52%, 28%)',
      light: 'hsl(28, 40%, 45%)',
      dark: 'hsl(28, 60%, 18%)',
      contrastText: 'hsl(40, 30%, 98%)',
    },
    background: {
      default: 'hsl(40, 33%, 96%)',
      paper: 'hsl(40, 30%, 98%)',
    },
    text: {
      primary: 'hsl(220, 40%, 20%)',
      secondary: 'hsl(220, 20%, 40%)',
    },
    success: {
      main: 'hsl(142, 76%, 36%)',
      contrastText: '#ffffff',
    },
    warning: {
      main: 'hsl(38, 60%, 50%)',
      contrastText: 'hsl(220, 40%, 20%)',
    },
    error: {
      main: 'hsl(0, 84%, 60%)',
      contrastText: 'hsl(40, 30%, 98%)',
    },
    divider: 'hsl(40, 20%, 82%)',
  },
  typography: {
    fontFamily: '"Open Sans", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Merriweather", "Georgia", serif',
      fontSize: '3.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontFamily: '"Merriweather", "Georgia", serif',
      fontSize: '2.75rem',
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontFamily: '"Merriweather", "Georgia", serif',
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.4,
    },
    h4: {
      fontFamily: '"Merriweather", "Georgia", serif',
      fontSize: '1.5rem',
      fontWeight: 700,
      lineHeight: 1.4,
    },
    h5: {
      fontFamily: '"Merriweather", "Georgia", serif',
      fontSize: '1.25rem',
      fontWeight: 700,
      lineHeight: 1.5,
    },
    h6: {
      fontFamily: '"Merriweather", "Georgia", serif',
      fontSize: '1rem',
      fontWeight: 700,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.7,
      letterSpacing: '0.00938em',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
    subtitle1: {
      fontSize: '1.125rem',
      fontWeight: 500,
      lineHeight: 1.75,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.57,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '12px 32px',
          fontSize: '1rem',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(26, 35, 126, 0.2)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0 6px 16px rgba(26, 35, 126, 0.3)',
          },
        },
        sizeSmall: {
          padding: '8px 20px',
          fontSize: '0.875rem',
        },
        sizeLarge: {
          padding: '16px 40px',
          fontSize: '1.125rem',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          padding: 24,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1A237E',
          boxShadow: '0 2px 8px rgba(26, 35, 126, 0.15)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
        elevation1: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        },
        elevation2: {
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0 2px 12px -2px hsl(213 52% 24% / 0.1)',
    '0 4px 20px -4px hsl(213 52% 24% / 0.15)',
    '0 8px 30px -8px hsl(213 52% 24% / 0.2)',
    '0 2px 4px rgba(0,0,0,0.1)',
    '0 4px 8px rgba(0,0,0,0.1)',
    '0 6px 12px rgba(0,0,0,0.1)',
    '0 8px 16px rgba(0,0,0,0.1)',
    '0 10px 20px rgba(0,0,0,0.12)',
    '0 12px 24px rgba(0,0,0,0.12)',
    '0 14px 28px rgba(0,0,0,0.14)',
    '0 16px 32px rgba(0,0,0,0.14)',
    '0 18px 36px rgba(0,0,0,0.16)',
    '0 20px 40px rgba(0,0,0,0.16)',
    '0 22px 44px rgba(0,0,0,0.18)',
    '0 24px 48px rgba(0,0,0,0.18)',
    '0 26px 52px rgba(0,0,0,0.2)',
    '0 28px 56px rgba(0,0,0,0.2)',
    '0 30px 60px rgba(0,0,0,0.22)',
    '0 32px 64px rgba(0,0,0,0.22)',
    '0 34px 68px rgba(0,0,0,0.24)',
    '0 36px 72px rgba(0,0,0,0.24)',
    '0 38px 76px rgba(0,0,0,0.26)',
    '0 40px 80px rgba(0,0,0,0.26)',
    '0 42px 84px rgba(0,0,0,0.28)',
  ],
});

// Custom theme extensions (matching Lovable)
declare module '@mui/material/styles' {
  interface Theme {
    customGradients: {
      navy: string;
      warm: string;
      hero: string;
    };
    customColors: {
      navy: string;
      navyLight: string;
      navyDark: string;
      brown: string;
      brownLight: string;
      beige: string;
      beigeDark: string;
      cream: string;
      gold: string;
    };
  }
  interface ThemeOptions {
    customGradients?: {
      navy?: string;
      warm?: string;
      hero?: string;
    };
    customColors?: {
      navy?: string;
      navyLight?: string;
      navyDark?: string;
      brown?: string;
      brownLight?: string;
      beige?: string;
      beigeDark?: string;
      cream?: string;
      gold?: string;
    };
  }
}

// Add custom properties to theme
(theme as any).customGradients = {
  navy: 'linear-gradient(135deg, hsl(213, 52%, 24%) 0%, hsl(213, 60%, 15%) 100%)',
  warm: 'linear-gradient(135deg, hsl(40, 33%, 96%) 0%, hsl(35, 25%, 88%) 100%)',
  hero: 'linear-gradient(180deg, hsl(213, 52%, 24%) 0%, hsl(213, 40%, 35%) 100%)',
};

(theme as any).customColors = {
  navy: 'hsl(213, 52%, 24%)',
  navyLight: 'hsl(213, 40%, 35%)',
  navyDark: 'hsl(213, 60%, 15%)',
  brown: 'hsl(28, 52%, 28%)',
  brownLight: 'hsl(28, 40%, 45%)',
  beige: 'hsl(40, 33%, 96%)',
  beigeDark: 'hsl(35, 25%, 88%)',
  cream: 'hsl(40, 30%, 98%)',
  gold: 'hsl(38, 60%, 50%)',
};

export default theme;
