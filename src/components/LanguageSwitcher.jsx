// Shared language switcher for all pages
import * as React from "react";
import { Button, IconButton, Menu, MenuItem } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import CheckIcon from "@mui/icons-material/Check";
import { useLocation, useNavigate } from "react-router-dom";
import i18n, { SUPPORTED_LANGUAGES, toCanonicalLanguage } from "../i18n";
import { useLanguageRouting } from "../utils/langRouting";
import { useTranslation } from "react-i18next";

/**
 * Props:
 * - buttonProps: forwarded to the trigger (Button or IconButton)
 * - iconOnly: if true, render IconButton instead of Button
 */
export default function LanguageSwitcher({ buttonProps = {}, iconOnly = false }) {
  const { routeLang } = useLanguageRouting();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleSelect = async (option) => {
    console.log("[LangSwitch] selected:", option, "routeLang:", routeLang);
    handleClose(); // close menu first to avoid MUI portal crash
    if (option !== routeLang) {
      const stripped = location.pathname.replace(/^\/[^/]+/, "") || "/";
      const target = `/${option}${stripped}${location.search}${location.hash}`;
      const canonical = toCanonicalLanguage(option);
      console.log("[LangSwitch] canonical:", canonical);
      console.log("[LangSwitch] pathname before:", location.pathname);
      setTimeout(() => {
        console.log("[LangSwitch] navigating to:", target);
        navigate(target, { replace: true });
        console.log("[LangSwitch] pathname after navigate (sync):", window.location.pathname);
      }, 0);
    }
  };

  const triggerLabel =
    routeLang === "es-us" ? t("language.spanish") : t("language.english");

  const Trigger = iconOnly ? IconButton : Button;

  const { sx: incomingSx, ...restButtonProps } = buttonProps;
  const baseSx = {
    backgroundColor: "#dc2626",
    color: "#fff",
    "&:hover": { backgroundColor: "#b91c1c" },
  };

  return (
    <>
      <Trigger
        onClick={handleOpen}
        startIcon={!iconOnly ? <LanguageIcon /> : undefined}
        aria-label={t("language.english")}
        variant={iconOnly ? undefined : "contained"}
        sx={{ ...baseSx, ...incomingSx }}
        {...restButtonProps}
      >
        {!iconOnly && triggerLabel}
        {iconOnly && <LanguageIcon />}
      </Trigger>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {SUPPORTED_LANGUAGES.map((option) => {
          const canonical = toCanonicalLanguage(option);
          const selected = i18n.language === canonical || routeLang === option;
          return (
            <MenuItem key={option} selected={selected} onClick={() => handleSelect(option)}>
              {selected && <CheckIcon fontSize="small" sx={{ mr: 1 }} />}
              {option === "es-us" ? t("language.spanish") : t("language.english")}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
}
