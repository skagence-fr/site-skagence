import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { initMotion } from './motion/index.js';

gsap.registerPlugin(ScrollTrigger);

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

/* ===== Année footer ===== */
document.querySelectorAll('#year').forEach((n) => (n.textContent = new Date().getFullYear()));

/* ===== Préloader ===== */
const loader = document.getElementById('loader');
const hideLoader = () => {
  if (!loader) return;
  loader.classList.add('is-hidden');
  setTimeout(() => loader.remove(), 700);
};
window.addEventListener('load', () => setTimeout(hideLoader, 600));
setTimeout(hideLoader, 1400);

/* ===== Lenis smooth scroll ===== */
let lenis;
if (!prefersReduced) {
  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    smoothTouch: false,
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* ===== Curseur custom (or) ===== */
const cursor = document.getElementById('cursor');
const cursorDot = cursor?.querySelector('.cursor__dot');
const cursorRing = cursor?.querySelector('.cursor__ring');

if (cursor && !isTouch && !prefersReduced) {
  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let rx = mx, ry = my;
  let visible = false;

  const onMove = (e) => {
    mx = e.clientX; my = e.clientY;
    if (!visible) {
      visible = true;
      cursor.classList.remove('is-hidden');
    }
  };
  document.addEventListener('mousemove', onMove, { passive: true });
  document.addEventListener('mouseleave', () => { cursor.classList.add('is-hidden'); visible = false; });
  document.addEventListener('mouseenter', () => cursor.classList.remove('is-hidden'));
  document.addEventListener('mousedown', () => cursor.classList.add('is-down'));
  document.addEventListener('mouseup', () => cursor.classList.remove('is-down'));

  const tick = () => {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    if (cursorDot) cursorDot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    if (cursorRing) cursorRing.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%) ${cursor.classList.contains('is-down') ? 'scale(.82)' : 'scale(1)'}`;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  const setHoverables = () => {
    document.querySelectorAll('a, button, summary, [data-cursor="hover"]').forEach((el) => {
      if (el.dataset.cursorBound) return;
      el.dataset.cursorBound = '1';
      el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
    });
  };
  setHoverables();
  window.addEventListener('load', setHoverables);
} else if (cursor) {
  cursor.style.display = 'none';
  document.body.style.cursor = 'auto';
}

/* ===== Nav sticky ===== */
const nav = document.querySelector('.nav');
if (nav) {
  ScrollTrigger.create({
    start: 'top -40',
    end: 99999,
    onUpdate: (self) => nav.classList.toggle('is-stuck', self.scroll() > 40),
  });
}

/* ===== Menu mobile =====
   Scroll-lock sur <html> (pas <body>) — fix Safari iOS BFCache et elastic scroll. */
const burger = document.getElementById('burger');
const menu = document.getElementById('menu');
const menuClose = document.getElementById('menu-close');

const openMenu = () => {
  menu?.classList.add('is-open');
  menu?.setAttribute('aria-hidden', 'false');
  burger?.setAttribute('aria-expanded', 'true');
  document.documentElement.style.overflow = 'hidden'; // sur html, pas body — Safari iOS
  if (lenis) lenis.stop();
  // Focus management : premier lien du menu
  const firstLink = menu?.querySelector('a');
  firstLink?.focus({ preventScroll: true });
};
const closeMenu = () => {
  menu?.classList.remove('is-open');
  menu?.setAttribute('aria-hidden', 'true');
  burger?.setAttribute('aria-expanded', 'false');
  document.documentElement.style.overflow = ''; // restauration propre
  if (lenis) lenis.start();
  burger?.focus({ preventScroll: true });
};
burger?.addEventListener('click', openMenu);
menuClose?.addEventListener('click', closeMenu);
menu?.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));
window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

/* ===== Ancres fluides ===== */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const offset = -80;
    if (lenis) lenis.scrollTo(target, { duration: 1.2, offset });
    else target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ===== Système de micro-animations centralisé ===== */
initMotion();

/* ===== FORMULAIRE DE DEVIS — monopage ===== */
const quoteForm = document.getElementById('quote-form');
if (quoteForm) {
  const successEl = document.getElementById('quote-success');
  const successName = document.querySelector('[data-success-name]');

  // Bascule email <-> téléphone (système classes + animation CSS keyframe)
  // - retire l'attribut hidden initial (utilisé en garde-fou no-JS)
  // - bascule la classe .is-collapsed (CSS gère display:none vs animation)
  // - gère required dynamiquement et vide le champ masqué
  // - met à jour aria-hidden pour l'accessibilité
  const syncChannel = (v) => {
    quoteForm.querySelectorAll('[data-channel]').forEach((d) => {
      const isVisible = d.dataset.channel === v;
      d.removeAttribute('hidden');
      d.classList.toggle('is-collapsed', !isVisible);
      d.setAttribute('aria-hidden', isVisible ? 'false' : 'true');
      const input = d.querySelector('input');
      if (input) {
        if (isVisible) {
          input.setAttribute('required', '');
          input.removeAttribute('tabindex');
        } else {
          input.removeAttribute('required');
          input.setAttribute('tabindex', '-1');
          input.value = '';
        }
      }
    });
    quoteForm.querySelectorAll('.quote__channel-tab').forEach((t) => {
      t.classList.toggle('is-active', t.querySelector('input').value === v);
    });
  };

  // Init : canal email actif par défaut — retirer required du tel masqué + retirer hidden
  syncChannel('email');

  quoteForm.querySelectorAll('input[name="contact_type"]').forEach((r) => {
    r.addEventListener('change', () => {
      syncChannel(r.value);
      const visible = quoteForm.querySelector(`[data-channel="${r.value}"] input`);
      setTimeout(() => visible?.focus({ preventScroll: true }), 60);
      updateQuoteProgress();
    });
  });

  /* === Barre progression dorée (additif — n'interfère pas avec validation/submit) === */
  const progressBar = quoteForm.querySelector('.quote__progress > span');
  const consentEl = quoteForm.querySelector('input[name="consent"]');
  const requiredIds = ['qf-prenom', 'qf-nom', 'qf-type', 'qf-activite', 'qf-message', 'qf-budget'];
  const TOTAL_FIELDS = requiredIds.length + 2; // + canal (email|tel) + consent

  const updateQuoteProgress = () => {
    if (!progressBar) return;
    let filled = 0;
    requiredIds.forEach((id) => {
      const el = quoteForm.querySelector('#' + id);
      if (el && el.value && el.value.trim() !== '') filled++;
    });
    const channelRadio = quoteForm.querySelector('input[name="contact_type"]:checked');
    if (channelRadio) {
      const contactEl = quoteForm.querySelector('#qf-' + channelRadio.value);
      if (contactEl && contactEl.value && contactEl.value.trim() !== '') filled++;
    }
    if (consentEl && consentEl.checked) filled++;
    const ratio = Math.min(filled / TOTAL_FIELDS, 1);
    progressBar.style.width = (ratio * 100) + '%';
  };

  quoteForm.querySelectorAll('input, select, textarea').forEach((el) => {
    if (el.name === 'website') return; // honeypot ignoré
    el.addEventListener('input', updateQuoteProgress);
    el.addEventListener('change', updateQuoteProgress);
  });
  updateQuoteProgress();

  // Validation : tous les requis + email/tel selon canal + consent
  const validate = () => {
    const errors = [];
    const get = (id) => quoteForm.querySelector(id);

    if (!get('#qf-prenom').value.trim()) errors.push(get('#qf-prenom'));
    if (!get('#qf-nom').value.trim()) errors.push(get('#qf-nom'));
    if (!get('#qf-type').value) errors.push(get('#qf-type'));
    if (!get('#qf-activite').value.trim()) errors.push(get('#qf-activite'));
    if (!get('#qf-message').value.trim()) errors.push(get('#qf-message'));
    if (!get('#qf-budget').value) errors.push(get('#qf-budget'));

    const channel = quoteForm.querySelector('input[name="contact_type"]:checked').value;
    const contact = get(`#qf-${channel}`);
    const v = contact.value.trim();
    if (!v) errors.push(contact);
    else if (channel === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) errors.push(contact);
    else if (channel === 'tel') {
      // Permissif : 10 chiffres minimum, espaces / points / tirets / + autorisés
      const digits = v.replace(/\D/g, '');
      if (digits.length < 10 || !/^[\d\s.\-\+]{9,}$/.test(v)) errors.push(contact);
    }

    if (!quoteForm.querySelector('input[name="consent"]').checked) {
      errors.push(quoteForm.querySelector('input[name="consent"]'));
    }
    return errors;
  };

  const submitBtn = document.getElementById('quote-submit');
  const sendErrorEl = document.getElementById('quote-send-error');

  quoteForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const errors = validate();
    if (errors.length > 0) {
      quoteForm.classList.add('has-error');
      setTimeout(() => quoteForm.classList.remove('has-error'), 500);
      errors[0].focus({ preventScroll: true });
      return;
    }

    if (sendErrorEl) {
      sendErrorEl.hidden = true;
      sendErrorEl.textContent = '';
    }

    const channel = quoteForm.querySelector('input[name="contact_type"]:checked').value;
    const payload = {
      prenom:       quoteForm.querySelector('#qf-prenom').value.trim(),
      nom:          quoteForm.querySelector('#qf-nom').value.trim(),
      type:         quoteForm.querySelector('#qf-type').value,
      activite:     quoteForm.querySelector('#qf-activite').value.trim(),
      message:      quoteForm.querySelector('#qf-message').value.trim(),
      budget:       quoteForm.querySelector('#qf-budget').value,
      contact_type: channel,
      email:        channel === 'email' ? quoteForm.querySelector('#qf-email').value.trim() : '',
      tel:          channel === 'tel'   ? quoteForm.querySelector('#qf-tel').value.trim()   : '',
      consent:      quoteForm.querySelector('input[name="consent"]').checked,
      website:      quoteForm.querySelector('input[name="website"]')?.value ?? '', // honeypot
    };

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Envoi en cours…';
    }

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        data = { ok: false, error: 'Réponse inattendue du serveur.' };
      }

      if (data.ok) {
        const prenom = payload.prenom;
        if (successName) successName.textContent = prenom;
        quoteForm.hidden = true;
        successEl.hidden = false;
        successEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        successEl.focus();
      } else {
        const msg = data.error || 'Une erreur est survenue. Veuillez réessayer ou nous écrire directement à sk.agence@outlook.fr';
        if (sendErrorEl) {
          sendErrorEl.textContent = msg;
          sendErrorEl.hidden = false;
          sendErrorEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Envoyer ma demande <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        }
      }

    } catch {
      const msg = 'Impossible de joindre le serveur. Vérifiez votre connexion ou écrivez-nous à sk.agence@outlook.fr';
      if (sendErrorEl) {
        sendErrorEl.textContent = msg;
        sendErrorEl.hidden = false;
        sendErrorEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Envoyer ma demande <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      }
    }
  });
}

/* ===== FAQ — un seul ouvert à la fois ===== */
const faqItems = document.querySelectorAll('.faq__item');
faqItems.forEach((item) => {
  item.addEventListener('toggle', () => {
    if (item.open) faqItems.forEach((other) => { if (other !== item) other.open = false; });
  });
});

/* ===== Refresh après polices ===== */
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => ScrollTrigger.refresh());
}
window.addEventListener('resize', () => ScrollTrigger.refresh());

/* ===== BFCache — restaurer l'état de la nav au retour arrière ===== */
window.addEventListener('pageshow', (e) => {
  if (e.persisted) {
    // Page restaurée depuis le cache navigateur : reset de l'overflow
    document.documentElement.style.overflow = '';
    // Re-init lenis si nécessaire
    if (lenis) lenis.start();
  }
});
