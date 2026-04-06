# Desktop Layout Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the desktop layout of the AI Melilla 2026 landing page so it looks great on all screen sizes, not just mobile.

**Architecture:** All changes are in `index.html` — a single static file with Tailwind CDN (no build step). The approach is: (1) cap content width with `max-w-[1400px] mx-auto` in every section inner container, (2) restructure the hero for a 2-column desktop layout, (3) fix the speakers grid, (4) replace company cards with a clean logo wall on desktop, (5) split "Sobre el evento" into 2 columns on desktop.

**Tech Stack:** HTML, Tailwind CSS (CDN, config in `<script id="tailwind-config">`), no build system.

---

## File Map

- Modify: `index.html` — all changes here

---

### Task 1: Hero — 2-column desktop layout

The hero section currently has `px-5 md:px-16 lg:px-24` on the `<section>` tag and a single `max-w-2xl` content div. On desktop the right half is empty. This task:
- Removes the padding from the `<section>` tag and puts it on a max-width inner container
- Makes the inner container a 2-column flex layout on desktop
- Moves the countdown to the right column on desktop (hidden on mobile)
- Keeps a `md:hidden` countdown in the left column for mobile
- Updates the JS `tick()` to update a second set of countdown IDs (`cd-days-d`, etc.) for the right column

**Files:**
- Modify: `index.html` — hero section (lines ~133–202) + JS tick() function (lines ~558–574)

- [ ] **Step 1: Remove padding from `<section>` and restructure the inner container**

Find the opening `<section>` tag of the hero (currently line ~133):
```html
<section class="relative min-h-svh flex flex-col justify-end md:justify-center px-5 md:px-16 lg:px-24 pb-14 pt-28 md:pt-24 overflow-hidden clip-down bg-surface">
```
Change to (remove the `px-*` classes):
```html
<section class="relative min-h-svh flex flex-col justify-end md:justify-center pb-14 pt-28 md:pt-24 overflow-hidden clip-down bg-surface">
```

Then find the inner content div (currently line ~143):
```html
  <div class="relative z-10 space-y-6 reveal max-w-2xl" style="transition-delay:0.1s">
```
Change to:
```html
  <div class="relative z-10 w-full reveal px-5 md:px-16 lg:px-24 max-w-[1400px] mx-auto" style="transition-delay:0.1s">
    <div class="md:flex md:items-center md:justify-between md:gap-12">
```
And close the new inner div before the closing `</div>` of the old `.relative.z-10` div:
```html
    </div><!-- end md:flex -->
  </div><!-- end relative z-10 -->
```

- [ ] **Step 2: Wrap the existing content in the left column div**

Inside the new `md:flex` wrapper, wrap everything that currently exists (eyebrow, h1, meta, countdown, CTA) in a left column:
```html
      <!-- LEFT COLUMN -->
      <div class="space-y-6 max-w-xl">
        [eyebrow]
        [h1]
        [meta]
        [countdown — add md:hidden so it hides on desktop]
        [CTA]
      </div>
```

For the countdown div (currently `<div class="pt-2">`), add `md:hidden`:
```html
        <div class="pt-2 md:hidden">
          [all countdown content unchanged]
        </div>
```

- [ ] **Step 3: Add right column with countdown (desktop only)**

After the left column closing `</div>`, add the right column:
```html
      <!-- RIGHT COLUMN: countdown desktop only -->
      <div class="hidden md:flex md:flex-col md:items-center md:justify-center md:flex-shrink-0 border border-cyan/20 bg-cyan/5 backdrop-blur-sm p-10 gap-6">
        <p class="font-grotesk text-[9px] tracking-[0.3em] text-muted uppercase">Cuenta atrás</p>
        <div class="flex items-start gap-6">
          <div class="text-center">
            <div class="cd-digit" id="cd-days-d">--</div>
            <div class="font-grotesk text-[9px] text-muted tracking-widest uppercase mt-1">Días</div>
          </div>
          <div class="cd-digit text-white/20 pt-0.5">:</div>
          <div class="text-center">
            <div class="cd-digit" id="cd-hours-d">--</div>
            <div class="font-grotesk text-[9px] text-muted tracking-widest uppercase mt-1">Horas</div>
          </div>
          <div class="cd-digit text-white/20 pt-0.5">:</div>
          <div class="text-center">
            <div class="cd-digit" id="cd-mins-d">--</div>
            <div class="font-grotesk text-[9px] text-muted tracking-widest uppercase mt-1">Min</div>
          </div>
          <div class="cd-digit text-white/20 pt-0.5">:</div>
          <div class="text-center">
            <div class="cd-digit" id="cd-secs-d">--</div>
            <div class="font-grotesk text-[9px] text-muted tracking-widest uppercase mt-1">Seg</div>
          </div>
        </div>
        <div class="font-grotesk text-[9px] text-cyan/50 tracking-[0.2em] uppercase mt-2">20 · 21 Mayo 2026</div>
      </div>
```

- [ ] **Step 4: Update the JS tick() function to update both sets of countdown IDs**

Find the `tick()` function in the `<script>` block (around line ~559). Currently:
```js
document.getElementById('cd-days').textContent  = pad(Math.floor(diff / 86400000));
document.getElementById('cd-hours').textContent = pad(Math.floor((diff % 86400000) / 3600000));
document.getElementById('cd-mins').textContent  = pad(Math.floor((diff % 3600000) / 60000));
document.getElementById('cd-secs').textContent  = pad(Math.floor((diff % 60000) / 1000));
```
Change to:
```js
var days  = pad(Math.floor(diff / 86400000));
var hours = pad(Math.floor((diff % 86400000) / 3600000));
var mins  = pad(Math.floor((diff % 3600000) / 60000));
var secs  = pad(Math.floor((diff % 60000) / 1000));
document.getElementById('cd-days').textContent   = days;
document.getElementById('cd-hours').textContent  = hours;
document.getElementById('cd-mins').textContent   = mins;
document.getElementById('cd-secs').textContent   = secs;
document.getElementById('cd-days-d').textContent  = days;
document.getElementById('cd-hours-d').textContent = hours;
document.getElementById('cd-mins-d').textContent  = mins;
document.getElementById('cd-secs-d').textContent  = secs;
```

Also update the `diff <= 0` branch at the top of tick():
```js
if (diff <= 0) {
  ['cd-days','cd-hours','cd-mins','cd-secs','cd-days-d','cd-hours-d','cd-mins-d','cd-secs-d'].forEach(function(id) {
    document.getElementById(id).textContent = '00';
  });
  return;
}
```

- [ ] **Step 5: Verify in browser**

Open `index.html` in a browser. At desktop width (≥768px): countdown should appear in a framed box on the right side. On mobile (≤767px): countdown should appear in its original position (between meta and CTA).

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "feat: hero 2-column desktop layout with framed countdown"
```

---

### Task 2: Speakers — `xl:grid-cols-6` capped within max-width

The speaker grid is `md:grid-cols-3 lg:grid-cols-6`. On large screens with no max-width, the 6 columns fill the entire viewport making faces huge. This task: adds a `max-w-[1400px] mx-auto` wrapper inside the section and delays the 6-column layout to `xl:` so that `lg:` shows 3 columns (2 nice rows).

**Files:**
- Modify: `index.html` — ponentes section (lines ~228–311)

- [ ] **Step 1: Wrap section content in a max-width container**

The ponentes section currently starts:
```html
<section id="ponentes" class="py-16 px-5 md:px-10 lg:px-24 bg-bg reveal">
  <h2 class="font-display text-5xl mb-2 ...">PONENTES</h2>
  <p class="font-grotesk text-[10px] ... md:hidden">Desliza para ver más →</p>

  <div class="flex overflow-x-auto gap-4 no-scrollbar snap-x snap-mandatory -mx-5 px-5 md:grid md:grid-cols-3 lg:grid-cols-6 md:overflow-visible md:snap-none md:mx-0 md:px-0">
```

Change to:
```html
<section id="ponentes" class="py-16 px-5 md:px-10 lg:px-24 bg-bg reveal">
  <div class="max-w-[1400px] mx-auto">
    <h2 class="font-display text-5xl mb-2 ...">PONENTES</h2>
    <p class="font-grotesk text-[10px] ... md:hidden">Desliza para ver más →</p>

    <div class="flex overflow-x-auto gap-4 no-scrollbar snap-x snap-mandatory -mx-5 px-5 md:grid md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 md:overflow-visible md:snap-none md:mx-0 md:px-0">
```

Close the new `max-w-[1400px] mx-auto` div before `</section>`:
```html
  </div><!-- end max-w wrapper -->
</section>
```

Key change in the grid div: `lg:grid-cols-6` → `lg:grid-cols-3 xl:grid-cols-6`

- [ ] **Step 2: Verify in browser**

At 1024–1279px: 3 columns (2 rows of 3 speakers). At 1280px+: 6 columns (1 row). Images should never be larger than ~230px wide on any desktop.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "fix: speakers grid max-width cap + delay 6-col to xl breakpoint"
```

---

### Task 3: Companies — clean logo wall on desktop

The companies section has the same problem: `md:grid-cols-5` with no max-width cap. On desktop, the square logo cards stretch too wide. This task adds a max-width cap AND replaces the card grid on desktop with a clean centered logo wall (the card grid stays for mobile scroll).

**Files:**
- Modify: `index.html` — empresas section (lines ~313–389)

- [ ] **Step 1: Add `md:hidden` to the existing scroll container**

The scroll+grid div currently starts:
```html
  <div class="flex overflow-x-auto gap-4 no-scrollbar snap-x snap-mandatory -mx-5 px-5 md:grid md:grid-cols-5 md:overflow-visible md:snap-none md:mx-0 md:px-0">
```
Change to:
```html
  <div class="flex overflow-x-auto gap-4 no-scrollbar snap-x snap-mandatory -mx-5 px-5 md:hidden">
```
(Removes the grid classes and hides the whole scroll container on desktop — the cards only show on mobile now.)

- [ ] **Step 2: Add the desktop logo wall after the scroll container**

After the closing `</div>` of the scroll container (and before `</section>`), add:
```html
    <!-- Desktop logo wall -->
    <div class="hidden md:flex md:flex-wrap md:justify-center md:items-center md:gap-12 lg:gap-20 max-w-[1400px] mx-auto">

      <!-- Microsoft -->
      <div class="flex flex-col items-center gap-4 group">
        <div class="w-24 h-24 flex items-center justify-center bg-bg border border-border group-hover:border-amber/40 transition-colors p-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="w-12 h-12" aria-label="Microsoft">
            <rect x="0"  y="0"  width="47" height="47" fill="#f25022"/>
            <rect x="53" y="0"  width="47" height="47" fill="#7fba00"/>
            <rect x="0"  y="53" width="47" height="47" fill="#00a4ef"/>
            <rect x="53" y="53" width="47" height="47" fill="#ffb900"/>
          </svg>
        </div>
        <span class="font-display text-lg text-white tracking-wide">MICROSOFT</span>
        <span class="font-grotesk text-[9px] text-white/30 tracking-widest uppercase -mt-3">AI & Cloud</span>
      </div>

      <!-- Eurecat -->
      <div class="flex flex-col items-center gap-4 group">
        <div class="w-24 h-24 flex items-center justify-center bg-[#ffffff] border border-border group-hover:border-amber/40 transition-colors p-4">
          <img src="assets/logos/eurecat.png" alt="Eurecat" class="max-h-12 max-w-full object-contain">
        </div>
        <span class="font-display text-lg text-white tracking-wide">EURECAT</span>
        <span class="font-grotesk text-[9px] text-white/30 tracking-widest uppercase -mt-3">Centro Tecnológico</span>
      </div>

      <!-- Gigas -->
      <div class="flex flex-col items-center gap-4 group">
        <div class="w-24 h-24 flex items-center justify-center bg-bg border border-border group-hover:border-amber/40 transition-colors p-4">
          <img src="assets/logos/gigas.svg" alt="Gigas" class="max-h-12 max-w-full object-contain">
        </div>
        <span class="font-display text-lg text-white tracking-wide">GIGAS</span>
        <span class="font-grotesk text-[9px] text-white/30 tracking-widest uppercase -mt-3">Cloud Hosting</span>
      </div>

      <!-- Freepik -->
      <div class="flex flex-col items-center gap-4 group">
        <div class="w-24 h-24 flex items-center justify-center bg-bg border border-border group-hover:border-amber/40 transition-colors p-4">
          <img src="assets/logos/freepik.svg" alt="Freepik" class="max-h-12 max-w-full object-contain">
        </div>
        <span class="font-display text-lg text-white tracking-wide">FREEPIK</span>
        <span class="font-grotesk text-[9px] text-white/30 tracking-widest uppercase -mt-3">AI Creative Tools</span>
      </div>

      <!-- Cluster -->
      <div class="flex flex-col items-center gap-4 group">
        <div class="w-24 h-24 flex items-center justify-center bg-bg border border-border group-hover:border-amber/40 transition-colors p-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="w-14 h-14" aria-label="Cluster">
            <polygon points="50,8 92,32 92,68 50,92 8,68 8,32" fill="none" stroke="#00c87a" stroke-width="5"/>
            <circle cx="50" cy="50" r="14" fill="#00c87a"/>
          </svg>
        </div>
        <span class="font-display text-base text-white tracking-wide leading-tight text-center">CLUSTER<br/>EMPRENDIMIENTO</span>
        <span class="font-grotesk text-[9px] text-white/30 tracking-widest uppercase -mt-3">Melilla</span>
      </div>

    </div><!-- end desktop logo wall -->
```

- [ ] **Step 3: Wrap the section heading in a max-width container too**

The `<h2>` and `<p>` at the top of the section also need the max-width treatment. Wrap them:
```html
<section class="py-16 px-5 md:px-10 lg:px-24 bg-surface-hi reveal">
  <div class="max-w-[1400px] mx-auto">
    <h2 class="font-display text-5xl mb-2 ...">EMPRESAS</h2>
    <p class="font-grotesk text-[10px] ... md:hidden">Organizaciones participantes →</p>

    [scroll container with md:hidden]
    [desktop logo wall]
  </div><!-- end max-w wrapper -->
</section>
```

- [ ] **Step 4: Verify in browser**

On mobile: horizontal scroll cards appear as before. On desktop (≥768px): clean centered logo wall with hover accents.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat: companies desktop logo wall, mobile scroll cards unchanged"
```

---

### Task 4: "Sobre el evento" — 2-column desktop layout

Currently a single left-aligned text block with stats at the bottom. On desktop, the right side is empty. This task splits it into 2 columns: text left, stats right (bigger, vertical).

**Files:**
- Modify: `index.html` — sobre section (lines ~392–416)

- [ ] **Step 1: Restructure the section into 2 columns on desktop**

Current structure:
```html
<section id="sobre" class="py-16 px-5 md:px-10 lg:px-24 bg-surface clip-up clip-down reveal">
  <div class="max-w-lg md:max-w-2xl">
    <p class="font-grotesk text-[10px] text-amber tracking-[0.3em] uppercase mb-4">El evento</p>
    <h2 class="font-display text-5xl leading-none mb-6 uppercase">IA DE VERDAD,<br/><span class="text-cyan">EN MELILLA.</span></h2>
    <p class="text-white/50 text-sm font-light leading-relaxed">...</p>
    <div class="flex gap-6 mt-8">
      <div>
        <div class="font-display text-4xl text-cyan">2</div>
        <div class="font-grotesk text-[9px] text-muted tracking-widest uppercase mt-1">Días</div>
      </div>
      <div class="w-px bg-border"></div>
      <div>
        <div class="font-display text-4xl text-cyan">MEL</div>
        <div class="font-grotesk text-[9px] text-muted tracking-widest uppercase mt-1">Melilla, ES</div>
      </div>
      <div class="w-px bg-border"></div>
      <div>
        <div class="font-display text-4xl text-amber">2026</div>
        <div class="font-grotesk text-[9px] text-muted tracking-widest uppercase mt-1">Mayo</div>
      </div>
    </div>
  </div>
</section>
```

Replace with:
```html
<section id="sobre" class="py-16 px-5 md:px-10 lg:px-24 bg-surface clip-up clip-down reveal">
  <div class="max-w-[1400px] mx-auto md:flex md:items-center md:gap-16 lg:gap-24 md:justify-between">

    <!-- Left: text -->
    <div class="max-w-lg md:max-w-xl flex-1">
      <p class="font-grotesk text-[10px] text-amber tracking-[0.3em] uppercase mb-4">El evento</p>
      <h2 class="font-display text-5xl leading-none mb-6 uppercase">IA DE VERDAD,<br/><span class="text-cyan">EN MELILLA.</span></h2>
      <p class="text-white/50 text-sm font-light leading-relaxed">
        <strong class="text-white font-medium">AI Melilla 2026</strong> es el gran evento de inteligencia artificial celebrado en el sur de España. Durante dos días, referentes del sector traen las últimas tendencias en modelos de lenguaje, automatización y ética de la IA directamente a nuestra ciudad.
      </p>
      <!-- Stats: mobile only -->
      <div class="flex gap-6 mt-8 md:hidden">
        <div>
          <div class="font-display text-4xl text-cyan">2</div>
          <div class="font-grotesk text-[9px] text-muted tracking-widest uppercase mt-1">Días</div>
        </div>
        <div class="w-px bg-border"></div>
        <div>
          <div class="font-display text-4xl text-cyan">MEL</div>
          <div class="font-grotesk text-[9px] text-muted tracking-widest uppercase mt-1">Melilla, ES</div>
        </div>
        <div class="w-px bg-border"></div>
        <div>
          <div class="font-display text-4xl text-amber">2026</div>
          <div class="font-grotesk text-[9px] text-muted tracking-widest uppercase mt-1">Mayo</div>
        </div>
      </div>
    </div>

    <!-- Right: stats desktop (large vertical) -->
    <div class="hidden md:flex md:flex-col md:gap-8 md:flex-shrink-0 md:min-w-[200px]">
      <div>
        <div class="font-display text-7xl text-cyan leading-none">2</div>
        <div class="font-grotesk text-[9px] text-muted tracking-widest uppercase mt-2">Días</div>
      </div>
      <div class="h-px bg-border"></div>
      <div>
        <div class="font-display text-7xl text-cyan leading-none">MEL</div>
        <div class="font-grotesk text-[9px] text-muted tracking-widest uppercase mt-2">Melilla, ES</div>
      </div>
      <div class="h-px bg-border"></div>
      <div>
        <div class="font-display text-7xl text-amber leading-none">2026</div>
        <div class="font-grotesk text-[9px] text-muted tracking-widest uppercase mt-2">Mayo</div>
      </div>
    </div>

  </div>
</section>
```

- [ ] **Step 2: Verify in browser**

On mobile: single column, stats row at the bottom (unchanged). On desktop: text left, large vertical stats right.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: sobre section 2-column desktop layout"
```

---

### Task 5: Max-width on remaining sections (Partners + Footer)

**Files:**
- Modify: `index.html` — partners section (lines ~418–428) + footer (lines ~467–475)

- [ ] **Step 1: Wrap partners section content**

Current:
```html
<section class="py-14 px-5 md:px-10 bg-bg border-y border-border reveal">
  <p class="font-grotesk text-[9px] text-muted tracking-[0.4em] uppercase mb-8 text-center">Organizan &amp; colaboran</p>
  <div class="flex flex-wrap justify-center gap-8 opacity-50">
    ...
  </div>
</section>
```
Change to:
```html
<section class="py-14 px-5 md:px-10 bg-bg border-y border-border reveal">
  <div class="max-w-[1400px] mx-auto">
    <p class="font-grotesk text-[9px] text-muted tracking-[0.4em] uppercase mb-8 text-center">Organizan &amp; colaboran</p>
    <div class="flex flex-wrap justify-center gap-8 opacity-50">
      ...
    </div>
  </div>
</section>
```

- [ ] **Step 2: Wrap footer content**

Current:
```html
<footer class="py-12 px-5 bg-bg border-t border-border flex flex-col items-center gap-6 pb-24 md:pb-12">
  [content]
</footer>
```
Change to:
```html
<footer class="py-12 px-5 bg-bg border-t border-border pb-24 md:pb-12">
  <div class="max-w-[1400px] mx-auto flex flex-col items-center gap-6">
    [content unchanged]
  </div>
</footer>
```

- [ ] **Step 3: Verify in browser**

On a 2560px screen: all sections should have content centered and capped at ~1400px. Background colors still span full width.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "fix: max-width cap on partners and footer sections"
```

---

## Self-Review Checklist

- [x] **Spec coverage**: Hero 2-col ✓, speakers grid ✓, companies logo wall ✓, sobre 2-col ✓, global max-width ✓
- [x] **Placeholder scan**: No TBDs. All HTML shown explicitly.
- [x] **Type consistency**: IDs `cd-days-d` etc. defined in Task 1 step 3, referenced in Task 1 step 4. No mismatches.
- [x] **Mobile preservation**: Every desktop change uses `md:hidden` / `hidden md:block` pattern. Mobile layouts unchanged.
