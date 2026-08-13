/* ══════════════════════════════════════════
   CASA COPAL — Main JS v2
   WD Studio Agency
   ══════════════════════════════════════════ */

// Custom cursor
const cursor = document.getElementById('cursor');
if (window.matchMedia('(pointer: fine)').matches) {
  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX - 4 + 'px';
    cursor.style.top = e.clientY - 4 + 'px';
  });
  const addCursorHover = () => {
    document.querySelectorAll('a, button, .suite-card').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });
  };
  addCursorHover();
}

// Nav scroll
const nav = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 80);
});

// Mobile menu
const hamburger = document.querySelector('.nav-hamburger');
const mobileMenu = document.getElementById('mobile-menu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    const spans = hamburger.querySelectorAll('span');
    if (mobileMenu.classList.contains('active')) {
      spans[0].style.transform = 'rotate(45deg) translate(4px, 4px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(4px, -4px)';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  });
}

function closeMobileMenu() {
  if (mobileMenu) mobileMenu.classList.remove('active');
  const spans = hamburger ? hamburger.querySelectorAll('span') : [];
  spans.forEach(s => { s.style.transform = 'none'; s.style.opacity = '1'; });
}

// Page navigation
function showPage(id) {
  closeMobileMenu();
  document.querySelectorAll('.page-section').forEach(p => {
    p.classList.remove('active');
    // Reset reveals for re-entry
    p.querySelectorAll('.reveal.visible').forEach(r => r.classList.remove('visible'));
  });
  const page = document.getElementById('page-' + id);
  if (page) {
    page.classList.add('active');
    window.scrollTo(0, 0);
    setTimeout(initReveals, 100);
  }
}

// Reveal animations
function initReveals() {
  const reveals = document.querySelectorAll('.page-section.active .reveal:not(.visible)');
  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(el => {
    const rect = el.getBoundingClientRect();
    const yaVisible = rect.top < window.innerHeight && rect.bottom > 0;
    if (yaVisible) {
      el.classList.add('visible');
    } else {
      observer.observe(el);
    }
  });
}

// Form handling with Formspree
const form = document.getElementById('inquire-form');
const formSuccess = document.getElementById('form-success');
const formContainer = document.getElementById('form-container');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('.btn-primary');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = 'SENDING...';
    submitBtn.style.opacity = '0.6';
    
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
      
      if (response.ok) {
        formContainer.style.display = 'none';
        formSuccess.classList.add('active');
      } else {
        submitBtn.innerHTML = 'ERROR — TRY AGAIN';
        submitBtn.style.opacity = '1';
        setTimeout(() => { submitBtn.innerHTML = originalText; }, 3000);
      }
    } catch (error) {
      submitBtn.innerHTML = 'ERROR — TRY AGAIN';
      submitBtn.style.opacity = '1';
      setTimeout(() => { submitBtn.innerHTML = originalText; }, 3000);
    }
  });
}

/* ══════════ CAROUSELS ══════════ */
(function () {
  const EASE = 'cubic-bezier(0.25,0.46,0.45,0.94)';

  /* ---- HERO ---- */
  const hero = document.getElementById('heroCarousel');
  if (hero) {
    const slides = [...hero.querySelectorAll('.hero-slide')];
    let i = Math.max(0, slides.findIndex(s => s.classList.contains('active')));
    let t = null;
    const show = n => {
      i = (n + slides.length) % slides.length;
      slides.forEach((s, k) => s.classList.toggle('active', k === i));
    };
    const play = () => { clearInterval(t); t = setInterval(() => show(i + 1), 6000); };
    const step = d => { show(i + d); play(); };

    document.getElementById('heroNext')?.addEventListener('click', () => step(1));
    document.getElementById('heroPrev')?.addEventListener('click', () => step(-1));
    const sec = hero.closest('.hero');
    sec?.addEventListener('mouseenter', () => clearInterval(t));
    sec?.addEventListener('mouseleave', play);
    show(i); play();
  }

  /* ---- GALLERY STRIP ---- */
  const inner = document.querySelector('.gallery-strip-inner');
  if (inner) {
    const items = [...inner.children];
    const N = Math.floor(items.length / 2); // originales (mitad = duplicados)
    let idx = 0, t = null, busy = false;

    const go = (n, animate = true) => {
      idx = n;
      inner.style.transition = animate ? `transform .9s ${EASE}` : 'none';
      inner.style.transform = `translateX(-${items[idx].offsetLeft}px)`;
    };
    const next = () => { if (!busy) { busy = true; go(idx + 1); } };
    const prev = () => {
      if (busy) return;
      busy = true;
      if (idx === 0) { go(N, false); requestAnimationFrame(() => requestAnimationFrame(() => go(N - 1))); }
      else go(idx - 1);
    };

    inner.addEventListener('transitionend', e => {
      if (e.propertyName !== 'transform') return;
      busy = false;
      if (idx >= N) go(idx - N, false); // salto invisible → loop infinito
    });

    const play = () => { clearInterval(t); t = setInterval(next, 3500); };
    const stop = () => clearInterval(t);

    document.getElementById('stripNext')?.addEventListener('click', () => { next(); play(); });
    document.getElementById('stripPrev')?.addEventListener('click', () => { prev(); play(); });
    const strip = inner.closest('.gallery-strip');
    strip?.addEventListener('mouseenter', stop);
    strip?.addEventListener('mouseleave', play);
    window.addEventListener('resize', () => go(idx, false));

    go(0, false); play();
  }
})();

// Initialize
initReveals();

/* ══════════ LIGHTBOX ══════════ */
(function () {
  const box = document.getElementById('lightbox');
  if (!box) return;
  const img = document.getElementById('lbImg');
  const cap = document.getElementById('lbCap');
  const SEL = '.gallery-page-item img, .gallery-strip-item img, .sd-img img';
  let group = [], i = 0;

  const render = () => {
    box.classList.remove('ready');
    const el = group[i];
    const pre = new Image();
    pre.onload = () => { img.src = pre.src; img.alt = el.alt || ''; box.classList.add('ready'); };
    pre.src = el.currentSrc || el.src;
    cap.textContent = el.alt ? `${el.alt} — ${i + 1} / ${group.length}` : `${i + 1} / ${group.length}`;
  };
  const open = el => {
    const page = el.closest('.page-section') || document;
    // agrupa solo las fotos de la misma zona; en el strip ignora las duplicadas
    let all = [...page.querySelectorAll(SEL)];
    if (el.closest('.gallery-strip-item')) {
      const seen = new Set();
      all = all.filter(n => n.closest('.gallery-strip-item') && !seen.has(n.src) && seen.add(n.src));
    } else {
      all = all.filter(n => !n.closest('.gallery-strip-item'));
    }
    group = all;
    i = Math.max(0, group.indexOf(el));
    render();
    box.classList.add('open');
    box.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    box.classList.remove('open', 'ready');
    box.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };
  const step = d => { i = (i + d + group.length) % group.length; render(); };

  document.addEventListener('click', e => {
    const el = e.target.closest(SEL);
    if (el) { e.preventDefault(); open(el); }
  });
  document.getElementById('lbClose').addEventListener('click', close);
  document.getElementById('lbNext').addEventListener('click', e => { e.stopPropagation(); step(1); });
  document.getElementById('lbPrev').addEventListener('click', e => { e.stopPropagation(); step(-1); });
  box.addEventListener('click', e => { if (e.target === box || e.target.closest('.lb-figure')) close(); });
  document.addEventListener('keydown', e => {
    if (!box.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft') step(-1);
  });
  // swipe mobile
  let x0 = null;
  box.addEventListener('touchstart', e => x0 = e.touches[0].clientX, { passive: true });
  box.addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
    x0 = null;
  });
})();
