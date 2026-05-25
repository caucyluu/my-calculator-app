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
