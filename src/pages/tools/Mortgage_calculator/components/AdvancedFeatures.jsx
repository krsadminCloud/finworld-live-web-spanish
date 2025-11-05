import React, { useState } from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import AdvancedSection from './AdvancedSection';

export default function AdvancedFeatures() {
  const [bgTheme, setBgTheme] = useState('#F5F7FA'); // default Option 1 – Light Cool Gray

  const handleThemeChange = (event) => setBgTheme(event.target.value);

  return (
    <Box
      sx={{
        backgroundColor: bgTheme,
        borderRadius: 3,
        p: 3,
        transition: 'background-color 0.3s ease',
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
          <InputLabel>Background Theme</InputLabel>
          <Select
            value={bgTheme}
            label="Background Theme"
            onChange={handleThemeChange}
          >
            <MenuItem value="#F5F7FA">Option 1 – Light Cool Gray</MenuItem>
            <MenuItem value="#E9F9F8">Option 2 – Pale Teal Tint</MenuItem>
            <MenuItem value="#FAFAF8">Option 3 – Warm Off-White</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Existing Advanced Features content */}
      <AdvancedSection />
    </Box>
  );
}

