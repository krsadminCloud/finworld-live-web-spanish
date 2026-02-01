// src/index.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { HelmetProvider } from "react-helmet-async"; // ✅ SEO provider
import { ColorModeContext } from "./context/ColorModeContext"; // ✅ Context and theme imports
import { useMode } from "./theme";
import "./i18n";
// ✅ Global Tailwind styles for the entire FinWorld app
import "./index.css";
// ✅ Ensure the TakeHomePay calculator's Tailwind + custom CSS loads too
//import "./pages/tools/take_home_pay/index.css";

function Main() {
  try {
    const [theme, colorMode] = useMode();    
    return (
      <HelmetProvider>
        <ColorModeContext.Provider value={colorMode}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
          </ThemeProvider>
        </ColorModeContext.Provider>
      </HelmetProvider>
    );
  } catch (err) {
    console.error("App render error:", err);
    return (
      <h1 style={{ color: "red", textAlign: "center" }}>
        ⚠️ App failed to load — see console.
      </h1>
    );
  }
}

// ✅ Bootstrap the app
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);
