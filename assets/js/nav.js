/* ═══════════════════════════════════════════════════
   NAV.JS — Navbar scroll effect, active links,
            hamburger mobile menu
═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  const navbar     = document.getElementById('navbar');
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobClose   = document.getElementById('mobClose');
  const navLinks   = document.querySelectorAll('.nav-links a');
  const footerYear = document.getElementById('footerYear');

  // ── Footer year ──
  if (footerYear) footerYear.textContent = new Date().getFullYear();

  // ── Navbar scroll state ──
  function handleScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active nav link detection
    updateActiveLink();
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // initial call

  // ── Highlight active section in nav ──
  function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';

    sections.forEach(function (sec) {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) {
        current = sec.id;
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  // ── Hamburger open/close ──
  function openMenu() {
    hamburger.classList.add('open');
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden'; // prevent background scroll
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Expose closeMenu globally (used via onclick in HTML)
  window.closeMenu = closeMenu;

  if (hamburger) hamburger.addEventListener('click', function () {
    if (hamburger.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (mobClose) mobClose.addEventListener('click', closeMenu);

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  // Close on backdrop click (outside links)
  if (mobileMenu) {
    mobileMenu.addEventListener('click', function (e) {
      if (e.target === mobileMenu) closeMenu();
    });
  }
})();
