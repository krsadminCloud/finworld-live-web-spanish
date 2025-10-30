import * as React from 'react';
import { Box, Container, Link, Typography, Stack, Divider } from '@mui/material';

export default function Footer() {
  return (
    <Box component="footer" sx={{ borderTop: '1px solid', borderColor: 'divider', mt: 8 }}>
      <Container sx={{ py: 4 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="row" spacing={3}>
            <Link href="#" underline="hover" color="text.secondary">About</Link>
            <Link href="#" underline="hover" color="text.secondary">Contact</Link>
            <Link href="#" underline="hover" color="text.secondary">Privacy</Link>
            <Link href="#" underline="hover" color="text.secondary">Terms</Link>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Finworld. All rights reserved.
          </Typography>
        </Stack>
        <Divider sx={{ mt: 2 }} />
      </Container>
    </Box>
  );
}
