"use client";

import { useEffect, useRef, useState } from "react";

type Font = "serif" | "sans" | "mono";
type Size = "s" | "m" | "l" | "xl";
type ReaderTheme = "paper" | "sepia" | "dim";

const STORAGE_KEY = "inky-reader-prefs";

interface Prefs {
  font: Font;
  size: Size;
  theme: ReaderTheme;
}

const DEFAULTS: Prefs = { font: "serif", size: "m", theme: "paper" };

function applyToDOM(prefs: Prefs) {
  document.querySelectorAll<HTMLElement>(".userstuff").forEach((el) => {
    el.dataset.readerFont = prefs.font;
    el.dataset.readerSize = prefs.size;
    el.dataset.readerTheme = prefs.theme;
  });
}

export default function ReadingSettings() {
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState<Prefs>(DEFAULTS);
  const [mounted, setMounted] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setPrefs({ ...DEFAULTS, ...JSON.parse(raw) });
    } catch {}
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    applyToDOM(prefs);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs)); } catch {}
  }, [prefs, mounted]);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  if (!mounted) return null;

  const update = <K extends keyof Prefs>(key: K, value: Prefs[K]) =>
    setPrefs((p) => ({ ...p, [key]: value }));

  return (
    <div className="reading-settings" ref={wrapRef}>
      {open && (
        <div className="reading-settings-panel" role="dialog" aria-label="Reading settings">
          <div className="reading-settings-row">
            <span className="reading-settings-label">Typeface</span>
            <div className="reading-settings-segment" role="group">
              {(["serif", "sans", "mono"] as Font[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  aria-pressed={prefs.font === f}
                  onClick={() => update("font", f)}
                >
                  {f === "serif" ? "Serif" : f === "sans" ? "Sans" : "Mono"}
                </button>
              ))}
            </div>
          </div>

          <div className="reading-settings-row">
            <span className="reading-settings-label">Size</span>
            <div className="reading-settings-segment" role="group">
              {(["s", "m", "l", "xl"] as Size[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  aria-pressed={prefs.size === s}
                  onClick={() => update("size", s)}
                >
                  {s.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="reading-settings-row">
            <span className="reading-settings-label">Background</span>
            <div className="reading-settings-segment" role="group">
              {(["paper", "sepia", "dim"] as ReaderTheme[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  aria-pressed={prefs.theme === t}
                  onClick={() => update("theme", t)}
                >
                  {t === "paper" ? "Paper" : t === "sepia" ? "Sepia" : "Dim"}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      <button
        type="button"
        className="reading-settings-fab"
        aria-label={open ? "Close reading settings" : "Open reading settings"}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" y1="6" x2="14" y2="6" />
          <line x1="4" y1="12" x2="11" y2="12" />
          <line x1="4" y1="18" x2="14" y2="18" />
          <circle cx="18" cy="6" r="2" />
          <circle cx="15" cy="12" r="2" />
          <circle cx="18" cy="18" r="2" />
        </svg>
      </button>
    </div>
  );
}
