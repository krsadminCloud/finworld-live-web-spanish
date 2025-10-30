// src/pages/tools/extra_payment/components/Layout.jsx
import * as React from "react";
import { Box, Toolbar } from "@mui/material";
import TopBar from "../../../../components/calculators_shared_files/topBar";
import Sidebar from "./Sidebar";

export default function Layout({
  compare1Visible,
  compare2Visible,
  setCompare1Visible,
  setCompare2Visible,
  inputs,
  setInputs,
  onCalculate,
  children,
}) {
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

      <Box sx={{ display: "flex", flexGrow: 1, width: "100%", overflow: "hidden" }}>
        <Sidebar
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
          compare1Visible={compare1Visible}
          compare2Visible={compare2Visible}
          setCompare1Visible={setCompare1Visible}
          setCompare2Visible={setCompare2Visible}
          inputs={inputs}
          setInputs={setInputs}
          onCalculate={onCalculate}
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
            p: { xs: 2, sm: 3, md: 4 },
            overflowX: "hidden",
            ml: { xs: 0, md: '340px' },
          }}
        >
          <Toolbar /> {/* spacer for fixed AppBar */}
          {children}
        </Box>
      </Box>
    </Box>
  );
}
