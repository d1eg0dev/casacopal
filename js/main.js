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
  reveals.forEach(el => observer.observe(el));
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

// Initialize
initReveals();
