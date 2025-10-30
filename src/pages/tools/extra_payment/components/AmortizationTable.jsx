import * as React from "react";
import {
  Box,
  Paper,
  Stack,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Typography,
} from "@mui/material";

const PAGE_SIZE = 20;

function getPlan(results, key) {
  switch (key) {
    case "Original":
      return results.original;
    case "Compare 1":
      return results.compare1;
    case "Compare 2":
      return results.compare2;
    default:
      return null;
  }
}

function labelForPPY(ppy) {
  if (ppy === 26) return "Biweekly";
  if (ppy === 52) return "Weekly";
  return "Monthly";
}

function buildRows(plan) {
  if (!plan?.schedule) return [];
  return plan.schedule.map((p, idx) => ({
    n: idx + 1,
    principal: p.principal,
    interest: p.interest,
    remain: p.balance,
    // per-period outflow (principal + interest + extra)
    payment: p.payment ?? (p.principal + p.interest + (p.extraPaid || 0)),
  }));
}

function downloadCSV(filename, rows) {
  const header = [
    "Payment #",
    "Principal",
    "Interest",
    "Remaining Balance",
    "Per-Period Payment",
  ];
  const csv = [
    header.join(","),
    ...rows.map((r) =>
      [
        r.n,
        r.principal.toFixed(2),
        r.interest.toFixed(2),
        r.remain.toFixed(2),
        r.payment.toFixed(2),
      ].join(",")
    ),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.click();
  URL.revokeObjectURL(url);
}

export default function AmortizationTable({ results, fmtCurrency }) {
  const [activePlan, setActivePlan] = React.useState("Original");
  const [visibleCount, setVisibleCount] = React.useState(PAGE_SIZE);

  const plan = getPlan(results, activePlan);
  const allRows = React.useMemo(() => buildRows(plan), [plan]);
  const rows = allRows.slice(0, visibleCount);

  React.useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activePlan, results]);

  const handleExportCSV = () => {
    const key = activePlan.toLowerCase().replace(/\s+/g, "-");
    const filename = `loan-schedule-${key}.csv`;
    downloadCSV(filename, allRows);
  };

  const handleExportPDF = async () => {
    if (!plan?.schedule?.length) return;
    const { default: jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default;

    const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });

    const now = new Date();
    const month = now.toLocaleString("default", { month: "long" });
    const year = now.getFullYear();

    doc.setFontSize(16);
    doc.text("Loan Payoff Schedule", 40, 40);
    doc.setFontSize(12);
    doc.text(`${activePlan} – Exported ${month} ${year}`, 40, 60);

    const tableRows = allRows.map((r) => [
      r.n,
      fmtCurrency(r.principal),
      fmtCurrency(r.interest),
      fmtCurrency(r.remain),
      fmtCurrency(r.payment),
    ]);

    const headerLabel = `${labelForPPY(plan?.meta?.paymentsPerYear)} Payment`;

    autoTable(doc, {
      startY: 80,
      head: [["#", "Principal", "Interest", "Remaining Balance", headerLabel]],
      body: tableRows,
      theme: "grid",
      styles: { fontSize: 9, halign: "right" },
      headStyles: { fillColor: [230, 230, 230], textColor: 20 },
      bodyStyles: { fillColor: [255, 255, 255], textColor: 20 },
      alternateRowStyles: { fillColor: [248, 248, 248] },
      margin: { left: 40, right: 40 },
    });

    const key = activePlan.toLowerCase().replace(/\s+/g, "-");
    const filename = `loan-schedule-${key}.pdf`;
    doc.save(filename);
  };

  const headerLabel = `${labelForPPY(plan?.meta?.paymentsPerYear)} Payment`;

  return (
    // ✅ Match Summary/Chart width: 100% mobile, 70% desktop
    <Box sx={{ width: { xs: "100%", md: "102%" }, mx: "auto", mb: 4 }}>
      <Paper
        sx={{
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 2,
          p: 3,            // match SummaryPanel padding
        }}
      >
        {/* Header */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
          sx={{
            pb: 2,
          }}
        >
          <Typography variant="h6" fontWeight={700}>
            Amortization Schedule
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            {["Original", "Compare 1", "Compare 2"].map((label) => (
              <Button
                key={label}
                variant={activePlan === label ? "contained" : "outlined"}
                onClick={() => setActivePlan(label)}
                sx={{ textTransform: "none" }}
              >
                {label}
              </Button>
            ))}

            <Button
              variant="outlined"
              color="secondary"
              onClick={handleExportCSV}
              sx={{ textTransform: "none", fontWeight: 500, ml: 2 }}
            >
              Export CSV
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleExportPDF}
              sx={{ textTransform: "none", fontWeight: 500 }}
            >
              Export PDF
            </Button>
          </Stack>
        </Stack>

        {/* Table */}
        <TableContainer sx={{ maxHeight: 320 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell>Payment #</TableCell>
                <TableCell align="right">Principal</TableCell>
                <TableCell align="right">Interest</TableCell>
                <TableCell align="right">Remaining Balance</TableCell>
                <TableCell align="right">{headerLabel}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.n} hover>
                  <TableCell>{r.n}</TableCell>
                  <TableCell align="right">{fmtCurrency(r.principal)}</TableCell>
                  <TableCell align="right">{fmtCurrency(r.interest)}</TableCell>
                  <TableCell align="right">{fmtCurrency(r.remain)}</TableCell>
                  <TableCell align="right">{fmtCurrency(r.payment)}</TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4, color: "text.secondary" }}>
                    No data — click “Calculate” to generate a schedule.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Footer */}
        <Box sx={{ p: 2, borderTop: 1, borderColor: "divider", textAlign: "center" }}>
          {visibleCount < allRows.length ? (
            <Button size="small" onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}>
              Load More
            </Button>
          ) : (
            <Typography variant="body2" color="text.secondary">
              End of schedule
            </Typography>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
