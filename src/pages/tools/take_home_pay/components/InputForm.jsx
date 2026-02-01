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
import { useTranslation } from 'react-i18next';

export function InputForm({
  inputs,
  onInputChange,
  onReset,
  advancedOpen,
  setAdvancedOpen
}) {
  const { t } = useTranslation();
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
            {t("calculators.takeHomePay.inputs.yourIncome")}
            <Tooltip text={t("calculators.takeHomePay.helper.yourIncome")} />
          </Box>
        }
        type="number"
        fullWidth
        value={inputs.income || ''}
        onChange={(e) => onInputChange('income', Number(e.target.value))}
        placeholder={t("calculators.takeHomePay.placeholders.income")}
        inputProps={{ min: 0, step: 100 }}
      />

      <TextField
        label={
          <Box component="span">
            {t("calculators.takeHomePay.inputs.spouseIncome")}
            <Tooltip text={t("calculators.takeHomePay.helper.spouseIncome")} />
          </Box>
        }
        type="number"
        fullWidth
        value={inputs.spouseIncome || ''}
        onChange={(e) => onInputChange('spouseIncome', Number(e.target.value))}
        placeholder={t("calculators.takeHomePay.placeholders.income")}
        inputProps={{ min: 0, step: 100 }}
      />

      <Stack direction="row" spacing={2}>
        <FormControl fullWidth>
          <InputLabel>
            {t("calculators.takeHomePay.inputs.taxYear")}
            <Tooltip text={t("calculators.takeHomePay.helper.taxYear")} />
          </InputLabel>
          <Select
            value={inputs.year}
            onChange={(e) => onInputChange('year', Number(e.target.value))}
            label={t("calculators.takeHomePay.inputs.taxYear")}
          >
            <MenuItem value={2025}>2025</MenuItem>
            <MenuItem value={2024}>2024</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>
            {t("calculators.takeHomePay.inputs.state")}
            <Tooltip text={t("calculators.takeHomePay.helper.state")} />
          </InputLabel>
          <Select
            value={inputs.state}
            onChange={(e) => onInputChange('state', e.target.value)}
            label={t("calculators.takeHomePay.inputs.state")}
          >
            <MenuItem value="">{t("calculators.takeHomePay.labels.selectState")}</MenuItem>
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
          {t("calculators.takeHomePay.inputs.filingStatus")}
          <Tooltip text={t("calculators.takeHomePay.helper.filingStatus")} />
        </InputLabel>
        <Select
          value={inputs.status}
          onChange={(e) => onInputChange('status', e.target.value)}
          label={t("calculators.takeHomePay.inputs.filingStatus")}
        >
          <MenuItem value="single">{t("calculators.takeHomePay.options.single")}</MenuItem>
          <MenuItem value="mfj">{t("calculators.takeHomePay.options.mfj")}</MenuItem>
          <MenuItem value="mfs">{t("calculators.takeHomePay.options.mfs")}</MenuItem>
          <MenuItem value="hoh">{t("calculators.takeHomePay.options.hoh")}</MenuItem>
        </Select>
      </FormControl>

      <Accordion title={t("calculators.takeHomePay.sections.your401")} tooltip={t("calculators.takeHomePay.helper.your401")}>
        <TextField
          label={t("calculators.takeHomePay.inputs.your401Percent")}
          type="number"
          fullWidth
          value={inputs.k401Percent || ''}
          onChange={(e) => onInputChange('k401Percent', Number(e.target.value))}
          placeholder={t("calculators.takeHomePay.placeholders.percent")}
          inputProps={{ min: 0, max: 100, step: 0.5 }}
        />
      </Accordion>

      <Accordion title={t("calculators.takeHomePay.sections.spouse401")} tooltip={t("calculators.takeHomePay.helper.spouse401")}>
        <TextField
          label={t("calculators.takeHomePay.inputs.spouse401Percent")}
          type="number"
          fullWidth
          value={inputs.spouseK401Percent || ''}
          onChange={(e) => onInputChange('spouseK401Percent', Number(e.target.value))}
          placeholder={t("calculators.takeHomePay.placeholders.percent")}
          inputProps={{ min: 0, max: 100, step: 0.5 }}
        />
      </Accordion>

      <Accordion title={t("calculators.takeHomePay.sections.yourRoth")} tooltip={t("calculators.takeHomePay.helper.yourRoth")}>
        <TextField
          label={t("calculators.takeHomePay.inputs.yourRothAmount")}
          type="number"
          fullWidth
          value={inputs.rothAmount || ''}
          onChange={(e) => onInputChange('rothAmount', Number(e.target.value))}
          placeholder={t("calculators.takeHomePay.placeholders.amount")}
          inputProps={{ min: 0, step: 100 }}
        />
      </Accordion>

      <Accordion title={t("calculators.takeHomePay.sections.spouseRoth")} tooltip={t("calculators.takeHomePay.helper.spouseRoth")}>
        <TextField
          label={t("calculators.takeHomePay.inputs.spouseRothAmount")}
          type="number"
          fullWidth
          value={inputs.spouseRothAmount || ''}
          onChange={(e) => onInputChange('spouseRothAmount', Number(e.target.value))}
          placeholder={t("calculators.takeHomePay.placeholders.amount")}
          inputProps={{ min: 0, step: 100 }}
        />
      </Accordion>

      <TextField
        label={
          <Box component="span">
            {t("calculators.takeHomePay.inputs.overrideState")}
            <Tooltip text={t("calculators.takeHomePay.helper.overrideState")} />
            <Typography component="span" variant="caption" sx={{ ml: 1, opacity: 0.7 }}>
              {t("calculators.takeHomePay.labels.optional")}
            </Typography>
          </Box>
        }
        type="number"
        fullWidth
        value={inputs.overrideStateRate || ''}
        onChange={(e) => onInputChange('overrideStateRate', e.target.value ? Number(e.target.value) : undefined)}
        placeholder={t("calculators.takeHomePay.placeholders.override")}
        inputProps={{ min: 0, step: 0.1 }}
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
        <Typography variant="body2">{t("calculators.takeHomePay.sections.advanced")}</Typography>
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
