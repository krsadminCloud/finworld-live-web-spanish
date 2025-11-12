import * as React from "react";
import {
  Box,
  Paper,
  Typography,
  Stack,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const frequencyOptions = ["Monthly", "Biweekly", "Weekly"];

export default function InputCard({
  inputs,
  setInputs,
  compare1Visible,
  compare2Visible,
  setCompare1Visible,
  setCompare2Visible,
}) {
  const allowNumeric = (val) => val === "" || /^[0-9]*\.?[0-9]*$/.test(val);

  const updateField = (field, value) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const updateCompare = (compareKey, field, value) => {
    setInputs((prev) => ({
      ...prev,
      [compareKey]: { ...prev[compareKey], [field]: value },
    }));
  };

  const formatWithCommas = (value) => {
    if (!value) return "";
    const num = Number(value.toString().replace(/,/g, ""));
    return isNaN(num) ? "" : num.toLocaleString();
  };

  return (
    <Paper
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: 3,
        boxShadow: 3,
        bgcolor: "background.paper",
      }}
    >
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
        Input Parameters
      </Typography>

      <Stack spacing={2.5}>
        <TextField
          label="Loan Amount"
          value={formatWithCommas(inputs.amount)}
          onChange={(e) => {
            const val = e.target.value.replace(/,/g, "");
            if (allowNumeric(val)) updateField("amount", val);
          }}
          InputProps={{
            startAdornment: <span style={{ marginRight: 8 }}>$</span>,
          }}
          fullWidth
        />

        <TextField
          label="Interest Rate (%)"
          value={inputs.rate}
          onChange={(e) => {
            const val = e.target.value;
            if (allowNumeric(val)) updateField("rate", val);
          }}
          fullWidth
        />

        <FormControl fullWidth>
          <InputLabel>Payment Frequency</InputLabel>
          <Select
            value={inputs.frequency || "Monthly"}
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
          value={inputs.years}
          onChange={(e) => {
            const val = e.target.value;
            if (allowNumeric(val)) updateField("years", val);
          }}
          fullWidth
        />

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
          <Button
            variant={compare1Visible ? "contained" : "outlined"}
            onClick={() => setCompare1Visible((v) => !v)}
            sx={{ flex: 1, textTransform: "none" }}
          >
            {compare1Visible ? "Hide Compare 1" : "Show Compare 1"}
          </Button>
          <Button
            variant={compare2Visible ? "contained" : "outlined"}
            onClick={() => setCompare2Visible((v) => !v)}
            sx={{ flex: 1, textTransform: "none" }}
          >
            {compare2Visible ? "Hide Compare 2" : "Show Compare 2"}
          </Button>
        </Stack>

        {compare1Visible && (
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              Compare 1
            </AccordionSummary>
            <AccordionDetails>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Extra Payment"
                  value={formatWithCommas(inputs.compare1.extra)}
                  onChange={(e) => {
                    const val = e.target.value.replace(/,/g, "");
                    if (allowNumeric(val)) updateCompare("compare1", "extra", val);
                  }}
                  InputProps={{
                    startAdornment: <span style={{ marginRight: 8 }}>$</span>,
                  }}
                  fullWidth
                />
                <FormControl fullWidth>
                  <InputLabel>Frequency</InputLabel>
                  <Select
                    value={inputs.compare1.frequency || inputs.frequency}
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
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              Compare 2
            </AccordionSummary>
            <AccordionDetails>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Extra Payment"
                  value={formatWithCommas(inputs.compare2.extra)}
                  onChange={(e) => {
                    const val = e.target.value.replace(/,/g, "");
                    if (allowNumeric(val)) updateCompare("compare2", "extra", val);
                  }}
                  InputProps={{
                    startAdornment: <span style={{ marginRight: 8 }}>$</span>,
                  }}
                  fullWidth
                />
                <FormControl fullWidth>
                  <InputLabel>Frequency</InputLabel>
                  <Select
                    value={inputs.compare2.frequency || inputs.frequency}
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
    </Paper>
  );
}
