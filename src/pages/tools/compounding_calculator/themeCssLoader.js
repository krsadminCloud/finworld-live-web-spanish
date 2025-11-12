const LINK_ID = "compounding-theme-css";
const MAP = {
  light: "/compound-themes/light.css",
  dark: "/compound-themes/dark.css",
};

export function ensureCompThemeCss(initialMode = "light") {
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

export function setCompThemeCss(mode) {
  const link = document.getElementById(LINK_ID);
  if (link && MAP[mode]) {
    link.href = MAP[mode];
  }
}
