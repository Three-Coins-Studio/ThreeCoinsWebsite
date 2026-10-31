(() => {
  const root = document.documentElement;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Scroll focus: elements fade in while in the viewport's focus band, out when not ---- */
  const revealed = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observe = (rootMargin) => new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting, boundingClientRect }) => {
        target.classList.toggle('in-focus', isIntersecting);
        if (!isIntersecting) target.dataset.exit = boundingClientRect.top < 0 ? 'up' : 'down';
      });
    }, { rootMargin, threshold: 0 });

    // The hero sits flush to the viewport bottom on load, so it uses the full viewport
    // instead of the inset focus band — its buttons must never start hidden.
    // Bottom inset stays under the sections' 44px bottom padding so content resting at the edge still shows.
    const band = observe('-6% 0px -3% 0px');
    const full = observe('0px');
    revealed.forEach((el) => (el.closest('.hero') ? full : band).observe(el));
  } else {
    revealed.forEach((el) => el.classList.add('in-focus'));
  }

  /* ---- Active section, dot navigation, nav colours, brand visibility, hero parallax ---- */
  const sections = [...document.querySelectorAll('[data-section]')];
  const dots = [...document.querySelectorAll('.dots a')];
  const hero = sections[0];
  let ticking = false;

  const sectionAt = (y) =>
    sections.find((s) => {
      const r = s.getBoundingClientRect();
      return r.top <= y && r.bottom > y;
    }) || sections[sections.length - 1];

  const update = () => {
    ticking = false;
    const current = sectionAt(innerHeight / 2);

    root.dataset.navTheme = current.dataset.theme;
    root.toggleAttribute('data-scrolled', scrollY > 40);

    const index = sections.indexOf(current);
    dots.forEach((dot, i) => {
      if (i === index) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });

    if (!reduceMotion) {
      const p = Math.min(Math.max(scrollY / hero.offsetHeight, 0), 1);
      hero.style.setProperty('--p', p.toFixed(3));
    }
  };

  const requestUpdate = () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  };
  addEventListener('scroll', requestUpdate, { passive: true });
  addEventListener('resize', requestUpdate);
  update();

  /* ---- Screenshot lightbox ---- */
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  const lbCount = document.getElementById('lb-count');
  const shots = [...document.querySelectorAll('.shot img')];
  let open = 0;

  const pad = (n) => String(n).padStart(2, '0');
  const show = (i) => {
    open = (i + shots.length) % shots.length;
    lbImg.src = shots[open].currentSrc || shots[open].src;
    lbImg.alt = shots[open].alt;
    lbCount.textContent = `${pad(open + 1)} / ${pad(shots.length)}`;
  };

  document.querySelectorAll('.shot button').forEach((btn) => {
    btn.addEventListener('click', () => {
      show(Number(btn.dataset.index));
      lb.showModal();
    });
  });
  document.getElementById('lb-prev').addEventListener('click', () => show(open - 1));
  document.getElementById('lb-next').addEventListener('click', () => show(open + 1));
  document.getElementById('lb-close').addEventListener('click', () => lb.close());
  lb.addEventListener('click', (e) => { if (e.target === lb) lb.close(); });
  lb.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(open - 1);
    if (e.key === 'ArrowRight') show(open + 1);
  });
})();
