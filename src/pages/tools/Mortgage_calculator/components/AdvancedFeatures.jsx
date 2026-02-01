import React, { useState } from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';
import AdvancedSection from './AdvancedSection';

export default function AdvancedFeatures() {
  const { t } = useTranslation();
  const [bgTheme, setBgTheme] = useState('#F5F7FA'); // default Option 1 – Light Cool Gray
  const bgColor = bgTheme;

  const handleThemeChange = (event) => setBgTheme(event.target.value);

  return (
    <Box
      id="advanced-features-container"
      sx={{
        '--af-bg': bgColor,
        backgroundColor: 'var(--af-bg)',
        borderRadius: 4,
        p: { xs: 2, md: 3 },
        mb: { xs: 12, md: 24 },
        transition: 'background-color 0.25s ease',
        '&, & *': {
          backgroundImage: 'none',
        },
      }}
    >
      {/* Dropdown Theme Selector */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          mb: 2,
        }}
      >
        <FormControl size="small" sx={{ minWidth: 220 }}>
          <InputLabel>{t("mortgage.theme.label")}</InputLabel>
          <Select
            value={bgTheme}
            label={t("mortgage.theme.label")}
            onChange={handleThemeChange}
          >
            <MenuItem value="#F5F7FA">{t("mortgage.theme.option1")}</MenuItem>
            <MenuItem value="#E9F9F8">{t("mortgage.theme.option2")}</MenuItem>
            <MenuItem value="#FAFAF8">{t("mortgage.theme.option3")}</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Existing Advanced Features content */}
      <AdvancedSection />
    </Box>
  );
}
