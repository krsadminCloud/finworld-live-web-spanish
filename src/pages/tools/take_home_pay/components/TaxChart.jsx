import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Box, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

ChartJS.register(ArcElement, Tooltip, Legend);

export function TaxChart({
  federalTax,
  stateTax,
  ficaTax,
  localTax,
  preTaxDeductions,
  rothContributions,
  netPay
}) {
  const theme = useTheme();
  const { t } = useTranslation();
  const isDark = theme.palette.mode === 'dark';
  const [chartKey, setChartKey] = useState(0);

  useEffect(() => {
    setChartKey((prev) => prev + 1);
  }, [isDark]);

  const data = {
    labels: [
      t("calculators.takeHomePay.chart.federal"),
      t("calculators.takeHomePay.chart.state"),
      t("calculators.takeHomePay.chart.fica"),
      t("calculators.takeHomePay.chart.local"),
      t("calculators.takeHomePay.chart.preTax"),
      t("calculators.takeHomePay.chart.roth"),
      t("calculators.takeHomePay.chart.netPay")
    ],
    datasets: [
      {
        data: [federalTax, stateTax, ficaTax, localTax, preTaxDeductions, rothContributions, netPay],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#4CAF50'],
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: isDark ? '#FFFFFF' : '#374151',
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text: t("calculators.takeHomePay.chart.title"),
        color: isDark ? '#FFFFFF' : '#374151',
        font: {
          size: 14,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              label += new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0,
              }).format(context.parsed);
            }
            return label;
          },
        },
      },
    },
    layout: {
      padding: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10,
      },
    },
  };

  return (
    <Box sx={{ mt: 3, height: 300 }}>
      <Pie key={chartKey} data={data} options={options} />
    </Box>
  );
}
