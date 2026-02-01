import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES, toCanonicalLanguage } from '../i18n';

export function normalizeLanguage(lang) {
  if (!lang) return DEFAULT_LANGUAGE;
  const lower = lang.toLowerCase();
  return SUPPORTED_LANGUAGES.includes(lower) ? lower : DEFAULT_LANGUAGE;
}

export function useLanguageRouting() {
  const { lang } = useParams();
  const routeLang = normalizeLanguage(lang);
  const currentLang = toCanonicalLanguage(routeLang);

  const withLang = (path) => {
    // Ensure path starts with /
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    // If path is just '/', return '/en' (no trailing slash)
    if (cleanPath === '/') return `/${routeLang}`;
    return `/${routeLang}${cleanPath}`;
  };

  return { currentLang, routeLang, withLang };
}

export function useLanguageNavigate() {
  const navigate = useNavigate();
  const { routeLang } = useLanguageRouting();

  return (path, options) => {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const target = cleanPath === '/' ? `/${routeLang}` : `/${routeLang}${cleanPath}`;
    navigate(target, options);
  };
}
