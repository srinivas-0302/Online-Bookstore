import { useEffect, useRef, useState } from "react";
import { ACCENTS, THEME_MODES } from "../context/themeOptions";
import useTheme from "../hooks/useTheme";

export default function ThemeMenu() {
  const { theme, accent, setTheme, setAccent } = useTheme();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Close when the user clicks outside, or presses Escape
  useEffect(() => {
    if (!open) return;

    const handleOutsideClick = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    const handleKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div className="theme-menu" ref={wrapperRef} onClick={(event) => event.stopPropagation()}>
      <button
        type="button"
        className="icon-button"
        aria-label="Appearance settings"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((previous) => !previous)}
      >
        🎨
      </button>

      {open && (
        <div className="theme-popover" role="dialog" aria-label="Appearance">
          <p className="popover-label">Theme</p>
          <div className="segmented">
            {THEME_MODES.map((mode) => (
              <button
                key={mode.id}
                type="button"
                className={theme === mode.id ? "active" : ""}
                onClick={() => setTheme(mode.id)}
              >
                {mode.icon} {mode.label}
              </button>
            ))}
          </div>

          <p className="popover-label">Accent colour</p>
          <div className="swatches">
            {ACCENTS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={accent === item.id ? "swatch active" : "swatch"}
                style={{ background: item.color }}
                aria-label={item.label}
                title={item.label}
                onClick={() => setAccent(item.id)}
              >
                {accent === item.id ? "✓" : ""}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}