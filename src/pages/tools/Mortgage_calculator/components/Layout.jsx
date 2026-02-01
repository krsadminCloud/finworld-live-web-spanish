import * as React from "react";
import { Box, Toolbar } from "@mui/material";
import TopBar from "../../../../components/calculators_shared_files/topBar";
import Sidebar from "./Sidebar";

export default function Layout({ inputs, setInputs, onCalculate, onReset, children }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <TopBar onMenuClick={() => setMobileOpen(true)} />

      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
          width: "100%",
          overflow: "hidden",
        }}
      >
        <Sidebar
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
          inputs={inputs}
          setInputs={setInputs}
          onCalculate={onCalculate}
          onReset={onReset}
        />

        <Box
          component="main"
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: { xs: 2, md: 3 },
            p: { xs: 1.5, sm: 2, md: 4 },
            overflowX: "hidden",
            ml: { xs: 0, md: "340px" },
            // Allow main content to use the full remaining width for better responsiveness
            maxWidth: { md: 'none' },
          }}
        >
          <Toolbar />
          {children}
        </Box>
      </Box>
    </Box>
  );
}
