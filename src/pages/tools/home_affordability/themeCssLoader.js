const LINK_ID = "home-afford-theme-css";
const MAP = {
  light: "/home-afford-themes/light.css",
  dark: "/home-afford-themes/dark.css",
};

export function ensureHomeAffThemeCss(initialMode = "light") {
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

export function setHomeAffThemeCss(mode) {
  const link = document.getElementById(LINK_ID);
  if (link && MAP[mode]) {
    link.href = MAP[mode];
  }
}
