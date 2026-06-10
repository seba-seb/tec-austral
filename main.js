// ── Nav scroll effect ──────────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    nav.style.background = 'rgba(255,255,255,0.97)';
  } else {
    nav.style.background = 'rgba(255,255,255,0.94)';
  }
}, { passive: true });

// ── Mobile menu ────────────────────────────────────────────────
const navToggle = document.querySelector('[data-nav-toggle]');
const navMobile = document.querySelector('[data-nav-mobile]');
if (navToggle && navMobile) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMobile.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  // Close on link click
  navMobile.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navMobile.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ── Scroll reveal ──────────────────────────────────────────────
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger siblings
          const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.is-visible)')];
          const idx = siblings.indexOf(entry.target);
          setTimeout(() => {
            entry.target.classList.add('is-visible');
          }, idx * 80);
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);
revealEls.forEach(el => io.observe(el));

// ── Projects swiper: drag + arrows ────────────────────────────
(function () {
  const track = document.querySelector('[data-projects-track]');
  if (!track) return;

  // Drag-to-scroll (mouse)
  let isDown = false, startX, startScrollLeft, moved = false;

  track.addEventListener('mousedown', e => {
    if (e.button !== 0) return;
    isDown = true;
    moved = false;
    startX = e.clientX;
    startScrollLeft = track.scrollLeft;
    track.style.cursor = 'grabbing';
  });

  window.addEventListener('mousemove', e => {
    if (!isDown) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 3) {
      moved = true;
      track.scrollLeft = startScrollLeft - dx;
    }
  });

  window.addEventListener('mouseup', e => {
    if (!isDown) return;
    isDown = false;
    track.style.cursor = '';
    if (moved) {
      // Block the next click on any child link
      const stop = ev => { ev.preventDefault(); ev.stopPropagation(); };
      track.addEventListener('click', stop, { capture: true, once: true });
    }
  });

  // Arrows
  const prevBtn = document.querySelector('[data-projects-prev]');
  const nextBtn = document.querySelector('[data-projects-next]');

  function scrollByCard(dir) {
    const cardW = track.querySelector('.project-card')?.offsetWidth ?? 320;
    track.scrollBy({ left: dir * (cardW + 16), behavior: 'smooth' });
  }

  if (prevBtn) prevBtn.addEventListener('click', () => scrollByCard(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => scrollByCard(1));

  function updateArrows() {
    if (prevBtn) prevBtn.disabled = track.scrollLeft <= 4;
    if (nextBtn) nextBtn.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 4;
  }
  track.addEventListener('scroll', updateArrows, { passive: true });
  updateArrows();
})();

// ── Auto-mark reveal on scroll ─────────────────────────────────
// Add .reveal only to elements that benefit from it
document.querySelectorAll([
  '.case-card',
  '.testimonial',
  '.services__text',
  '.valueprops__item',
  '.svc-card',
  '.team-card',
  '.pf-card',
  '.profile-card',
].join(',')).forEach(el => {
  el.classList.add('reveal');
  io.observe(el);
});
