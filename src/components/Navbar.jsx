import * as React from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Button, InputBase, Menu, MenuItem, alpha, useTheme } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import MenuIcon from '@mui/icons-material/Menu';
import { ColorModeContext } from '../theme';

export default function Navbar() {
  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileOpen, setMobileOpen] = React.useState(null);
  const navigate = useNavigate();

  const handleOpenTools = (e) => setAnchorEl(e.currentTarget);
  const handleCloseTools = () => setAnchorEl(null);

  const Search = (props) => (
    <Box
      sx={{
        position: 'relative',
        borderRadius: 999,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': { backgroundColor: alpha(theme.palette.common.white, 0.25) },
        ml: { xs: 1, md: 3 },
        width: { xs: '100%', sm: 'auto' },
        display: 'flex',
        alignItems: 'center',
        px: 1.5,
        py: 0.5,
        border: `1px solid ${alpha(theme.palette.text.primary, 0.1)}`,
        bgcolor: theme.palette.mode === 'light' ? '#fff' : alpha('#000', 0.2)
      }}
    >
      <SearchIcon sx={{ mr: 1, opacity: 0.7 }} />
      <InputBase
        placeholder="Search…"
        inputProps={{ 'aria-label': 'search' }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            // TODO: wire search route
            navigate('/');
          }
        }}
        sx={{ minWidth: 160 }}
      />
    </Box>
  );

  return (
    <AppBar position="sticky" color="transparent" elevation={0}
      sx={{ borderBottom: `1px solid ${alpha(theme.palette.text.primary, 0.12)}`, backdropFilter: 'blur(6px)' }}>
      <Toolbar sx={{ display: 'flex', gap: 2 }}>
        <IconButton edge="start" sx={{ display: { md: 'none' } }} onClick={(e) => setMobileOpen(e.currentTarget)}>
          <MenuIcon />
        </IconButton>

        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{ textDecoration: 'none', color: 'text.primary', fontWeight: 800 }}
        >
          Finworld
        </Typography>

        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          <Button component={RouterLink} to="/" sx={{ fontWeight: 600 }}>Home</Button>
          <Button onClick={handleOpenTools} sx={{ fontWeight: 600 }}>Financial Tools</Button>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseTools}>
            <MenuItem component={RouterLink} to="/tools/extra_payment" onClick={handleCloseTools}>Extra Payment Calculator</MenuItem>
            <MenuItem component={RouterLink} to="/tools/paycheck" onClick={handleCloseTools}>Take-Home Pay</MenuItem>
          </Menu>
          <Button sx={{ fontWeight: 600 }} component={RouterLink} to="/comparisons">Comparisons</Button>
          <Button sx={{ fontWeight: 600 }} component={RouterLink} to="/guides">Guides</Button>
          <Button sx={{ fontWeight: 600 }} component={RouterLink} to="/about">About</Button>
        </Box>

        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Search />
          <IconButton onClick={colorMode.toggle} aria-label="toggle theme">
            {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
