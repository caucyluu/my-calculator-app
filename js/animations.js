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
