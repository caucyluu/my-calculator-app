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
