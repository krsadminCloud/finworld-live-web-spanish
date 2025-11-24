// src/pages/tools/index.jsx
import * as React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Stack,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Container,
  Paper,
  Divider,
  Card,
  Tooltip,
  Badge,
  IconButton as MuiIconButton,
  Collapse,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { ColorModeContext } from "../../context/ColorModeContext";

// Icons
import CalculateIcon from "@mui/icons-material/Calculate";
import SearchIcon from "@mui/icons-material/Search";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import PaidIcon from "@mui/icons-material/Paid";
import PaymentsIcon from "@mui/icons-material/Payments";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import EventRepeatIcon from "@mui/icons-material/EventRepeat";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import RealEstateAgentIcon from "@mui/icons-material/RealEstateAgent";
import HouseIcon from "@mui/icons-material/House";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import ApartmentIcon from "@mui/icons-material/Apartment";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import SavingsIcon from "@mui/icons-material/Savings";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import SchoolIcon from "@mui/icons-material/School";
import HomeIcon from "@mui/icons-material/Home";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function FinancialCalculators() {
  const theme = useTheme();
  const navigate = useNavigate();
  const colorMode = React.useContext(ColorModeContext);

  const [query, setQuery] = React.useState("");
  const [debouncedQuery, setDebouncedQuery] = React.useState("");
  const [category, setCategory] = React.useState("All");
  const [showPlanned, setShowPlanned] = React.useState(false);
  const searchRef = React.useRef(null);

  const calculators = [
    {
      title: "Mortgage Calculator",
      icon: <PaymentsIcon sx={{ color: "#0ea5e9" }} fontSize="large" />,
      to: "/tools/mortgage-calculator",
      cat: "Mortgage",
      status: "live",
      desc: "Monthly payment with taxes, insurance, PMI, and amortization.",
      tags: ["payment", "mortgage", "piti"],
    },
    {
      title: "Loan Payoff Calculator",
      icon: <PaidIcon sx={{ color: "#10b981" }} fontSize="large" />,
      to: "/tools/extra-payment",
      cat: "Mortgage",
      status: "live",
      desc: "Compare extra payment strategies and interest saved.",
      tags: ["loan", "payoff", "extra"],
    },
    {
      title: "Mortgage Affordability Calculator",
      icon: <AttachMoneyIcon sx={{ color: "#22c55e" }} fontSize="large" />,
      to: "/tools/home-affordability",
      cat: "Mortgage",
      status: "live",
      desc: "Income and debts to realistic price range and monthly cost.",
      tags: ["dti", "price", "budget"],
    },
    {
      title: "Rental Property Calculator",
      icon: <RealEstateAgentIcon sx={{ color: "#06b6d4" }} fontSize="large" />,
      to: "/tools/rental-property-calculator",
      cat: "Investment",
      status: "live",
      desc: "Cash flow, cap rate, and cash-on-cash returns.",
      tags: ["rental", "cap rate", "coc"],
    },
    {
      title: "Compounding Calculator",
      icon: <TrendingUpIcon sx={{ color: "#f59e0b" }} fontSize="large" />,
      to: "/tools/compounding-calculator",
      cat: "Personal Finance",
      status: "live",
      desc: "Project growth with contributions and flexible frequency.",
      tags: ["investment", "compound", "savings"],
    },
    {
      title: "Retirement Saving",
      icon: <SavingsIcon sx={{ color: "#60a5fa" }} fontSize="large" />,
      to: "/tools/retirement-calculator",
      cat: "Retirement",
      status: "live",
      desc: "Retirement trajectory with inflation-aware projections.",
      tags: ["retirement", "nest egg", "drawdown"],
    },
    {
      title: "Take Home Pay",
      icon: <AttachMoneyIcon sx={{ color: "#f472b6" }} fontSize="large" />,
      to: "/tools/take-home-pay",
      cat: "Taxes",
      status: "live",
      desc: "Net pay after federal, state, FICA, and deductions.",
      tags: ["paycheck", "tax", "net"],
    },
    {
      title: "Car Loan",
      icon: <DirectionsCarIcon sx={{ color: "#38bdf8" }} fontSize="large" />,
      to: "/tools/auto-loan-calculator",
      cat: "Auto",
      status: "live",
      desc: "Auto loan payment, interest, and payoff timing.",
      tags: ["auto", "loan", "payoff"],
    },
    {
      title: "Buy vs Lease",
      icon: <DirectionsCarIcon sx={{ color: "#22d3ee" }} fontSize="large" />,
      to: "/tools/buy-vs-lease-auto",
      cat: "Auto",
      status: "live",
      desc: "Total cost comparison over your chosen horizon.",
      tags: ["lease", "auto", "compare"],
    },
    { title: "Mortgage Amortization Calculator", icon: <ReceiptLongIcon sx={{ color: "#93C5FD" }} fontSize="large" />, cat: "Mortgage", status: "planned", desc: "Full amortization table with exports.", tags: ["schedule"] },
    { title: "Bi-Weekly Payment Calculator", icon: <EventRepeatIcon sx={{ color: "#C4B5FD" }} fontSize="large" />, cat: "Mortgage", status: "planned", desc: "Bi-weekly vs monthly payoff savings.", tags: ["biweekly"] },
    { title: "Interest-Only Mortgage Calculator", icon: <MoneyOffIcon sx={{ color: "#FCA5A5" }} fontSize="large" />, cat: "Mortgage", status: "planned", desc: "IO period impact on payment and equity.", tags: ["interest only"] },
    { title: "Adjustable Rate (ARM) Calculator", icon: <TrendingUpIcon sx={{ color: "#FCD34D" }} fontSize="large" />, cat: "Mortgage", status: "planned", desc: "Reset scenarios and payment changes.", tags: ["arm"] },
    { title: "Balloon Mortgage Calculator", icon: <RocketLaunchIcon sx={{ color: "#FDBA74" }} fontSize="large" />, cat: "Mortgage", status: "planned", desc: "Balloon payment sizing and risk.", tags: ["balloon"] },
    { title: "Mortgage Refinance Calculator", icon: <RealEstateAgentIcon sx={{ color: "#93C5FD" }} fontSize="large" />, cat: "Mortgage", status: "planned", desc: "Refi break-even and total cost.", tags: ["refi"] },
    { title: "Home Equity Loan Calculator", icon: <HouseIcon sx={{ color: "#A7F3D0" }} fontSize="large" />, cat: "Mortgage", status: "planned", desc: "HELOC vs fixed equity options.", tags: ["heloc"] },
    { title: "Mortgage Comparison Calculator", icon: <CompareArrowsIcon sx={{ color: "#C7D2FE" }} fontSize="large" />, cat: "Mortgage", status: "planned", desc: "Side-by-side loan comparisons.", tags: ["compare"] },
    { title: "Rent vs. Buy Calculator", icon: <ApartmentIcon sx={{ color: "#BAE6FD" }} fontSize="large" />, cat: "Mortgage", status: "planned", desc: "Long-run rent vs own math.", tags: ["rent"] },
    { title: "Budget Planner", icon: <CalculateIcon sx={{ color: "#FDE68A" }} fontSize="large" />, cat: "Personal Finance", status: "planned", desc: "Envelope-style monthly budget.", tags: ["budget"] },
    { title: "Net Worth", icon: <AccountBalanceIcon sx={{ color: "#A7F3D0" }} fontSize="large" />, cat: "Personal Finance", status: "planned", desc: "Track assets, debts, progress.", tags: ["net worth"] },
    { title: "Debt Payoff", icon: <MoneyOffIcon sx={{ color: "#FCA5A5" }} fontSize="large" />, cat: "Personal Finance", status: "planned", desc: "Snowball vs avalanche plans.", tags: ["debt"] },
    { title: "Savings Goal", icon: <SavingsIcon sx={{ color: "#86EFAC" }} fontSize="large" />, cat: "Personal Finance", status: "planned", desc: "Timeline to reach a target.", tags: ["savings"] },
    { title: "Credit Card Payoff", icon: <CreditCardIcon sx={{ color: "#FBBF24" }} fontSize="large" />, cat: "Personal Finance", status: "planned", desc: "APR, fees, and payoff speed.", tags: ["card"] },
    { title: "Emergency Fund", icon: <HealthAndSafetyIcon sx={{ color: "#FBCFE8" }} fontSize="large" />, cat: "Personal Finance", status: "planned", desc: "Safety net sizing and pacing.", tags: ["emergency"] },
    { title: "College Savings", icon: <SchoolIcon sx={{ color: "#C7D2FE" }} fontSize="large" />, cat: "Personal Finance", status: "planned", desc: "529 growth and withdrawal needs.", tags: ["college"] },
    { title: "Home Affordability", icon: <HomeIcon sx={{ color: "#FDBA74" }} fontSize="large" />, cat: "Personal Finance", status: "planned", desc: "Quick affordability check.", tags: ["afford"] },
  ];

  const categories = ["All", ...Array.from(new Set(calculators.map((c) => c.cat)))];
  const liveCalculators = calculators.filter((c) => c.status === "live");
  const plannedCalculators = calculators.filter((c) => c.status === "planned");
  const plannedByCategory = plannedCalculators.reduce((acc, item) => {
    if (!acc[item.cat]) acc[item.cat] = [];
    acc[item.cat].push(item);
    return acc;
  }, {});

  React.useEffect(() => {
    searchRef.current?.focus();
  }, []);

  React.useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(query.trim().toLowerCase()), 180);
    return () => clearTimeout(id);
  }, [query]);

  React.useEffect(() => {
    const handleSlashFocus = (e) => {
      const target = e.target;
      const isFormField =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.getAttribute("contenteditable") === "true";
      if (e.key === "/" && !isFormField) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleSlashFocus);
    return () => window.removeEventListener("keydown", handleSlashFocus);
  }, []);

  const filteredLive = liveCalculators.filter((c) => {
    const matchesCategory = category === "All" ? true : c.cat === category;
    const q = debouncedQuery;
    const matchesQuery =
      !q ||
      c.title.toLowerCase().includes(q) ||
      (c.desc && c.desc.toLowerCase().includes(q)) ||
      (c.tags && c.tags.some((tag) => tag.toLowerCase().includes(q)));
    return matchesCategory && matchesQuery;
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        backgroundImage:
          theme.palette.mode === "dark"
            ? "radial-gradient(circle at 20% 20%, rgba(45,212,191,0.08), transparent 40%), radial-gradient(circle at 80% 0%, rgba(59,130,246,0.08), transparent 45%)"
            : "radial-gradient(circle at 20% 20%, rgba(20,184,166,0.08), transparent 40%), radial-gradient(circle at 80% 0%, rgba(59,130,246,0.08), transparent 45%)",
      }}
    >
      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: "background.paper",
          color: "text.primary",
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar sx={{ px: { xs: 2, md: 6 }, minHeight: { xs: 72, md: 64 } }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <CalculateIcon sx={{ color: "#14B8A6" }} />
            <Typography variant="h6" fontWeight={800} sx={{ letterSpacing: "-0.02em" }}>
              <Box component="span" sx={{ color: "inherit" }}>Fin</Box>
              <Box component="span" sx={{ color: "#14B8A6" }}>World</Box>
            </Typography>
          </Stack>

          <Box sx={{ flexGrow: 1 }} />

          <Stack
            direction="row"
            spacing={{ xs: 0.5, md: 1.5 }}
            alignItems="center"
            flexWrap={{ xs: "wrap", md: "nowrap" }}
            justifyContent={{ xs: "flex-end", md: "flex-start" }}
            useFlexGap
            sx={{ rowGap: { xs: 1, md: 0 } }}
          >
            <IconButton
              onClick={colorMode.toggleColorMode}
              color="inherit"
              size="small"
              sx={{
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
              }}
            >
              {theme.palette.mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
            <Button
              size="small"
              variant="contained"
              sx={{
                borderRadius: 50,
                fontWeight: 700,
                px: { xs: 1.25, md: 2.5 },
                py: { xs: 0.5, md: 1 },
                whiteSpace: "nowrap",
                bgcolor: "#14B8A6",
                color: "#fff",
                "&:hover": { bgcolor: "#0f948a" },
              }}
            >
              My Account
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Paper
          elevation={1}
          sx={{
            p: { xs: 3, md: 5 },
            mb: 4,
            borderRadius: "20px",
            overflow: "hidden",
            backgroundImage:
              theme.palette.mode === "dark"
                ? "linear-gradient(135deg,#0b1727 0%,#0f2e2c 100%), radial-gradient(circle at 20% 10%, rgba(45,212,191,0.12), transparent 45%)"
                : "linear-gradient(135deg,#f8fffb 0%,#ecfeff 45%,#f2f6ff 100%), radial-gradient(circle at 20% 10%, rgba(20,184,166,0.14), transparent 48%)",
            backgroundBlendMode: "screen",
            border: `1px solid ${theme.palette.divider}`,
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 14px 36px rgba(0,0,0,0.32)"
                : "0 18px 44px rgba(15,23,42,0.12)",
          }}
        >
          <Stack direction={{ xs: "column", md: "row" }} spacing={4} alignItems="stretch">
            <Stack spacing={2} flex={1}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Badge color="success" variant="dot" anchorOrigin={{ vertical: "top", horizontal: "left" }}>
                  <Chip label="Fresh & trusted" color="success" size="small" />
                </Badge>
                <Chip label="No sign-up" variant="outlined" size="small" />
              </Stack>
              <Typography
                variant="h3"
                fontWeight={800}
                sx={{
                  letterSpacing: "-0.03em",
                  fontSize: { xs: "2rem", sm: "2.4rem", md: "2.9rem" },
                  lineHeight: 1.15,
                  color: theme.palette.mode === "dark" ? "#c4f1f9" : "#0f766e",
                }}
              >
                Financial Calculators, tuned for real decisions.
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: 720 }}>
                Compare mortgages, plan paychecks, and stress-test investments without spreadsheets.
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => document?.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" })}
                  sx={{
                    px: 3,
                    py: 1.25,
                    borderRadius: 999,
                    bgcolor: "#14B8A6",
                    "&:hover": { bgcolor: "#0f948a" },
                  }}
                >
                  Browse calculators
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => window.open("mailto:hello@finworld.live?subject=Calculator%20request")}
                  sx={{ px: 3, py: 1.25, borderRadius: 999 }}
                >
                  Suggest a calculator
                </Button>
              </Stack>
            </Stack>

            <Paper
              elevation={0}
              sx={{
                flex: 1,
                width: "100%",
                borderRadius: "16px",
                p: { xs: 2.5, md: 3 },
                background:
                  theme.palette.mode === "dark"
                    ? "linear-gradient(145deg,rgba(15,23,42,0.8),rgba(17,24,39,0.7))"
                    : "linear-gradient(145deg,rgba(255,255,255,0.85),rgba(230,255,251,0.8))",
                border: `1px solid ${theme.palette.divider}`,
                boxShadow:
                  theme.palette.mode === "dark"
                    ? "0 10px 26px rgba(0,0,0,0.32)"
                    : "0 12px 28px rgba(15,23,42,0.08)",
                backdropFilter: "blur(6px)",
              }}
            >
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Quick actions
              </Typography>
              <Stack spacing={1.25}>
                {[
                  { label: "Plan a mortgage payment", to: "/tools/mortgage-calculator", icon: <PaymentsIcon fontSize="small" /> },
                  { label: "Pay down a loan faster", to: "/tools/extra-payment", icon: <PaidIcon fontSize="small" /> },
                  { label: "Project retirement savings", to: "/tools/retirement-calculator", icon: <SavingsIcon fontSize="small" /> },
                ].map((item, idx) => (
                  <Paper
                    key={item.label}
                    elevation={0}
                    onClick={() => navigate(item.to)}
                    sx={{
                      p: 1.5,
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      gap: 1.25,
                      cursor: "pointer",
                      border: `1px solid ${theme.palette.divider}`,
                      transition: "all 0.18s ease",
                      backgroundColor: theme.palette.mode === "dark" ? "rgba(15,23,42,0.6)" : "rgba(255,255,255,0.7)",
                      backdropFilter: "blur(4px)",
                      "&:not(:last-of-type)": {
                        borderBottom: `1px solid ${theme.palette.divider}`,
                      },
                      "&:hover": {
                        borderColor: "#14B8A6",
                        transform: "translateY(-2px)",
                        boxShadow:
                          theme.palette.mode === "dark"
                            ? "0 10px 22px rgba(0,0,0,0.42)"
                            : "0 12px 26px rgba(20,184,166,0.14)",
                      },
                    }}
                  >
                    {item.icon}
                    <Typography fontWeight={700}>{item.label}</Typography>
                  </Paper>
                ))}
              </Stack>
            </Paper>
          </Stack>
        </Paper>

        <Paper
          elevation={1}
          sx={{
            mx: { xs: 0, sm: "auto" },
            mb: 2.5,
            maxWidth: 920,
            borderRadius: "14px",
            p: 1.1,
            position: "sticky",
            top: 12,
            zIndex: 2,
            border: `1px solid ${theme.palette.divider}`,
            background:
              theme.palette.mode === "dark"
                ? "linear-gradient(135deg,rgba(15,23,42,0.82),rgba(11,17,32,0.78))"
                : "linear-gradient(135deg,rgba(255,255,255,0.92),rgba(240,249,255,0.9))",
            backdropFilter: "blur(10px)",
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 10px 24px rgba(0,0,0,0.32)"
                : "0 12px 26px rgba(15,23,42,0.12)",
            transition: "box-shadow 0.2s ease, border-color 0.2s ease",
            "&:focus-within": {
              borderColor: "#14B8A6",
              boxShadow:
                theme.palette.mode === "dark"
                  ? "0 0 0 3px rgba(20,184,166,0.35)"
                  : "0 0 0 3px rgba(20,184,166,0.18)",
            },
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <TextField
              fullWidth
              placeholder='Search title, purpose, or tags (e.g., "amortization", "paycheck", "rental")'
              variant="standard"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              inputRef={searchRef}
              InputProps={{
                disableUnderline: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: query ? (
                  <InputAdornment position="end">
                    <MuiIconButton
                      aria-label="Clear search"
                      size="small"
                      onClick={() => setQuery("")}
                    >
                      <CloseRoundedIcon fontSize="small" />
                    </MuiIconButton>
                  </InputAdornment>
                ) : null,
                sx: { px: 1.75, py: 1, fontSize: "1rem", backgroundColor: "transparent" },
              }}
            />
            <Chip
              label={`${filteredLive.length} results`}
              size="small"
              variant="outlined"
              sx={{ borderRadius: "999px" }}
            />
          </Stack>
        </Paper>

        <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" sx={{ mb: 1.5 }}>
          <Typography variant="body2" color="text.secondary">
            Showing {filteredLive.length} of {liveCalculators.length} live calculators
          </Typography>
          {(debouncedQuery || category !== "All") && (
            <Chip
              label="Filters active"
              size="small"
              color="primary"
              onDelete={() => {
                setCategory("All");
                setQuery("");
              }}
            />
          )}
        </Stack>

        <Stack spacing={1.5} sx={{ mb: 2 }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 800, color: theme.palette.mode === "dark" ? "#e0f2fe" : "#0f172a" }}
          >
            Popular
          </Typography>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2} useFlexGap flexWrap="wrap">
            {[
              { title: "Mortgage payment", desc: "See monthly payment with taxes, insurance, and PMI.", to: "/tools/mortgage-calculator", icon: <PaymentsIcon /> },
              { title: "Loan payoff boost", desc: "Compare extra payments and interest saved.", to: "/tools/extra-payment", icon: <PaidIcon /> },
              { title: "Plan retirement", desc: "Estimate contributions, growth, and withdrawals.", to: "/tools/retirement-calculator", icon: <SavingsIcon /> },
              { title: "Take-home pay", desc: "Federal, state, and FICA deductions applied.", to: "/tools/take-home-pay", icon: <AttachMoneyIcon /> },
            ].map((item) => (
              <Paper
                key={item.title}
                elevation={0}
                onClick={() => navigate(item.to)}
                sx={{
                  flex: { md: "1 1 220px" },
                  p: 2,
                  borderRadius: 3,
                  cursor: "pointer",
                  border: `1px solid ${theme.palette.divider}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.25,
                  transition: "all 0.15s ease",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    borderColor: "#14B8A6",
                    boxShadow:
                      theme.palette.mode === "dark"
                        ? "0 10px 22px rgba(0,0,0,0.45)"
                        : "0 12px 28px rgba(20,184,166,0.16)",
                  },
                }}
              >
                <Box sx={{ color: "#14B8A6" }}>{item.icon}</Box>
                <Box>
                  <Typography fontWeight={800}>{item.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.desc}
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Stack>
        </Stack>

        <Divider sx={{ mb: 3 }} />

        <Stack
          id="catalog"
          direction="row"
          spacing={{ xs: 0.75, md: 1 }}
          justifyContent="center"
          flexWrap="wrap"
          useFlexGap
          sx={{
            mb: 2.5,
            rowGap: { xs: 1, md: 0.85 },
            backdropFilter: "blur(8px)",
            backgroundColor:
              theme.palette.mode === "dark" ? "rgba(15,23,42,0.78)" : "rgba(255,255,255,0.9)",
            borderRadius: "12px",
            px: 2,
            py: 0.9,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 10px 24px rgba(0,0,0,0.3)"
                : "0 10px 26px rgba(15,23,42,0.08)",
          }}
        >
          {categories.map((c) => {
            const count = liveCalculators.filter((item) => (c === "All" ? true : item.cat === c)).length;
            return (
              <Chip
                key={c}
                label={c === "All" ? "All" : `${c} - ${count}`}
                onClick={() => setCategory(c)}
                color={c === category ? "primary" : "default"}
                variant={c === category ? "filled" : "outlined"}
                sx={{
                  borderRadius: "999px",
                  height: { xs: 30, md: 34 },
                  fontSize: { xs: ".82rem", md: ".9rem" },
                  px: { xs: 0.5, md: 1 },
                  fontWeight: 700,
                  boxShadow: c === category ? "0 4px 10px rgba(16,185,129,0.3)" : "none",
                  "&:hover": {
                    boxShadow:
                      c === category
                        ? "0 6px 16px rgba(16,185,129,0.35)"
                        : "0 4px 8px rgba(0,0,0,0.05)",
                  },
                }}
              />
            );
          })}
        </Stack>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(auto-fit,minmax(240px,1fr))", sm: "repeat(auto-fit,minmax(260px,1fr))" },
            gap: { xs: 1.5, md: 2 },
            alignItems: "stretch",
          }}
        >
          {filteredLive.map((item) => {
            const accentColor = item.icon?.props?.sx?.color || "#14B8A6";
            return (
              <Card
                key={item.title}
                onClick={() => item.to && navigate(item.to)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if ((e.key === "Enter" || e.key === " " ) && item.to) {
                    e.preventDefault();
                    navigate(item.to);
                  }
                }}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  minHeight: 200,
                  borderRadius: "14px",
                  textAlign: "left",
                  cursor: "pointer",
                  background:
                    theme.palette.mode === "dark"
                      ? "linear-gradient(180deg,#0f172a,#0b2530)"
                      : "linear-gradient(180deg,#ffffff,#f8fafc)",
                  border: `1px solid ${theme.palette.divider}`,
                  boxShadow:
                    theme.palette.mode === "dark"
                      ? "0 6px 14px rgba(0,0,0,0.28)"
                      : "0 10px 28px rgba(15,23,42,0.12)",
                  outline: "none",
                  transition: "transform .18s ease, box-shadow .18s ease, background .2s ease, border-color .2s ease",
                  p: 2.5,
                  gap: 1.25,
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow:
                      theme.palette.mode === "dark"
                        ? "0 14px 32px rgba(0,0,0,0.38)"
                        : "0 14px 36px rgba(15,23,42,0.18)",
                    borderColor: accentColor,
                  },
                  "&:focus-visible": {
                    borderColor: accentColor,
                    boxShadow:
                      theme.palette.mode === "dark"
                        ? "0 0 0 3px rgba(20,184,166,0.35)"
                        : "0 0 0 3px rgba(20,184,166,0.22)",
                  },
                }}
              >
                <Stack spacing={1} sx={{ height: "100%" }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Box
                      sx={{
                        color: accentColor,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 36,
                        height: 36,
                        borderRadius: "12px",
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? "rgba(20,184,166,0.12)"
                            : "rgba(20,184,166,0.08)",
                      }}
                    >
                      {item.icon && React.cloneElement(item.icon, { fontSize: "medium" })}
                    </Box>
                    <Chip
                      label={item.cat}
                      size="small"
                      variant="outlined"
                      sx={{
                        fontWeight: 700,
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? "rgba(20,184,166,0.08)"
                            : "rgba(20,184,166,0.08)",
                        borderColor: "transparent",
                      }}
                    />
                  </Stack>
                  <Typography fontWeight={800} sx={{ mt: 0.25, letterSpacing: "-0.01em" }}>
                    {item.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      lineHeight: 1.5,
                    }}
                  >
                    {item.desc}
                  </Typography>
                  {!!item.tags?.length && (
                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: "auto" }}>
                      {item.tags.slice(0, 3).map((tag) => (
                        <Stack direction="row" spacing={0.5} alignItems="center" key={tag}>
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              backgroundColor: accentColor,
                            }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {tag}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  )}
                </Stack>
              </Card>
            );
          })}
        </Box>

        {!filteredLive.length && (
          <Paper
            elevation={0}
            sx={{
              mt: 3,
              p: 3,
              borderRadius: 3,
              textAlign: "center",
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography fontWeight={800}>No calculators match your filters.</Typography>
            <Typography variant="body2" color="text.secondary">
              Try clearing filters or switching categories.
            </Typography>
          </Paper>
        )}

        <Stack spacing={1.5} sx={{ mt: 6 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h6" fontWeight={800}>
                Planned calculators
              </Typography>
              <Chip label={`${plannedCalculators.length} planned`} color="default" size="small" />
            </Stack>
            <Button
              size="small"
              variant="text"
              endIcon={
                <ExpandMoreIcon
                  sx={{ transform: showPlanned ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }}
                />
              }
              onClick={() => setShowPlanned((p) => !p)}
            >
              {showPlanned ? "Hide planned" : "Show planned"}
            </Button>
          </Stack>
          <Collapse in={showPlanned}>
            <Stack spacing={2.5} sx={{ pt: 1 }}>
              {Object.entries(plannedByCategory).map(([cat, items]) => (
                <Box key={cat}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 800 }}>
                    {cat}
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "repeat(auto-fit,minmax(220px,1fr))", sm: "repeat(auto-fit,minmax(240px,1fr))" },
                      gap: { xs: 1.25, md: 1.5 },
                    }}
                  >
                    {items.map((item) => (
                      <Paper
                        key={item.title}
                        elevation={0}
                        sx={{
                          height: "100%",
                          p: 2.25,
                          borderRadius: "14px !important",
                          border: `1px dashed ${theme.palette.divider}`,
                          opacity: 0.92,
                          color: theme.palette.text.secondary,
                          background:
                            theme.palette.mode === "dark"
                              ? "linear-gradient(135deg,rgba(148,163,184,0.08),rgba(148,163,184,0.04))"
                              : "linear-gradient(135deg,#f8fafc,#f4f4f5)",
                          filter: "grayscale(0.75)",
                          boxShadow:
                            theme.palette.mode === "dark"
                              ? "0 10px 24px rgba(0,0,0,0.26)"
                              : "0 12px 26px rgba(15,23,42,0.08)",
                        }}
                      >
                        <Stack spacing={1.25} sx={{ height: "100%" }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            {item.icon}
                            <Tooltip title="Coming soon">
                              <Chip label="Coming soon" size="small" color="default" />
                            </Tooltip>
                          </Box>
                          <Typography fontWeight={800}>{item.title}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.desc}
                          </Typography>
                          {!!item.tags?.length && (
                            <Stack direction="row" spacing={1} flexWrap="wrap">
                              {item.tags.slice(0, 3).map((tag) => (
                                <Stack direction="row" spacing={0.5} alignItems="center" key={tag}>
                                  <Box
                                    sx={{
                                      width: 6,
                                      height: 6,
                                      borderRadius: "50%",
                                      backgroundColor: item.icon?.props?.sx?.color || "#94a3b8",
                                    }}
                                  />
                                  <Typography variant="caption" color="text.secondary">
                                    {tag}
                                  </Typography>
                                </Stack>
                              ))}
                            </Stack>
                          )}
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() =>
                              window.open(
                                "mailto:hello@finworld.live?subject=Notify%20me&body=Let%20me%20know%20when%20this%20calculator%20ships%3A%20" +
                                  encodeURIComponent(item.title)
                              )
                            }
                            sx={{ alignSelf: "flex-start", borderRadius: 999, mt: "auto" }}
                          >
                            Notify me
                          </Button>
                        </Stack>
                      </Paper>
                    ))}
                  </Box>
                </Box>
              ))}
            </Stack>
          </Collapse>
        </Stack>

        <Box
          component="footer"
          sx={{
            position: "relative",
            borderTop: `1px solid ${theme.palette.divider}`,
            mt: 7,
            py: { xs: 4, md: 5 },
            px: { xs: 2.5, md: 4 },
            borderRadius: 4,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2.5,
            alignItems: { xs: "flex-start", md: "center" },
            justifyContent: "space-between",
            overflow: "hidden",
            background:
              theme.palette.mode === "dark"
                ? "linear-gradient(135deg,rgba(15,23,42,0.85),rgba(11,17,32,0.78))"
                : "linear-gradient(135deg,#f8fafc,#eef2ff)",
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 10px 22px rgba(0,0,0,0.3)"
                : "0 12px 26px rgba(15,23,42,0.08)",
            "&::before": {
              content: '""',
              position: "absolute",
              inset: 0,
              background:
                theme.palette.mode === "dark"
                  ? "radial-gradient(circle at 20% 50%, rgba(34,211,238,0.08), transparent 40%)"
                  : "radial-gradient(circle at 20% 50%, rgba(20,184,166,0.08), transparent 40%)",
              pointerEvents: "none",
            },
          }}
        >
          <Stack spacing={0.5} sx={{ position: "relative", zIndex: 1 }}>
            <Typography variant="subtitle1" fontWeight={800}>
              FinWorld
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Practical finance tools that stay fresh and accurate.
            </Typography>
            <Typography variant="caption" color="text.secondary">
              (c) 2025 FinCalc. All Rights Reserved.
            </Typography>
          </Stack>
          <Stack
            direction="row"
            spacing={1.5}
            flexWrap="wrap"
            justifyContent={{ xs: "flex-start", md: "flex-end" }}
            sx={{ position: "relative", zIndex: 1 }}
          >
            <Button size="small" color="inherit" variant="text">About Us</Button>
            <Button size="small" color="inherit" variant="text">Contact</Button>
            <Button size="small" color="inherit" variant="text">Help &amp; Guidance</Button>
            <Button size="small" color="inherit" variant="text">Terms of Service</Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
