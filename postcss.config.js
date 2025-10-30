// postcss.config.js - for Azure build / CI
const tailwind = require("@tailwindcss/postcss");
const autoprefixer = require("autoprefixer");

module.exports = {
  plugins: [tailwind, autoprefixer],
};
