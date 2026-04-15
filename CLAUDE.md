# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static single-file landing page for **IA Melilla 2026** — an AI conference event (May 20-21, 2026, Melilla, Spain). Uses Tailwind CSS via CDN, no build system, no framework. Open `index.html` directly in a browser.

## Development

No build, lint, or test commands — there are none. To preview, open `index.html` in a browser or serve it with any static file server:

```bash
python3 -m http.server 8080
# or
npx serve .
```

## Architecture

Everything lives in `index.html` in this order:

1. **`<head>`** — Google Fonts (Bebas Neue + Space Grotesk + Inter), Tailwind CDN with custom config, inline `<style>`, structured data (JSON-LD)
2. **`<body>`** sections in DOM order:
   - `header` — fixed navbar with hamburger menu (mobile) and desktop nav
   - Hero section — full-screen with gradient blobs, scanlines, countdown timer (mobile + desktop), and CTA
   - Data ribbon — marquee with event keywords
   - `#ponentes` — speaker card grid (horizontal scroll on mobile, grid on desktop)
   - `#agenda` — two-day schedule with tab navigation and timeline layout
   - `#empresas` — company/partner logos (horizontal scroll on mobile, logo wall on desktop)
   - `#sobre` — event details and stats
   - Partners ribbon — text-only partner names
   - `#registro` — email waitlist form with Google Apps Script backend
   - `footer` — logo, navigation links
   - Bottom nav — fixed mobile navigation bar
   - Drawer — slide-out mobile menu
3. **Inline `<script>`** at end of body — all JS (agenda tabs, drawer, countdown, waitlist form, scroll reveal, smooth scroll)

## Design System (Tailwind Config)

| Token | Value | Use |
|-------|-------|-----|
| `bg` | `#0b0c1f` | Main background |
| `surface` / `surface-hi` / `surface-top` | `#111225` / `#1d1e32` / `#27283d` | Elevated surfaces |
| `cyan` / `cyan-dim` | `#00f2ff` / `#00dbe7` | Primary accent |
| `amber` | `#ffab00` | Secondary accent / highlight |
| `muted` | `#5a6b7b` | Muted text |
| `border` | `rgba(255,255,255,0.07)` | Borders |

Fonts: `font-display` (Bebas Neue), `font-grotesk` (Space Grotesk), `font-body` (Inter). Border radius set to 0px (sharp edges design).

## Key Patterns

- **Scroll animations**: `IntersectionObserver` adds `.visible` class to elements with `.reveal` class
- **Countdown**: `setInterval` targeting `2026-05-20T09:00:00` — update this date for future events
- **Agenda**: Tab-based day switcher with staggered CSS animations on items
- **Form**: Email regex validation, sends to Google Apps Script endpoint, inline success/error messages
- **Responsive**: Tailwind `md:` breakpoint (768px); hamburger drawer menu + bottom nav on mobile
- **Speaker cards**: Horizontal scroll with snap on mobile, CSS grid on desktop; grayscale-to-color hover effect
