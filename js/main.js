/* =========================================================
   Portafolio · Matías Sack — JavaScript sin frameworks
   ========================================================= */

/* ---------- CONFIGURACIÓN (EDITAR) ----------
   GitHub Pages es estático, así que el formulario envía a Formspree (gratis):
   1. Creá un form en https://formspree.io y copiá el ID (ej. "xyzabcd").
   2. Pegalo en FORMSPREE_ID.
   Mientras esté vacío, el formulario abre el cliente de correo con el mensaje armado
   hacia CONTACT_EMAIL. */
const CONFIG = {
  FORMSPREE_ID: '',
  CONTACT_EMAIL: 'matisk.90@gmail.com',
  TYPED_PHRASES: [
    'APIs REST con Spring Boot',
    'microservicios con Kafka',
    'asistentes con IA basados en RAG',
    'herramientas en Go y Python',
    'SPAs con Angular',
    'login seguro con OAuth2 y Keycloak',
    'soluciones en AWS',
  ],
};

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ---------- Tema claro / oscuro ---------- */
(function theme() {
  const root = document.documentElement;
  const btn = $('#theme-toggle');
  const meta = $('meta[name="theme-color"]');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

  const current = () => root.getAttribute('data-theme') || (systemDark.matches ? 'dark' : 'light');
  const sync = () => {
    const dark = current() === 'dark';
    meta.setAttribute('content', dark ? '#111214' : '#f6f3ee');
    btn.setAttribute('aria-label', dark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro');
  };

  btn.addEventListener('click', () => {
    const next = current() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) { /* modo privado */ }
    sync();
  });
  systemDark.addEventListener('change', sync);
  sync();
})();

/* ---------- Navegación: sombra, menú móvil y link activo ---------- */
(function nav() {
  const header = $('#nav');
  const burger = $('#nav-burger');
  const menu = $('#nav-links');
  const links = $$('a', menu);

  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const setOpen = (open) => {
    menu.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  };
  burger.addEventListener('click', () => setOpen(!menu.classList.contains('is-open')));
  links.forEach((a) => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });

  // Marca en el menú la sección visible
  const sections = links.map((a) => $(a.getAttribute('href'))).filter(Boolean);
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((s) => spy.observe(s));
})();

/* ---------- Texto que se escribe solo ---------- */
(function typed() {
  const el = $('#typed');
  const phrases = CONFIG.TYPED_PHRASES;
  if (!el || reduceMotion || phrases.length < 2) return;

  let i = 0, chars = phrases[0].length, deleting = true;
  const tick = () => {
    const word = phrases[i];
    chars += deleting ? -1 : 1;
    el.textContent = word.slice(0, chars);

    let delay = deleting ? 35 : 70;
    if (!deleting && chars === word.length) { deleting = true; delay = 2200; }
    else if (deleting && chars === 0) { deleting = false; i = (i + 1) % phrases.length; delay = 350; }
    setTimeout(tick, delay);
  };
  setTimeout(tick, 2500);
})();

/* ---------- Aparición al hacer scroll + contadores ---------- */
(function reveal() {
  const items = $$('.reveal');
  if (!('IntersectionObserver' in window)) { items.forEach((el) => el.classList.add('is-visible')); return; }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      $$('.counter', entry.target).forEach(countUp);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.15 });
  items.forEach((el) => io.observe(el));
})();

function countUp(el) {
  const target = Number(el.dataset.target) || 0;
  if (reduceMotion) { el.textContent = target; return; }
  const duration = 1400;
  const start = performance.now();
  const step = (now) => {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
    el.textContent = Math.round(target * eased);
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* ---------- Carrusel de proyectos ---------- */
(function carousel() {
  const track = $('#carousel-track');
  const dotsBox = $('#carousel-dots');
  const slides = $$('.slide', track);
  const prev = $('[data-carousel="prev"]');
  const next = $('[data-carousel="next"]');
  if (!track || !slides.length) return;

  let index = 0;

  const dots = slides.map((slide, i) => {
    const title = $('.slide__title', slide)?.textContent.trim() || `Proyecto ${i + 1}`;
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'carousel__dot';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', title);
    dot.addEventListener('click', () => goTo(i));
    dotsBox.appendChild(dot);
    return dot;
  });

  function goTo(i, smooth = !reduceMotion) {
    index = Math.max(0, Math.min(i, slides.length - 1));
    track.scrollTo({ left: slides[index].offsetLeft, behavior: smooth ? 'smooth' : 'auto' });
  }

  function update() {
    dots.forEach((d, i) => d.setAttribute('aria-selected', String(i === index)));
    slides.forEach((s, i) => s.toggleAttribute('inert', i !== index));
    prev.disabled = index === 0;
    next.disabled = index === slides.length - 1;
  }

  // Detecta la diapositiva visible (sirve también para swipe y trackpad)
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio >= 0.6) {
        index = slides.indexOf(entry.target);
        update();
      }
    });
  }, { root: track, threshold: [0.6] });
  slides.forEach((s) => io.observe(s));

  prev.addEventListener('click', () => goTo(index - 1));
  next.addEventListener('click', () => goTo(index + 1));
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(index + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(index - 1); }
  });
  window.addEventListener('resize', () => goTo(index, false));

  update();
})();

/* ---------- Formulario de contacto ---------- */
(function contactForm() {
  const form = $('#contact-form');
  const status = $('#form-status');
  if (!form) return;

  const messages = {
    valueMissing: 'Este campo es obligatorio.',
    typeMismatch: 'Ingresá un email válido.',
    tooShort: (el) => `Escribí al menos ${el.minLength} caracteres.`,
  };

  const validateField = (el) => {
    const field = el.closest('.field');
    const error = $('.field__error', field);
    el.value = el.value.trimStart();
    let msg = '';
    if (el.validity.valueMissing) msg = messages.valueMissing;
    else if (el.validity.typeMismatch) msg = messages.typeMismatch;
    else if (el.validity.tooShort) msg = messages.tooShort(el);
    field.classList.toggle('has-error', Boolean(msg));
    el.setAttribute('aria-invalid', String(Boolean(msg)));
    error.textContent = msg;
    return !msg;
  };

  const inputs = $$('.field input, .field textarea', form);
  inputs.forEach((el) => {
    el.addEventListener('blur', () => validateField(el));
    el.addEventListener('input', () => { if (el.closest('.field').classList.contains('has-error')) validateField(el); });
  });

  const setStatus = (text, type = '') => {
    status.textContent = text;
    status.className = `form__status${type ? ` is-${type}` : ''}`;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const valid = inputs.map(validateField).every(Boolean);
    if (!valid) { inputs.find((el) => el.getAttribute('aria-invalid') === 'true')?.focus(); return; }
    if (form._gotcha.value) return; // bot

    const data = Object.fromEntries(new FormData(form));
    delete data._gotcha;

    // Sin Formspree configurado: abre el correo con el mensaje armado
    if (!CONFIG.FORMSPREE_ID) {
      const body = `${data.message}\n\n— ${data.name} (${data.email})`;
      window.location.href = `mailto:${CONFIG.CONTACT_EMAIL}?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(body)}`;
      setStatus('Se abrió tu cliente de correo con el mensaje listo para enviar.', 'ok');
      return;
    }

    const btn = $('button[type="submit"]', form);
    btn.disabled = true;
    setStatus('Enviando…');
    try {
      const res = await fetch(`https://formspree.io/f/${CONFIG.FORMSPREE_ID}`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      form.reset();
      setStatus('¡Gracias! Tu mensaje fue enviado. Te respondo pronto.', 'ok');
    } catch (err) {
      setStatus('No se pudo enviar. Probá de nuevo o escribime directamente por LinkedIn.', 'error');
    } finally {
      btn.disabled = false;
    }
  });
})();

/* ---------- Visor de imágenes ---------- */
(function lightbox() {
  const dialog = $('#lightbox');
  if (!dialog || typeof dialog.showModal !== 'function') return; // sin soporte: las capturas se ven igual en la tarjeta
  const img = $('.lightbox__img', dialog);
  const caption = $('.lightbox__caption', dialog);

  $$('[data-lightbox]').forEach((btn) => {
    btn.addEventListener('click', () => {
      img.src = btn.dataset.lightbox;
      img.alt = $('img', btn)?.alt || '';
      caption.textContent = btn.dataset.caption || '';
      dialog.showModal();
    });
  });
  $('.lightbox__close', dialog).addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); }); // clic en el fondo
})();

/* ---------- Año del footer ---------- */
$('#year').textContent = new Date().getFullYear();
