# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static single-file landing page for **AI Melilla 2025** — an AI conference event (May 20-22, 2025, Melilla, Spain). No build system, no dependencies, no framework. Open `index.html` directly in a browser.

## Development

No build, lint, or test commands — there are none. To preview, open `index.html` in a browser or serve it with any static file server:

```bash
python3 -m http.server 8080
# or
npx serve .
```

## Architecture

Everything lives in `index.html` (≈1173 lines) in this order:

1. **`<head>`** — Google Fonts (Syne + Inter), inline `<style>` with the full CSS
2. **`<body>`** sections in DOM order:
   - `#nav` — fixed navbar, hamburger menu, scroll-triggered background blur
   - `#hero` — full-screen with animated gradient blobs, canvas particle system, countdown timer, and waitlist CTA
   - `#about` — event details/stats with scroll-triggered fade-in via Intersection Observer
   - `#speakers` — speaker card grid with fade-up animations
   - `#waitlist` — email capture form with inline validation
   - `footer` — logo, social links
   - Mobile sticky pill — floating CTA that appears after 1.5s
3. **Inline `<script>`** at end of body — all JS (particle system, countdown, form validation, Intersection Observer, mobile menu)

## Design System (CSS Variables)

| Token | Value | Use |
|-------|-------|-----|
| Backgrounds | `#0a0f1e`, `#0d1428`, `#111d3a` | Navy scale |
| Primary accent | `#00f5ff` / `#00c8d4` | Cyan |
| Highlight | `#ffb800` | Amber |
| Text | `#e8f0fe` / `#5a6a8a` | Primary / muted |
| Transition | `0.3s cubic-bezier(0.4,0,0.2,1)` | All interactive states |
| Border radius | `12px` primary, `8px`/`6px` buttons | — |

Gradient text uses `-webkit-background-clip: text` with the cyan palette. Glass-morphism cards use `backdrop-filter: blur()`.

## Key Patterns

- **Scroll animations**: `IntersectionObserver` adds `.animate` class to elements with `data-animate` attribute
- **Particles**: Canvas-based; 80 particles on desktop, 40 on mobile (checked via `window.innerWidth`)
- **Countdown**: `setInterval` targeting `May 20, 2025 09:00:00` — update this date for future events
- **Form**: Email regex validation, inline success/error messages, no backend integration (currently client-side only)
- **Responsive**: Media queries at 768px and 480px breakpoints; hamburger menu below 768px
