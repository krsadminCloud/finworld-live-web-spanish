// Page-scoped theme CSS loader for Take-Home Pay
const LINK_ID = 'thp-theme-css';
const MAP = { light: '/thp-themes/light.css', dark: '/thp-themes/dark.css' };

export function ensureThpThemeCss(initialMode = 'light') {
  const mode = initialMode === 'dark' ? 'dark' : 'light';
  let link = document.getElementById(LINK_ID);
  if (!link) {
    link = document.createElement('link');
    link.id = LINK_ID;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
  link.href = MAP[mode];
  return mode;
}

export function setThpThemeCss(mode) {
  const link = document.getElementById(LINK_ID);
  if (link && MAP[mode]) link.href = MAP[mode];
}

