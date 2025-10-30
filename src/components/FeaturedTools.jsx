// src/components/FeaturedTools.jsx
import * as React from "react";
import {
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Box,
  Stack,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

// 🖼️ Local image imports
import extraPaymentImg from "../assets/images/extra_payment.jpg";
import takeHomePayImg from "../assets/images/take_home_pay.jpg";
import mortgageRatesImg from "../assets/images/mortgage_rates.jpg";
import creditCardImg from "../assets/images/credit_card.jpg";

// 🔹 Card template component
const ToolCard = ({ title, description, to, image }) => (
  <Card
    sx={{
      width: 230,
      height: 260,
      borderRadius: 3,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      mx: "auto",
      transition: "all 0.3s ease",
      boxShadow: 2,
      "&:hover": {
        transform: "translateY(-5px) scale(1.03)",
        boxShadow: 8,
      },
    }}
  >
    <CardActionArea
      component={RouterLink}
      to={to}
      onClick={(e) => {
        // 🚀 Fallback: if React Router misroutes, force redirect
        if (to.startsWith("http") || to.startsWith("/tools/take_home_pay")) {
          e.preventDefault();
          window.location.href = to;
        }
      }}
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Box
        component="img"
        src={image}
        alt={title}
        sx={{
          width: "100%",
          height: 120,
          objectFit: "cover",
          transition: "transform 0.4s ease",
          "&:hover": {
            transform: "scale(1.05)",
          },
        }}
      />
      <CardContent sx={{ flexGrow: 1, textAlign: "center", p: 2 }}>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 700, fontSize: "0.95rem", mb: 0.5 }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: "0.8rem" }}
        >
          {description}
        </Typography>
      </CardContent>
    </CardActionArea>
  </Card>
);

// 🔹 Main component: FeaturedTools
export default function FeaturedTools() {
  return (
    <Stack spacing={4} sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3} justifyContent="center" alignItems="center">
        {/* 🧮 Financial Calculators */}
        <Grid item>
          <ToolCard
            title="Financial Calculators"
            description="Explore our full library of financial calculators."
            to="/tools"
            image={extraPaymentImg}
          />
        </Grid>

        {/* �️ Insurance Quote */}
        <Grid item>
          <ToolCard
            title="Insurance Quote"
            description="Get a personalized insurance quote."
            to="/tools/take_home_pay" // ✅ Absolute route
            image={takeHomePayImg}
          />
        </Grid>

        {/* 🏠 Mortgage Rates */}
        <Grid item>
          <ToolCard
            title="Mortgage Rates (Soon)"
            description="Compare lender rates and fees side by side."
            to="/comparisons"
            image={mortgageRatesImg}
          />
        </Grid>

        {/* 💳 Credit Card Finder */}
        <Grid item>
          <ToolCard
            title="Credit Card Finder (Soon)"
            description="Match cards to your spending profile."
            to="/guides"
            image={creditCardImg}
          />
        </Grid>
      </Grid>
    </Stack>
  );
}
