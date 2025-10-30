import React from 'react';
import { Chip } from '@mui/material';

export function InfoChip({ children }) {
  return (
    <Chip
      label={children}
      size="small"
      sx={{
        fontSize: '0.75rem',
        height: 'auto',
        py: 0.5,
        px: 1,
        '& .MuiChip-label': {
          px: 0.5
        }
      }}
      variant="outlined"
    />
  );
}
