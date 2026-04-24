/* ANIMATIONS.JS — Scroll Reveal + Parallax */
(function () {
  /* Reveal observer */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });

  document.querySelectorAll('.reveal-up,.reveal-left,.reveal-right').forEach(el => revealObs.observe(el));

  /* Subtle parallax on orbs */
  const orbs = document.querySelectorAll('.sec-orb, .hero-orb');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (ticking) return;
    requestAnimationFrame(() => {
      const sy = window.scrollY;
      orbs.forEach((orb, i) => {
        const dir   = i % 2 === 0 ? 1 : -1;
        const speed = 0.06 + i * 0.015;
        orb.style.transform = `translateY(${sy * speed * dir}px)`;
      });
      ticking = false;
    });
    ticking = true;
  }, { passive: true });
})();
