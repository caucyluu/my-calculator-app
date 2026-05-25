# Personal Blog with Fluid Animations — Design Spec

## Overview

A single-page personal blog with cool, smooth, fluid animations. Mixed content (tech articles, personal life, creative works). Apple-inspired warm minimalist design language. Zero framework — vanilla HTML/CSS/JS.

---

## Architecture

```
index.html          — Single entry point, full-site shell
├── /                — Home: Hero + article list with category filter
├── /article/{slug}  — Article detail: Markdown rendered + reading progress bar
└── (extensible)     — About, portfolio, etc.
```

### Routing

- History API (`pushState` + `popstate`) for SPA routing without page reloads
- Intercept all internal navigation clicks, prevent default, push state instead
- `<main id="view">` as the dynamic view container — JS replaces content on route change

### File Structure

```
/
├── index.html           # Single HTML shell
├── css/
│   └── style.css        # Global styles + design tokens
├── js/
│   ├── router.js        # SPA routing system
│   ├── animations.js    # Animation engine
│   ├── markdown.js      # MD loading + rendering (marked.js)
│   └── app.js           # Main entry, wires everything together
├── content/
│   └── posts/
│       ├── index.json   # Article metadata manifest
│       └── *.md         # Individual article Markdown files
└── assets/
    └── images/          # Image assets
```

---

## Animation System (Three Layers)

### Layer 1: Scroll-driven Storytelling

- **Tech**: `IntersectionObserver` on elements as they enter viewport
- **Effects**: articles fade in from below (`opacity 0→1` + `translateY 30px→0`), staggered reveals
- **Article detail**: paragraphs, images, code blocks enter sequentially, building reading rhythm
- **Trigger once** — animations fire on first scroll-in, don't repeat

### Layer 2: Micro-interactions

- **Card hover**: subtle lift (`translateY -4px`), shadow deepening, gloss sweep across surface
- **Buttons/links**: smooth background transition on hover, elastic scale down on click (`scale 0.97` then spring back)
- **Reading progress bar**: thin bar at top of page, grows as user scrolls, with gradient color
- **Hero cursor glow**: soft glow follows mouse on Hero section

### Layer 3: Page Transitions

- **Home→Article (primary)**: clicked card expands into full article view (FLIP technique, iOS-style app open)
- **Article→Home (reverse)**: article view shrinks back into card
- **Fallback**: crossfade + slide if shared-element transition isn't feasible (old view slides left, new view slides in from right)

All animations use pure CSS `transition`/`@keyframes` + `requestAnimationFrame`. No animation library except marked.js for Markdown parsing.

---

## Visual Design

### Design Language

Warm, minimalist Apple-inspired. Clean, airy, content-focused.

### Color Palette

| Role | Value |
|------|-------|
| Main background | `#faf8f5` (warm off-white) |
| Card background | `#ffffff` |
| Primary text | `#2c2c2c` |
| Secondary text | `#6b6b6b` |
| Accent | `#e88d7d` (warm coral) or `#007aff` (apple blue) |
| Code block bg | `#1e1e1e` |

### Typography

- **Headings**: system font stack (San Francisco / Segoe UI / PingFang SC), large size, generous letter-spacing
- **Body**: system serif or sans-serif, 16-18px, line-height 1.7
- **Code**: JetBrains Mono / Fira Code

### Visual Elements

- **Glass navbar**: fixed at top, `backdrop-filter: blur(20px)`, semi-transparent bg, fades from transparent to solid on scroll
- **Cards**: large border-radius (16px), subtle border (`1px solid rgba(0,0,0,0.06)`), elevated shadow on hover
- **Spacing**: 8px base grid — all spacing as multiples (8, 16, 24, 32, 48, 64...)
- **Hero**: large site title + tagline, mouse-following soft glow

### CSS Architecture

- CSS Custom Properties for all design tokens (`--color-bg`, `--color-text`, `--radius-card`, etc.)
- Single file, organized: `reset → tokens → layout → components → animations → utilities`

---

## Components

### 1. Global Shell

- Top navbar: site title + category tags (All / Tech / Life / Creative)
- Reading progress bar: 2px line below navbar, fills on scroll
- `<main id="view">`: dynamic view container
- Footer: copyright + simple links

### 2. Home View

- **Hero**: large title + one-line description + cursor-following glow
- **Category filter bar**: click to filter, underline indicator slides between tabs
- **Article card list**: each card shows — title, date, category tag, excerpt (first ~150 chars), reading time
- **Staggered entrance**: cards appear one by one on scroll

### 3. Article Detail View

- **Header**: back button + article title + meta (date, category, reading time)
- **Content area**: Markdown rendered — headings, paragraphs, code blocks (syntax highlighting), images, blockquotes
- **Paragraph entrance**: IntersectionObserver per paragraph, sequential fade-in
- **Footer**: previous/next article navigation

### 4. Page Transition Layer

- JS-managed overlay for exit/enter animation sequences
- FLIP-based shared element transition (card → article) is the priority
- Fallback to crossfade + slide when FLIP isn't viable

---

## Data Flow

1. Home page loads → fetch `/content/posts/index.json` for article metadata
2. Article list rendered from metadata, sorted by date descending
3. User clicks article → router navigates to `/article/{slug}` → fetch `/content/posts/{slug}.md`
4. Markdown rendered to HTML via marked.js, inserted into article view
5. Category filter: client-side filtering of `index.json` entries by category tag

### index.json Schema

```json
[
  {
    "slug": "hello-world",
    "title": "Hello World",
    "date": "2026-05-20",
    "category": "tech",
    "excerpt": "First 150 characters of the post...",
    "readingTime": 5
  }
]
```

---

## Constraints

- Zero runtime dependencies except marked.js (loaded via CDN)
- All animations are CSS/JS native — no GSAP, no Framer Motion
- Works in modern browsers (Chrome, Firefox, Safari, Edge latest 2 versions)
- No SEO requirement (personal blog, SPA is acceptable)
- Dark mode not in scope for v1

---

## Future Extensibility

- About page, portfolio showcase, contact form (new routes in router)
- Dark/light theme toggle (add CSS custom property overrides)
- Search (client-side filtering of index.json)
- Comment system (third-party integration)
- RSS feed generation
