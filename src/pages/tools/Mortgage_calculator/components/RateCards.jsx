import * as React from "react";
import { Box, Paper, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";

const rateData = [
  {
    title: "All Rates",
    subtitle: "As low as 6.25% APR",
    description: "Compare rates from multiple lenders",
    action: "navigate"
  },
  {
    title: "30-Year Rates",
    subtitle: "As low as 6.50% APR",
    description: "Most popular fixed-rate mortgage",
    action: "none"
  },
  {
    title: "15-Year Rates",
    subtitle: "As low as 5.75% APR",
    description: "Save on interest with shorter term",
    action: "none"
  },
];

export default function RateCards() {
  const navigate = useNavigate();

  const handleCardClick = (index) => {
    if (rateData[index].action === "navigate") {
      navigate("/tools/mortgage_calculator/allrates");
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
        Mortgage Rates
      </Typography>
      <Box sx={{ display: "flex", gap: 2, flexWrap: { xs: "wrap", sm: "nowrap" } }}>
        {rateData.map((rate, index) => (
          <Paper
            key={index}
            onClick={() => handleCardClick(index)}
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
              cursor: rate.action === "navigate" ? "pointer" : "default",
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
            {rate.action === "navigate" && (
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
    </Box>
  );
}
