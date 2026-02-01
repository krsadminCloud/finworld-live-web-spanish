import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enCommon from "./locales/en/common.json";
import esUsCommon from "./locales/es-us/common.json";

// Route-friendly codes stay lowercase; i18next uses canonical casing for region.
export const SUPPORTED_LANGUAGES = ["en", "es-us"];
export const DEFAULT_LANGUAGE = "en";
export const LANGUAGE_STORAGE_KEY = "finworld.lang";

const toCanonical = (lang) => {
  const lower = (lang || "").toLowerCase();
  if (lower === "es-us") return "es-US";
  if (lower === "en") return "en";
  return DEFAULT_LANGUAGE;
};

const getStoredLanguage = () => {
  if (typeof window === "undefined") return null;
  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (stored) return toCanonical(stored);
  return null;
};

const getInitialLanguage = () => getStoredLanguage() || DEFAULT_LANGUAGE;

const resources = {
  en: { common: enCommon },
  "es-US": { common: esUsCommon },
  // Allow base "es" to reuse es-US bundle to satisfy i18next base-lang lookups
  es: { common: esUsCommon },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: toCanonical(getInitialLanguage()),
    fallbackLng: {
      es: ["es-US"],
      default: [DEFAULT_LANGUAGE],
    },
    debug: true,
    supportedLngs: ["en", "es", "es-US"],
    defaultNS: "common",
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });

i18n.on("languageChanged", (lng) => {
  const canonical = toCanonical(lng);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, canonical);
    if (document?.documentElement) {
      document.documentElement.lang = canonical;
    }
  }
});

if (document?.documentElement) {
  document.documentElement.lang = i18n.language || DEFAULT_LANGUAGE;
}

export const toCanonicalLanguage = toCanonical;

export default i18n;
