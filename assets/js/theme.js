/* ═══════════════════════════════════════════════════
   THEME.JS — Dark / Light Mode Toggle
   Persists preference in localStorage
═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── Read saved preference or default to dark ──
  const saved = localStorage.getItem('sa-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);

  // ── Toggle on button click ──
  document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;

    btn.addEventListener('click', function () {
      const current = document.documentElement.getAttribute('data-theme');
      const next    = current === 'dark' ? 'light' : 'dark';

      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('sa-theme', next);

      // Small rotation animation on click
      btn.style.transform = 'scale(0.85) rotate(30deg)';
      setTimeout(function () { btn.style.transform = ''; }, 300);
    });
  });
})();
