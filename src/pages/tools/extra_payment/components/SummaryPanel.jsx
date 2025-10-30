import * as React from "react";
import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Button,
  Typography,
} from "@mui/material";

export default function SummaryPanel({
  results,
  fmtCurrency,
  compare1Visible,
  compare2Visible,
}) {
  const origT = results.original?.totals || {};
  const c1T = results.compare1?.totals || {};
  const c2T = results.compare2?.totals || {};

  const savedC1 = Math.max(0, (origT.totalInterest || 0) - (c1T.totalInterest || 0));
  const savedC2 = Math.max(0, (origT.totalInterest || 0) - (c2T.totalInterest || 0));

  const years = (t) => t.yearsToPayoff || 0;
  const months = (t) => t.monthsToPayoff || 0;

  const handleExportSummaryPDF = async () => {
    const { default: jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default;
    const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
    const now = new Date();
    const month = now.toLocaleString("default", { month: "long" });
    const year = now.getFullYear();

    doc.setFontSize(16);
    doc.text("Loan Summary Report", 40, 40);
    doc.setFontSize(12);
    doc.text(`Exported ${month} ${year}`, 40, 60);

    const header = ["Description", "Original", "Compare 1", "Compare 2"];
    const body = [
      ["Total Interest", fmtCurrency(origT.totalInterest || 0), fmtCurrency(c1T.totalInterest || 0), fmtCurrency(c2T.totalInterest || 0)],
      ["Total Payments", fmtCurrency(origT.totalPayments || 0), fmtCurrency(c1T.totalPayments || 0), fmtCurrency(c2T.totalPayments || 0)],
      ["Interest Saved (vs Original)", "–", fmtCurrency(savedC1), fmtCurrency(savedC2)],
      ["Years to Payoff", years(origT), years(c1T), years(c2T)],
      ["Months to Payoff", months(origT), months(c1T), months(c2T)],
    ];

    autoTable(doc, {
      startY: 80,
      head: [header],
      body,
      theme: "grid",
      styles: { fontSize: 10, halign: "right" },
      headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: "bold" },
      bodyStyles: { fillColor: [255, 255, 255], textColor: [20, 20, 20] },
      margin: { left: 40, right: 40 },
    });

    doc.save("loan-summary.pdf");
  };

  return (
    <Paper
      sx={{
        p: 3,
        bgcolor: "background.paper",
        overflow: "hidden",
        borderRadius: 2,
        boxShadow: 2,
        minHeight: 330,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
      }}
    >
      <Box sx={{ position: "absolute", top: 16, right: 20 }}>
        <Button
          size="small"
          variant="outlined"
          color="secondary"
          onClick={handleExportSummaryPDF}
          sx={{ textTransform: "none", fontWeight: 500 }}
        >
          Export Summary PDF
        </Button>
      </Box>

      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
        Loan Summary
      </Typography>

      <Table size="small" sx={{ tableLayout: "fixed", mt: 1 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: "30%" }}>Description</TableCell>
            <TableCell align="right" sx={{ width: "23%" }}>Original</TableCell>
            <TableCell align="right" sx={{ width: "23%" }}>Compare 1</TableCell>
            <TableCell align="right" sx={{ width: "24%" }}>Compare 2</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Total Interest</TableCell>
            <TableCell align="right">{fmtCurrency(origT.totalInterest)}</TableCell>
            <TableCell align="right">{fmtCurrency(c1T.totalInterest)}</TableCell>
            <TableCell align="right">{fmtCurrency(c2T.totalInterest)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Total Payments</TableCell>
            <TableCell align="right">{fmtCurrency(origT.totalPayments)}</TableCell>
            <TableCell align="right">{fmtCurrency(c1T.totalPayments)}</TableCell>
            <TableCell align="right">{fmtCurrency(c2T.totalPayments)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Interest Saved (vs Original)</TableCell>
            <TableCell align="right">–</TableCell>
            <TableCell align="right" sx={{ color: "success.main" }}>{fmtCurrency(savedC1)}</TableCell>
            <TableCell align="right" sx={{ color: "success.main" }}>{fmtCurrency(savedC2)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Years to Payoff</TableCell>
            <TableCell align="right">{years(origT)}</TableCell>
            <TableCell align="right">{years(c1T)}</TableCell>
            <TableCell align="right">{years(c2T)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Months to Payoff</TableCell>
            <TableCell align="right">{months(origT)}</TableCell>
            <TableCell align="right">{months(c1T)}</TableCell>
            <TableCell align="right">{months(c2T)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  );
}
