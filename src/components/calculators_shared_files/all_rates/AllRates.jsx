import React, { useState, useEffect } from 'react';
import { Box, Typography, Select, MenuItem, Button, Paper } from '@mui/material';
import { fetchRates, STATES, LENDERS, trackClick } from './api';

const AllRates = () => {
  const [selectedState, setSelectedState] = useState('NC');
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch rates when state changes
  useEffect(() => {
    const loadRates = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchRates(selectedState);
        setRates(data);
      } catch (err) {
        setError('Failed to fetch rates');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadRates();
  }, [selectedState]);

  // Get current date
  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Handle state change
  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
  };

  // Handle lender click
  const handleLenderClick = (lender) => {
    trackClick(lender.name, selectedState);
    window.open(lender.url, '_blank');
  };

  // Loading state
  if (loading) {
    return (
      <Box sx={{ maxWidth: '1200px', margin: '0 auto', p: 2 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6">Fetching rates for {STATES[selectedState]}...</Typography>
        </Paper>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ maxWidth: '1200px', margin: '0 auto', p: 2 }}>
        <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'error.light' }}>
          <Typography variant="h6" color="error">{error}</Typography>
          <Button 
            variant="outlined" 
            onClick={() => window.location.reload()} 
            sx={{ mt: 2 }}
          >
            Retry
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      p: { xs: 2, md: 3 },
      backgroundColor: 'background.default',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
        Compare Current Mortgage Rates across Lenders
      </Typography>
      <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
        Updated: {getCurrentDate()}
      </Typography>

      {/* Toolbar */}
      <Paper sx={{ 
        p: 2, 
        mb: 3, 
        display: 'flex', 
        flexWrap: 'wrap', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        gap: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            Select State:
          </Typography>
          <Select
            value={selectedState}
            onChange={handleStateChange}
            size="small"
            sx={{ minWidth: 200 }}
          >
            {Object.entries(STATES).map(([abbr, label]) => (
              <MenuItem key={abbr} value={abbr}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
          {STATES[selectedState]} rates
        </Typography>
      </Paper>

      {/* Rates Cards */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 3 }}>
        {LENDERS.map((lender, index) => (
          <Paper
            key={index}
            sx={{
              p: 3,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-start',
              gap: 2,
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 3
              }
            }}
          >
            {/* Left: Logo and Name */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2, 
              minWidth: '180px',
              flex: '1 1 auto',
              maxWidth: '260px'
            }}>
              <Box sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: '#f1f5f9',
                border: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                position: 'relative',
                fontSize: '0.7rem',
                fontWeight: 600,
                color: 'primary.main'
              }}>
                <img
                  src={lender.logo}
                  alt={`${lender.name} logo`}
                  style={{
                    maxWidth: '70%',
                    maxHeight: '70%',
                    objectFit: 'contain',
                    display: 'block'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
                <Box sx={{
                  position: 'absolute',
                  inset: 0,
                  display: 'none',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '6px',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  color: 'primary.main'
                }}>
                  {lender.initials}
                </Box>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {lender.name}
              </Typography>
            </Box>

            {/* Middle: Rate Columns */}
            <Box sx={{ 
              display: 'flex', 
              flex: '3 1 480px',
              flexWrap: 'wrap',
              gap: 3,
              px: 1
            }}>
              <Box sx={{ minWidth: '120px', flex: '1 1 120px' }}>
                <Typography variant="caption" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                  30–Year Fixed
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main', my: 0.5 }}>
                  {rates?.f30?.toFixed(2)}%
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'uppercase' }}>
                  APR {rates?.apr30?.toFixed(2)}%
                </Typography>
              </Box>

              <Box sx={{ minWidth: '120px', flex: '1 1 120px' }}>
                <Typography variant="caption" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                  15–Year Fixed
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main', my: 0.5 }}>
                  {rates?.f15?.toFixed(2)}%
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'uppercase' }}>
                  APR {rates?.apr15?.toFixed(2)}%
                </Typography>
              </Box>

              <Box sx={{ minWidth: '120px', flex: '1 1 120px' }}>
                <Typography variant="caption" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                  5/1 ARM
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main', my: 0.5 }}>
                  {rates?.arm?.toFixed(2)}%
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'uppercase' }}>
                  APR {rates?.aprArm?.toFixed(2)}%
                </Typography>
              </Box>
            </Box>

            {/* Right: CTA Button */}
            <Box sx={{ 
              flex: '0 0 auto', 
              ml: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              minWidth: '160px'
            }}>
              <Button
                variant="contained"
                onClick={() => handleLenderClick(lender)}
                sx={{
                  backgroundColor: 'primary.main',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: 600,
                  px: 3,
                  py: 1.5,
                  minWidth: '150px',
                  '&:hover': {
                    backgroundColor: 'primary.dark'
                  }
                }}
              >
                Check Rate
              </Button>
            </Box>
          </Paper>
        ))}
      </Box>

      {/* Disclaimer */}
      <Typography variant="caption" sx={{ 
        color: 'text.secondary', 
        textAlign: 'center', 
        display: 'block',
        lineHeight: 1.4,
        maxWidth: '800px',
        mx: 'auto'
      }}>
        Rates shown are for informational purposes only and do not constitute a loan offer.
      </Typography>
    </Box>
  );
};

export default AllRates;
