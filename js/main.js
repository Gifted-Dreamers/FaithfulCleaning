// Faithful Cleaning TX — interaction layer
(() => {
  'use strict';

  // ── Sticky header shadow on scroll ───────────────────────────
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ── Mobile nav toggle ────────────────────────────────────────
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // ── Reveal-on-scroll ─────────────────────────────────────────
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  // ── Before/After sliders ─────────────────────────────────────
  document.querySelectorAll('.ba-slider').forEach(slider => {
    const afterWrap = slider.querySelector('.ba-after-wrap');
    const handle = slider.querySelector('.ba-handle');
    const afterImg = afterWrap && afterWrap.querySelector('img');
    if (!afterWrap || !handle || !afterImg) return;

    let dragging = false;

    // Pin the after image to the slider's full pixel width so the wrap
    // acts purely as a clipping mask. Re-pin on resize.
    const syncSize = () => { afterImg.style.width = slider.clientWidth + 'px'; };
    syncSize();
    if (afterImg.complete) syncSize();
    else afterImg.addEventListener('load', syncSize, { once: true });
    window.addEventListener('resize', syncSize, { passive: true });

    const setPosition = (clientX) => {
      const rect = slider.getBoundingClientRect();
      // pct = handle position (0 = all before, 100 = all after).
      const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
      handle.style.left = pct + '%';
      afterWrap.style.width = pct + '%';
    };

    const onStart = (e) => {
      dragging = true;
      slider.classList.add('is-dragging');
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      setPosition(x);
      e.preventDefault();
    };
    const onMove = (e) => {
      if (!dragging) return;
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      setPosition(x);
      if (e.cancelable) e.preventDefault();
    };
    const onEnd = () => {
      dragging = false;
      slider.classList.remove('is-dragging');
    };

    slider.addEventListener('mousedown', onStart);
    slider.addEventListener('touchstart', onStart, { passive: false });
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchend', onEnd);
    window.addEventListener('touchcancel', onEnd);

    // Keyboard accessibility
    slider.setAttribute('tabindex', '0');
    slider.setAttribute('role', 'slider');
    slider.setAttribute('aria-label', 'Before and after comparison. Use left and right arrow keys to compare.');
    let kbPct = 50;
    slider.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { kbPct = Math.max(0, kbPct - 5); }
      else if (e.key === 'ArrowRight') { kbPct = Math.min(100, kbPct + 5); }
      else return;
      const rect = slider.getBoundingClientRect();
      setPosition(rect.left + (rect.width * kbPct / 100));
      e.preventDefault();
    });

    // Subtle on-load nudge to hint interactivity
    const hint = () => {
      const rect = slider.getBoundingClientRect();
      let t = 0;
      const tick = () => {
        t += 0.04;
        if (t > 1) { setPosition(rect.left + rect.width * 0.5); return; }
        const eased = 0.5 + Math.sin(t * Math.PI * 2) * 0.08 * (1 - t);
        setPosition(rect.left + rect.width * eased);
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const hintObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { hint(); hintObserver.disconnect(); }
      });
    }, { threshold: 0.5 });
    hintObserver.observe(slider);
  });

  // ── Contact form (posts to n8n) ──────────────────────────────
  const form = document.querySelector('#quote-form');
  if (form) {
    const status = form.querySelector('.form-status');
    const submitBtn = form.querySelector('button[type="submit"]');
    const endpoint = form.dataset.endpoint;

    const showError = () => {
      status.textContent = '';
      status.className = 'form-status is-error';
      const txt1 = document.createTextNode("Something went wrong sending the form. Please call or text ");
      const phone = document.createElement('a');
      phone.href = 'tel:+12075180350';
      phone.textContent = '(207) 518-0350';
      const txt2 = document.createTextNode(' or email ');
      const mail = document.createElement('a');
      mail.href = 'mailto:faithfulcleaningtx@gmail.com';
      mail.textContent = 'faithfulcleaningtx@gmail.com';
      const txt3 = document.createTextNode('.');
      status.append(txt1, phone, txt2, mail, txt3);
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (form.querySelector('.hp input').value.trim() !== '') return; // honeypot

      status.className = 'form-status';
      status.textContent = '';
      submitBtn.disabled = true;
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending…';

      const data = Object.fromEntries(new FormData(form).entries());
      data.source = 'faithfulcleaningtx.com';
      data.submitted_at = new Date().toISOString();

      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Server returned ' + res.status);
        status.textContent = "Thank you! Your message is on its way to Camibella. She'll be in touch within 24 hours.";
        status.className = 'form-status is-success';
        form.reset();
        if (window.gtag) {
          window.gtag('event', 'generate_lead', { event_category: 'engagement', event_label: 'quote_form' });
        }
      } catch (err) {
        showError();
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }

  // ── Year stamp ────────────────────────────────────────────────
  const yearEl = document.querySelector('#current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
