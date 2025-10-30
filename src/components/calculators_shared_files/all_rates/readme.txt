FinWorld Mortgage Rates - Light Edition
---------------------------------------
1. Run your backend (getRates.js):
   npm install express node-fetch cors
   set API_NINJAS_KEY=your_api_key_here
   node getRates.js

2. Open all_rates.html via local server:
   python -m http.server 5500

3. Visit http://localhost:5500/all_rates.html
   - Auto-loads North Carolina
   - State dropdown refreshes instantly
   - Uses your backend at localhost:8080/api/getRates
   - Tracks clicks at localhost:8080/api/trackClick
