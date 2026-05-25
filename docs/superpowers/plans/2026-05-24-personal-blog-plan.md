# Personal Blog with Fluid Animations — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page personal blog with fluid scroll-driven, micro-interaction, and page-transition animations using vanilla HTML/CSS/JS.

**Architecture:** Single index.html shell with SPA routing via History API. Views are dynamically rendered into `<main id="view">`. Articles stored as Markdown files, fetched and rendered client-side via marked.js. Three-layer animation system: IntersectionObserver for scroll reveals, CSS transitions for micro-interactions, and FLIP-based page transitions with fallback.

**Tech Stack:** Vanilla HTML/CSS/JS, marked.js (CDN), no framework, no build step.

---

### Task 1: Project Scaffolding

**Files:**
- Create: `index.html`
- Create: `css/style.css`
- Create: `js/router.js`
- Create: `js/animations.js`
- Create: `js/markdown.js`
- Create: `js/app.js`
- Create: `content/posts/index.json`
- Create: `content/posts/hello-world.md`
- Create: `assets/images/.gitkeep`

- [ ] **Step 1: Create directory structure**

```bash
mkdir -p css js content/posts assets/images
```

- [ ] **Step 2: Create index.html shell**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Blog</title>
  <link rel="stylesheet" href="css/style.css">
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
</head>
<body>
  <div id="progress-bar"></div>
  <nav id="navbar">
    <div class="nav-inner">
      <a href="/" class="nav-title" data-link>My Blog</a>
      <div class="nav-tags">
        <a href="/" class="nav-tag active" data-category="all" data-link>All</a>
        <a href="/?category=tech" class="nav-tag" data-category="tech" data-link>Tech</a>
        <a href="/?category=life" class="nav-tag" data-category="life" data-link>Life</a>
        <a href="/?category=creative" class="nav-tag" data-category="creative" data-link>Creative</a>
      </div>
    </div>
  </nav>
  <main id="view"></main>
  <footer id="footer">
    <p>&copy; 2026 My Blog. Built with love.</p>
  </footer>
  <script type="module" src="js/app.js"></script>
</body>
</html>
```

- [ ] **Step 3: Create empty JS module stubs with placeholder exports**

```bash
echo "// Router — SPA routing via History API" > js/router.js
echo "// Animations — scroll-driven, micro-interactions, page transitions" > js/animations.js
echo "// Markdown — fetch and render .md files" > js/markdown.js
echo "// App — main entry point" > js/app.js
echo "/* style.css — global styles */" > css/style.css
```

- [ ] **Step 4: Create .gitkeep in assets**

```bash
touch assets/images/.gitkeep
```

- [ ] **Step 5: Verify file structure**

```bash
find . -type f | sort
```
Expected output:
```
./assets/images/.gitkeep
./content/posts/index.json
./content/posts/hello-world.md
./css/style.css
./index.html
./js/animation.js
./js/app.js
./js/markdown.js
./js/router.js
```

---

### Task 2: CSS Design Tokens and Reset

**Files:**
- Modify: `css/style.css` (write full content)

- [ ] **Step 1: Write CSS reset, tokens, and base layout**

```css
/* ===== Reset ===== */
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC",
    "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial,
    sans-serif;
  font-size: 17px;
  line-height: 1.7;
  color: #2c2c2c;
  background-color: #faf8f5;
  overflow-x: hidden;
}

a {
  color: inherit;
  text-decoration: none;
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}

code {
  font-family: "JetBrains Mono", "Fira Code", "Cascadia Code", "SF Mono",
    "Fira Mono", "Droid Sans Mono", monospace;
}

/* ===== Design Tokens ===== */
:root {
  --color-bg: #faf8f5;
  --color-surface: #ffffff;
  --color-text: #2c2c2c;
  --color-text-secondary: #6b6b6b;
  --color-accent: #e88d7d;
  --color-border: rgba(0, 0, 0, 0.06);
  --color-shadow: rgba(0, 0, 0, 0.08);
  --color-shadow-hover: rgba(0, 0, 0, 0.14);
  --color-code-bg: #1e1e1e;
  --color-code-text: #e0e0e0;
  --color-progress: linear-gradient(90deg, #e88d7d, #f0a590);

  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;

  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;
  --space-4xl: 96px;

  --max-width: 720px;
  --max-width-wide: 960px;
  --navbar-height: 56px;

  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-out-back: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;
  --duration-page: 400ms;
}

/* ===== Base Layout ===== */
body {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

#view {
  flex: 1;
  margin-top: var(--navbar-height);
}

#footer {
  text-align: center;
  padding: var(--space-2xl) var(--space-lg);
  color: var(--color-text-secondary);
  font-size: 14px;
}
```

- [ ] **Step 2: Open index.html in browser, verify base styles load**

Open `index.html` in browser (or use `python -m http.server 8080`). The page should show a warm off-white background, the navbar area at top, and centered footer at bottom.

---

### Task 3: Navbar Styles and Progress Bar

**Files:**
- Modify: `css/style.css` (append to file)

- [ ] **Step 1: Append navbar and progress bar styles to style.css**

```css
/* ===== Navbar ===== */
#navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: var(--navbar-height);
  background: rgba(250, 248, 245, 0.72);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid transparent;
  transition: border-color var(--duration-normal), background var(--duration-normal);
}

#navbar.scrolled {
  border-bottom-color: var(--color-border);
  background: rgba(250, 248, 245, 0.92);
}

.nav-inner {
  max-width: var(--max-width-wide);
  margin: 0 auto;
  padding: 0 var(--space-lg);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-title {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.02em;
  transition: opacity var(--duration-fast);
}

.nav-title:hover {
  opacity: 0.7;
}

.nav-tags {
  display: flex;
  gap: var(--space-xs);
}

.nav-tag {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-secondary);
  transition: color var(--duration-fast), background var(--duration-fast);
  position: relative;
}

.nav-tag:hover {
  color: var(--color-text);
  background: rgba(0, 0, 0, 0.04);
}

.nav-tag.active {
  color: var(--color-text);
  background: rgba(0, 0, 0, 0.06);
}

/* ===== Progress Bar ===== */
#progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 0%;
  height: 2px;
  z-index: 101;
  background: var(--color-progress);
  transition: width 50ms linear;
}
```

---

### Task 4: Router Module

**Files:**
- Modify: `js/router.js` (write full content)

- [ ] **Step 1: Write router module**

```js
// Router — SPA routing via History API

class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    this.currentCleanup = null;

    window.addEventListener('popstate', () => this._handle());
    document.addEventListener('click', (e) => this._onClick(e));
  }

  on(pattern, handler) {
    this.routes[pattern] = handler;
  }

  navigate(url, replace = false) {
    if (replace) {
      history.replaceState(null, '', url);
    } else {
      history.pushState(null, '', url);
    }
    this._handle();
  }

  _handle() {
    const path = window.location.pathname + window.location.search;

    if (this.currentCleanup) {
      this.currentCleanup();
      this.currentCleanup = null;
    }

    let matched = false;

    for (const [pattern, handler] of Object.entries(this.routes)) {
      const match = this._match(pattern, path);
      if (match) {
        this.currentRoute = pattern;
        const cleanup = handler(match);
        if (typeof cleanup === 'function') {
          this.currentCleanup = cleanup;
        }
        matched = true;
        break;
      }
    }

    if (!matched) {
      this.routes['*']?.({});
    }

    updateActiveTag();
  }

  _match(pattern, path) {
    if (pattern === '*') return {};

    const paramNames = [];
    const regexStr = pattern.replace(/:([^/]+)/g, (_, name) => {
      paramNames.push(name);
      return '([^/]+)';
    });

    // Strip query string from path for matching if pattern doesn't have one
    const pathBase = path.split('?')[0];
    const regex = new RegExp(`^${regexStr}$`);
    const result = regex.exec(pathBase);

    if (!result) return null;

    const params = {};
    paramNames.forEach((name, i) => {
      params[name] = decodeURIComponent(result[i + 1]);
    });

    // Parse query string
    const queryString = path.includes('?') ? path.split('?')[1] : '';
    if (queryString) {
      queryString.split('&').forEach((pair) => {
        const [key, val] = pair.split('=');
        params[key] = decodeURIComponent(val || '');
      });
    }

    return params;
  }

  _onClick(e) {
    const link = e.target.closest('a[data-link]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

    // Ignore external links, hash links, or ctrl/cmd clicks
    if (
      href.startsWith('http') ||
      href.startsWith('#') ||
      e.ctrlKey ||
      e.metaKey
    ) {
      return;
    }

    e.preventDefault();
    this.navigate(href);

    // Update active tag
    updateActiveTag();
  }
}

export { Router };
```

- [ ] **Step 2: Add active tag update helper to router.js**

Append to router.js:

```js
// Shared helper — update nav tag active state
function updateActiveTag() {
  const params = new URLSearchParams(window.location.search);
  const category = params.get('category') || 'all';

  document.querySelectorAll('.nav-tag').forEach((tag) => {
    const tagCategory = tag.dataset.category;
    tag.classList.toggle('active', tagCategory === category);
  });
}
```

---

### Task 5: Markdown Module

**Files:**
- Modify: `js/markdown.js` (write full content)

- [ ] **Step 1: Write markdown loader and renderer**

```js
// Markdown — fetch and render .md files

class MarkdownLoader {
  constructor() {
    this.cache = new Map();
  }

  async loadMeta() {
    const res = await fetch('/content/posts/index.json');
    if (!res.ok) throw new Error('Failed to load index.json');
    const posts = await res.json();
    return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  async loadPost(slug) {
    if (this.cache.has(slug)) {
      return this.cache.get(slug);
    }
    const res = await fetch(`/content/posts/${slug}.md`);
    if (!res.ok) throw new Error(`Post not found: ${slug}`);
    const raw = await res.text();
    const html = marked.parse(raw);

    // Extract title from first h1
    const titleMatch = raw.match(/^#\s+(.+)/m);
    const title = titleMatch ? titleMatch[1] : slug;

    const result = { slug, title, html };
    this.cache.set(slug, result);
    return result;
  }

  formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}

export { MarkdownLoader };
```

---

### Task 6: View Render Functions

**Files:**
- Create: `js/views.js`

- [ ] **Step 1: Write home view and article view render functions**

```js
// Views — render functions for home and article pages
import { MarkdownLoader } from './markdown.js';

const loader = new MarkdownLoader();

export async function renderHome(params = {}) {
  const category = params.category || 'all';
  const posts = await loader.loadMeta();
  const filtered = category === 'all'
    ? posts
    : posts.filter((p) => p.category === category);

  const cardsHTML = filtered
    .map(
      (post, i) => `
    <article class="card card-animate" data-slug="${post.slug}" data-index="${i}" style="--stagger: ${i}">
      <a href="/article/${post.slug}" data-link class="card-link">
        <div class="card-gloss"></div>
        <span class="card-category">${post.category}</span>
        <h2 class="card-title">${post.title}</h2>
        <p class="card-excerpt">${post.excerpt}</p>
        <div class="card-meta">
          <time>${loader.formatDate(post.date)}</time>
          <span>${post.readingTime} min read</span>
        </div>
      </a>
    </article>
  `
    )
    .join('');

  const emptyHTML = filtered.length === 0
    ? `<p class="empty-message">No posts in this category yet.</p>`
    : '';

  return `
    <div class="home-view">
      <section class="hero">
        <div class="hero-glow" id="hero-glow"></div>
        <h1 class="hero-title">My Blog</h1>
        <p class="hero-subtitle">Thoughts on tech, life, and creativity.</p>
      </section>
      <section class="posts-container" id="posts-container">
        ${cardsHTML}
        ${emptyHTML}
      </section>
    </div>
  `;
}

export async function renderArticle(slug) {
  try {
    const post = await loader.loadPost(slug);
    return `
      <div class="article-view">
        <header class="article-header">
          <a href="/" data-link class="back-button">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12 4L6 10L12 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Back
          </a>
          <h1 class="article-title">${post.title}</h1>
        </header>
        <div class="article-content animate-paragraphs">
          ${post.html}
        </div>
        <footer class="article-footer">
          <a href="/" data-link class="back-home">← Back to all posts</a>
        </footer>
      </div>
    `;
  } catch {
    return `
      <div class="article-view">
        <header class="article-header">
          <a href="/" data-link class="back-button">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12 4L6 10L12 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Back
          </a>
        </header>
        <div class="article-content">
          <h1>Post Not Found</h1>
          <p>Sorry, this article doesn't exist.</p>
        </div>
      </div>
    `;
  }
}
```

---

### Task 7: Home View and Article View Styles

**Files:**
- Modify: `css/style.css` (append to file)

- [ ] **Step 1: Append home view and card styles**

```css
/* ===== Hero ===== */
.hero {
  position: relative;
  padding: var(--space-4xl) var(--space-lg) var(--space-3xl);
  text-align: center;
  overflow: hidden;
}

.hero-title {
  font-size: clamp(36px, 6vw, 56px);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.1;
  margin-bottom: var(--space-md);
}

.hero-subtitle {
  font-size: 18px;
  color: var(--color-text-secondary);
  font-weight: 400;
}

.hero-glow {
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(232, 141, 125, 0.15), transparent 70%);
  pointer-events: none;
  transform: translate(-50%, -50%);
  transition: opacity 0.4s;
  opacity: 0;
}

.hero:hover .hero-glow {
  opacity: 1;
}

/* ===== Posts Container ===== */
.posts-container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--space-lg) var(--space-3xl);
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.empty-message {
  text-align: center;
  color: var(--color-text-secondary);
  padding: var(--space-3xl) 0;
}

/* ===== Card ===== */
.card {
  position: relative;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  padding: var(--space-xl);
  cursor: pointer;
  transition: transform var(--duration-normal) var(--ease-out-expo),
              box-shadow var(--duration-normal) var(--ease-out-expo);
  overflow: hidden;
  transform: translateY(30px);
  opacity: 0;
}

.card.visible {
  transform: translateY(0);
  opacity: 1;
  transition: transform var(--duration-slow) var(--ease-out-expo),
              opacity var(--duration-slow) var(--ease-out-expo),
              box-shadow var(--duration-normal) var(--ease-out-expo);
  transition-delay: calc(var(--stagger, 0) * 60ms);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px var(--color-shadow-hover);
}

.card:active {
  transform: scale(0.98);
  transition: transform 100ms var(--ease-in-out);
}

.card-link {
  display: block;
  position: relative;
  z-index: 1;
}

.card-gloss {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.4) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  opacity: 0;
  transition: opacity var(--duration-normal);
  pointer-events: none;
  z-index: 0;
  transform: translateX(-100%);
}

.card:hover .card-gloss {
  opacity: 1;
  transform: translateX(100%);
  transition: transform 0.6s ease, opacity var(--duration-normal);
}

.card-category {
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-accent);
  margin-bottom: var(--space-sm);
}

.card-title {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.3;
  margin-bottom: var(--space-sm);
}

.card-excerpt {
  font-size: 15px;
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: var(--space-md);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  display: flex;
  gap: var(--space-md);
  font-size: 13px;
  color: var(--color-text-secondary);
}
```

- [ ] **Step 2: Append article view styles**

```css
/* ===== Article View ===== */
.article-view {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: var(--space-2xl) var(--space-lg) var(--space-3xl);
}

.article-header {
  margin-bottom: var(--space-2xl);
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  color: var(--color-text-secondary);
  margin-bottom: var(--space-lg);
  transition: color var(--duration-fast), transform var(--duration-fast);
}

.back-button:hover {
  color: var(--color-text);
  transform: translateX(-2px);
}

.article-title {
  font-size: clamp(28px, 5vw, 40px);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.2;
}

/* ===== Article Content (Markdown Rendered) ===== */
.article-content {
  font-size: 17px;
  line-height: 1.8;
}

.article-content h1,
.article-content h2,
.article-content h3 {
  margin-top: var(--space-2xl);
  margin-bottom: var(--space-md);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.3;
}

.article-content h1 { font-size: 28px; }
.article-content h2 { font-size: 22px; }
.article-content h3 { font-size: 18px; }

.article-content p {
  margin-bottom: var(--space-md);
}

.article-content p:last-child {
  margin-bottom: 0;
}

.article-content blockquote {
  border-left: 3px solid var(--color-accent);
  margin: var(--space-lg) 0;
  padding: var(--space-sm) var(--space-lg);
  color: var(--color-text-secondary);
  font-style: italic;
}

.article-content pre {
  background: var(--color-code-bg);
  color: var(--color-code-text);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
  margin: var(--space-lg) 0;
  overflow-x: auto;
  font-size: 14px;
  line-height: 1.6;
}

.article-content code {
  font-size: 0.9em;
}

.article-content p code,
.article-content li code {
  background: rgba(0, 0, 0, 0.06);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.88em;
}

.article-content pre code {
  background: none;
  padding: 0;
  border-radius: 0;
  font-size: inherit;
}

.article-content ul,
.article-content ol {
  margin: var(--space-md) 0;
  padding-left: var(--space-xl);
}

.article-content li {
  margin-bottom: var(--space-xs);
}

.article-content img {
  border-radius: var(--radius-md);
  margin: var(--space-lg) 0;
}

.article-content hr {
  border: none;
  border-top: 1px solid var(--color-border);
  margin: var(--space-2xl) 0;
}

/* Paragraph animation */
.animate-paragraphs > p,
.animate-paragraphs > h1,
.animate-paragraphs > h2,
.animate-paragraphs > h3,
.animate-paragraphs > blockquote,
.animate-paragraphs > pre,
.animate-paragraphs > ul,
.animate-paragraphs > ol,
.animate-paragraphs > img {
  opacity: 0;
  transform: translateY(20px);
}

.animate-paragraphs > .revealed {
  opacity: 1;
  transform: translateY(0);
  transition: opacity var(--duration-slow) var(--ease-out-expo),
              transform var(--duration-slow) var(--ease-out-expo);
}

.article-footer {
  margin-top: var(--space-3xl);
  padding-top: var(--space-xl);
  border-top: 1px solid var(--color-border);
}

.back-home {
  font-size: 15px;
  color: var(--color-text-secondary);
  transition: color var(--duration-fast);
}

.back-home:hover {
  color: var(--color-text);
}
```

---

### Task 8: Animation Engine

**Files:**
- Modify: `js/animations.js` (write full content)

- [ ] **Step 1: Write scroll reveal observer**

```js
// Animations — scroll-driven, micro-interactions, page transitions

// ===== Scroll Reveal =====
let scrollObserver = null;

function initScrollReveal() {
  if (scrollObserver) {
    scrollObserver.disconnect();
  }

  scrollObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          scrollObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -30px 0px' }
  );

  document.querySelectorAll('.card-animate').forEach((card) => {
    scrollObserver.observe(card);
  });
}

// ===== Paragraph Reveal =====
let paragraphObserver = null;

function initParagraphReveal() {
  if (paragraphObserver) {
    paragraphObserver.disconnect();
  }

  paragraphObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          paragraphObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -20px 0px' }
  );

  document
    .querySelectorAll('.animate-paragraphs > *')
    .forEach((el) => {
      paragraphObserver.observe(el);
    });
}

// ===== Hero Glow =====
function initHeroGlow() {
  const hero = document.querySelector('.hero');
  const glow = document.getElementById('hero-glow');
  if (!hero || !glow) return;

  const onMove = (e) => {
    const rect = hero.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    glow.style.left = `${x}px`;
    glow.style.top = `${y}px`;
  };

  hero.addEventListener('mousemove', onMove);
  hero.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
  });
  hero.addEventListener('mouseenter', () => {
    glow.style.opacity = '1';
  });
}

// ===== Progress Bar =====
let progressRAF = null;

function initProgressBar() {
  const bar = document.getElementById('progress-bar');

  const update = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${Math.min(progress, 100)}%`;
    progressRAF = requestAnimationFrame(update);
  };

  if (progressRAF) cancelAnimationFrame(progressRAF);
  progressRAF = requestAnimationFrame(update);
}

// ===== Navbar Scroll Effect =====
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 10);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // initial check
}

// ===== Page Transition =====
const view = document.getElementById('view');

export async function pageTransition(renderFn) {
  // Exit: fade out current content
  view.style.opacity = '0';
  view.style.transform = 'translateY(8px)';
  view.style.transition = 'opacity 200ms ease-out, transform 200ms ease-out';

  await sleep(200);

  // Scroll to top before rendering new content
  window.scrollTo(0, 0);

  // Render new content
  view.innerHTML = await renderFn();

  // Reset position for entrance
  view.style.transition = 'none';
  view.style.opacity = '0';
  view.style.transform = 'translateY(12px)';

  // Force reflow
  view.offsetHeight;

  // Enter: fade in
  view.style.transition =
    'opacity 350ms cubic-bezier(0.16, 1, 0.3, 1), transform 350ms cubic-bezier(0.16, 1, 0.3, 1)';
  view.style.opacity = '1';
  view.style.transform = 'translateY(0)';

  await sleep(350);
  view.style.transition = '';
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ===== Init All Animation Systems =====
export function initAnimations() {
  initScrollReveal();
  initParagraphReveal();
  initHeroGlow();
  initProgressBar();
  initNavbarScroll();
}
```

---

### Task 9: App Entry Point

**Files:**
- Modify: `js/app.js` (write full content)

- [ ] **Step 1: Write app.js — wire router, views, and animations**

```js
// App — main entry point
import { Router } from './router.js';
import { renderHome, renderArticle } from './views.js';
import { initAnimations, pageTransition } from './animations.js';

const router = new Router();

// Home route
router.on('/', async (params) => {
  await pageTransition(() => renderHome(params));
  initAnimations();
});

// Article route
router.on('/article/:slug', async (params) => {
  await pageTransition(() => renderArticle(params.slug));
  initAnimations();
});

// 404 fallback
router.on('*', () => {
  document.getElementById('view').innerHTML = `
    <div class="article-view" style="text-align:center;padding-top:120px;">
      <h1>404</h1>
      <p>Page not found.</p>
      <a href="/" data-link style="color:var(--color-accent);">Go home</a>
    </div>
  `;
});

// Boot
router.navigate(window.location.pathname + window.location.search, true);
```

---

### Task 10: Sample Content

**Files:**
- Modify: `content/posts/index.json`
- Modify: `content/posts/hello-world.md`
- Create: `content/posts/smooth-animations.md`
- Create: `content/posts/life-first-post.md`

- [ ] **Step 1: Write index.json with 3 sample posts**

```json
[
  {
    "slug": "hello-world",
    "title": "Hello World — 博客启航",
    "date": "2026-05-24",
    "category": "tech",
    "excerpt": "这是我的第一篇博客文章。聊聊为什么要建这个博客，以及它用了哪些技术——原生 HTML/CSS/JS 打造的丝滑动画体验。",
    "readingTime": 3
  },
  {
    "slug": "smooth-animations",
    "title": "纯 CSS + JS 实现丝滑动画的秘诀",
    "date": "2026-05-20",
    "category": "tech",
    "excerpt": "不用任何动画库，只用原生 API 如何做出顶级流畅的网页动画？分享 IntersectionObserver、FLIP 技术和 CSS easing 的实战心得。",
    "readingTime": 8
  },
  {
    "slug": "life-first-post",
    "title": "周末徒步小记 — 山间的光与影",
    "date": "2026-05-15",
    "category": "life",
    "excerpt": "上周末去郊外走了走。五月的阳光穿过树叶，洒在山路上。随手拍了几张照片，记录一下这段安静时光。",
    "readingTime": 4
  }
]
```

- [ ] **Step 2: Write hello-world.md**

```markdown
# Hello World — 博客启航

欢迎来到我的个人博客！这是第一篇文章，简单聊聊这个项目的缘起。

## 为什么要做这个博客

我一直想要一个属于自己的空间——不是社交媒体上的碎片化状态，也不是第三方平台到处是广告的页面。一个能让我**掌控每一像素**的地方。

## 技术选型

这个博客没有用任何框架。坦白说，用 Next.js 或 Vue 会快很多。但我就是想亲手写每一行 HTML、CSS 和 JS，感受每一个动画的帧与帧之间发生了什么。

核心技术：

- **原生 HTML/CSS/JS** — 零框架依赖
- **History API** — SPA 路由，无刷新页面切换
- **IntersectionObserver** — 滚动驱动的入场动画
- **marked.js** — Markdown 解析（唯一的第三方库）
- **CSS Custom Properties** — 设计 Token 管理

## 下一步

计划慢慢完善内容。如果你也在折腾类似的东西，欢迎交流。

写于 2026 年 5 月。
```

- [ ] **Step 3: Write smooth-animations.md**

```markdown
# 纯 CSS + JS 实现丝滑动画的秘诀

不使用任何动画库，只用原生 API 如何做出顶级流畅的网页动画？分享几个实战心得。

## 1. 选对 easing 函数

动画的「感觉」90% 来自缓动曲线。CSS 默认的 `ease` 其实很不错，但如果想要更精致的效果：

```css
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
--ease-out-back: cubic-bezier(0.34, 1.56, 0.64, 1);
```

Expo 缓出最适合元素入场，因为它快速启动然后优雅减速。Back 缓出带一点回弹，适合按钮反馈。

## 2. IntersectionObserver 替代 scroll 事件

不要在 `scroll` 事件里做任何事。用 IntersectionObserver：

```js
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target); // 只触发一次
    }
  });
}, { threshold: 0.15 });
```

性能差距巨大——Observer 是浏览器原生优化，scroll 事件里做 getBoundingClientRect 会让主线程卡顿。

## 3. FLIP 动画技巧

页面过渡最难的是元素从一页变形到另一页。FLIP（First, Last, Invert, Play）是解决方案：

1. **First**: 记录元素当前的位置和尺寸
2. **Last**: 渲染目标页面的该元素，记录新位置
3. **Invert**: 用 `transform` 把元素从新位置拉回旧位置
4. **Play**: 取消 transform，让浏览器自动插值过渡

更多细节以后展开写。先到这里！
```

- [ ] **Step 4: Write life-first-post.md**

```markdown
# 周末徒步小记 — 山间的光与影

上周末去了趟郊外的山。不算远的山路，两个小时来回，但五月的山林刚好是最舒服的时候。

## 路上的小发现

阳光从树叶缝隙里漏下来，路面上一块一块的光斑。风一吹，光斑就跟着晃。

想起来村上春树在《挪威的森林》里写的那句："春天的原野里，你一个人正走着，对面走来一只可爱的小熊..."

当然我没遇到小熊。倒是遇到一条很友善的柴犬，主人说它叫小豆。

## 一点感受

平时盯着屏幕太久了。走到山里才发现，自然界里没有直射的蓝光，没有 60Hz 的刷新率，也没有 notification badge。

就是很安静，很慢，很舒服。

回来以后决定在这个博客里也记录一些生活片段，不全是代码和技术。这样回头看的时候，不至于全是 bug 和 deadline。

---

*写于 2026 年 5 月一个闷热的下午*
```

---

### Task 11: Integration and Final Verification

- [ ] **Step 1: Start a local server**

```bash
python -m http.server 8080
```

- [ ] **Step 2: Verify home page**
  - Open `http://localhost:8080` in Chrome
  - Hero with title and subtitle visible
  - 3 article cards stagger in on scroll
  - Hover glow sweeps across cards
  - Card lifts on hover
  - Click category tags — list filters (All → 3, Tech → 2, Life → 1)
  - Navbar blurs background, gets border on scroll

- [ ] **Step 3: Verify article page**
  - Click any card — smooth fade transition to article
  - Article renders with title, paragraphs, code blocks
  - Paragraphs reveal sequentially on scroll
  - Progress bar fills as you scroll
  - Back button returns to home with transition

- [ ] **Step 4: Verify browser back/forward**
  - Use browser back button — returns to home with transition
  - Use browser forward — returns to article
  - URL updates correctly for each navigation

- [ ] **Step 5: Verify progress bar**
  - Scroll down on article page
  - Progress bar at top fills from left to right
  - Reaches 100% at bottom of page
