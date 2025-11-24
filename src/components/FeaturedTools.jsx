// src/components/FeaturedTools.jsx
import * as React from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Box,
  Stack,
  Chip,
  useTheme,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import extraPaymentImg from "../assets/images/extra_payment.jpg";
import takeHomePayImg from "../assets/images/take_home_pay.jpg";
import mortgageRatesImg from "../assets/images/mortgage_rates.jpg";
import creditCardImg from "../assets/images/credit_card.jpg";

const tools = [
  {
    title: "Financial Calculators",
    description: "Explore our full library of financial calculators.",
    to: "/tools",
    image: extraPaymentImg,
    accent: "#14B8A6",
    status: "Live",
  },
  {
    title: "Insurance Quote",
    description: "Get a personalized insurance quote.",
    to: "/tools/take-home-pay",
    image: takeHomePayImg,
    accent: "#38bdf8",
    status: "Live",
  },
  {
    title: "Mortgage Rates (Soon)",
    description: "Compare lender rates and fees side by side.",
    to: "/comparisons",
    image: mortgageRatesImg,
    accent: "#fbbf24",
    status: "Planned",
  },
  {
    title: "Credit Card Finder (Soon)",
    description: "Match cards to your spending profile.",
    to: "/guides",
    image: creditCardImg,
    accent: "#a78bfa",
    status: "Planned",
  },
];

const ToolCard = ({ title, description, to, image, accent, status }) => {
  const theme = useTheme();
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow:
          theme.palette.mode === "dark"
            ? "0 12px 28px rgba(0,0,0,0.38)"
            : "0 14px 32px rgba(15,23,42,0.14)",
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(180deg,#0f172a,#0b2530)"
            : "linear-gradient(180deg,#ffffff,#f8fafc)",
        transition: "transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          borderColor: accent,
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 16px 36px rgba(0,0,0,0.45)"
              : "0 18px 40px rgba(20,184,166,0.18)",
        },
        "&:focus-within": {
          borderColor: accent,
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 0 0 3px rgba(20,184,166,0.32)"
              : "0 0 0 3px rgba(20,184,166,0.2)",
        },
      }}
    >
      <CardActionArea
        component={RouterLink}
        to={to}
        aria-label={title}
        sx={{
          height: "100%",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        }}
      >
        <Box sx={{ position: "relative", width: "100%", pt: "62%" }}>
          <Box
            component="img"
            src={image}
            alt={title}
            loading="lazy"
            sx={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transformOrigin: "center",
              transition: "transform 0.35s ease",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.45) 100%), linear-gradient(135deg, ${accent}22, transparent 60%)`,
            }}
          />
        </Box>
        <CardContent
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 1.1,
            textAlign: "left",
            p: 2.4,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Chip
              label={status}
              size="small"
              sx={{
                borderRadius: "999px",
                fontWeight: 700,
                height: 26,
                backgroundColor: `${accent}22`,
                color: accent,
                border: "none",
              }}
            />
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: accent,
              }}
            />
          </Stack>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 800, fontSize: "1.02rem", letterSpacing: "-0.01em" }}
          >
            {title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default function FeaturedTools() {
  return (
    <Stack spacing={3} sx={{ mt: 2 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            md: "repeat(3, minmax(0, 1fr))",
            lg: "repeat(4, minmax(0, 1fr))",
          },
          gap: { xs: 2, sm: 2.5, md: 3 },
          alignItems: "stretch",
        }}
      >
        {tools.map((tool) => (
          <Box key={tool.title} sx={{ display: "flex" }}>
            <ToolCard {...tool} />
          </Box>
        ))}
      </Box>
    </Stack>
  );
}
