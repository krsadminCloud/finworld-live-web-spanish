import React, { useState } from 'react';
import { IconButton, Tooltip as MuiTooltip } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export function Tooltip({ text }) {
  return (
    <MuiTooltip title={text} arrow placement="top">
      <IconButton
        size="small"
        sx={{
          ml: 0.5,
          p: 0,
          verticalAlign: 'middle',
          '& .MuiSvgIcon-root': {
            fontSize: '0.9rem'
          }
        }}
      >
        <InfoOutlinedIcon fontSize="small" />
      </IconButton>
    </MuiTooltip>
  );
}
