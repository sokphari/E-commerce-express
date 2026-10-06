import { useEffect, useMemo, useState } from "react";
import { ThemeContext } from "./theme-context";
import { applyTheme, getInitialTheme, readStoredTheme, storeTheme } from "./theme";

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
    storeTheme(theme);
  }, [theme]);

  useEffect(() => {
    function handleStorage(event) {
      if (event.key !== "phonehub_theme") return;
      const next = readStoredTheme();
      if (next) setTheme(next);
    }

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggle: () => setTheme((current) => (current === "dark" ? "light" : "dark")),
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}