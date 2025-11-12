const LINK_ID = "loan-payoff-theme-css";
const MAP = {
  light: "/loan-payoff-themes/light.css",
  dark: "/loan-payoff-themes/dark.css",
};

export function ensureLoanPayoffThemeCss(initialMode = "light") {
  const mode = initialMode === "dark" ? "dark" : "light";
  let link = document.getElementById(LINK_ID);
  if (!link) {
    link = document.createElement("link");
    link.id = LINK_ID;
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }
  link.href = MAP[mode];
  return mode;
}

export function setLoanPayoffThemeCss(mode) {
  const link = document.getElementById(LINK_ID);
  if (link && MAP[mode]) {
    link.href = MAP[mode];
  }
}
