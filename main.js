// ── Nav scroll effect ──────────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.style.background = window.scrollY > 20 ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.94)';
}, { passive: true });

// ── Mobile menu (mismo menú, se despliega en móvil) ───────────
const navToggle = document.querySelector('[data-nav-toggle]');
if (navToggle) {
  const setOpen = open => {
    nav.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
  };
  navToggle.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
  nav.querySelectorAll('.nav__links a, .nav__ctas a').forEach(a => a.addEventListener('click', () => setOpen(false)));
}

// ── Scroll reveal ──────────────────────────────────────────────
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.is-visible)')];
    const idx = siblings.indexOf(entry.target);
    setTimeout(() => entry.target.classList.add('is-visible'), idx * 80);
    io.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.process__steps, .svc-card, .team-card, .work').forEach(el => {
  el.classList.add('reveal');
  io.observe(el);
});

// ── Formulario de contacto ─────────────────────────────────────
const form = document.querySelector('[data-contact-form]');
if (form) {
  const status = form.querySelector('[data-form-status]');
  const button = form.querySelector('button[type="submit"]');
  const MAX_BYTES = 4 * 1024 * 1024; // límite de cuerpo de las funciones de Vercel: 4,5 MB

  const say = (msg, isError = false) => {
    status.textContent = msg;
    status.classList.toggle('is-error', isError);
  };

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const files = [...form.archivos.files];
    if (files.reduce((n, f) => n + f.size, 0) > MAX_BYTES) {
      say('Los archivos superan 4 MB en total. Envíalos por WhatsApp o a comercial@tecaustral.com.', true);
      return;
    }
    button.disabled = true;
    say('Enviando…');
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'No se pudo enviar.');
      form.reset();
      say('Mensaje enviado. Te respondemos en breve.');
    } catch (err) {
      say(`${err.message} Escríbenos por WhatsApp o a comercial@tecaustral.com.`, true);
    } finally {
      button.disabled = false;
    }
  });
}
