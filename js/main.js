/* ========== ユーティリティ ========== */
const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

const throttle = (fn, limit) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/* ========== 年号更新 ========== */
(function updateYear() {
  const y = document.getElementById('y');
  if (y) y.textContent = new Date().getFullYear();
})();

(function themeToggle() {
  const root = document.documentElement;
  const btn = document.getElementById('themeToggle');

  const apply = (mode) => {
    if (mode === 'light') {
      root.setAttribute('data-theme', 'light');
    } else {
      root.removeAttribute('data-theme');
    }
    if (btn) {
      const isLight = mode === 'light';
      if (!btn.querySelector('svg')) {
        const sun = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        sun.setAttribute('viewBox', '0 0 24 24');
        sun.setAttribute('aria-hidden', 'true');
        sun.classList.add('icon', 'sun');
        const sunPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        sunPath.setAttribute('fill', 'currentColor');
        sunPath.setAttribute('d', 'M12 7.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Zm0-5a1 1 0 0 1 1 1v1.5a1 1 0 1 1-2 0V3.5a1 1 0 0 1 1-1ZM12 20.5a1 1 0 0 1-1-1V18a1 1 0 1 1 2 0v1.5a1 1 0 0 1-1 1ZM3.5 11a1 1 0 0 1 1-1H6a1 1 0 1 1 0 2H4.5a1 1 0 0 1-1-1Zm15.5-1a1 1 0 1 1 0 2h1.5a1 1 0 1 1 0-2H19ZM5.05 4.64a1 1 0 0 1 1.41 0L7.6 5.78a1 1 0 1 1-1.41 1.41L5.05 6.05a1 1 0 0 1 0-1.41Zm10.8 10.8a1 1 0 0 1 1.41 0l1.13 1.13a1 1 0 1 1-1.41 1.41l-1.13-1.13a1 1 0 0 1 0-1.41Zm1.13-10.8a1 1 0 0 1 1.41 1.41L17.26 7.6a1 1 0 1 1-1.41-1.41l1.13-1.13ZM6.05 16.4a1 1 0 0 1 1.41 1.41l-1.13 1.13a1 1 0 0 1-1.41-1.41L6.05 16.4Z');
        sun.appendChild(sunPath);

        const moon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        moon.setAttribute('viewBox', '0 0 24 24');
        moon.setAttribute('aria-hidden', 'true');
        moon.classList.add('icon', 'moon');
        const moonPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        moonPath.setAttribute('fill', 'currentColor');
        moonPath.setAttribute('d', 'M21 12.75a8.25 8.25 0 0 1-11.5 7.62 8.25 8.25 0 0 0 0-15.24A8.25 8.25 0 0 1 21 12.75Z');
        moon.appendChild(moonPath);

        btn.innerHTML = '';
        btn.appendChild(sun);
        btn.appendChild(moon);
      }
      btn.classList.toggle('is-light', isLight);
      btn.setAttribute('aria-label', isLight ? 'ダークモードに切り替え' : 'ライトモードに切り替え');
      btn.title = isLight ? 'ダークモードに切り替え' : 'ライトモードに切り替え';
    }
  };

  const saved = (typeof localStorage !== 'undefined') ? localStorage.getItem('theme') : null;
  const initial = (saved === 'light' || saved === 'dark') ? saved : 'dark';
  apply(initial);

  if (btn) {
    btn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      const next = current === 'light' ? 'dark' : 'light';
      apply(next);
      try { localStorage.setItem('theme', next); } catch (_) {}
    });
  }
})();

(function mobileMenu() {
  const nav = document.getElementById('navLinks');
  const btn = document.getElementById('menuBtn');
  if (!nav || !btn) return;

  const setOpen = (open) => {
    nav.classList.toggle('show', open);
    nav.classList.toggle('open', open);
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(!!open));
    // メニュー開閉時のアニメーション
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  btn.addEventListener('click', () => {
    const isOpen = nav.classList.contains('show');
    setOpen(!isOpen);
    if (!isOpen) {
      const firstLink = nav.querySelector('a');
      firstLink && firstLink.focus();
    }
  });

  // リンククリック時にメニューを閉じる
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => setOpen(false));
  });

  document.addEventListener('click', (e) => {
    const isOpen = nav.classList.contains('show');
    if (!isOpen) return;
    if (!nav.contains(e.target) && e.target !== btn) setOpen(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });
})();

(function smoothScroll() {
  const nav = document.getElementById('navLinks');
  const menuBtn = document.getElementById('menuBtn');
  const header = document.querySelector('header');
  const headerHeight = header ? header.offsetHeight : 64;

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 10;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      if (nav) {
        nav.classList.remove('show');
        nav.classList.remove('open');
      }
      if (menuBtn) {
        menuBtn.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
      document.body.style.overflow = '';
      
      // フォーカス管理
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });
})();

/* ========== ページトップボタン ========== */
(function scrollTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;

  const toggleVisibility = () => {
    if (window.pageYOffset > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', throttle(toggleVisibility, 100));
  toggleVisibility();

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
})();

/* ========== アクティブナビゲーションハイライト ========== */
(function activeNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  
  if (!sections.length || !navLinks.length) return;

  const highlightNav = () => {
    const scrollPos = window.pageYOffset + 100;
    
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', throttle(highlightNav, 100));
  highlightNav();
})();

(function conditionalServerImage() {
  const picture = document.querySelector('.server-shot picture');
  if (!picture) return;
  const img = picture.querySelector('img');
  if (!img) return;
  
  const pngUrl = 'server image.png';
  
  fetch(pngUrl, { method: 'HEAD' })
    .then(res => {
      if (res.ok) {
        img.src = pngUrl;
        img.style.display = 'block';
      }
    })
    .catch(() => {});
})();

(function scrollReveal() {
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const targets = [
    ...document.querySelectorAll('.card'),
    ...document.querySelectorAll('.embed-card'),
    ...document.querySelectorAll('.cta-wrap'),
    ...document.querySelectorAll('section h2'),
    ...document.querySelectorAll('.rule'),
    ...document.querySelectorAll('.server-shot'),
    ...document.querySelectorAll('.contact-card')
  ];

  if (targets.length === 0) return;

  targets.forEach((el, index) => {
    el.classList.add('reveal');
    const parent = el.parentElement;
    if (parent && parent.classList && parent.classList.contains('grid')) {
      const siblings = Array.from(parent.children).filter(n => targets.includes(n));
      const siblingIndex = siblings.indexOf(el);
      if (siblingIndex >= 0) {
        el.style.transitionDelay = `${Math.min(siblingIndex * 80, 480)}ms`;
        el.classList.add(`stagger-${Math.min(siblingIndex + 1, 6)}`);
      }
    }
  });

  if (prefersReduced || typeof IntersectionObserver === 'undefined') {
    targets.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const getBucketByWidth = (w) => {
    if (w <= 480) return 0;
    if (w <= 768) return 1;
    if (w <= 1024) return 2;
    return 3;
  };

  const getIoOptionsByBucket = (bucket) => {
    switch (bucket) {
      case 0:
        return { root: null, rootMargin: '0px 0px 50% 0px', threshold: 0.05 };
      case 1:
        return { root: null, rootMargin: '0px 0px 40% 0px', threshold: 0.1 };
      case 2:
        return { root: null, rootMargin: '0px 0px 20% 0px', threshold: 0.15 };
      default:
        return { root: null, rootMargin: '0px 0px 0% 0px', threshold: 0.2 };
    }
  };

  let io = null;
  let currentBucket = getBucketByWidth(window.innerWidth || document.documentElement.clientWidth || 0);

  const initObserver = () => {
    if (io) io.disconnect();
    const options = getIoOptionsByBucket(currentBucket);
    io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, options);

    targets.forEach(el => {
      if (!el.classList.contains('is-visible')) io.observe(el);
    });
  };

  initObserver();

  let resizeTimer = 0;
  const onResize = () => {
    const w = window.innerWidth || document.documentElement.clientWidth || 0;
    const nextBucket = getBucketByWidth(w);
    if (nextBucket !== currentBucket) {
      currentBucket = nextBucket;
      initObserver();
    }
  };

  const debounced = () => {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(onResize, 150);
  };

  window.addEventListener('resize', debounced);
  window.addEventListener('orientationchange', debounced);
})();
(function tosConsent() {
  const VERSION = '2025-12-16';
  const KEY = 'hoxica_tos';

  let accepted = false;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const data = JSON.parse(raw);
      accepted = (data && data.version === VERSION && data.accepted === true);
    }
  } catch (_) {}

  if (accepted) return;

  const d = document;
  const body = d.body;

  const backdrop = d.createElement('div');
  backdrop.className = 'modal-backdrop show';

  const modal = d.createElement('div');
  modal.className = 'tos-modal show';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'tos-title');
  modal.setAttribute('aria-describedby', 'tos-desc');

  const dialog = d.createElement('div');
  dialog.className = 'tos-dialog';

  const head = d.createElement('div');
  head.className = 'tos-head';
  head.innerHTML = '<h3 id="tos-title">利用規約への同意</h3>';

  const bodyWrap = d.createElement('div');
  bodyWrap.className = 'tos-body';
  bodyWrap.innerHTML = `
    <p id="tos-desc">Hoxica Nexus Realm のご利用にあたり、<a href="terms.html" target="_blank" rel="noopener noreferrer">利用規約</a>への同意が必要です。以下は概要です。全文はリンクからご確認ください。</p>
    <div class="excerpt">
      <strong>主な内容（概要）</strong><br>
      ・マナー違反やチート等の禁止事項<br>
      ・スタッフの指示への協力、違反時の罰則<br>
      ・アカウント管理は所有者の責任、免責事項 等
    </div>
  `;

  const foot = d.createElement('div');
  foot.className = 'tos-foot';

  const deny = d.createElement('button');
  deny.className = 'btn-ghost';
  deny.type = 'button';
  deny.textContent = '同意しない';

  const agree = d.createElement('button');
  agree.className = 'btn';
  agree.type = 'button';
  agree.textContent = '同意する';

  foot.append(deny, agree);
  dialog.append(head, bodyWrap, foot);
  modal.append(dialog);
  body.append(backdrop, modal);
  body.classList.add('no-scroll');
  const focusables = () => Array.from(dialog.querySelectorAll('a[href], button, [tabindex]:not([tabindex="-1"])')).filter(el => !el.hasAttribute('disabled'));
  const firstFocus = () => {
    const els = focusables();
    (els[0] || agree).focus();
  };
  setTimeout(firstFocus, 0);

  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      const els = focusables();
      if (els.length === 0) return;
      const idx = els.indexOf(document.activeElement);
      if (e.shiftKey) {
        if (idx <= 0) { e.preventDefault(); els[els.length - 1].focus(); }
      } else {
        if (idx === -1 || idx >= els.length - 1) { e.preventDefault(); els[0].focus(); }
      }
    }
    if (e.key === 'Escape') {
      e.preventDefault();
    }
  });
  const close = () => {
    modal.classList.remove('show');
    backdrop.classList.remove('show');
    body.classList.remove('no-scroll');
    modal.remove();
    backdrop.remove();
  };

  agree.addEventListener('click', () => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ version: VERSION, accepted: true, ts: Date.now() }));
    } catch (_) {}
    close();
  });

  deny.addEventListener('click', () => {
    alert('利用規約に同意いただけない場合、サイトをご利用いただけません。規約をご確認のうえ、同意するを押してください。');
    firstFocus();
  });
})();

/* ========== 画像スライダー自動再生 ========== */
(function autoSlider() {
  const slider = document.querySelector('.server-slider');
  if (!slider) return;

  const slides = slider.querySelector('.slides');
  const slideItems = slider.querySelectorAll('.slide');
  const dots = slider.querySelector('.slider-dots');
  const prevBtn = slider.querySelector('.slider-btn.prev');
  const nextBtn = slider.querySelector('.slider-btn.next');
  
  if (!slides || slideItems.length === 0) return;

  let currentIndex = 0;
  let autoPlayInterval;
  const autoPlayDelay = 5000;

  // ドットの生成
  if (dots) {
    dots.innerHTML = '';
    slideItems.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `スライド ${i + 1}`);
      dot.setAttribute('role', 'tab');
      if (i === 0) dot.classList.add('is-active');
      dot.addEventListener('click', () => goToSlide(i));
      dots.appendChild(dot);
    });
  }

  const updateDots = () => {
    if (!dots) return;
    dots.querySelectorAll('button').forEach((dot, i) => {
      dot.classList.toggle('is-active', i === currentIndex);
    });
  };

  const goToSlide = (index) => {
    currentIndex = index;
    if (currentIndex >= slideItems.length) currentIndex = 0;
    if (currentIndex < 0) currentIndex = slideItems.length - 1;
    slides.style.transform = `translateX(-${currentIndex * 100}%)`;
    updateDots();
  };

  const nextSlide = () => goToSlide(currentIndex + 1);
  const prevSlide = () => goToSlide(currentIndex - 1);

  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoPlay(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoPlay(); });

  const startAutoPlay = () => {
    autoPlayInterval = setInterval(nextSlide, autoPlayDelay);
  };

  const resetAutoPlay = () => {
    clearInterval(autoPlayInterval);
    startAutoPlay();
  };

  // タッチ/スワイプ対応
  let touchStartX = 0;
  let touchEndX = 0;

  slider.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  slider.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
      resetAutoPlay();
    }
  }, { passive: true });

  // ホバー時は自動再生を一時停止
  slider.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
  slider.addEventListener('mouseleave', startAutoPlay);

  // 初期化
  startAutoPlay();
})();

/* ========== パフォーマンス計測（開発用） ========== */
(function perfMetrics() {
  if (typeof window.performance === 'undefined') return;
  
  window.addEventListener('load', () => {
    setTimeout(() => {
      const timing = performance.getEntriesByType('navigation')[0];
      if (timing) {
        console.log('🚀 Page Load Metrics:');
        console.log(`  DOM Content Loaded: ${Math.round(timing.domContentLoadedEventEnd)}ms`);
        console.log(`  Load Complete: ${Math.round(timing.loadEventEnd)}ms`);
      }
    }, 0);
  });
})();

/* ========== カウントアップアニメーション ========== */
(function countUp() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const duration = 2000;
    const start = performance.now();
    
    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(target * easeOut);
      el.textContent = current.toLocaleString();
      
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target.toLocaleString();
      }
    };
    
    requestAnimationFrame(update);
  };

  if (typeof IntersectionObserver !== 'undefined') {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
  } else {
    counters.forEach(animateCounter);
  }
})();

/* ========== コピーボタン機能 ========== */
(function copyButton() {
  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const text = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(text);
        const originalText = btn.textContent;
        btn.textContent = 'コピーしました！';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = originalText;
          btn.classList.remove('copied');
        }, 2000);
      } catch (err) {
        console.error('コピーに失敗しました:', err);
      }
    });
  });
})();

/* ========== ローディング完了アニメーション ========== */
(function pageLoaded() {
  document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('loaded');
    
    // ヒーローセクションのアニメーション順序
    const hero = document.querySelector('.hero');
    if (hero) {
      hero.classList.add('animate-in');
    }
  });
})();
