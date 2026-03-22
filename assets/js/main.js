/* ═══════════════════════════════════════════════════
   MAIN.JS — General Init, Smooth Scroll, Polish
═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── Smooth scroll for all anchor links ──
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 66; // navbar height
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  // ── Subtle background floating dots (NOT particles sphere) ──
  // Very faint, low-count, purely ambient
  (function bgDots() {
    const canvas = document.createElement('canvas');
    canvas.id    = 'bg-ambient';
    canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;opacity:0.35;';
    document.body.insertBefore(canvas, document.body.firstChild);

    const ctx = canvas.getContext('2d');
    let W, H;

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const isMobile = window.innerWidth < 768;
    const COUNT    = isMobile ? 25 : 50;

    // Create ambient dots
    const dots = Array.from({ length: COUNT }, function () {
      return {
        x:  Math.random() * window.innerWidth,
        y:  Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        r:  Math.random() * 1.1 + 0.3,
        a:  Math.random() * 0.25 + 0.05,
      };
    });

    function getColor() {
      return document.documentElement.getAttribute('data-theme') === 'light'
        ? '124,58,237'
        : '155,89,245';
    }

    function frame() {
      requestAnimationFrame(frame);
      ctx.clearRect(0, 0, W, H);
      const col = getColor();

      dots.forEach(function (d) {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0) d.x = W;
        if (d.x > W) d.x = 0;
        if (d.y < 0) d.y = H;
        if (d.y > H) d.y = 0;

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${col},${d.a})`;
        ctx.fill();
      });
    }

    frame();
  })();

  // ── Add 'loaded' class to body once all done ──
  window.addEventListener('load', function () {
    document.body.classList.add('loaded');
  });

  // ── Prevent form double submit ──
  // (handled in contact.js, just a safety guard here)

  // ── Log signature (just for fun) ──
  console.log(
    '%c Somala Ajay — Portfolio ',
    'background:#9b59f5;color:#fff;padding:6px 14px;border-radius:4px;font-weight:bold;font-size:14px;'
  );
  console.log('%c Built with HTML · CSS · JS', 'color:#d4a843;font-size:12px;');

})();
