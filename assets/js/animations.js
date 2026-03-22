/* ═══════════════════════════════════════════════════
   ANIMATIONS.JS — Scroll Reveal & Counter Animation
═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Scroll Reveal via IntersectionObserver ── */
const revealEls = document.querySelectorAll(
    '.reveal-up, .reveal-left, .reveal-right, .cert-card'
  );

  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealEls.forEach(function (el) {
    revealObserver.observe(el);
  });

  // ── Project cards: stagger one-by-one ──
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(function (card, i) {
    card.style.opacity   = '0';
    card.style.transform = 'translateY(40px)';
    card.style.transition = `opacity 0.6s ease ${i * 0.12}s, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 0.12}s, border-color 0.3s, box-shadow 0.3s`;
  });

  const projectObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
        projectObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  projectCards.forEach(function (card) { projectObserver.observe(card); });

  // ── Cert cards: stagger one-by-one ──
  const certCards = document.querySelectorAll('.cert-card');
  certCards.forEach(function (card, i) {
    card.style.opacity   = '0';
    card.style.transform = 'translateX(-24px)';
    card.style.transition = `opacity 0.55s ease ${i * 0.1}s, transform 0.55s ease ${i * 0.1}s, border-color 0.3s`;
  });

  const certObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateX(0)';
        certObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  certCards.forEach(function (card) { certObserver.observe(card); });

  // ── Counter Animation ──
  // Animates .stat-val elements from 0 to data-target
  function animateCounter(el) {
    const target   = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1800; // ms
    const start    = performance.now();

    function update(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = Math.round(eased * target);
      el.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(update);
  }

  // Trigger counters when hero stats enter view
  const statsSection = document.querySelector('.hero-stats');
  let countersStarted = false;

  if (statsSection) {
    const statsObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !countersStarted) {
          countersStarted = true;
          document.querySelectorAll('.stat-val[data-target]').forEach(function (el) {
            animateCounter(el);
          });
          statsObserver.disconnect();
        }
      });
    }, { threshold: 0.5 });

    statsObserver.observe(statsSection);
  }

  // ── Section tag line animation (draw line left-to-right) ──
  const tags = document.querySelectorAll('.section-tag');
  const tagObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'none';
        tagObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  tags.forEach(function (tag) {
    tag.style.opacity = '0';
    tag.style.transform = 'translateX(-10px)';
    tag.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    tagObserver.observe(tag);
  });

})();
