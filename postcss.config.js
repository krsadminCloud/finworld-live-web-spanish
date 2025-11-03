// postcss.config.js - for Azure build
const path = require("path");
const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");

// Detect which tool/calc is being built
const appDir = process.env.APP_DIR || "auto_loan_calculator"; // default to auto_loan_calculator
const tailwindPath = path.resolve(__dirname, `src/pages/tools/${appDir}/tailwind.config.js`);

console.log("🌀 Using Tailwind config:", tailwindPath);

module.exports = {
  plugins: [tailwindcss(tailwindPath), autoprefixer],
};
