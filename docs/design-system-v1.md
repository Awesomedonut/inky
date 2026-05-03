# Inky Design System v1

> A literary archive that **reads like Stripe Press**, **navigates like Linear**, and **breathes like Hobonichi**.

Synthesized 2026-05-02 from CSS extraction of:
- **stripe.press** — editorial typography, drop caps, paper aesthetic, warm palette
- **linear.app** — token taxonomy (12-step grays, layered backgrounds, semantic radii, signature easings)
- **hobonichi.co.jp** — restraint, white space, unsaturated palette
- *granta.com referenced from prior knowledge (capture timed out on heavy ad-tech)*

---

## 1. Design Principles

| Principle | What it means in practice |
|---|---|
| **Reading is sacred** | Body text optimized first (19px / 1.7 / 65ch). Every other decision serves it. |
| **Paper, not screen** | Warm off-white background (`#fcfaf7`), not pure white. Ink is `#1a1715`, not pure black. Reduces eye strain, feels printed. |
| **One accent, used sparingly** | Rose `#c1576f` is the *only* chromatic color in the UI. Everything else is the warm gray scale. Restraint = literary. |
| **Borders before shadows** | 1px hairlines (`--color-rule`) define structure. Shadows reserved for floating UI (modals, popovers). |
| **Motion is paper-physics** | All easings approximate paper folding/turning — slow start, soft landing. No bounces, no springs. |
| **Tokens, not magic numbers** | Everything traceable to a token. Tailwind 4 `@theme` is the single source of truth. |

---

## 2. Color System

### Light mode (default)

| Token | Hex | Use |
|---|---|---|
| `--color-paper`     | `#fcfaf7` | Page background. Warm off-white. |
| `--color-paper-2`   | `#f5efe6` | Raised surface (cards, inputs at rest). |
| `--color-paper-3`   | `#efe7da` | Deeper surface (sidebar, footer, code blocks). |
| `--color-ink`       | `#1a1715` | Primary text. Warm black, not pure. |
| `--color-ink-2`     | `#4a433d` | Secondary text (captions, meta). |
| `--color-ink-3`     | `#7a6f65` | Tertiary text (timestamps, hints). |
| `--color-ink-4`     | `#a89e92` | Quaternary (placeholders, disabled). |
| `--color-rule`      | `#ede6dc` | Hairline borders, dividers. |
| `--color-rule-strong` | `#d9cfc0` | Stronger borders (input focus base). |
| `--color-accent`    | `#c1576f` | The *only* chromatic. Links, primary CTA, kudos hearts. Inspired by Stripe Press warm-clay accents but pushed to a literary rose. |
| `--color-accent-hover` | `#a04458` | Accent on hover/active. |
| `--color-accent-tint` | `#f5d9df` | Selection background, hover backgrounds. |
| `--color-gold`      | `#c8964a` | Sparingly: hits counter, "featured" markers. Echoes Stripe Press `#ffb55e` muted down. |
| `--color-success`   | `#6b8a4b` | Olive — "saved", "published". |
| `--color-warning`   | `#c68c2e` | Mustard — "draft", "expiring". |
| `--color-error`     | `#a04458` | Same as accent-hover (single hue family). |

### Dark mode

Not pure black. Deep ink (`#16140f`) with warm cream text. Linear's "layered bg" pattern: each elevation gets a slightly lighter tone.

| Token | Hex |
|---|---|
| `--color-paper`     | `#16140f` |
| `--color-paper-2`   | `#1f1c16` |
| `--color-paper-3`   | `#28241d` |
| `--color-ink`       | `#f0eae0` |
| `--color-ink-2`     | `#bfb6a8` |
| `--color-ink-3`     | `#8a8275` |
| `--color-ink-4`     | `#5c544a` |
| `--color-rule`      | `#2a2620` |
| `--color-rule-strong` | `#3e3830` |
| `--color-accent`    | `#e89aac` (lighter for AA contrast on dark) |
| `--color-accent-hover` | `#f0b0bf` |
| `--color-accent-tint` | `#3a2329` |
| `--color-gold`      | `#e0b96c` |

**Rationale:** Linear's `--gray1`..`--gray12` is brilliant but cold. We warm it: every gray has a +5% red bias. Stripe Press uses pure black + warm off-white — we keep that contrast but never hit pure black/white anywhere.

---

## 3. Typography

### Font stack

```
--font-serif:   "Source Serif 4 Variable", "Source Serif 4", "Iowan Old Style", "Charter", Georgia, serif
--font-sans:    "Inter Variable", "Inter", system-ui, sans-serif
--font-display: "Fraunces Variable", "Fraunces", "Source Serif 4", serif   /* with SOFT + opsz axes */
--font-mono:    "JetBrains Mono", "Menlo", monospace
--font-jp:      "Noto Sans JP", "Hiragino Kaku Gothic ProN", sans-serif    /* for Japanese fandoms/tags */
```

**Why these choices:**
- **Source Serif 4** for body — variable, screen-optimized serif. Free. Replaces Stripe Press's commercial Ivar Headline.
- **Fraunces** for display/branding — variable serif with SOFT and optical-size axes. Lets us go warm + literary without being stuffy.
- **Inter** for UI — Linear uses it. Geist is current Vercel default but Inter has more weight options.
- **JetBrains Mono** — the only mono with the literary chops to sit next to a serif.
- **Noto Sans JP** because Inky has Japanese fandoms (Undertale tag in works.json) — needs CJK fallback.

### Type scale (1.2 modular ratio, editorial)

| Token | Size (rem / px) | Use |
|---|---|---|
| `--text-xs`   | `0.75rem` / 12px  | Labels, captions, meta |
| `--text-sm`   | `0.875rem` / 14px | UI body, button text |
| `--text-base` | `1.0625rem` / 17px | Default body (slightly large for reading) |
| `--text-lg`   | `1.25rem` / 20px  | Large body, h5 |
| `--text-xl`   | `1.5rem` / 24px   | h4 |
| `--text-2xl`  | `1.875rem` / 30px | h3 |
| `--text-3xl`  | `2.375rem` / 38px | h2 |
| `--text-4xl`  | `3rem` / 48px     | h1 (work title) |
| `--text-5xl`  | `4rem` / 64px     | Display |
| `--text-6xl`  | `5.25rem` / 84px  | Hero (homepage) |

### Reading-content overrides

When inside `.prose` (chapter body):

```
font-family: var(--font-serif)
font-size:   1.1875rem  /* 19px */
line-height: 1.7
max-width:   65ch
letter-spacing: 0
```

### Letter spacing

| Token | Value | Use |
|---|---|---|
| `--tracking-display` | `-0.03em` | h1 / hero |
| `--tracking-heading` | `-0.02em` | h2-h4 |
| `--tracking-body`    | `0`       | body |
| `--tracking-label`   | `0.08em`  | uppercase labels |

### Weights

300 / 400 / 500 / 600 / 700 / 900 — only use what you need. Body=400, emphasis=500, headings=500/600, display=600/700.

---

## 4. Spacing

4px base. Tailwind 4 derives all `p-*`, `m-*`, `gap-*` etc. from `--spacing: 0.25rem`.

Custom semantic spacing (use sparingly; prefer the scale):

| Token | px | Use |
|---|---|---|
| `--space-page-x` | 24px (mobile), 48px (md), 80px (lg) | Page horizontal padding |
| `--space-section` | 96px | Vertical gap between major sections |
| `--space-prose` | 1.2em | Paragraph spacing inside `.prose` |
| `--space-stack` | 16px | Default vertical rhythm in lists |

---

## 5. Border Radius

| Token | px | Use |
|---|---|---|
| `--radius-sm`  | 4  | Inline elements (badges, code) |
| `--radius-md`  | 6  | Inputs, small buttons |
| `--radius-lg`  | 8  | Buttons, default |
| `--radius-xl`  | 12 | Cards |
| `--radius-2xl` | 16 | Modals, large surfaces |
| `--radius-3xl` | 24 | Hero panels |
| `--radius-pill` | 9999px | Tag chips, pills |

Linear uses the same scale (verified from `--radius-4` through `--radius-32`).

---

## 6. Shadows

Subtle. Paper does not float dramatically.

| Token | Value |
|---|---|
| `--shadow-tiny`   | `0 1px 0 rgba(26, 23, 21, 0.04)` |
| `--shadow-low`    | `0 1px 2px rgba(26, 23, 21, 0.04), 0 2px 4px rgba(26, 23, 21, 0.04)` |
| `--shadow-medium` | `0 4px 8px rgba(26, 23, 21, 0.06), 0 8px 16px rgba(26, 23, 21, 0.04)` |
| `--shadow-high`   | `0 8px 16px rgba(26, 23, 21, 0.08), 0 24px 48px rgba(26, 23, 21, 0.08)` |
| `--shadow-paper`  | `0 1px 0 rgba(26, 23, 21, 0.06), 0 0 0 1px rgba(26, 23, 21, 0.04)` (1px hairline + 1px lift, "paper sheet" effect) |

Default state for cards: **no shadow, just hairline**. Shadow appears only on hover/active.

---

## 7. Motion

| Token | Value | Use |
|---|---|---|
| `--ease-quick`     | `cubic-bezier(0.4, 0, 0.2, 1)`     | Material standard. Buttons, simple state changes. |
| `--ease-out-quart` | `cubic-bezier(0.25, 1, 0.5, 1)`    | Hover lifts, tooltip in. |
| `--ease-out-quint` | `cubic-bezier(0.22, 1, 0.36, 1)`   | Linear's signature. Page transitions. |
| `--ease-paper`     | `cubic-bezier(0.16, 1, 0.3, 1)`    | Modal/drawer slide. Slow, soft. |

| Speed | ms | Use |
|---|---|---|
| `--speed-quick`   | 150 | Hover, focus rings |
| `--speed-regular` | 250 | Most state changes |
| `--speed-slow`    | 400 | Drawers, modals |
| `--speed-page`    | 600 | Route transitions, hero reveals |

**Never animate:** opacity-only fades (boring), bouncy springs (juvenile), parallax (vertigo), auto-rotating carousels (criminal).

---

## 8. Component Patterns

### Cards (work tile, project tile)

```
background: var(--color-paper-2)
border: 1px solid var(--color-rule)
border-radius: var(--radius-xl)
padding: 24px
transition: all var(--speed-regular) var(--ease-out-quart)
```

Hover: `translate-y(-2px)`, `box-shadow: var(--shadow-low)`, `border-color: var(--color-rule-strong)`.

### Buttons

| Variant | Bg | Text | Border |
|---|---|---|---|
| **Primary** | `--color-ink` | `--color-paper` | none |
| **Secondary** | `--color-paper` | `--color-ink` | 1px `--color-rule-strong` |
| **Ghost** | transparent | `--color-ink` | none (hover: `--color-paper-2` bg) |
| **Accent** | `--color-accent` | `--color-paper` | none |

Common: `padding: 8px 16px`, `radius: --radius-lg`, `font-weight: 500`, `font-size: --text-sm`. Hover scales nothing; uses subtle inner shadow `inset 0 1px 0 rgba(255,255,255,.08)` (Linear's `--btn-overlay-shadow-hover`).

### Inputs

```
background: var(--color-paper)
border: 1px solid var(--color-rule-strong)
border-radius: var(--radius-md)
padding: 10px 14px
font-size: var(--text-base)
```

Focus: `outline: 2px solid var(--color-accent)`, `outline-offset: 2px`, `border-color: var(--color-accent)`.

### Tag chips (the AO3 lifeblood — preserve density, restyle)

```
background: var(--color-paper-3)
color: var(--color-ink-2)
font-size: var(--text-xs)
padding: 4px 10px
border-radius: var(--radius-pill)
font-weight: 500
```

Hover: `background: var(--color-accent-tint)`, `color: var(--color-accent-hover)`.

### Navigation header

- Sticky, `height: 56px`
- `background: rgba(252, 250, 247, 0.85)` + `backdrop-filter: blur(12px)`
- 1px bottom border that fades in only after `scrollY > 8px` (use IntersectionObserver)
- Logo (Fraunces, 18px) | center spacer | Search | Theme toggle | Avatar

### Reader chrome (the centerpiece)

- **Top progress bar:** 2px tall, `--color-accent`, scales width `transform: scaleX()` based on scroll %.
- **Reading settings drawer:** floats right edge, slides in `--ease-paper` 400ms. Adjust: font (serif/sans), size (16–24px), line-height (1.5–2.0), theme (paper/sepia/dark).
- **Drop cap:** first paragraph of a chapter — `::first-letter` selector, font-family `--font-display`, 4 lines tall, color `--color-accent`, slight margin-right.
- **Pull quotes:** `<blockquote>` styled with 4px left border `--color-accent`, italic, `--text-lg`, indented.
- **Chapter nav:** fixed bottom, two large pill buttons (← Previous / Next →), backdrop-blurred surface.

### Lists / tables (works browse)

- No zebra stripes
- Row min-height `64px`
- 1px bottom hairline `--color-rule`
- Hover: `background: var(--color-paper-2)`, transition `--speed-quick`

---

## 9. Tailwind 4 `@theme` block — drop into `app/globals.css`

```css
@import "tailwindcss";

@theme {
  /* ---------- COLOR ---------- */
  --color-paper: #fcfaf7;
  --color-paper-2: #f5efe6;
  --color-paper-3: #efe7da;
  --color-ink: #1a1715;
  --color-ink-2: #4a433d;
  --color-ink-3: #7a6f65;
  --color-ink-4: #a89e92;
  --color-rule: #ede6dc;
  --color-rule-strong: #d9cfc0;
  --color-accent: #c1576f;
  --color-accent-hover: #a04458;
  --color-accent-tint: #f5d9df;
  --color-gold: #c8964a;
  --color-success: #6b8a4b;
  --color-warning: #c68c2e;
  --color-error: #a04458;

  /* ---------- TYPOGRAPHY ---------- */
  --font-serif: "Source Serif 4 Variable", "Source Serif 4", "Iowan Old Style", "Charter", Georgia, serif;
  --font-sans: "Inter Variable", "Inter", system-ui, sans-serif;
  --font-display: "Fraunces Variable", "Fraunces", "Source Serif 4", serif;
  --font-mono: "JetBrains Mono", "Menlo", monospace;
  --font-jp: "Noto Sans JP", "Hiragino Kaku Gothic ProN", sans-serif;

  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1.0625rem;
  --text-lg: 1.25rem;
  --text-xl: 1.5rem;
  --text-2xl: 1.875rem;
  --text-3xl: 2.375rem;
  --text-4xl: 3rem;
  --text-5xl: 4rem;
  --text-6xl: 5.25rem;

  --tracking-display: -0.03em;
  --tracking-heading: -0.02em;
  --tracking-body: 0em;
  --tracking-label: 0.08em;

  /* ---------- SPACING ---------- */
  --spacing: 0.25rem;

  /* ---------- RADIUS ---------- */
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-2xl: 1rem;
  --radius-3xl: 1.5rem;

  /* ---------- SHADOW ---------- */
  --shadow-tiny: 0 1px 0 rgba(26, 23, 21, 0.04);
  --shadow-low: 0 1px 2px rgba(26, 23, 21, 0.04), 0 2px 4px rgba(26, 23, 21, 0.04);
  --shadow-medium: 0 4px 8px rgba(26, 23, 21, 0.06), 0 8px 16px rgba(26, 23, 21, 0.04);
  --shadow-high: 0 8px 16px rgba(26, 23, 21, 0.08), 0 24px 48px rgba(26, 23, 21, 0.08);
  --shadow-paper: 0 1px 0 rgba(26, 23, 21, 0.06), 0 0 0 1px rgba(26, 23, 21, 0.04);

  /* ---------- MOTION ---------- */
  --ease-quick: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
  --ease-out-quint: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-paper: cubic-bezier(0.16, 1, 0.3, 1);
  --speed-quick: 150ms;
  --speed-regular: 250ms;
  --speed-slow: 400ms;
  --speed-page: 600ms;
}

/* Dark mode — opt-in via .dark class on <html> */
@variant dark (&:where(.dark, .dark *));

.dark {
  --color-paper: #16140f;
  --color-paper-2: #1f1c16;
  --color-paper-3: #28241d;
  --color-ink: #f0eae0;
  --color-ink-2: #bfb6a8;
  --color-ink-3: #8a8275;
  --color-ink-4: #5c544a;
  --color-rule: #2a2620;
  --color-rule-strong: #3e3830;
  --color-accent: #e89aac;
  --color-accent-hover: #f0b0bf;
  --color-accent-tint: #3a2329;
  --color-gold: #e0b96c;
}

/* Base */
@layer base {
  html { color-scheme: light dark; }
  body {
    background: var(--color-paper);
    color: var(--color-ink);
    font-family: var(--font-sans);
    font-size: var(--text-base);
    line-height: 1.55;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }
  ::selection {
    background: var(--color-accent-tint);
    color: var(--color-accent-hover);
  }
}

/* Reading prose */
@layer components {
  .prose-reader {
    font-family: var(--font-serif);
    font-size: 1.1875rem;
    line-height: 1.7;
    max-width: 65ch;
    color: var(--color-ink);
  }
  .prose-reader p + p { margin-top: 1.2em; }
  .prose-reader p:first-of-type::first-letter {
    font-family: var(--font-display);
    font-weight: 600;
    color: var(--color-accent);
    float: left;
    font-size: 4.4em;
    line-height: 0.85;
    margin-right: 0.08em;
    margin-top: 0.05em;
  }
  .prose-reader blockquote {
    border-left: 3px solid var(--color-accent);
    padding-left: 1.25rem;
    font-style: italic;
    font-size: var(--text-lg);
    color: var(--color-ink-2);
    margin: 1.5em 0;
  }
}
```

---

## 10. Font loading (add to `app/layout.tsx`)

```tsx
import { Inter, Fraunces, Source_Serif_4, JetBrains_Mono } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const serif = Source_Serif_4({ subsets: ["latin"], variable: "--font-serif", display: "swap" });
const display = Fraunces({ subsets: ["latin"], variable: "--font-display", display: "swap", axes: ["SOFT", "opsz"] });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${serif.variable} ${display.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

---

## 11. Phase plan (next steps)

1. **Phase 1 (now):** Drop the `@theme` block above into `app/globals.css`, wire up next/font in `layout.tsx`. Verify nothing visually explodes. *Estimated: 1 hour.*
2. **Phase 2:** New header + footer using the new tokens; theme toggle. *2-3 hours.*
3. **Phase 3:** Reading page — drop cap, progress bar, settings drawer. *4-6 hours.*
4. **Phase 4:** Browse/discovery — work cards, tag filter sidebar. *3-4 hours.*
5. **Phase 5:** Editor — replace textarea with TipTap. *6-8 hours.*
6. **Phase 6:** Brand polish — wordmark, micro-animations, empty states. *3-4 hours.*

---

## Appendix: where each token came from

| Token area | Source |
|---|---|
| Color palette warmth | Stripe Press (warm off-white + warm black instead of pure values) |
| 12-step gray idea | Linear (Radix gray); we collapsed to 4 ink + 3 paper for editorial restraint |
| Layered surface (paper / paper-2 / paper-3) | Linear (`--color-bg-level-0/1/2/3`) |
| Single chromatic accent | Hobonichi (one blue) + Stripe Press (one orange-tan) |
| Type scale ratio (1.2) | Stripe Press, Granta (editorial standard) |
| Reading defaults (19px / 1.7 / 65ch) | Stripe Press, Medium, Substack consensus |
| Drop cap pattern | Stripe Press chapter openings |
| Border-first / shadow-second | Linear (`--border-hairline`, sparing shadow use) |
| Easing curves | Linear (`--ease-out-quint`, `--ease-out-quart`, `--ease-paper`) |
| Speed scale (quick/regular/slow) | Linear (`--speed-quickTransition`, etc.) |
| Radius scale (4/6/8/12/16/24) | Linear (`--radius-4` through `--radius-32`) |
| Restrained palette (one accent) | Hobonichi |
| Generous spacing for "wabi-sabi" | Hobonichi |
