import { useCallback, useEffect, useMemo, useState } from "react";
import { ThemeContext } from "./ThemeContext";
import { ACCENTS, THEME_MODES } from "./themeOptions";

const THEME_KEY = "theme";
const ACCENT_KEY = "accent";

const THEME_IDS = THEME_MODES.map((mode) => mode.id);
const ACCENT_IDS = ACCENTS.map((accent) => accent.id);

function readSetting(key, allowedValues, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return allowedValues.includes(saved) ? saved : fallback;
  } catch {
    return fallback;
  }
}

function saveSetting(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore (private mode etc.)
  }
}

export default function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => readSetting(THEME_KEY, THEME_IDS, "system"));
  const [accent, setAccentState] = useState(() => readSetting(ACCENT_KEY, ACCENT_IDS, "indigo"));
  const [systemDark, setSystemDark] = useState(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  // Follow the computer's dark/light setting (used when theme = "system")
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (event) => setSystemDark(event.matches);
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  const resolvedTheme = theme === "system" ? (systemDark ? "dark" : "light") : theme;

  // Put the choice on the <html> tag. The CSS does the rest.
  useEffect(() => {
    document.documentElement.dataset.theme = resolvedTheme;
    document.documentElement.dataset.accent = accent;
  }, [resolvedTheme, accent]);

  const setTheme = useCallback((value) => {
    setThemeState(value);
    saveSetting(THEME_KEY, value);
  }, []);

  const setAccent = useCallback((value) => {
    setAccentState(value);
    saveSetting(ACCENT_KEY, value);
  }, []);

  const value = useMemo(
    () => ({ theme, accent, resolvedTheme, setTheme, setAccent }),
    [theme, accent, resolvedTheme, setTheme, setAccent]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}