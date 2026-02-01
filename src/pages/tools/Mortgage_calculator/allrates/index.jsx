import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Breadcrumbs, Link, Paper } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AllRatesComponent from '../../../../components/calculators_shared_files/all_rates/AllRates';
import { useTranslation } from 'react-i18next';

const AllRates = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Box sx={{
      minHeight: '100vh',
      background: (theme) =>
        theme.palette.mode === 'dark'
          ? 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)'
          : 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
    }}>
      {/* Header with Navigation */}
      <Box sx={{
        backgroundColor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        p: 3
      }}>
        <Box sx={{
          maxWidth: '1400px',
          margin: '0 auto',
          width: '100%'
        }}>
          {/* Breadcrumbs */}
          <Breadcrumbs sx={{ mb: 2 }}>
            <Link
              color="inherit"
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
              }}
              sx={{
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              {t("mortgage.allrates.home")}
            </Link>
            <Link
              color="inherit"
              href="/tools"
              onClick={(e) => {
                e.preventDefault();
                navigate('/tools');
              }}
              sx={{
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              {t("mortgage.allrates.financialTools")}
            </Link>
            <Link
              color="inherit"
              href="/tools/mortgage_calculator"
              onClick={(e) => {
                e.preventDefault();
                navigate('/tools/mortgage_calculator');
              }}
              sx={{
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              {t("mortgage.allrates.mortgageCalculator")}
            </Link>
            <Typography color="text.primary">{t("mortgage.allrates.allRatesLabel")}</Typography>
          </Breadcrumbs>

          {/* Page Header */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: 1
          }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/tools/mortgage_calculator')}
              variant="outlined"
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500
              }}
            >
              {t("mortgage.allrates.backToCalculator")}
            </Button>
          </Box>

          <Typography variant="h3" sx={{
            fontWeight: 700,
            mb: 1,
            color: 'text.primary'
          }}>
            {t("mortgage.allrates.compareTitle")}
          </Typography>
          <Typography variant="h6" sx={{
            color: 'text.secondary',
            fontWeight: 400
          }}>
            {t("mortgage.allrates.compareSubtitle")}
          </Typography>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{
        py: 4,
        px: { xs: 2, md: 3 }
      }}>
        <Box sx={{
          maxWidth: '1400px',
          margin: '0 auto',
          width: '100%'
        }}>
          <AllRatesComponent />
        </Box>
      </Box>
    </Box>
  );
};

export default AllRates;
