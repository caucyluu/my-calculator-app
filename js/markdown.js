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
