import * as React from "react";
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid, // Import Grid component
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import PaidIcon from "@mui/icons-material/Paid";
import SavingsIcon from "@mui/icons-material/Savings";
import PercentIcon from "@mui/icons-material/Percent";
import { Doughnut, Line } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Filler } from "chart.js";
import { formatCurrency, formatCurrencyDetailed, calculatePayoffDate, prepareLoanEstimateChartData } from "../utils/mortgageCalculations";
import { useTranslation } from "react-i18next";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Filler);

export default function PaymentBreakdown({ results, inputs }) {
  const theme = useTheme();
  const { t } = useTranslation();
  const isDark = theme.palette.mode === "dark";
  const cardBg = isDark ? "rgba(255,255,255,0.06)" : "#f8fafc";
  const cardBorder = isDark ? "rgba(255,255,255,0.12)" : "#e7edf3";
  const iconBg = (color) => (isDark ? `${color}22` : `${color}1f`);
  const textMuted = isDark ? "rgba(255,255,255,0.75)" : "text.secondary";
  const accentGreen = isDark ? "#22c55e" : "#059669";

  const [activeTab, setActiveTab] = React.useState(0);
  const [loanEstimateSubTab, setLoanEstimateSubTab] = React.useState(0);

  if (!results) {
    return (
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography>{t("mortgage.empty.prompt")}</Typography>
      </Paper>
    );
  }

  const chartLabels = [t("mortgage.chart.principalInterest"), t("mortgage.chart.taxes"), t("mortgage.chart.insurance")];
  const chartDataValues = [
    results.principalAndInterest,
    results.monthlyPropertyTax,
    results.monthlyInsurance,
  ];
  const chartColors = ["#1976d2", "#16a34a", "#bdbdbd"];

if (results.monthlyPMI > 0) {
chartLabels.push(t("mortgage.chart.pmi"));
chartDataValues.push(results.monthlyPMI / 12);
chartColors.push("#f59e0b");
}

if (results.monthlyHOA > 0) {
chartLabels.push(t("mortgage.chart.hoa"));
chartDataValues.push(results.monthlyHOA / 12);
chartColors.push("#8b5cf6");
}
  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        data: chartDataValues,
        backgroundColor: chartColors,
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    cutout: "70%",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.label}: ${formatCurrency(context.parsed)}`;
          },
        },
      },
    },
  };

  const homePrice = parseFloat((inputs?.homePrice || "").replace(/,/g, "")) || 0;
  const downPaymentPercent =
    inputs?.downPaymentMode === "percent"
      ? parseFloat(inputs?.downPaymentPercent || "") || 0
      : homePrice > 0
      ? ((parseFloat((inputs?.downPayment || "").replace(/,/g, "")) || 0) / homePrice) * 100
      : 0;
  const downPaymentAmount =
    inputs?.downPaymentMode === "percent"
      ? (homePrice * downPaymentPercent) / 100
      : parseFloat((inputs?.downPayment || "").replace(/,/g, "")) || 0;
  const rate = parseFloat(inputs?.interestRate || "") || 0;

  const Legend = () => (
    <Box sx={{ mt: { xs: 2, sm: 3 }, minWidth: { xs: 'auto', sm: '280px' }, width: { xs: '100%', sm: 'auto' } }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5, border: '1px solid #e0e0e0', borderRadius: 1, p: 1.5 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box
            sx={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              bgcolor: "#1976d2",
              mr: 1,
            }}
          />
          <Typography>{t("mortgage.chart.principalInterest")}</Typography>
        </Box>
        <Typography sx={{ fontWeight: 600, ml: 2 }}>
          {formatCurrency(results.principalAndInterest)}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5, border: '1px solid #e0e0e0', borderRadius: 1, p: 1.5 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box
            sx={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              bgcolor: "#16a34a",
              mr: 1,
            }}
          />
          <Typography>{t("mortgage.chart.taxes")}</Typography>
        </Box>
        <Typography sx={{ fontWeight: 600, ml: 2 }}>
          {formatCurrency(results.monthlyPropertyTax)}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5, border: '1px solid #e0e0e0', borderRadius: 1, p: 1.5 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box
            sx={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              bgcolor: "#bdbdbd",
              mr: 1,
            }}
          />
          <Typography>{t("mortgage.chart.insurance")}</Typography>
        </Box>
        <Typography sx={{ fontWeight: 600, ml: 2 }}>
          {formatCurrency(results.monthlyInsurance)}
        </Typography>
      </Box>
      {results.monthlyPMI > 0 && (
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5, border: '1px solid #e0e0e0', borderRadius: 1, p: 1.5 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                bgcolor: "#f59e0b",
                mr: 1,
              }}
            />
            <Typography>{t("mortgage.chart.pmi")}</Typography>
          </Box>
          <Typography sx={{ fontWeight: 600, ml: 2 }}>
            {formatCurrency(results.monthlyPMI)}
          </Typography>
        </Box>
      )}
      {results.monthlyHOA > 0 && (
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", border: '1px solid #e0e0e0', borderRadius: 1, p: 1.5 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                bgcolor: "#8b5cf6",
                mr: 1,
              }}
            />
            <Typography>{t("mortgage.chart.hoa")}</Typography>
          </Box>
          <Typography sx={{ fontWeight: 600, ml: 2 }}>
            {formatCurrency(results.monthlyHOA)}
          </Typography>
        </Box>
      )}
    </Box>
  );

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: "-0.02em", mb: 0.5 }}>
          {t("mortgage.summary.title")}
        </Typography>
        <Typography variant="body2" sx={{ color: textMuted }}>
          {t("mortgage.summary.subtitle")}
        </Typography>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 2,
              border: `1px solid ${cardBorder}`,
              backgroundColor: cardBg,
              boxShadow: isDark ? "0 10px 24px rgba(0,0,0,0.35)" : "0 10px 24px rgba(15,23,42,0.06)",
              height: "100%",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 1,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: iconBg("#3b82f6"),
                  color: "#1d4ed8",
                }}
              >
                <PaidIcon fontSize="small" />
              </Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: isDark ? "#e2e8f0" : "text.secondary" }}>
                {t("mortgage.summary.fullPrice")}
              </Typography>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 900 }}>
              {formatCurrency(homePrice)}
            </Typography>
            <Typography variant="caption" sx={{ color: textMuted }}>
              {t("mortgage.summary.fullPriceDesc")}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 2,
              border: `1px solid ${cardBorder}`,
              backgroundColor: cardBg,
              boxShadow: isDark ? "0 10px 24px rgba(0,0,0,0.35)" : "0 10px 24px rgba(15,23,42,0.06)",
              height: "100%",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 1,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: iconBg("#10b981"),
                  color: "#0f766e",
                }}
              >
                <SavingsIcon fontSize="small" />
              </Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: isDark ? "#e2e8f0" : "text.secondary" }}>
                {t("mortgage.summary.downPayment")}
              </Typography>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 900, display: "flex", alignItems: "baseline", gap: 1 }}>
              {formatCurrency(downPaymentAmount)}
              {downPaymentPercent ? (
                <Typography component="span" variant="subtitle2" sx={{ color: "text.secondary" }}>
                  ({downPaymentPercent.toFixed(0)}%)
                </Typography>
              ) : null}
            </Typography>
              <Typography variant="caption" sx={{ color: textMuted }}>
                <Box component="span" sx={{ color: accentGreen, fontWeight: 600 }}>
                  {t("mortgage.summary.downPaymentDesc")}
                </Box>
              </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 2,
              border: `1px solid ${cardBorder}`,
              backgroundColor: cardBg,
              boxShadow: isDark ? "0 10px 24px rgba(0,0,0,0.35)" : "0 10px 24px rgba(15,23,42,0.06)",
              height: "100%",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 1,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: iconBg("#7c3aed"),
                  color: "#6d28d9",
                }}
              >
                <PercentIcon fontSize="small" />
              </Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: isDark ? "#e2e8f0" : "text.secondary" }}>
                {t("mortgage.summary.interestRate")}
              </Typography>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 900 }}>
              {rate ? `${rate}%` : "--"}
            </Typography>
            <Typography variant="caption" sx={{ color: textMuted }}>
              {t("mortgage.summary.interestRateDesc")}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}
      >
        <Tab
          label={t("mortgage.tabs.paymentBreakdown")}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            fontSize: { xs: '0.85rem', sm: '1rem', md: '1.25rem' },
          }}
        />
        <Tab
          label={t("mortgage.tabs.loanEstimate")}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            fontSize: { xs: '0.85rem', sm: '1rem', md: '1.25rem' },
          }}
        />
        <Tab
          label={t("mortgage.tabs.amortization")}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            fontSize: { xs: '0.85rem', sm: '1rem', md: '1.25rem' },
          }}
        />
      </Tabs>

      {activeTab === 0 && (
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
          <Box
            sx={{
              position: "relative",
              maxWidth: { xs: 220, sm: 320 },
              width: '100%',
              mr: { xs: 0, sm: 4 },
            }}
          >
            <Doughnut data={chartData} options={chartOptions} />
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
              }}
            >
              <Typography variant="body2" sx={{ color: textMuted }}>
                {t("mortgage.payment.monthlyPayment")}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {formatCurrency(results.totalMonthlyPayment)}
              </Typography>
            </Box>
          </Box>
          <Legend />
        </Box>
      )}

      {activeTab === 1 && (
        <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, letterSpacing: 1 }}>
            {t("mortgage.summary.sectionTitle")}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {t("mortgage.summary.numPayments", { count: results.amortizationSchedule.length })}
          </Typography>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }} />

        <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 4 }}>
          <Grid item xs={6} sm={6} md={3}>
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 0.5 }}>
              {t("mortgage.summary.monthlyPayment")}
            </Typography>
            <Typography sx={{ fontWeight: 700, fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2.125rem' } }}>
              {formatCurrency(results.totalMonthlyPayment)}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 0.5 }}>
              {t("mortgage.summary.totalInterest")}
            </Typography>
            <Typography sx={{ fontWeight: 700, fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2.125rem' } }}>
              {formatCurrency(results.totalInterest)}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 0.5 }}>
              {t("mortgage.summary.totalCost")}
            </Typography>
            <Typography sx={{ fontWeight: 700, fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2.125rem' } }}>
              {formatCurrency(results.totalCost)}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 0.5 }}>
              {t("mortgage.summary.payoffDate")}
            </Typography>
            <Typography sx={{ fontWeight: 700, fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2.125rem' } }}>
              {calculatePayoffDate(results.amortizationSchedule.length / 12)}
            </Typography>
          </Grid>
        </Grid>

          <Tabs
            value={loanEstimateSubTab}
            onChange={(e, newValue) => setLoanEstimateSubTab(newValue)}
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              mb: 3,
              minHeight: 40,
              '& .MuiTab-root': {
                minHeight: 40,
                textTransform: "none",
                fontSize: "1rem",
              }
            }}
          >
            <Tab label={t("mortgage.tabs.chart")} />
            <Tab label={t("mortgage.tabs.schedule")} />
          </Tabs>

          {loanEstimateSubTab === 0 && (() => {
            const chartData = prepareLoanEstimateChartData(results.amortizationSchedule, results.loanAmount);
            const loanTermYears = Math.round(results.amortizationSchedule.length / 12);

            const lineChartData = {
              labels: chartData.years,
              datasets: [
                {
                  label: t("mortgage.loanEstimate.principalPaid"),
                  data: chartData.principalPaidData,
                  borderColor: "#60a5fa",
                  backgroundColor: "rgba(96, 165, 250, 0.1)",
                  fill: false,
                  tension: 0.4,
                  pointRadius: 0,
                  pointHoverRadius: 5,
                  borderWidth: 2,
                },
                {
                  label: t("mortgage.loanEstimate.interestPaid"),
                  data: chartData.interestPaidData,
                  borderColor: "#4ade80",
                  backgroundColor: "rgba(74, 222, 128, 0.1)",
                  fill: false,
                  tension: 0.4,
                  pointRadius: 0,
                  pointHoverRadius: 5,
                  borderWidth: 2,
                },
                {
                  label: t("mortgage.loanEstimate.loanBalance"),
                  data: chartData.loanBalanceData,
                  borderColor: "#1e40af",
                  backgroundColor: "rgba(30, 64, 175, 0.1)",
                  fill: false,
                  tension: 0.4,
                  pointRadius: 0,
                  pointHoverRadius: 5,
                  borderWidth: 2,
                },
              ],
            };

            const lineChartOptions = {
              responsive: true,
              maintainAspectRatio: true,
              plugins: {
                legend: {
                  display: false,
                },
                tooltip: {
                  mode: "index",
                  intersect: false,
                  callbacks: {
                    label: (context) => {
                      return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`;
                    },
                  },
                },
              },
              scales: {
                x: {
                  grid: {
                    display: true,
                    color: "rgba(0, 0, 0, 0.05)",
                  },
                },
                y: {
                  grid: {
                    display: true,
                    color: "rgba(0, 0, 0, 0.05)",
                  },
                  ticks: {
                    callback: (value) => {
                      return formatCurrency(value / 1000) + "K";
                    },
                  },
                },
              },
              interaction: {
                mode: "index",
                intersect: false,
              },
            };

            const currentDate = new Date();
            const currentMonthYear = currentDate.toLocaleDateString(undefined, { month: "long", year: "numeric" });

            return (
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                  {t("mortgage.loanEstimate.howPaymentsChange", { years: loanTermYears })}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
                  {t("mortgage.loanEstimate.howPaymentsChangeDesc")}
                </Typography>

                <Box sx={{ display: "flex", gap: { xs: 2, sm: 4 }, flexWrap: "wrap", alignItems: "flex-start" }}>
                  <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 400px" }, minWidth: 0 }}>
                    <Line data={lineChartData} options={lineChartOptions} />
                  </Box>

                  <Box sx={{
                    flex: { xs: "1 1 100%", sm: "0 0 auto" },
                    minWidth: { xs: 'auto', sm: 200 },
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 1,
                    p: 2
                  }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 2 }}>
                      {t("mortgage.loanEstimate.asOf", { date: currentMonthYear })}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            bgcolor: "#60a5fa",
                            mr: 1,
                          }}
                        />
                        <Typography variant="body2">{t("mortgage.loanEstimate.principalPaid")}</Typography>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formatCurrency(Math.round(chartData.principalPaidData[0] || 0))}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            bgcolor: "#4ade80",
                            mr: 1,
                          }}
                        />
                        <Typography variant="body2">{t("mortgage.loanEstimate.interestPaid")}</Typography>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formatCurrency(Math.round(chartData.interestPaidData[0] || 0))}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            bgcolor: "#1e40af",
                            mr: 1,
                          }}
                        />
                        <Typography variant="body2">{t("mortgage.loanEstimate.loanBalance")}</Typography>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formatCurrency(results.loanAmount)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            );
          })()}

          {loanEstimateSubTab === 1 && (
            <TableContainer sx={{ maxHeight: 500, overflowX: "auto" }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>{t("mortgage.table.month")}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>
                      {t("mortgage.table.principal")}
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>
                      {t("mortgage.table.interest")}
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>
                      {t("mortgage.table.balance")}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {results.amortizationSchedule.map((row) => (
                    <TableRow key={row.month}>
                      <TableCell>{row.month}</TableCell>
                      <TableCell align="right">
                        {formatCurrencyDetailed(row.principalPayment)}
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrencyDetailed(row.interestPayment)}
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(row.remainingBalance)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      )}

      {activeTab === 2 && (
        <TableContainer sx={{ maxHeight: 500, overflowX: "auto" }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>{t("mortgage.table.month")}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  {t("mortgage.table.principal")}
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  {t("mortgage.table.interest")}
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  {t("mortgage.table.balance")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.amortizationSchedule.slice(0, 12).map((row) => (
                <TableRow key={row.month}>
                  <TableCell>{row.month}</TableCell>
                  <TableCell align="right">
                    {formatCurrencyDetailed(row.principalPayment)}
                  </TableCell>
                  <TableCell align="right">
                    {formatCurrencyDetailed(row.interestPayment)}
                  </TableCell>
                  <TableCell align="right">
                    {formatCurrency(row.remainingBalance)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
}
