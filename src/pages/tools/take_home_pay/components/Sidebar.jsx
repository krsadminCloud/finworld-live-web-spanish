import React from 'react';
import {
  Drawer,
  Toolbar,
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
import { formatNumberWithCommas, parseNumberFromFormattedString } from '../../../../utils/formatNumber';

const drawerWidth = 320;

export default function Sidebar({
  mobileOpen,
  onClose,
  inputs,
  onInputChange,
  onReset,
  advancedOpen,
  setAdvancedOpen
}) {
  const content = (
    <Box sx={{ p: 2, overflowY: 'auto', height: '100%' }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
        Take-Home Pay Calculator
      </Typography>

      <Stack spacing={2.5}>
        <TextField
          label={
            <Box component="span">
              Your Gross Annual Income
              <Tooltip text="Your total income before any deductions or taxes." />
            </Box>
          }
          fullWidth
          value={formatNumberWithCommas(inputs.income)}
          onChange={(e) => onInputChange('income', parseNumberFromFormattedString(e.target.value))}
          placeholder="e.g. 90,000"
          inputProps={{ min: 0, step: 100 }}
        />

        <TextField
          label={
            <Box component="span">
              Spouse's Gross Annual Income
              <Tooltip text="Your spouse's total income before any deductions or taxes." />
            </Box>
          }
          fullWidth
          value={formatNumberWithCommas(inputs.spouseIncome)}
          onChange={(e) => onInputChange('spouseIncome', parseNumberFromFormattedString(e.target.value))}
          placeholder="e.g. 75,000"
          inputProps={{ min: 0, step: 100 }}
        />

        <TextField
          label={
            <Box component="span">
              Tax Year
              <Tooltip text="The tax year for which calculations are performed." />
            </Box>
          }
          fullWidth
          value={inputs.year || ''}
          onChange={(e) => onInputChange('year', Number(e.target.value))}
          placeholder="e.g. 2025"
          inputProps={{ min: 1900, max: 2100, step: 1 }}
        />

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
          fullWidth
          value={formatNumberWithCommas(inputs.rothAmount)}
          onChange={(e) => onInputChange('rothAmount', parseNumberFromFormattedString(e.target.value))}
          placeholder="e.g. 7,000"
          inputProps={{ min: 0, step: 100 }}
          />
        </Accordion>

        <Accordion title="Spouse's Roth IRA (Post-tax)" tooltip="Spouse's post-tax contributions to their Roth IRA retirement plan.">
          <TextField
          label="Spouse's annual amount ($)"
          fullWidth
          value={formatNumberWithCommas(inputs.spouseRothAmount)}
          onChange={(e) => onInputChange('spouseRothAmount', parseNumberFromFormattedString(e.target.value))}
          placeholder="e.g. 7,000"
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

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                fullWidth
                value={formatNumberWithCommas(inputs.healthInsurance)}
                onChange={(e) => onInputChange('healthInsurance', parseNumberFromFormattedString(e.target.value))}
                placeholder="e.g. 4,800"
                inputProps={{ min: 0, step: 100 }}
              />
              <TextField
                label="HSA Contribution ($ annual)"
                fullWidth
                value={formatNumberWithCommas(inputs.hsa)}
                onChange={(e) => onInputChange('hsa', parseNumberFromFormattedString(e.target.value))}
                placeholder="e.g. 3,850"
                inputProps={{ min: 0, step: 100 }}
              />
              <TextField
                label="Traditional IRA Contribution ($ annual)"
                fullWidth
                value={formatNumberWithCommas(inputs.traditionalIra)}
                onChange={(e) => onInputChange('traditionalIra', parseNumberFromFormattedString(e.target.value))}
                placeholder="e.g. 6,500"
                inputProps={{ min: 0, step: 100 }}
              />
              <TextField
                label="Student Loan Interest Paid ($ annual)"
                fullWidth
                value={formatNumberWithCommas(inputs.studentLoanInterest)}
                onChange={(e) => onInputChange('studentLoanInterest', parseNumberFromFormattedString(e.target.value))}
                placeholder="e.g. 2,500"
                inputProps={{ min: 0, step: 100 }}
              />
              <TextField
                label="FSA Contribution ($ annual)"
                fullWidth
                value={formatNumberWithCommas(inputs.fsaContribution)}
                onChange={(e) => onInputChange('fsaContribution', parseNumberFromFormattedString(e.target.value))}
                placeholder="e.g. 2,850"
                inputProps={{ min: 0, step: 100 }}
              />
              <TextField
                label="Other Pre-Tax Deductions ($ annual)"
                fullWidth
                value={formatNumberWithCommas(inputs.otherPreTaxDeductions)}
                onChange={(e) => onInputChange('otherPreTaxDeductions', parseNumberFromFormattedString(e.target.value))}
                placeholder="e.g. 1,000"
                inputProps={{ min: 0, step: 100 }}
              />
            </Accordion>

            <Accordion title="Federal Tax Credits" tooltip="Amounts that directly reduce your federal tax liability.">
              <TextField
                label="Child Tax Credit ($)"
                fullWidth
                value={formatNumberWithCommas(inputs.childTaxCredit)}
                onChange={(e) => onInputChange('childTaxCredit', parseNumberFromFormattedString(e.target.value))}
                placeholder="e.g. 2,000"
                inputProps={{ min: 0, step: 100 }}
              />
              <TextField
                label="Dependent Care Credit ($)"
                fullWidth
                value={formatNumberWithCommas(inputs.dependentCareCredit)}
                onChange={(e) => onInputChange('dependentCareCredit', parseNumberFromFormattedString(e.target.value))}
                placeholder="e.g. 3,000"
                inputProps={{ min: 0, step: 100 }}
              />
              <TextField
                label="Child and Dependent Care Expenses ($ annual)"
                fullWidth
                value={formatNumberWithCommas(inputs.childDependentCareExpenses)}
                onChange={(e) => onInputChange('childDependentCareExpenses', parseNumberFromFormattedString(e.target.value))}
                placeholder="e.g. 6,000"
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

        <Button
          variant="outlined"
          onClick={onReset}
          fullWidth
          sx={{ fontWeight: 700, mt: 2 }}
        >
          Reset
        </Button>

        <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.5 }}>
          Estimation uses federal standard deduction; applies entered credits and the Additional Medicare Tax. 401(k) is
          treated as pre-tax (no cap enforced). Roth IRA is post-tax (no cap enforced).
        </Typography>
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
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' }
        }}
      >
        <Toolbar />
        {content}
      </Drawer>
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            position: 'fixed',
            height: '100vh',
            overflowY: 'auto'
          },
        }}
      >
        <Toolbar />
        {content}
      </Drawer>
    </>
  );
}
