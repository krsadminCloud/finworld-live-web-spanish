import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(cors());
const PORT = 8080;

// Fetch mortgage rates by state
app.get('/api/getRates', async (req, res) => {
  const state = req.query.state || 'US';
  try {
    const response = await fetch(`https://api.api-ninjas.com/v1/mortgage-rate?state=${state}`, {
      headers: { 'X-Api-Key': process.env.API_NINJAS_KEY || '5nYZ8dQglYCQIQMjkT/e1w==tdJqf8CZDaJlWlFY' }
    });
    const data = await response.json();
    console.log(`Fetched: ${state} → ${data.thirty_year_fixed || 'N/A'} / ${data.fifteen_year_fixed || 'N/A'} / ${data.arm5_1 || 'N/A'}`);
    res.json(data);
  } catch (err) {
    console.error('Error fetching mortgage rates:', err);
    res.json({ state, thirty_year_fixed: 7.05, fifteen_year_fixed: 6.38, arm5_1: 6.52 });
  }
});

// Track user clicks
app.get('/api/trackClick', (req, res) => {
  const { lender, state } = req.query;
  console.log(`Click: ${lender} (${state})`);
  res.json({ status: 'ok' });
});

app.listen(PORT, () => console.log(`✅ FinWorld getRates.js running at http://localhost:${PORT}`));
