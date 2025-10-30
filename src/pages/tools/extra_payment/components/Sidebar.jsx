import * as React from "react";
import {
  Drawer,
  Toolbar,
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Button,
  Stack,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const drawerWidth = 320;

export default function Sidebar({
  mobileOpen,
  onClose,
  inputs,
  setInputs,
  compare1Visible,
  compare2Visible,
  setCompare1Visible,
  setCompare2Visible,
  onCalculate,
}) {
  const [localInputs, setLocalInputs] = React.useState(inputs);
  React.useEffect(() => setLocalInputs(inputs), [inputs]);

  const allowNumeric = (val) => val === "" || /^[0-9]*\.?[0-9]*$/.test(val);
  const updateField = (field, value) => {
    setLocalInputs({ ...localInputs, [field]: value });
    setInputs({ ...localInputs, [field]: value });
  };
  const updateCompare = (compareKey, field, value) => {
    setLocalInputs({
      ...localInputs,
      [compareKey]: { ...localInputs[compareKey], [field]: value },
    });
    setInputs({
      ...localInputs,
      [compareKey]: { ...localInputs[compareKey], [field]: value },
    });
  };

  const frequencyOptions = ["Monthly", "Biweekly", "Weekly"];
  const formatWithCommas = (value) => {
    if (!value) return "";
    const num = Number(value.toString().replace(/,/g, ""));
    return isNaN(num) ? "" : num.toLocaleString();
  };

  const content = (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
        Loan Payoff Calculator
      </Typography>
      <Stack spacing={2}>
        <TextField
          label="Loan Amount"
          value={formatWithCommas(localInputs.amount)}
          onChange={(e) => {
            const val = e.target.value.replace(/,/g, "");
            if (allowNumeric(val)) updateField("amount", val);
          }}
          InputProps={{
            startAdornment: <span style={{ marginRight: 8 }}>$</span>,
          }}
        />
        <TextField
          label="Interest Rate (%)"
          value={localInputs.rate}
          onChange={(e) => {
            const val = e.target.value;
            if (allowNumeric(val)) updateField("rate", val);
          }}
        />
        <FormControl fullWidth>
          <InputLabel>Payment Frequency</InputLabel>
          <Select
            value={localInputs.frequency || "Monthly"}
            label="Payment Frequency"
            onChange={(e) => updateField("frequency", e.target.value)}
          >
            {frequencyOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Loan Term (years)"
          value={localInputs.years}
          onChange={(e) => {
            const val = e.target.value;
            if (allowNumeric(val)) updateField("years", val);
          }}
        />

        {/* Removed Base Plan extra input */}

        <Stack direction="row" spacing={2} justifyContent="center" sx={{ pt: 1 }}>
          <Button
            variant={compare1Visible ? "contained" : "outlined"}
            size="small"
            onClick={() => setCompare1Visible((v) => !v)}
            sx={{ flex: 1, textTransform: "none" }}
          >
            {compare1Visible ? "Hide Compare 1" : "Show Compare 1"}
          </Button>
          <Button
            variant={compare2Visible ? "contained" : "outlined"}
            size="small"
            onClick={() => setCompare2Visible((v) => !v)}
            sx={{ flex: 1, textTransform: "none" }}
          >
            {compare2Visible ? "Hide Compare 2" : "Show Compare 2"}
          </Button>
        </Stack>

        {compare1Visible && (
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>Compare 1</AccordionSummary>
            <AccordionDetails>
              <Stack direction="row" spacing={2}>
                <TextField
                  label="Extra Payment"
                  value={formatWithCommas(localInputs.compare1.extra)}
                  onChange={(e) => {
                    const val = e.target.value.replace(/,/g, "");
                    if (allowNumeric(val)) updateCompare("compare1", "extra", val);
                  }}
                  InputProps={{
                    startAdornment: <span style={{ marginRight: 8 }}>$</span>,
                  }}
                  sx={{ flex: 1 }}
                />
                <FormControl sx={{ flex: 1 }}>
                  <InputLabel>Frequency</InputLabel>
                  <Select
                    value={localInputs.compare1.frequency || localInputs.frequency}
                    label="Frequency"
                    onChange={(e) => updateCompare("compare1", "frequency", e.target.value)}
                  >
                    {frequencyOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            </AccordionDetails>
          </Accordion>
        )}

        {compare2Visible && (
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>Compare 2</AccordionSummary>
            <AccordionDetails>
              <Stack direction="row" spacing={2}>
                <TextField
                  label="Extra Payment"
                  value={formatWithCommas(localInputs.compare2.extra)}
                  onChange={(e) => {
                    const val = e.target.value.replace(/,/g, "");
                    if (allowNumeric(val)) updateCompare("compare2", "extra", val);
                  }}
                  InputProps={{
                    startAdornment: <span style={{ marginRight: 8 }}>$</span>,
                  }}
                  sx={{ flex: 1 }}
                />
                <FormControl sx={{ flex: 1 }}>
                  <InputLabel>Frequency</InputLabel>
                  <Select
                    value={localInputs.compare2.frequency || localInputs.frequency}
                    label="Frequency"
                    onChange={(e) => updateCompare("compare2", "frequency", e.target.value)}
                  >
                    {frequencyOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            </AccordionDetails>
          </Accordion>
        )}
                
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
        sx={{ display: { xs: "block", md: "none" }, "& .MuiDrawer-paper": { width: drawerWidth } }}
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
