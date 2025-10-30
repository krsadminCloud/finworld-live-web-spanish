import React from 'react';
import { Box, Toolbar } from '@mui/material';
import TopBar from '../../../../components/calculators_shared_files/topBar';
import Sidebar from './Sidebar';

export default function Layout({
  inputs,
  onInputChange,
  onReset,
  advancedOpen,
  setAdvancedOpen,
  children,
}) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <TopBar onMenuClick={() => setMobileOpen(true)} />

      <Box sx={{ display: 'flex', flexGrow: 1, width: '100%', overflow: 'hidden' }}>
        <Sidebar
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
          inputs={inputs}
          onInputChange={onInputChange}
          onReset={onReset}
          advancedOpen={advancedOpen}
          setAdvancedOpen={setAdvancedOpen}
        />

        <Box
          component="main"
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: { xs: 2, md: 3 },
            p: { xs: 2, sm: 3, md: 4 },
            overflowX: 'hidden',
            overflowY: 'auto',
            ml: { xs: 0, md: '325px' },
            maxWidth: { md: 'calc(100% - 325px - ((100% - 325px) * 0.3))' }, // 30% smaller
          }}
        >
          <Toolbar />
          {children}
        </Box>
      </Box>
    </Box>
  );
}
