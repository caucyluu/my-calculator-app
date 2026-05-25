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
  }
}

// Shared helper — update nav tag active state
function updateActiveTag() {
  const params = new URLSearchParams(window.location.search);
  const category = params.get('category') || 'all';

  document.querySelectorAll('.nav-tag').forEach((tag) => {
    const tagCategory = tag.dataset.category;
    tag.classList.toggle('active', tagCategory === category);
  });
}

export { Router };
