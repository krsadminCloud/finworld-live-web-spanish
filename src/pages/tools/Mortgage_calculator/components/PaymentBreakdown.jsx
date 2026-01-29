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
import PaidIcon from "@mui/icons-material/Paid";
import SavingsIcon from "@mui/icons-material/Savings";
import PercentIcon from "@mui/icons-material/Percent";
import { Doughnut, Line } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Filler } from "chart.js";
import { formatCurrency, formatCurrencyDetailed, calculatePayoffDate, prepareLoanEstimateChartData } from "../utils/mortgageCalculations";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Filler);

export default function PaymentBreakdown({ results, inputs }) {
  const [activeTab, setActiveTab] = React.useState(0);
  const [loanEstimateSubTab, setLoanEstimateSubTab] = React.useState(0);

  if (!results) {
    return (
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography>Enter values to see payment breakdown</Typography>
      </Paper>
    );
  }

  const chartLabels = ["Principal & Interest", "Taxes", "Insurance"];
  const chartDataValues = [
    results.principalAndInterest,
    results.monthlyPropertyTax,
    results.monthlyInsurance,
  ];
  const chartColors = ["#1976d2", "#16a34a", "#bdbdbd"];

if (results.monthlyPMI > 0) {
chartLabels.push("PMI");
chartDataValues.push(results.monthlyPMI / 12);
chartColors.push("#f59e0b");
}

if (results.monthlyHOA > 0) {
chartLabels.push("HOA");
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
    <Box sx={{ mt: 3, minWidth: '280px' }}>
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
          <Typography>Principal & Interest</Typography>
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
          <Typography>Taxes</Typography>
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
          <Typography>Insurance</Typography>
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
            <Typography>PMI</Typography>
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
            <Typography>HOA</Typography>
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
          Mortgage Purchase Summary
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Review your estimated loan inputs before diving into the payment breakdown.
        </Typography>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 2,
              border: "1px solid #e7edf3",
              backgroundColor: "#f8fafc",
              boxShadow: "0 10px 24px rgba(15,23,42,0.06)",
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
                  backgroundColor: "rgba(59,130,246,0.12)",
                  color: "#1d4ed8",
                }}
              >
                <PaidIcon fontSize="small" />
              </Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.secondary" }}>
                Full Purchase Price
              </Typography>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 900 }}>
              {formatCurrency(homePrice)}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Entered home price for this scenario
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 2,
              border: "1px solid #e7edf3",
              backgroundColor: "#f8fafc",
              boxShadow: "0 10px 24px rgba(15,23,42,0.06)",
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
                  backgroundColor: "rgba(16,185,129,0.14)",
                  color: "#0f766e",
                }}
              >
                <SavingsIcon fontSize="small" />
              </Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.secondary" }}>
                Down Payment
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
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              <Box component="span" sx={{ color: "#059669", fontWeight: 600 }}>
                Avoid PMI insurance by paying 20%
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
              border: "1px solid #e7edf3",
              backgroundColor: "#f8fafc",
              boxShadow: "0 10px 24px rgba(15,23,42,0.06)",
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
                  backgroundColor: "rgba(124,58,237,0.12)",
                  color: "#6d28d9",
                }}
              >
                <PercentIcon fontSize="small" />
              </Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.secondary" }}>
                Interest Rate
              </Typography>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 900 }}>
              {rate ? `${rate}%` : "--"}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Fixed rate entered for this loan term
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
          label="Payment Breakdown"
          sx={{
            textTransform: "none",
            fontWeight: 600,
            fontSize: (theme) => theme.typography.h6.fontSize,
          }}
        />
        <Tab
          label="Loan Estimate"
          sx={{
            textTransform: "none",
            fontWeight: 600,
            fontSize: (theme) => theme.typography.h6.fontSize,
          }}
        />
        <Tab
          label="Amortization"
          sx={{
            textTransform: "none",
            fontWeight: 600,
            fontSize: (theme) => theme.typography.h6.fontSize,
          }}
        />
      </Tabs>

      {activeTab === 0 && (
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
          <Box
            sx={{
              position: "relative",
              maxWidth: 320,
              mr: 4, // Add margin-right for spacing between chart and legend
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
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Monthly Payment
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
              SUMMARY
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Number of payments: {results.amortizationSchedule.length}
            </Typography>
          </Box>

          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }} />

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" sx={{ color: "text.secondary", mb: 0.5 }}>
                Monthly payment
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                <Box component="span" sx={{ fontSize: "0.6em", verticalAlign: "super" }}>$</Box>
                {Math.round(results.totalMonthlyPayment).toLocaleString()}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" sx={{ color: "text.secondary", mb: 0.5 }}>
                Total interest paid
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                <Box component="span" sx={{ fontSize: "0.6em", verticalAlign: "super" }}>$</Box>
                {Math.round(results.totalInterest).toLocaleString()}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" sx={{ color: "text.secondary", mb: 0.5 }}>
                Total cost of loan
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                <Box component="span" sx={{ fontSize: "0.6em", verticalAlign: "super" }}>$</Box>
                {Math.round(results.totalCost).toLocaleString()}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" sx={{ color: "text.secondary", mb: 0.5 }}>
                Payoff date
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
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
            <Tab label="Chart" />
            <Tab label="Schedule" />
          </Tabs>

          {loanEstimateSubTab === 0 && (() => {
            const chartData = prepareLoanEstimateChartData(results.amortizationSchedule, results.loanAmount);
            const loanTermYears = Math.round(results.amortizationSchedule.length / 12);

            const lineChartData = {
              labels: chartData.years,
              datasets: [
                {
                  label: "Principal paid",
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
                  label: "Interest paid",
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
                  label: "Loan balance",
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
                      return "$" + (value / 1000).toFixed(0) + "K";
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
            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            const currentMonthYear = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

            return (
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                  How payments change over the life of a {loanTermYears}-year loan
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
                  As the term of your mortgage progresses, a larger share of your payment goes toward paying down the principal until the loan is paid in full at the end of your term.
                </Typography>

                <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap", alignItems: "flex-start" }}>
                  <Box sx={{ flex: "1 1 400px", minWidth: 0 }}>
                    <Line data={lineChartData} options={lineChartOptions} />
                  </Box>

                  <Box sx={{
                    flex: "0 0 auto",
                    minWidth: 200,
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 1,
                    p: 2
                  }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 2 }}>
                      As of {currentMonthYear}
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
                        <Typography variant="body2">Principal paid</Typography>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        ${Math.round(chartData.principalPaidData[0] || 0).toLocaleString()}
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
                        <Typography variant="body2">Interest paid</Typography>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        ${Math.round(chartData.interestPaidData[0] || 0).toLocaleString()}
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
                        <Typography variant="body2">Loan balance</Typography>
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
            <TableContainer sx={{ maxHeight: 500 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Month</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>
                      Principal
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>
                      Interest
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>
                      Balance
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
        <TableContainer sx={{ maxHeight: 500 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Month</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  Principal
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  Interest
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  Balance
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
