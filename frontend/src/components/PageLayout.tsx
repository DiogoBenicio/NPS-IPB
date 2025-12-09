import React from 'react';
import { Container, Box, Typography } from '@mui/material';

interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
  subtitle?: string;
  action?: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ title, children, subtitle, action }) => {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'hsl(40, 33%, 96%)' }}>
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Box
          className="animate-fade-in"
          sx={{
            mb: 5,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'flex-start', md: 'center' },
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Box sx={{ textAlign: { xs: 'left', md: 'left' } }}>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 700,
                fontFamily: 'Merriweather, serif',
                color: 'primary.main',
                mb: subtitle ? 1.5 : 0,
                fontSize: { xs: '2rem', md: '2.75rem' },
              }}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography
                variant="h6"
                sx={{
                  color: 'text.secondary',
                  fontFamily: 'Open Sans, sans-serif',
                  fontWeight: 400,
                  fontSize: { xs: '1rem', md: '1.15rem' },
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
          {action && <Box>{action}</Box>}
        </Box>
        <Box
          className="animate-slide-up"
          sx={{
            backgroundColor: 'background.paper',
            borderRadius: 3,
            p: { xs: 3, md: 5 },
            boxShadow: '0 4px 24px -4px hsl(213 52% 24% / 0.12)',
          }}
        >
          {children}
        </Box>
      </Container>
    </Box>
  );
};

export default PageLayout;
