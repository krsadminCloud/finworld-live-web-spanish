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
  const tableRef = React.useRef(null);
  const [visibleCount, setVisibleCount] = React.useState(40);

  const plan = getPlan(results, activePlan);
  const allRows = React.useMemo(() => buildRows(plan), [plan]);
  const rows = allRows.slice(0, visibleCount);

  React.useEffect(() => {
    setVisibleCount(40);
  }, [activePlan, results]);

  React.useEffect(() => {
    const container = tableRef.current;
    if (!container) return;
    const handleScroll = () => {
      if (
        container.scrollTop + container.clientHeight >=
        container.scrollHeight - 16
      ) {
        setVisibleCount((prev) =>
          prev < allRows.length ? prev + 40 : prev
        );
      }
    };
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [allRows.length]);

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
    <Box sx={{ width: "100%", maxWidth: 1200, mx: "auto", mb: 4 }}>
      <Paper
        sx={{
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 2,
          p: { xs: 2, sm: 3 },
        }}
      >
        {/* Header */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{ xs: "flex-start", md: "center" }}
          justifyContent="space-between"
          sx={{ pb: 2 }}
        >
          <Typography variant="h6" fontWeight={700}>
            Amortization Schedule
          </Typography>

          <Stack
            spacing={{ xs: 1.5, md: 2 }}
            direction={{ xs: "column", md: "row" }}
            alignItems={{ xs: "stretch", md: "center" }}
            justifyContent="flex-end"
            sx={{ width: { xs: "100%", md: "auto" } }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              alignItems="stretch"
              justifyContent={{ xs: "flex-start", md: "flex-end" }}
              sx={{ minWidth: { md: 320 } }}
            >
              {["Original", "Compare 1", "Compare 2"].map((label) => (
                <Button
                  key={label}
                  size="small"
                  variant={activePlan === label ? "contained" : "outlined"}
                  onClick={() => setActivePlan(label)}
                  sx={{ textTransform: "none", flex: 1, minWidth: { xs: 0, md: 120 } }}
                >
                  {label}
                </Button>
              ))}
            </Stack>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              alignItems="stretch"
              justifyContent={{ xs: "flex-start", md: "flex-end" }}
              sx={{ minWidth: { md: 280 } }}
            >
              <Button
                size="small"
                variant="outlined"
                color="secondary"
                onClick={handleExportCSV}
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                  flex: 1,
                }}
              >
                Export CSV
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="secondary"
                onClick={handleExportPDF}
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                  flex: 1,
                }}
              >
                Export PDF
              </Button>
            </Stack>
          </Stack>
        </Stack>

        {/* Table */}
        <TableContainer
          sx={{ maxHeight: 320, overflowX: "auto" }}
          ref={tableRef}
        >
          <Table stickyHeader size="small" sx={{ minWidth: 600 }}>
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

     </Paper>
   </Box>
 );
}
