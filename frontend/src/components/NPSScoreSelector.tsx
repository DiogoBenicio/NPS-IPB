import React from 'react';
import { Box, Button, Typography } from '@mui/material';

interface NPSScoreSelectorProps {
  value: number | null;
  onChange: (score: number) => void;
  disabled?: boolean;
}

const NPSScoreSelector: React.FC<NPSScoreSelectorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const scores = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const getScoreColor = (score: number): string => {
    if (score <= 6) return 'hsl(0, 70%, 60%)'; // Detratores - vermelho
    if (score <= 8) return 'hsl(45, 80%, 55%)'; // Neutros - amarelo
    return 'hsl(142, 71%, 45%)'; // Promotores - verde
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          gap: 0.5,
          flexWrap: 'wrap',
          justifyContent: 'center',
          mb: 2,
        }}
      >
        {scores.map((score) => (
          <Button
            key={score}
            onClick={() => onChange(score)}
            disabled={disabled}
            sx={{
              minWidth: { xs: '40px', sm: '50px' },
              height: { xs: '40px', sm: '50px' },
              p: 0,
              fontSize: { xs: '1rem', sm: '1.125rem' },
              fontWeight: 'bold',
              border: '2px solid',
              borderColor: value === score ? getScoreColor(score) : 'divider',
              bgcolor: value === score ? getScoreColor(score) : 'background.paper',
              color: value === score ? 'white' : 'text.primary',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: getScoreColor(score),
                bgcolor: value === score ? getScoreColor(score) : 'action.hover',
                transform: 'scale(1.05)',
              },
              '&:disabled': {
                opacity: 0.6,
              },
            }}
          >
            {score}
          </Button>
        ))}
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          px: 1,
        }}
      >
        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
          Nada provável
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
          Muito provável
        </Typography>
      </Box>
    </Box>
  );
};

export default NPSScoreSelector;
