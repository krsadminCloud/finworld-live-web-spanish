import React from 'react';
import { Accordion as MuiAccordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export function Accordion({ title, tooltip, children, defaultOpen = false }) {
  return (
    <MuiAccordion
      defaultExpanded={defaultOpen}
      elevation={0}
      sx={{
        '&:before': {
          display: 'none',
        },
        bgcolor: 'action.hover',
        borderRadius: 1,
        mb: 1
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          '& .MuiAccordionSummary-content': {
            my: 1
          }
        }}
      >
        <Typography variant="body2" fontWeight={600}>
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          pt: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        {children}
      </AccordionDetails>
    </MuiAccordion>
  );
}
