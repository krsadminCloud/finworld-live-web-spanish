// src/components/calculators_shared_files/topBar.jsx
import * as React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Button,
  useTheme,
  Stack,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import {
  Brightness4 as MoonIcon,
  Brightness7 as SunIcon,
  CalculateOutlined as CalculatorIcon,
} from "@mui/icons-material";
import { ColorModeContext } from "../../context/ColorModeContext";

export default function TopBar({ onMenuClick }) {
  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);

  return (
    <AppBar
      position="sticky"
      color="transparent"
      elevation={0}
      sx={{
        borderBottom: `1px solid ${theme.palette.divider}`,
        bgcolor: "background.paper",
        color: "text.primary",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: { xs: 2, md: 6 },
          minHeight: { xs: 72, md: 64 },
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          {onMenuClick && (
            <IconButton
              onClick={onMenuClick}
              edge="start"
              color="inherit"
              sx={{
                display: { xs: "inline-flex", md: "none" },
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
              }}
            >
              <Box
                component="span"
                sx={{
                  width: 16,
                  height: 2,
                  backgroundColor: "currentColor",
                  position: "relative",
                  display: "inline-block",
                }}
              >
                <Box
                  component="span"
                  sx={{
                    position: "absolute",
                    width: 16,
                    height: 2,
                    backgroundColor: "currentColor",
                    top: -5,
                    left: 0,
                  }}
                />
                <Box
                  component="span"
                  sx={{
                    position: "absolute",
                    width: 16,
                    height: 2,
                    backgroundColor: "currentColor",
                    top: 5,
                    left: 0,
                  }}
                />
              </Box>
            </IconButton>
          )}
          {/* Left: Brand */}
          <Box
            component={RouterLink}
            to="/"
            sx={{ display: "flex", alignItems: "center", textDecoration: "none", gap: 0.75 }}
          >
            <CalculatorIcon sx={{ color: "#14B8A6" }} />
            <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: "-0.02em" }}>
              <Box component="span" sx={{ color: "inherit" }}>
                Fin
              </Box>
              <Box component="span" sx={{ color: "#14B8A6" }}>
                World
              </Box>
            </Typography>
          </Box>
        </Stack>

        {/* Right: Actions */}
        <Stack
          direction="row"
          spacing={{ xs: 0.5, md: 1.5 }}
          alignItems="center"
          flexWrap={{ xs: "wrap", md: "nowrap" }}
          justifyContent={{ xs: "flex-end", md: "flex-start" }}
          useFlexGap
          sx={{ rowGap: { xs: 1, md: 0 } }}
        >
          <IconButton
            onClick={colorMode.toggleColorMode}
            color="inherit"
            size="small"
            sx={{ border: "1px solid", borderColor: "divider", bgcolor: "background.paper" }}
          >
            {theme.palette.mode === "dark" ? <SunIcon /> : <MoonIcon />}
          </IconButton>

          <Button
            size="small"
            variant="contained"
            sx={{
              borderRadius: 50,
              fontWeight: 700,
              px: { xs: 1.25, md: 2.5 },
              py: { xs: 0.5, md: 1 },
              whiteSpace: "nowrap",
              bgcolor: "#14B8A6",
              color: "#fff",
              "&:hover": {
                bgcolor: "#0f948a",
              },
            }}
          >
            My Account
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
