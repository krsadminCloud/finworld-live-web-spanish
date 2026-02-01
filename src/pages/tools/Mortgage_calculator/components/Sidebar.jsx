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
import { useTranslation } from "react-i18next";

const drawerWidth = 340;

export default function Sidebar({
  mobileOpen,
  onClose,
  inputs,
  setInputs,
  onCalculate,
  onReset,
}) {
  const { t } = useTranslation();
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
        {t("mortgage.title")}
      </Typography>

      <Stack spacing={2.5}>
        <TextField
          label={t("mortgage.inputs.homePrice")}
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
            <Typography sx={{ fontWeight: 600 }}>{t("mortgage.inputs.downPayment")}</Typography>
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
              label={t("mortgage.inputs.downPaymentPercent")}
              value={inputs.downPaymentPercent}
              onChange={(e) => {
                const val = e.target.value;
                if (allowNumeric(val)) updateField("downPaymentPercent", val);
              }}
              InputProps={{
                endAdornment: <span style={{ marginLeft: 8 }}>%</span>,
              }}
              fullWidth
              helperText={
                inputs.homePrice
                  ? t("mortgage.inputs.downPaymentPercentHelper")
                  : t("mortgage.inputs.downPaymentPercentHelperMissingPrice")
              }
            />
          ) : (
            <TextField
              label={t("mortgage.inputs.downPaymentAmount")}
              placeholder={t("mortgage.inputs.downPaymentAmountPlaceholder")}
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
            <InputLabel>{t("mortgage.inputs.loanTerm")}</InputLabel>
            <Select
              value={inputs.loanTerm}
              label={t("mortgage.inputs.loanTerm")}
              onChange={(e) => updateField("loanTerm", e.target.value)}
            >
              {loanTermOptions.map((term) => (
                <MenuItem key={term} value={term}>
                  {t("mortgage.inputs.loanTermYears", { years: term })}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label={t("mortgage.inputs.interestRate")}
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
              {t("mortgage.inputs.taxesInsuranceHoa")}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              <TextField
                label={t("mortgage.inputs.propertyTax")}
                value={formatWithCommas(inputs.propertyTax)}
                onChange={(e) => {
                  const val = e.target.value.replace(/,/g, "");
                  if (allowNumeric(val)) updateField("propertyTax", val);
                }}
                InputProps={{
                  startAdornment: <span style={{ marginRight: 8 }}>$</span>,
                }}
                fullWidth
                helperText={t("mortgage.inputs.propertyTaxHelper")}
              />

              <TextField
                label={t("mortgage.inputs.homeInsurance")}
                value={formatWithCommas(inputs.homeInsurance)}
                onChange={(e) => {
                  const val = e.target.value.replace(/,/g, "");
                  if (allowNumeric(val)) updateField("homeInsurance", val);
                }}
                InputProps={{
                  startAdornment: <span style={{ marginRight: 8 }}>$</span>,
                }}
                fullWidth
                helperText={t("mortgage.inputs.homeInsuranceHelper")}
              />

              <TextField
                label={t("mortgage.inputs.pmi")}
                value={formatWithCommas(inputs.pmi)}
                onChange={(e) => {
                  const val = e.target.value.replace(/,/g, "");
                  if (allowNumeric(val)) updateField("pmi", val);
                }}
                InputProps={{
                  startAdornment: <span style={{ marginRight: 8 }}>$</span>,
                }}
                fullWidth
                helperText={t("mortgage.inputs.pmiHelper")}
              />

              <TextField
                label={t("mortgage.inputs.hoaFees")}
                value={formatWithCommas(inputs.hoaFees)}
                onChange={(e) => {
                  const val = e.target.value.replace(/,/g, "");
                  if (allowNumeric(val)) updateField("hoaFees", val);
                }}
                InputProps={{
                  startAdornment: <span style={{ marginRight: 8 }}>$</span>,
                }}
                fullWidth
                helperText={t("mortgage.inputs.hoaFeesHelper")}
              />
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* State dropdown moved to be right before Credit Score */}
        <FormControl fullWidth>
          <InputLabel>{t("mortgage.inputs.stateOptional")}</InputLabel>
          <Select
            value={inputs.state}
            label={t("mortgage.inputs.stateOptional")}
            onChange={(e) => updateField("state", e.target.value)}
          >
            <MenuItem value="">{t("mortgage.inputs.stateSelectPlaceholder")}</MenuItem>
            {Object.entries(STATES).map(([abbr, name]) => (
              <MenuItem key={abbr} value={abbr}>
                {name} ({abbr})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>{t("mortgage.inputs.creditScore")}</InputLabel>
          <Select
            value={inputs.creditScore}
            label={t("mortgage.inputs.creditScore")}
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
          {t("mortgage.actions.reset")}
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
