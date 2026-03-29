/* ═══════════════════════════════════════════════════
   LOGO.JS — Animated SA Logo + Name Letter Scatter
   Letters fly in from random positions → snap into place
   Plays on load, replays on logo click
   Somala Ajay Portfolio
═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Config ── */
  const NAME_FIRST = 'Somala';
  const NAME_LAST  = 'Ajay';
  const LOGO_CHARS = ['S', 'A'];

  /* ── Canvas Logo (SA) ── */
  function initLogoCanvas() {
    const wrap   = document.getElementById('heroLogo');
    const canvas = document.getElementById('logoCanvas');
    if (!canvas || !wrap) return;

    const SIZE = 110;
    const DPR  = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width  = SIZE * DPR;
    canvas.height = SIZE * DPR;
    canvas.style.width  = SIZE + 'px';
    canvas.style.height = SIZE + 'px';
    const ctx = canvas.getContext('2d');
    ctx.scale(DPR, DPR);

    function isDark() {
      return document.documentElement.getAttribute('data-theme') !== 'light';
    }

    /* ── SA Letter particles ── */
    // Each letter of S and A is made of tiny dots
    // that fly in from random screen positions
    function getLetterDots(letter, offsetX, size) {
      const offCanvas = document.createElement('canvas');
      offCanvas.width  = size;
      offCanvas.height = size;
      const offCtx = offCanvas.getContext('2d');
      offCtx.fillStyle = '#fff';
      offCtx.font = `bold ${size * 0.85}px "Cormorant Garamond", serif`;
      offCtx.textAlign    = 'center';
      offCtx.textBaseline = 'middle';
      offCtx.fillText(letter, size / 2, size / 2);

      const imageData = offCtx.getImageData(0, 0, size, size);
      const dots = [];
      const step = 4;
      for (let y = 0; y < size; y += step) {
        for (let x = 0; x < size; x += step) {
          const i = (y * size + x) * 4;
          if (imageData.data[i + 3] > 100) {
            dots.push({
              tx: offsetX + x,   // target x
              ty: y,             // target y
              x:  (Math.random() - 0.5) * 400 + SIZE / 2,
              y:  (Math.random() - 0.5) * 400 + SIZE / 2,
              size: Math.random() * 1.5 + 0.8,
            });
          }
        }
      }
      return dots;
    }

    let particles = [];
    let animId;
    let progress = 0;
    let phase = 'scatter'; // scatter | hold

    function buildParticles() {
      const half = SIZE / 2 - 4;
      const dotsS = getLetterDots('S', 2,  half);
      const dotsA = getLetterDots('A', half + 4, half);
      particles = [...dotsS, ...dotsA];
      // Randomize starting positions
      particles.forEach(function(p) {
        const angle = Math.random() * Math.PI * 2;
        const dist  = 150 + Math.random() * 200;
        p.x = SIZE / 2 + Math.cos(angle) * dist;
        p.y = SIZE / 2 + Math.sin(angle) * dist;
      });
    }

    function easeOutExpo(t) {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function drawRing(t) {
      // Animated ring around the logo
      const dark = isDark();
      const cx = SIZE / 2, cy = SIZE / 2, r = SIZE / 2 - 4;
      // Gold ring draws in as letters arrive
      ctx.beginPath();
      ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * t);
      ctx.strokeStyle = dark ? '#d4a843' : '#b8860b';
      ctx.lineWidth   = 2.5;
      ctx.stroke();
      // Purple inner glow
      if (t > 0.5) {
        const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        glow.addColorStop(0, `rgba(155,89,245,${(t - 0.5) * 0.15})`);
        glow.addColorStop(1, 'rgba(155,89,245,0)');
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
      }
    }

    function animate() {
      animId = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, SIZE, SIZE);

      progress = Math.min(progress + 0.022, 1); // Speed of gather
      const e = easeOutExpo(progress);
      const dark = isDark();

      drawRing(progress);

      particles.forEach(function(p) {
        const px = p.x + (p.tx - p.x) * e;
        const py = p.y + (p.ty - p.y) * e;

        // Color shifts from scattered (purple) to settled (white/gold)
        const r = dark
          ? Math.round(155 + (255 - 155) * e)
          : Math.round(124 + (212 - 124) * e);
        const g = dark
          ? Math.round(89  + (255 - 89)  * e)
          : Math.round(58  + (168 - 58)  * e);
        const b = dark
          ? Math.round(245 + (255 - 245) * e)
          : Math.round(237 + (67  - 237) * e);

        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fill();
      });

      if (progress >= 1) {
        cancelAnimationFrame(animId);
        // Trigger name animation after logo settles
        setTimeout(animateName, 80);
      }
    }

    function playLogoAnimation() {
      cancelAnimationFrame(animId);
      progress = 0;
      buildParticles();
      // Also reset name
      resetName();
      animate();
    }

    // Click to replay
    wrap.style.cursor = 'pointer';
    wrap.addEventListener('click', playLogoAnimation);

    // Initial play
    setTimeout(playLogoAnimation, 300);
  }

  /* ── Name Letter Scatter Animation ── */
  const nameEl = document.getElementById('heroName');

  function buildNameHTML() {
    if (!nameEl) return;
    nameEl.innerHTML =
      '<span class="name-first" id="nameFirst">' +
        NAME_FIRST.split('').map(function(l, i) {
          return `<span class="nl" data-i="${i}" style="--ni:${i}">${l}</span>`;
        }).join('') +
      '</span>' +
      '<span class="name-last" id="nameLast">' +
        NAME_LAST.split('').map(function(l, i) {
          return `<span class="nl" data-i="${i + NAME_FIRST.length}" style="--ni:${i + NAME_FIRST.length}">${l}</span>`;
        }).join('') +
      '</span>';
  }

  function resetName() {
    const letters = nameEl ? nameEl.querySelectorAll('.nl') : [];
    letters.forEach(function(l) {
      l.classList.remove('nl-visible');
      l.classList.add('nl-hidden');
      // Random starting offset
      const angle  = Math.random() * 360;
      const dist   = 120 + Math.random() * 180;
      const tx = Math.cos(angle * Math.PI / 180) * dist;
      const ty = Math.sin(angle * Math.PI / 180) * dist;
      l.style.setProperty('--tx', tx + 'px');
      l.style.setProperty('--ty', ty + 'px');
      l.style.setProperty('--rot', (Math.random() * 360 - 180) + 'deg');
    });
  }

  function animateName() {
    const letters = nameEl ? nameEl.querySelectorAll('.nl') : [];
    letters.forEach(function(l, i) {
      setTimeout(function() {
        l.classList.remove('nl-hidden');
        l.classList.add('nl-visible');
      }, i * 38); // Fast stagger — 38ms per letter
    });
  }

  /* ── Inject Name Letter Styles ── */
  function injectNameStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* ── Logo Canvas Wrap ── */
      .hero-logo {
        position: relative;
        width: 110px;
        height: 110px;
        margin-bottom: 1.75rem;
        animation: fadeUp 0.4s 0.1s both;
        border-radius: 50%;
        transition: transform 0.3s ease;
      }
      .hero-logo:hover { transform: scale(1.05); }
      .hero-logo:active { transform: scale(0.97); }

      /* ── Name Letters ── */
      #heroName {
        overflow: visible !important;
        position: relative;
      }

      .nl {
        display: inline-block;
        position: relative;
        transition:
          transform 0.45s cubic-bezier(0.16,1,0.3,1),
          opacity 0.45s ease,
          filter 0.45s ease;
        transition-delay: calc(var(--ni) * 0.038s);
      }

      /* Hidden state — scattered position */
      .nl-hidden {
        opacity: 0;
        transform: translate(var(--tx, 80px), var(--ty, -60px)) rotate(var(--rot, 45deg)) scale(0.4);
        filter: blur(4px);
      }

      /* Visible state — snapped into place */
      .nl-visible {
        opacity: 1;
        transform: translate(0,0) rotate(0deg) scale(1);
        filter: blur(0px);
      }

      /* Shimmer still works on name-first and name-last */
      .name-first .nl,
      .name-last  .nl {
        /* Inherit gradient text from hero.css */
      }
    `;
    document.head.appendChild(style);
  }

  /* ── Init ── */
  document.addEventListener('DOMContentLoaded', function () {
    injectNameStyles();
    buildNameHTML();
    resetName();
    initLogoCanvas();
  });

  // Expose replay for nav logo click too
  window.SA_replayLogo = function () {
    document.getElementById('heroLogo') &&
      document.getElementById('heroLogo').click();
  };

})();
