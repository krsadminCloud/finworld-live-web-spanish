import * as React from "react";
import { Box, Paper, Typography, Button, Modal } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AllRates from "../../../../components/calculators_shared_files/all_rates/AllRates";

const rateData = [
  {
    title: "All Rates",
    subtitle: "As low as 6.25% APR",
    description: "Compare rates from multiple lenders",
  },
  {
    title: "30-Year Rates",
    subtitle: "As low as 6.50% APR",
    description: "Most popular fixed-rate mortgage",
  },
  {
    title: "15-Year Rates",
    subtitle: "As low as 5.75% APR",
    description: "Save on interest with shorter term",
  },
];

export default function RateCards() {
  const [showAllRates, setShowAllRates] = React.useState(false);

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
        Mortgage Rates
      </Typography>
      <Box sx={{ display: "flex", gap: 2, flexWrap: { xs: "wrap", sm: "nowrap" } }}>
        {rateData.map((rate, index) => (
          <Paper
            key={index}
            onClick={() => {
              if (index === 0) {
                setShowAllRates(true);
              }
            }}
            sx={{
              p: 2.5,
              borderRadius: 2,
              flex: { xs: "1 1 100%", sm: "1 1 0" },
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: (theme) =>
                  theme.palette.mode === "dark"
                    ? "0 8px 24px rgba(0,0,0,0.4)"
                    : "0 8px 24px rgba(0,0,0,0.12)",
              },
              cursor: index === 0 ? "pointer" : "default",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
              {rate.title}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "primary.main", fontWeight: 600, mb: 1 }}
            >
              {rate.subtitle}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", mb: 2, flex: 1 }}
            >
              {rate.description}
            </Typography>
            {index === 0 && (
              <Box sx={{ mt: "auto" }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "primary.main",
                    fontWeight: 600,
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                >
                  View Rates <ArrowForwardIcon sx={{ ml: 0.5, fontSize: "1rem" }} />
                </Typography>
              </Box>
            )}
          </Paper>
        ))}
      </Box>

      {/* Modal for All Rates */}
      <Modal
        open={showAllRates}
        onClose={() => setShowAllRates(false)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box sx={{
          width: '95%',
          maxWidth: '1400px',
          maxHeight: '95vh',
          overflow: 'auto',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
        }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            borderBottom: '1px solid',
            borderColor: 'divider'
          }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Compare Mortgage Rates
            </Typography>
            <Button
              onClick={() => setShowAllRates(false)}
              sx={{
                minWidth: 'auto',
                p: 1,
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }}
            >
              ✕
            </Button>
          </Box>
          <AllRates />
        </Box>
      </Modal>
    </Box>
  );
}
