// src/pages/tools/extra_payment/components/Layout.jsx
import * as React from "react";
import { Box, Toolbar } from "@mui/material";
import TopBar from "../../../../components/calculators_shared_files/topBar";

export default function Layout({ children }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <TopBar />
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
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
