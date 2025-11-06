// src/components/calculators_shared_files/topBar.jsx
import * as React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Button,
  alpha,
  useTheme,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import {
  Brightness4 as MoonIcon,
  Brightness7 as SunIcon,
  CalculateOutlined as CalculatorIcon,
} from "@mui/icons-material";
import { ColorModeContext } from "../../context/ColorModeContext";

export default function TopBar() {
  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);

  return (
    <AppBar
      position="sticky"
      color="transparent"
      elevation={0}
      sx={{
        borderBottom: `1px solid ${alpha(theme.palette.text.primary, 0.12)}`,
        backdropFilter: "blur(6px)",
        bgcolor: "background.paper",
        height: 65,
        maxWidth: "50%",
        mx: "auto",
        borderRadius: "0 0 12px 12px",
        transition: "background-color 0.3s ease",
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: 65,
          px: { xs: 2, sm: 3 },
        }}
      >
        {/* === Left: Brand with Icon === */}
        <Box
          component={RouterLink}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            gap: 0.6,
          }}
        >
          <CalculatorIcon
            sx={{
              color: "#00A86B",
              fontSize: "1.1rem",
              mt: "1px",
            }}
          />
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 800,
              color: "text.primary",
              fontSize: "1.10rem",
              letterSpacing: 0.3,
            }}
          >
            FinCalc
          </Typography>
        </Box>

        {/* === Center: Navigation Buttons === */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 1.2, sm: 2.5 },
            justifyContent: "center",
          }}
        >
          <Button
            component={RouterLink}
            to="/"
            sx={{
              color: "text.primary",
              fontWeight: 600,
              textTransform: "none",
              fontSize: "1.1rem",
              minWidth: "auto",
              p: 0,
            }}
          >
            Home
          </Button>
<Button
  component={RouterLink}
  to="/tools"
  sx={{
    color: "text.primary",
    fontWeight: 600,
    textTransform: "none",
    fontSize: "1.1rem",
    minWidth: "auto",
    p: 0,
  }}
>
  Calculator
</Button>
          {/* Buy vs Lease link removed per request */}
          {/* Retirement Calculator button removed per request */}
        </Box>

        {/* === Right: Theme Toggle === */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            onClick={colorMode.toggleColorMode}
            aria-label="toggle theme"
            sx={{
              color: "text.primary",
              p: 0.5,
              "& svg": { fontSize: "1.5rem" },
            }}
          >
            {theme.palette.mode === "dark" ? <SunIcon /> : <MoonIcon />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
