// src/theme.js
import { useMemo, useState } from "react";
import { createTheme } from "@mui/material/styles";

export const useMode = () => {
  const [mode, setMode] = useState("light");

  const colorMode = {
    toggleColorMode: () =>
      setMode((prev) => (prev === "light" ? "dark" : "light")),
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "light"
            ? {
                // 🌿 Light mode palette
                primary: { main: "#10b981" }, // emerald
                secondary: { main: "#14b8a6" }, // teal
                background: {
                  default: "#f8fafc", // light cool gray
                  paper: "#ffffff",
                },
                text: {
                  primary: "#1f2937", // gray-800
                  secondary: "#4b5563", // gray-600
                },
              }
            : {
                // 🌙 Dark mode palette
                primary: { main: "#34d399" }, // lighter emerald
                secondary: { main: "#2dd4bf" }, // lighter teal
                background: {
                  default: "#0b1120", // dark navy
                  paper: "#1f2937",
                },
                text: {
                  primary: "#f3f4f6",
                  secondary: "#9ca3af",
                },
              }),
        },

        typography: {
          fontFamily: ['"Poppins"', '"Nunito"', "sans-serif"].join(","),
          h1: { fontWeight: 800 },
          h2: { fontWeight: 700 },
          h3: { fontWeight: 700 },
          h4: { fontWeight: 600 },
          h5: { fontWeight: 600 },
          h6: { fontWeight: 600 },
          button: { textTransform: "none", fontWeight: 600 },
        },

        shape: { borderRadius: 16 },

        shadows: Array(25)
          .fill("none")
          .map((_, i) =>
            i === 1
              ? "0 4px 12px rgba(0,0,0,0.05)"
              : i === 8
              ? "0 8px 24px rgba(0,0,0,0.08)"
              : "none"
          ),

        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                borderRadius: 16,
                transition: "box-shadow 0.2s ease",
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 20,
                transition:
                  "transform 0.18s ease-in-out, box-shadow 0.18s ease-in-out",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow:
                    mode === "light"
                      ? "0 10px 24px rgba(16,185,129,0.15)"
                      : "0 10px 24px rgba(34,211,238,0.25)",
                },
              },
            },
          },
        },
      }),
    [mode]
  );

  return [theme, colorMode];
};
