import * as React from "react";
import {
  Drawer,
  Toolbar,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
// Removed expand icon as Taxes/Insurance/HOA is no longer collapsible
import { STATES } from "../../../../components/calculators_shared_files/all_rates/api";

const drawerWidth = 340;

export default function Sidebar({
  mobileOpen,
  onClose,
  inputs,
  setInputs,
  onCalculate,
  onReset,
}) {
  const allowNumeric = (val) => val === "" || /^[0-9]*\.?[0-9]*$/.test(val);

  const updateField = (field, value) => {
    const newInputs = { ...inputs, [field]: value };
    setInputs(newInputs);
  };

  const formatWithCommas = (value) => {
    if (!value) return "";
    const num = Number(value.toString().replace(/,/g, ""));
    return isNaN(num) ? "" : num.toLocaleString();
  };

  const creditScoreOptions = [
    "Excellent (740+)",
    "Good (700-739)",
    "Fair (650-699)",
    "Poor (600-649)",
    "Very Poor (<600)",
  ];

  const loanTermOptions = ["30", "20", "15", "10"];

  const content = (
    <Box
      sx={{
        p: 2.5,
        // Force inputs to keep a neutral background (remove light blue tint)
        '& .MuiOutlinedInput-root': {
          bgcolor: 'background.paper',
        },
        '& .MuiOutlinedInput-root.Mui-focused': {
          bgcolor: 'background.paper',
        },
        '& .MuiInputBase-root': {
          bgcolor: 'background.paper',
        },
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
        Mortgage Calculator
      </Typography>

      <Stack spacing={2.5}>
        <TextField
          label="Home Price"
          value={formatWithCommas(inputs.homePrice)}
          onChange={(e) => {
            const val = e.target.value.replace(/,/g, "");
            if (allowNumeric(val)) updateField("homePrice", val);
          }}
          InputProps={{
            startAdornment: <span style={{ marginRight: 8 }}>$</span>,
          }}
          fullWidth
        />

        <Box>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
            <Typography sx={{ fontWeight: 600 }}>Down Payment</Typography>
            <ToggleButtonGroup
              size="small"
              color="primary"
              exclusive
              value={inputs.downPaymentMode}
              onChange={(e, val) => {
                if (val) updateField("downPaymentMode", val);
              }}
            >
              <ToggleButton value="percent">%</ToggleButton>
              <ToggleButton value="amount">$</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {inputs.downPaymentMode === "percent" ? (
            <TextField
              label="Down Payment (%)"
              value={inputs.downPaymentPercent}
              onChange={(e) => {
                const val = e.target.value;
                if (allowNumeric(val)) updateField("downPaymentPercent", val);
              }}
              InputProps={{
                endAdornment: <span style={{ marginLeft: 8 }}>%</span>,
              }}
              fullWidth
              helperText={inputs.homePrice ? "Enter percentage of home price" : "Enter home price for % to apply"}
            />
          ) : (
            <TextField
              label="Down Payment Amount"
              placeholder="Enter Dollar Amount"
              value={formatWithCommas(inputs.downPayment)}
              onChange={(e) => {
                const val = e.target.value.replace(/,/g, "");
                if (allowNumeric(val)) updateField("downPayment", val);
              }}
              InputProps={{
                startAdornment: <span style={{ marginRight: 8 }}>$</span>,
              }}
              fullWidth
            />
          )}
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          <FormControl sx={{ flex: 1 }}>
            <InputLabel>Loan Term</InputLabel>
            <Select
              value={inputs.loanTerm}
              label="Loan Term"
              onChange={(e) => updateField("loanTerm", e.target.value)}
            >
              {loanTermOptions.map((term) => (
                <MenuItem key={term} value={term}>
                  {term} Years
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Interest Rate"
            value={inputs.interestRate}
            onChange={(e) => {
              const val = e.target.value;
              if (allowNumeric(val)) updateField("interestRate", val);
            }}
            InputProps={{
              endAdornment: <span style={{ marginLeft: 8 }}>%</span>,
            }}
            sx={{ flex: 1 }}
          />
        </Box>

        <Accordion expanded>
          <AccordionSummary>
            <Typography sx={{ fontWeight: 600 }}>
              Taxes, Insurance & HOA
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              <TextField
                label="Property Tax"
                value={formatWithCommas(inputs.propertyTax)}
                onChange={(e) => {
                  const val = e.target.value.replace(/,/g, "");
                  if (allowNumeric(val)) updateField("propertyTax", val);
                }}
                InputProps={{
                  startAdornment: <span style={{ marginRight: 8 }}>$</span>,
                }}
                fullWidth
                helperText="Annual property tax"
              />

              <TextField
                label="Home Insurance"
                value={formatWithCommas(inputs.homeInsurance)}
                onChange={(e) => {
                  const val = e.target.value.replace(/,/g, "");
                  if (allowNumeric(val)) updateField("homeInsurance", val);
                }}
                InputProps={{
                  startAdornment: <span style={{ marginRight: 8 }}>$</span>,
                }}
                fullWidth
                helperText="Annual home insurance premium"
              />

              <TextField
                label="PMI (if applicable)"
                value={formatWithCommas(inputs.pmi)}
                onChange={(e) => {
                  const val = e.target.value.replace(/,/g, "");
                  if (allowNumeric(val)) updateField("pmi", val);
                }}
                InputProps={{
                  startAdornment: <span style={{ marginRight: 8 }}>$</span>,
                }}
                fullWidth
                helperText="Monthly PMI payment"
              />

              <TextField
                label="HOA Fees"
                value={formatWithCommas(inputs.hoaFees)}
                onChange={(e) => {
                  const val = e.target.value.replace(/,/g, "");
                  if (allowNumeric(val)) updateField("hoaFees", val);
                }}
                InputProps={{
                  startAdornment: <span style={{ marginRight: 8 }}>$</span>,
                }}
                fullWidth
                helperText="Monthly HOA fees"
              />
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* State dropdown moved to be right before Credit Score */}
        <FormControl fullWidth>
          <InputLabel>State (Optional)</InputLabel>
          <Select
            value={inputs.state}
            label="State (Optional)"
            onChange={(e) => updateField("state", e.target.value)}
          >
            <MenuItem value="">— Select —</MenuItem>
            {Object.entries(STATES).map(([abbr, name]) => (
              <MenuItem key={abbr} value={abbr}>
                {name} ({abbr})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Credit Score</InputLabel>
          <Select
            value={inputs.creditScore}
            label="Credit Score"
            onChange={(e) => updateField("creditScore", e.target.value)}
          >
            {creditScoreOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          onClick={onReset}
          sx={{
            py: 1.5,
            bgcolor: "#14b8a6",
            color: "#ffffff",
            fontWeight: 600,
            textTransform: "none",
            fontSize: "1rem",
            borderRadius: 2,
            "&:hover": {
              bgcolor: "#0d9488",
            },
          }}
        >
          Reset
        </Button>
      </Stack>
    </Box>
  );

  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { width: drawerWidth },
        }}
      >
        <Toolbar />
        {content}
      </Drawer>
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" },
        }}
      >
        <Toolbar />
        {content}
      </Drawer>
    </>
  );
}
