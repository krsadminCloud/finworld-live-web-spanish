import React from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Typography,
  FormControlLabel,
  Switch,
  Stack
} from '@mui/material';
import { Tooltip } from './Tooltip';
import { Accordion } from './Accordion';
import { STATES_LIST } from '../utils/taxData';

export function InputForm({
  inputs,
  onInputChange,
  onReset,
  advancedOpen,
  setAdvancedOpen
}) {
  return (
    <Box
      sx={{
        p: 3,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 2.5
      }}
    >
      <TextField
        label={
          <Box component="span">
            Your Gross Annual Income
            <Tooltip text="Your total income before any deductions or taxes." />
          </Box>
        }
        type="number"
        fullWidth
        value={inputs.income || ''}
        onChange={(e) => onInputChange('income', Number(e.target.value))}
        placeholder="e.g. 90000"
        inputProps={{ min: 0, step: 100 }}
      />

      <TextField
        label={
          <Box component="span">
            Spouse's Gross Annual Income
            <Tooltip text="Your spouse's total income before any deductions or taxes." />
          </Box>
        }
        type="number"
        fullWidth
        value={inputs.spouseIncome || ''}
        onChange={(e) => onInputChange('spouseIncome', Number(e.target.value))}
        placeholder="e.g. 75000"
        inputProps={{ min: 0, step: 100 }}
      />

      <Stack direction="row" spacing={2}>
        <FormControl fullWidth>
          <InputLabel>
            Tax Year
            <Tooltip text="The tax year for which calculations are performed." />
          </InputLabel>
          <Select
            value={inputs.year}
            onChange={(e) => onInputChange('year', Number(e.target.value))}
            label="Tax Year"
          >
            <MenuItem value={2025}>2025</MenuItem>
            <MenuItem value={2024}>2024</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>
            State
            <Tooltip text="Your state of residence for state tax calculations." />
          </InputLabel>
          <Select
            value={inputs.state}
            onChange={(e) => onInputChange('state', e.target.value)}
            label="State"
          >
            <MenuItem value="">— Select —</MenuItem>
            {STATES_LIST.map((state) => (
              <MenuItem key={state} value={state}>
                {state}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      <FormControl fullWidth>
        <InputLabel>
          Filing Status
          <Tooltip text="Your tax filing status (e.g., Single, Married Filing Jointly)." />
        </InputLabel>
        <Select
          value={inputs.status}
          onChange={(e) => onInputChange('status', e.target.value)}
          label="Filing Status"
        >
          <MenuItem value="single">Single</MenuItem>
          <MenuItem value="mfj">Married Filing Jointly</MenuItem>
          <MenuItem value="mfs">Married Filing Separately</MenuItem>
          <MenuItem value="hoh">Head of Household</MenuItem>
        </Select>
      </FormControl>

      <Accordion title="Your 401(k) Contributions" tooltip="Pre-tax contributions to your 401(k) retirement plan.">
        <TextField
          label="Percent of your income"
          type="number"
          fullWidth
          value={inputs.k401Percent || ''}
          onChange={(e) => onInputChange('k401Percent', Number(e.target.value))}
          placeholder="e.g. 10"
          inputProps={{ min: 0, max: 100, step: 0.5 }}
        />
      </Accordion>

      <Accordion title="Spouse's 401(k) Contributions" tooltip="Spouse's pre-tax contributions to their 401(k) retirement plan.">
        <TextField
          label="Percent of spouse's income"
          type="number"
          fullWidth
          value={inputs.spouseK401Percent || ''}
          onChange={(e) => onInputChange('spouseK401Percent', Number(e.target.value))}
          placeholder="e.g. 8"
          inputProps={{ min: 0, max: 100, step: 0.5 }}
        />
      </Accordion>

      <Accordion title="Your Roth IRA (Post-tax)" tooltip="Post-tax contributions to your Roth IRA retirement plan.">
        <TextField
          label="Your annual amount ($)"
          type="number"
          fullWidth
          value={inputs.rothAmount || ''}
          onChange={(e) => onInputChange('rothAmount', Number(e.target.value))}
          placeholder="e.g. 7000"
          inputProps={{ min: 0, step: 100 }}
        />
      </Accordion>

      <Accordion title="Spouse's Roth IRA (Post-tax)" tooltip="Spouse's post-tax contributions to their Roth IRA retirement plan.">
        <TextField
          label="Spouse's annual amount ($)"
          type="number"
          fullWidth
          value={inputs.spouseRothAmount || ''}
          onChange={(e) => onInputChange('spouseRothAmount', Number(e.target.value))}
          placeholder="e.g. 7000"
          inputProps={{ min: 0, step: 100 }}
        />
      </Accordion>

      <TextField
        label={
          <Box component="span">
            Override State Effective Rate (%)
            <Tooltip text="Manually set a state tax rate to override the default calculation." />
            <Typography component="span" variant="caption" sx={{ ml: 1, opacity: 0.7 }}>
              (optional)
            </Typography>
          </Box>
        }
        type="number"
        fullWidth
        value={inputs.overrideStateRate || ''}
        onChange={(e) => onInputChange('overrideStateRate', e.target.value ? Number(e.target.value) : undefined)}
        placeholder="Leave blank to use table"
        inputProps={{ min: 0, step: 0.1 }}
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
        <Typography variant="body2">Advanced Options</Typography>
        <FormControlLabel
          control={
            <Switch
              checked={advancedOpen}
              onChange={(e) => setAdvancedOpen(e.target.checked)}
            />
          }
          label=""
        />
      </Box>

      {advancedOpen && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Accordion title="Pre-Tax Deductions" tooltip="Deductions from your gross income before taxes are calculated.">
            <TextField
              label="Health Insurance ($ annual)"
              type="number"
              fullWidth
              value={inputs.healthInsurance || ''}
              onChange={(e) => onInputChange('healthInsurance', Number(e.target.value))}
              placeholder="e.g. 4800"
              inputProps={{ min: 0, step: 100 }}
            />
            <TextField
              label="HSA Contribution ($ annual)"
              type="number"
              fullWidth
              value={inputs.hsa || ''}
              onChange={(e) => onInputChange('hsa', Number(e.target.value))}
              placeholder="e.g. 3850"
              inputProps={{ min: 0, step: 100 }}
            />
            <TextField
              label="Traditional IRA Contribution ($ annual)"
              type="number"
              fullWidth
              value={inputs.traditionalIra || ''}
              onChange={(e) => onInputChange('traditionalIra', Number(e.target.value))}
              placeholder="e.g. 6500"
              inputProps={{ min: 0, step: 100 }}
            />
            <TextField
              label="Student Loan Interest Paid ($ annual)"
              type="number"
              fullWidth
              value={inputs.studentLoanInterest || ''}
              onChange={(e) => onInputChange('studentLoanInterest', Number(e.target.value))}
              placeholder="e.g. 2500"
              inputProps={{ min: 0, step: 100 }}
            />
            <TextField
              label="FSA Contribution ($ annual)"
              type="number"
              fullWidth
              value={inputs.fsaContribution || ''}
              onChange={(e) => onInputChange('fsaContribution', Number(e.target.value))}
              placeholder="e.g. 2850"
              inputProps={{ min: 0, step: 100 }}
            />
            <TextField
              label="Other Pre-Tax Deductions ($ annual)"
              type="number"
              fullWidth
              value={inputs.otherPreTaxDeductions || ''}
              onChange={(e) => onInputChange('otherPreTaxDeductions', Number(e.target.value))}
              placeholder="e.g. 1000"
              inputProps={{ min: 0, step: 100 }}
            />
          </Accordion>

          <Accordion title="Federal Tax Credits" tooltip="Amounts that directly reduce your federal tax liability.">
            <TextField
              label="Child Tax Credit ($)"
              type="number"
              fullWidth
              value={inputs.childTaxCredit || ''}
              onChange={(e) => onInputChange('childTaxCredit', Number(e.target.value))}
              placeholder="e.g. 2000"
              inputProps={{ min: 0, step: 100 }}
            />
            <TextField
              label="Dependent Care Credit ($)"
              type="number"
              fullWidth
              value={inputs.dependentCareCredit || ''}
              onChange={(e) => onInputChange('dependentCareCredit', Number(e.target.value))}
              placeholder="e.g. 3000"
              inputProps={{ min: 0, step: 100 }}
            />
            <TextField
              label="Child and Dependent Care Expenses ($ annual)"
              type="number"
              fullWidth
              value={inputs.childDependentCareExpenses || ''}
              onChange={(e) => onInputChange('childDependentCareExpenses', Number(e.target.value))}
              placeholder="e.g. 6000"
              inputProps={{ min: 0, step: 100 }}
            />
          </Accordion>

          <Accordion title="Local Taxes" tooltip="Local income taxes, if applicable.">
            <TextField
              label="Local Tax Rate (%)"
              type="number"
              fullWidth
              value={inputs.localTaxRate || ''}
              onChange={(e) => onInputChange('localTaxRate', Number(e.target.value))}
              placeholder="e.g. 1.5"
              inputProps={{ min: 0, step: 0.1 }}
            />
          </Accordion>
        </Box>
      )}

      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <Button
          variant="outlined"
          onClick={onReset}
          fullWidth
          sx={{ fontWeight: 700 }}
        >
          Reset
        </Button>
      </Stack>

      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, lineHeight: 1.5 }}>
        Estimation uses federal standard deduction; applies entered credits and the Additional Medicare Tax. 401(k) is
        treated as pre-tax (no cap enforced). Roth IRA is post-tax (no cap enforced).
      </Typography>
    </Box>
  );
}
