/* ═══════════════════════════════════════════════════
   CURSOR.JS — Custom Cursor (dot + ring)
   Disabled automatically on touch devices
═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  // Skip on touch devices
  if (window.matchMedia('(hover: none)').matches) return;

  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');

  if (!dot || !ring) return;

  let mouseX = -100, mouseY = -100;
  let ringX  = -100, ringY  = -100;
  let rafId;

  // ── Track mouse position ──
  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Dot follows instantly
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  // ── Ring follows with smooth lag ──
  function animateRing() {
    // Ease ring toward cursor
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;

    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';

    rafId = requestAnimationFrame(animateRing);
  }
  animateRing();

  // ── Hover state on interactive elements ──
  const interactiveSelectors = 'a, button, .project-card, .cert-card, .skill-card, .about-card, .contact-link, .stat-item, .tag, .timeline-card, [role="button"]';

  document.addEventListener('mouseover', function (e) {
    if (e.target.closest(interactiveSelectors)) {
      dot.classList.add('hovering');
      ring.classList.add('hovering');
    }
  });

  document.addEventListener('mouseout', function (e) {
    if (e.target.closest(interactiveSelectors)) {
      dot.classList.remove('hovering');
      ring.classList.remove('hovering');
    }
  });

  // ── Click state ──
  document.addEventListener('mousedown', function () {
    dot.classList.add('clicking');
    ring.classList.add('clicking');
  });

  document.addEventListener('mouseup', function () {
    dot.classList.remove('clicking');
    ring.classList.remove('clicking');
  });

  // ── Show/hide on enter/leave window ──
  document.addEventListener('mouseleave', function () {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });

  document.addEventListener('mouseenter', function () {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });
})();
