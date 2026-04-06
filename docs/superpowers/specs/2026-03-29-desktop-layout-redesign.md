# Desktop Layout Redesign — AI Melilla 2026

**Date:** 2026-03-29
**Status:** Approved

## Problem

On desktop (≥768px) and especially on large monitors (≥1440px), the landing page looks broken:
- Speaker cards stretch to huge sizes because `lg:grid-cols-6` fills the full viewport width
- Company cards have the same problem with `md:grid-cols-5`
- No max-width cap on any section — content expands infinitely on ultra-wide screens
- Hero leaves all horizontal space on the right completely empty on desktop

## Design Decisions

### 1. Global max-width
All section inner containers get `max-w-[1400px] mx-auto`. Section backgrounds remain full-width; only content is constrained.

### 2. Hero — 2-column layout on desktop
- **Left col (60%)**: title, meta (date/location), CTA button
- **Right col (40%)**: countdown timer, framed with a cyan accent border
- Mobile: unchanged (stacked, full-width)

### 3. Speakers — `lg:grid-cols-3` (2 rows of 3)
- Mobile: unchanged (horizontal scroll, 75vw cards)
- Desktop: 2 rows × 3 cards, max-w-5xl, each card ~340px wide
- XL (≥1280px): 6 cols within max-w-7xl → each card ~213px — acceptable
- Cards keep `aspect-[3/4]` portrait ratio

### 4. Companies — logo wall on desktop
- Mobile: unchanged (horizontal scroll, 60vw cards)
- Desktop: centered `max-w-4xl` grid of logos — no card chrome, just logo + company name below
- The square card design is appropriate for mobile scroll; desktop gets a cleaner brand showcase

### 5. "Sobre el evento" — 2-column on desktop
- **Left (55%)**: existing paragraph text
- **Right (45%)**: stats (2 días / Melilla / 2026) displayed vertically with large numerals
- Mobile: unchanged (stacked)

## Files Changed

- `index.html` — all changes inline (no build system)

## Non-goals

- No changes to mobile layout
- No new assets or dependencies
- No changes to animations, JS, or form behavior
