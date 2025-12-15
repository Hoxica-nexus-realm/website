// Global UI behaviors for Hoxica site
// Runs with "defer" so DOM is parsed when this script executes

// Year in footer
(function updateYear() {
  const y = document.getElementById('y');
  if (y) y.textContent = new Date().getFullYear();
})();

// Mobile menu toggle (index page)
(function mobileMenu() {
  const nav = document.getElementById('navLinks');
  const btn = document.getElementById('menuBtn');
  if (!nav || !btn) return;
  btn.addEventListener('click', () => nav.classList.toggle('show'));
})();

// Smooth scroll for in-page anchors (index page)
(function smoothScroll() {
  const nav = document.getElementById('navLinks');
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      nav?.classList.remove('show');
    });
  });
})();

// Conditionally load server overview image (index page) to avoid 404 logs
(function conditionalServerImage() {
  const img = document.querySelector('.server-shot img');
  if (!img) return;
  const url = 'server image.png'; // Place real PNG at: homepage/server image.png
  fetch(url, { method: 'HEAD' })
    .then(res => {
      if (res.ok) {
        img.src = url;
        img.style.display = 'block';
      }
    })
    .catch(() => {});
})();

// On-scroll reveal animations (IntersectionObserver)
(function scrollReveal() {
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Elements to reveal on scroll (HTMLは触らずJSで付与)
  const targets = [
    ...document.querySelectorAll('.card'),
    ...document.querySelectorAll('.embed-card'),
    ...document.querySelectorAll('.cta-wrap'),
    ...document.querySelectorAll('section h2'),
    ...document.querySelectorAll('.rule'),
    ...document.querySelectorAll('.server-shot')
  ];

  if (targets.length === 0) return;

  // まず .reveal を付与し、グリッド内要素は軽くスタッガー
  targets.forEach(el => {
    el.classList.add('reveal');
    const parent = el.parentElement;
    if (parent && parent.classList && parent.classList.contains('grid')) {
      const siblings = Array.from(parent.children).filter(n => targets.includes(n));
      const index = siblings.indexOf(el);
      if (index >= 0) el.style.transitionDelay = `${Math.min(index * 60, 360)}ms`;
    }
  });

  // reduce-motion では即時表示
  if (prefersReduced || typeof IntersectionObserver === 'undefined') {
    targets.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.15 });

  targets.forEach(el => io.observe(el));
})();
