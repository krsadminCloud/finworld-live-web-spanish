import * as React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from "recharts";
import { useTheme } from "@mui/material/styles";
import { Paper, Typography } from "@mui/material"; // ✅ added Typography

function yearlySeries(amount, schedule, paymentsPerYear) {
  if (!amount || !schedule?.length || !paymentsPerYear) return [];
  const periods = schedule.length;
  const years = Math.ceil(periods / paymentsPerYear);
  const data = [{ year: 0, balance: amount }];
  for (let y = 1; y <= years; y++) {
    const p = Math.min(y * paymentsPerYear, periods);
    const snap = schedule[p - 1];
    const bal = Math.max(0, snap?.balance ?? 0);
    data.push({ year: y, balance: bal });
  }
  return data;
}

function mergeSeries(series, key, merged = {}) {
  series.forEach((pt) => {
    if (!merged[pt.year]) merged[pt.year] = { year: pt.year };
    merged[pt.year][key] = Math.round(pt.balance / 1000);
  });
  return merged;
}

function toArray(map) {
  return Object.values(map).sort((a, b) => a.year - b.year);
}

export default function PayoffChart({
  results,
  compare1Visible,
  compare2Visible,
  initialAmount = 0,
}) {
  const theme = useTheme();
  const merged = {};

  const addPlan = (plan, key) => {
    if (!plan?.schedule?.length) return;
    const ppy = plan?.meta?.paymentsPerYear || 12;
    const s = yearlySeries(initialAmount, plan.schedule, ppy);
    mergeSeries(s, key, merged);
  };

  addPlan(results?.original, "original");
  if (compare1Visible) addPlan(results?.compare1, "c1");
  if (compare2Visible) addPlan(results?.compare2, "c2");

  const data = toArray(merged);

  const axisColor =
    theme.palette.mode === "light" ? "#000000" : "rgba(255,255,255,0.3)";
  const tickColor =
    theme.palette.mode === "light" ? "#000000" : "rgba(255,255,255,0.6)";
  const labelColor =
    theme.palette.mode === "light" ? "#000000" : "rgba(255,255,255,0.75)";

  return (
    <Paper
      sx={{
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 2,
        p: 3, // slightly more padding for title space
      }}
    >
      {/* ✅ Title added */}
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
        Loan Payoff Projection
      </Typography>

      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 80 }}>
          <defs>
            <linearGradient id="gradOriginal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#facc15" stopOpacity={0.7} />
              <stop offset="95%" stopColor="#facc15" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradC1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradC2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f472b6" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#f472b6" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.1)"
            vertical={false}
          />

          <XAxis
            dataKey="year"
            stroke={axisColor}
            tick={{ fill: tickColor, fontSize: 12 }}
            axisLine={{ stroke: axisColor }}
          >
            <Label
              value="Years"
              position="insideBottom"
              dy={15}
              style={{ fill: labelColor, fontSize: 13, fontWeight: 600 }}
            />
          </XAxis>

          <YAxis
            stroke={axisColor}
            tick={{ fill: tickColor, fontSize: 12 }}
            axisLine={{ stroke: axisColor }}
            tickFormatter={(value) => `$${value}k`}
          />

          <Tooltip
            formatter={(value) => `$${value}k`}
            contentStyle={{
              background: "rgba(15,23,42,0.9)",
              border: "1px solid rgba(148,163,184,0.2)",
              borderRadius: "8px",
              color: "#e2e8f0",
            }}
          />

          <Legend
            verticalAlign="bottom"
            align="center"
            height={40}
            wrapperStyle={{
              transform: "translateY(20px)",
              color: "rgba(255,255,255,0.75)",
              fontSize: "0.9rem",
              letterSpacing: "0.3px",
            }}
          />

          <Area
            type="monotone"
            dataKey="original"
            name="Original"
            stroke="#facc15"
            strokeWidth={3}
            fill="url(#gradOriginal)"
            fillOpacity={0.3}
            dot={false}
            activeDot={{ r: 6, fill: "#facc15" }}
          />
          {"c1" in (data[0] || {}) && (
            <Area
              type="monotone"
              dataKey="c1"
              name="Compare 1"
              stroke="#a78bfa"
              strokeWidth={2}
              fill="url(#gradC1)"
              fillOpacity={0.15}
              strokeDasharray="6 4"
              dot={false}
              activeDot={{ r: 5, fill: "#a78bfa" }}
            />
          )}
          {"c2" in (data[0] || {}) && (
            <Area
              type="monotone"
              dataKey="c2"
              name="Compare 2"
              stroke="#f472b6"
              strokeWidth={2}
              fill="url(#gradC2)"
              fillOpacity={0.15}
              strokeDasharray="6 4"
              dot={false}
              activeDot={{ r: 5, fill: "#f472b6" }}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </Paper>
  );
}
