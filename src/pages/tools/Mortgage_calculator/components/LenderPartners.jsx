import * as React from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Tabs,
  Tab,
  Rating,
  Chip,
} from "@mui/material";

const lenderData = {
  best: [
    {
      id: 1,
      name: "Prime Lending",
      logo: "PL",
      rating: 4.9,
      review_count: 1204,
      min_credit: "620+",
      down_payment: "3%",
      external_url: "https://example.com/prime-lending",
    },
    {
      id: 2,
      name: "Future Finance",
      logo: "FF",
      rating: 4.8,
      review_count: 887,
      min_credit: "680+",
      down_payment: "5%",
      external_url: "https://example.com/future-finance",
    },
    {
      id: 3,
      name: "Homeowner Capital",
      logo: "HC",
      rating: 4.7,
      review_count: 623,
      min_credit: "640+",
      down_payment: "3%",
      external_url: "https://example.com/homeowner-capital",
    },
  ],
  "first-time": [
    {
      id: 4,
      name: "First Home Loans",
      logo: "FH",
      rating: 4.6,
      review_count: 512,
      min_credit: "600+",
      down_payment: "3%",
      external_url: "https://example.com/first-home-loans",
    },
  ],
  refinance: [
    {
      id: 5,
      name: "Refi Masters",
      logo: "RM",
      rating: 4.8,
      review_count: 945,
      min_credit: "660+",
      down_payment: "20%",
      external_url: "https://example.com/refi-masters",
    },
  ],
  heloc: [
    {
      id: 6,
      name: "HELOC Plus",
      logo: "HP",
      rating: 4.7,
      review_count: 734,
      min_credit: "680+",
      down_payment: "0%",
      external_url: "https://example.com/heloc-plus",
    },
  ],
  "home-equity": [
    {
      id: 7,
      name: "Equity First",
      logo: "EF",
      rating: 4.5,
      review_count: 421,
      min_credit: "650+",
      down_payment: "0%",
      external_url: "https://example.com/equity-first",
    },
  ],
};

export default function LenderPartners() {
  const [activeTab, setActiveTab] = React.useState(0);

  const tabCategories = [
    { label: "Best Lenders", value: "best" },
    { label: "First-Time Buyer", value: "first-time" },
    { label: "Refinance", value: "refinance" },
    { label: "HELOC", value: "heloc" },
    { label: "Home Equity Loans", value: "home-equity" },
  ];

  const currentCategory = tabCategories[activeTab].value;
  const lenders = lenderData[currentCategory] || [];

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
        Mortgage Loans from Our Partners
      </Typography>

      <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              minWidth: "auto",
            },
          }}
        >
          {tabCategories.map((category, index) => (
            <Tab key={index} label={category.label} />
          ))}
        </Tabs>

        <Box sx={{ p: 2 }}>
          {lenders.map((lender) => (
            <Paper
              key={lender.id}
              sx={{
                p: 2.5,
                mb: 2,
                display: "flex",
                alignItems: "center",
                gap: 2,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                flexWrap: { xs: "wrap", sm: "nowrap" },
              }}
            >
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: 2,
                  bgcolor: "primary.main",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "1.25rem",
                  flexShrink: 0,
                }}
              >
                {lender.logo}
              </Box>

              <Box sx={{ flex: 1, minWidth: 200 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {lender.name}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Rating
                    value={lender.rating}
                    precision={0.1}
                    readOnly
                    size="small"
                  />
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {lender.rating} ({lender.review_count} reviews)
                  </Typography>
                </Box>
                <Typography
                  variant="caption"
                  sx={{ color: "text.secondary", display: "block", mt: 0.5 }}
                >
                  NerdWallet rating
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 3,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary", display: "block" }}
                  >
                    Min. Credit
                  </Typography>
                  <Typography sx={{ fontWeight: 600 }}>
                    {lender.min_credit}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary", display: "block" }}
                  >
                    Down Pmt.
                  </Typography>
                  <Typography sx={{ fontWeight: 600 }}>
                    {lender.down_payment}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  sx={{
                    bgcolor: "#1976d2",
                    textTransform: "none",
                    fontWeight: 600,
                    px: 3,
                    "&:hover": {
                      bgcolor: "#1565c0",
                    },
                  }}
                  onClick={() => window.open(lender.external_url, "_blank")}
                >
                  Check Rate
                </Button>
              </Box>
            </Paper>
          ))}

          <Button
            fullWidth
            variant="outlined"
            sx={{
              mt: 2,
              py: 1.5,
              textTransform: "none",
              fontWeight: 600,
              fontSize: "1rem",
            }}
          >
            Compare More Lenders
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
