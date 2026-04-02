/* ═══════════════════════════════════════════════════
   LOGO.JS — Animated SA Logo + Name Letter Scatter
   Completely rewritten for reliability on mobile
   Somala Ajay Portfolio
═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  const NAME_FIRST = 'Somala';
  const NAME_LAST  = 'Ajay';

  /* ── Canvas Logo ── */
  function initLogoCanvas() {
    const wrap   = document.getElementById('heroLogo');
    const canvas = document.getElementById('logoCanvas');
    if (!canvas || !wrap) return;

    const SIZE = 130;
    const DPR  = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width  = SIZE * DPR;
    canvas.height = SIZE * DPR;
    canvas.style.width  = SIZE + 'px';
    canvas.style.height = SIZE + 'px';
    wrap.style.width    = SIZE + 'px';
    wrap.style.height   = SIZE + 'px';

    const ctx = canvas.getContext('2d');
    ctx.scale(DPR, DPR);
    const CX = SIZE / 2, CY = SIZE / 2;

    function isDark() {
      return document.documentElement.getAttribute('data-theme') !== 'light';
    }

    function sampleLetter(letter, targetX, targetY, letterSize) {
      const off = document.createElement('canvas');
      off.width = off.height = letterSize;
      const offCtx = off.getContext('2d');
      offCtx.fillStyle = '#ffffff';
      offCtx.font = `bold ${Math.floor(letterSize * 0.95)}px serif`;
      offCtx.textAlign = 'center';
      offCtx.textBaseline = 'middle';
      offCtx.fillText(letter, letterSize / 2, letterSize / 2);
      const data = offCtx.getImageData(0, 0, letterSize, letterSize).data;
      const dots = [];
      const step = 3;
      for (let y = 0; y < letterSize; y += step) {
        for (let x = 0; x < letterSize; x += step) {
          if (data[(y * letterSize + x) * 4 + 3] > 80) {
            const angle = Math.random() * Math.PI * 2;
            const dist  = 180 + Math.random() * 150;
            dots.push({
              tx: targetX + x, ty: targetY + y,
              x: CX + Math.cos(angle) * dist,
              y: CY + Math.sin(angle) * dist,
              size: 1.5 + Math.random() * 1.3,
            });
          }
        }
      }
      return dots;
    }

    let particles = [], animId = null, t = 0;

    function buildParticles() {
      // Each letter gets half the canvas width, centered vertically
      const letterSize = Math.floor(SIZE / 2) - 8;
      const topPad     = Math.floor((SIZE - letterSize) / 2); // vertical center
      const gap        = 4; // gap between S and A
      const totalW     = letterSize * 2 + gap;
      const leftStart  = Math.floor((SIZE - totalW) / 2);     // horizontal center

      particles = [
        ...sampleLetter('S', leftStart,                  topPad, letterSize),
        ...sampleLetter('A', leftStart + letterSize + gap, topPad, letterSize)
      ];
    }

    function easeOutBack(x) {
      const c1 = 1.70158, c3 = c1 + 1;
      return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    }

    function drawFrame() {
      ctx.clearRect(0, 0, SIZE, SIZE);
      const dark = isDark();

      // Background circle
      ctx.beginPath();
      ctx.arc(CX, CY, SIZE/2-3, 0, Math.PI*2);
      ctx.fillStyle = dark ? 'rgba(26,15,53,0.75)' : 'rgba(237,232,250,0.75)';
      ctx.fill();

      // Gold ring draws in
      if (t > 0.1) {
        const rt = Math.min((t-0.1)/0.9, 1);
        ctx.beginPath();
        ctx.arc(CX, CY, SIZE/2-3, -Math.PI/2, -Math.PI/2 + Math.PI*2*rt);
        ctx.strokeStyle = dark ? '#d4a843' : '#b8860b';
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }

      // Purple inner glow
      if (t > 0.5) {
        const gt = (t-0.5)/0.5;
        ctx.beginPath();
        ctx.arc(CX, CY, SIZE/2-8, 0, Math.PI*2);
        ctx.strokeStyle = `rgba(155,89,245,${gt*0.45})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Particles
      const e = easeOutBack(Math.min(t*1.1, 1));
      const settled = Math.min(t*2, 1);
      particles.forEach(function(p) {
        const px = p.x + (p.tx - p.x) * e;
        const py = p.y + (p.ty - p.y) * e;
        const r = dark ? Math.round(155 + (255-155)*settled) : Math.round(120 + (212-120)*settled);
        const g = dark ? Math.round(89  + (255-89)*settled)  : Math.round(58  + (168-58)*settled);
        const b = dark ? Math.round(245 + (255-245)*settled) : Math.round(237 + (67-237)*settled);
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI*2);
        ctx.fillStyle = `rgba(${r},${g},${b},0.96)`;
        ctx.fill();
      });
    }

    function animate() {
      t += 0.018;
      drawFrame();
      if (t < 1.05) {
        animId = requestAnimationFrame(animate);
      } else {
        t = 1; drawFrame();
        setTimeout(startNameAnimation, 120);
      }
    }

    function play() {
      if (animId) cancelAnimationFrame(animId);
      t = 0;
      buildParticles();
      resetNameLetters();
      animate();
    }

    wrap.style.cursor = 'pointer';
    wrap.addEventListener('click', play);
    setTimeout(play, 400);
  }

  /* ── Name Letter Animation ── */
  const nameEl = document.getElementById('heroName');

  function buildNameLetters() {
    if (!nameEl) return;
    let html = '<span class="name-first">';
    for (let i = 0; i < NAME_FIRST.length; i++) {
      html += `<span class="nl-letter" id="nl-${i}">${NAME_FIRST[i]}</span>`;
    }
    html += '</span><span class="name-last">';
    for (let i = 0; i < NAME_LAST.length; i++) {
      html += `<span class="nl-letter" id="nl-${NAME_FIRST.length+i}">${NAME_LAST[i]}</span>`;
    }
    html += '</span>';
    nameEl.innerHTML = html;
  }

  function resetNameLetters() {
    document.querySelectorAll('.nl-letter').forEach(function(l) {
      const angle = Math.random() * 360;
      const dist  = 120 + Math.random() * 160;
      const tx = Math.cos(angle * Math.PI/180) * dist;
      const ty = Math.sin(angle * Math.PI/180) * dist;
      const rot = (Math.random() - 0.5) * 360;
      l.style.cssText = `display:inline-block;opacity:0;transform:translate(${tx}px,${ty}px) rotate(${rot}deg) scale(0.3);filter:blur(5px);transition:none;`;
    });
  }

  function startNameAnimation() {
    document.querySelectorAll('.nl-letter').forEach(function(l, i) {
      setTimeout(function() {
        l.style.cssText = `display:inline-block;opacity:1;transform:translate(0,0) rotate(0deg) scale(1);filter:blur(0);transition:opacity 0.5s cubic-bezier(0.16,1,0.3,1) ${i*0.045}s,transform 0.5s cubic-bezier(0.16,1,0.3,1) ${i*0.045}s,filter 0.4s ease ${i*0.045}s;`;
      }, i * 45);
    });
  }

  /* ── Styles ── */
  function injectStyles() {
    const s = document.createElement('style');
    s.textContent = `
      .hero-logo { position:relative; width:130px; height:130px; margin-bottom:1.75rem; animation:fadeUp 0.4s 0.1s both; border-radius:50%; transition:transform 0.3s ease; flex-shrink:0; }
      .hero-logo:hover { transform:scale(1.06); }
      .hero-logo:active { transform:scale(0.96); }
      #logoCanvas { border-radius:50%; display:block; }
      .nl-letter { display:inline-block; opacity:0; }

      /* Shimmer on first name letters */
      .name-first .nl-letter {
        background:linear-gradient(105deg,var(--white,#f0ecff) 0%,var(--white,#f0ecff) 35%,rgba(255,255,255,0.95) 45%,#e8d5ff 50%,rgba(255,255,255,0.95) 55%,var(--white,#f0ecff) 65%,var(--white,#f0ecff) 100%);
        background-size:250% auto;
        -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
        animation:nameShimmer 4s linear infinite;
      }
      /* Gold-purple shimmer on last name */
      .name-last .nl-letter {
        background:linear-gradient(135deg,var(--gold-bright,#f0c860) 0%,var(--purple,#9b59f5) 60%,var(--gold,#d4a843) 100%);
        background-size:200% auto;
        -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
        animation:nameShimmer 5s linear infinite reverse;
      }
      [data-theme="light"] .name-first .nl-letter {
        background:linear-gradient(105deg,#1a0f35 0%,#1a0f35 35%,#7c3aed 48%,#1a0f35 60%,#1a0f35 100%);
        background-size:250% auto;
        -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
        animation:nameShimmer 4s linear infinite;
      }
      [data-theme="light"] .name-last .nl-letter {
        background:linear-gradient(135deg,#b8860b 0%,#7c3aed 60%,#d4a843 100%);
        background-size:200% auto;
        -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
        animation:nameShimmer 5s linear infinite reverse;
      }
    `;
    document.head.appendChild(s);
  }

  /* ── Init ── */
  document.addEventListener('DOMContentLoaded', function() {
    injectStyles();
    buildNameLetters();
    resetNameLetters();
    initLogoCanvas();
  });

  window.SA_replayLogo = function() {
    const w = document.getElementById('heroLogo');
    if (w) w.click();
  };

})();
