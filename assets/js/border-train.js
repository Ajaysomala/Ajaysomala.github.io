/* ═══════════════════════════════════════════════════
   BORDER-TRAIN.JS
   1. Skills Section — colored light train flows around
      the section border cycling through all tech colors
   2. Experience Cards — when card enters view, tech
      skill labels appear one by one along the card
      border like a train stopping at stations
   Somala Ajay Portfolio
═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ══════════════════════════════════
     PART 1 — SKILLS SECTION BORDER TRAIN
     A glowing colored light races around
     the skills section border, cycling
     through all tech category colors
  ══════════════════════════════════ */

  const TRAIN_COLORS = [
    '#9b59f5', // purple  — Programming
    '#d4a843', // gold    — Backend
    '#60a5fa', // blue    — Data Science
    '#f472b6', // pink    — ML/AI
    '#34d399', // green   — GenAI
    '#fb923c', // orange  — Tools
  ];

  function initSkillsBorderTrain() {
    const section = document.getElementById('skills');
    if (!section) return;

    // Create canvas overlay on the section
    const canvas = document.createElement('canvas');
    canvas.id = 'skillsBorderCanvas';
    canvas.style.cssText = `
      position:absolute; inset:0; width:100%; height:100%;
      pointer-events:none; z-index:0; border-radius:0;
    `;
    section.style.position = 'relative';
    section.style.overflow = 'hidden';
    section.insertBefore(canvas, section.firstChild);

    const ctx = canvas.getContext('2d');
    let W, H, animId;
    let trainPos   = 0;   // 0 → 1 along perimeter
    let colorIndex = 0;
    let colorT     = 0;   // 0→1 transition between colors

    function resize() {
      W = canvas.width  = section.offsetWidth;
      H = canvas.height = section.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    function hexToRgb(hex) {
      const r = parseInt(hex.slice(1,3),16);
      const g = parseInt(hex.slice(3,5),16);
      const b = parseInt(hex.slice(5,7),16);
      return [r, g, b];
    }

    function lerpColor(a, b, t) {
      const ra = hexToRgb(a), rb = hexToRgb(b);
      return [
        Math.round(ra[0] + (rb[0]-ra[0])*t),
        Math.round(ra[1] + (rb[1]-ra[1])*t),
        Math.round(ra[2] + (rb[2]-ra[2])*t),
      ];
    }

    // Perimeter path: top→right→bottom→left
    function perimeterPoint(t, w, h) {
      const perim = 2*(w+h);
      const d = t * perim;
      if (d < w)       return { x: d,       y: 0 };           // top
      if (d < w+h)     return { x: w,        y: d-w };        // right
      if (d < 2*w+h)   return { x: w-(d-w-h), y: h };         // bottom
                       return { x: 0,        y: h-(d-2*w-h) }; // left
    }

    const TRAIN_LENGTH  = 0.08;  // fraction of perimeter
    const TRAIN_SPEED   = 0.0018;
    const COLOR_CHANGE  = 1 / TRAIN_COLORS.length; // fraction per color

    function drawFrame() {
      ctx.clearRect(0, 0, W, H);

      // Advance train
      trainPos  = (trainPos + TRAIN_SPEED) % 1;
      colorT    = (colorT   + TRAIN_SPEED * 0.6) % 1;
      colorIndex = Math.floor(colorT * TRAIN_COLORS.length);
      const nextColorIndex = (colorIndex + 1) % TRAIN_COLORS.length;
      const localT = (colorT * TRAIN_COLORS.length) % 1;
      const [r,g,b] = lerpColor(
        TRAIN_COLORS[colorIndex],
        TRAIN_COLORS[nextColorIndex],
        localT
      );
      const trainColor = `rgb(${r},${g},${b})`;

      // Draw glowing train along border
      const steps = 60;
      for (let i = 0; i < steps; i++) {
        const frac  = i / steps;
        const pos   = (trainPos - frac * TRAIN_LENGTH + 1) % 1;
        const pt    = perimeterPoint(pos, W, H);
        const alpha = (1 - frac) * 0.85; // fade tail
        const size  = (1 - frac) * 4 + 1;

        // Outer glow
        const grd = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, size * 3);
        grd.addColorStop(0, `rgba(${r},${g},${b},${alpha * 0.5})`);
        grd.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, size * 3, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.fill();
      }

      // Draw faint border line
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      ctx.strokeStyle = isDark
        ? `rgba(${r},${g},${b},0.12)`
        : `rgba(${r},${g},${b},0.15)`;
      ctx.lineWidth = 1;
      ctx.strokeRect(1, 1, W-2, H-2);

      animId = requestAnimationFrame(drawFrame);
    }

    drawFrame();
  }

  /* ══════════════════════════════════
     PART 2 — EXPERIENCE CARD BORDER TRAIN
     When each card enters view, its tech
     skills appear one by one as glowing
     tags along the card border — like a
     train stopping at stations
  ══════════════════════════════════ */

  const EXP_SKILLS = [
    {
      selector: '.timeline-item:nth-child(1) .timeline-card',
      color: '#d4a843',
      skills: ['SQL', 'Data Ops', '98% Accuracy', 'ETL', 'SLA', 'Validation', 'Pipelines'],
    },
    {
      selector: '.timeline-item:nth-child(2) .timeline-card',
      color: '#9b59f5',
      skills: ['Python', 'TensorFlow', 'Flask', 'NLP', 'OpenCV', 'Pandas', '31 Projects', 'GenAI'],
    },
  ];

  function createBorderCanvas(card) {
    const c = document.createElement('canvas');
    c.style.cssText = `
      position:absolute; inset:0; width:100%; height:100%;
      pointer-events:none; z-index:0; border-radius:12px;
    `;
    card.style.position = 'relative';
    card.style.overflow = 'hidden';
    card.insertBefore(c, card.firstChild);
    return c;
  }

  function animateCardBorder(card, color, skills) {
    const canvas = createBorderCanvas(card);
    const ctx    = canvas.getContext('2d');
    let W = canvas.width  = card.offsetWidth;
    let H = canvas.height = card.offsetHeight;

    window.addEventListener('resize', function() {
      W = canvas.width  = card.offsetWidth;
      H = canvas.height = card.offsetHeight;
    }, { passive: true });

    const hexToRgb = function(hex) {
      return [
        parseInt(hex.slice(1,3),16),
        parseInt(hex.slice(3,5),16),
        parseInt(hex.slice(5,7),16),
      ];
    };

    const [cr, cg, cb] = hexToRgb(color);

    // Stations: evenly spaced around the perimeter
    function perimPoint(t) {
      const perim = 2*(W+H);
      const d = t * perim;
      if (d < W)       return { x: d,        y: 0 };
      if (d < W+H)     return { x: W,         y: d-W };
      if (d < 2*W+H)   return { x: W-(d-W-H), y: H };
                       return { x: 0,         y: H-(d-2*W-H) };
    }

    // Spread skills evenly around perimeter
    const stations = skills.map(function(skill, i) {
      return {
        t:     i / skills.length,
        label: skill,
        visible: false,
        alpha: 0,
      };
    });

    // Train state
    let trainT    = 0;
    let stoppedAt = -1;
    let stopTimer = 0;
    const SPEED   = 0.006;
    const STOP_DURATION = 28; // frames to pause at each station
    let animId;
    let done = false;

    function drawFrame() {
      ctx.clearRect(0, 0, W, H);
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';

      // Draw border line
      ctx.strokeStyle = `rgba(${cr},${cg},${cb},0.25)`;
      ctx.lineWidth   = 1.5;
      ctx.beginPath();
      ctx.roundRect(1, 1, W-2, H-2, 12);
      ctx.stroke();

      // Check if train is near a station
      const nextStation = stations.find(function(s, i) {
        return !s.visible && i === stoppedAt + 1;
      });

      if (nextStation && stopTimer === 0) {
        const dist = Math.abs(trainT - nextStation.t);
        const wrappedDist = Math.min(dist, 1 - dist);
        if (wrappedDist < 0.015) {
          // Stop at station
          trainT    = nextStation.t;
          stopTimer = STOP_DURATION;
          stoppedAt++;
          nextStation.visible = true;
        }
      }

      if (stopTimer > 0) {
        stopTimer--;
        // Fade in the newly visible station label
        const cur = stations[stoppedAt];
        if (cur && cur.alpha < 1) cur.alpha = Math.min(cur.alpha + 0.07, 1);
      } else if (!done) {
        trainT = (trainT + SPEED) % 1;
        // Check if all stations done
        if (stoppedAt >= stations.length - 1 && trainT > stations[stations.length-1].t + 0.05) {
          done = true;
        }
      }

      // Draw visited station labels along border
      stations.forEach(function(s) {
        if (!s.visible && s.alpha <= 0) return;
        const pt = perimPoint(s.t);
        const alpha = s.alpha;

        const fs   = isDark ? 8.5 : 8;
        ctx.font   = `600 ${fs}px 'JetBrains Mono', monospace`;
        const tw   = ctx.measureText(s.label).width;
        const pw   = tw + 10, ph = 14;

        // Position pill just inside the border
        let px = pt.x, py = pt.y;
        const perim = 2*(W+H), d = s.t * perim;
        if (d < W)           { py += 5;  px -= pw/2; }       // top
        else if (d < W+H)    { px -= pw + 5; py -= ph/2; }   // right
        else if (d < 2*W+H)  { py -= ph + 5; px -= pw/2; }   // bottom
        else                 { px += 5;  py -= ph/2; }        // left

        // Pill background
        ctx.fillStyle = isDark
          ? `rgba(15,10,28,${alpha * 0.88})`
          : `rgba(245,240,255,${alpha * 0.88})`;
        ctx.beginPath();
        ctx.roundRect(px, py, pw, ph, 4);
        ctx.fill();

        // Pill border
        ctx.strokeStyle = `rgba(${cr},${cg},${cb},${alpha * 0.7})`;
        ctx.lineWidth   = 1;
        ctx.stroke();

        // Label text
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${alpha})`;
        ctx.textAlign  = 'left';
        ctx.fillText(s.label, px + 5, py + ph - 3.5);
      });

      // Draw train head
      if (!done) {
        const pt = perimPoint(trainT);

        // Glow
        const grd = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, 12);
        grd.addColorStop(0, `rgba(${cr},${cg},${cb},0.9)`);
        grd.addColorStop(0.4, `rgba(${cr},${cg},${cb},0.4)`);
        grd.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 12, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // White core
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,0.95)`;
        ctx.fill();

        // Color ring
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 5.5, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${cr},${cg},${cb},0.9)`;
        ctx.lineWidth   = 1.5;
        ctx.stroke();

        // Trail
        for (let i = 1; i <= 10; i++) {
          const tPrev = (trainT - i * 0.003 + 1) % 1;
          const pPrev = perimPoint(tPrev);
          const ta = (1 - i/10) * 0.5;
          ctx.beginPath();
          ctx.arc(pPrev.x, pPrev.y, 2 - i*0.1, 0, Math.PI*2);
          ctx.fillStyle = `rgba(${cr},${cg},${cb},${ta})`;
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(drawFrame);
    }

    drawFrame();
  }

  function initExpCardTrains() {
    EXP_SKILLS.forEach(function(exp) {
      const card = document.querySelector(exp.selector);
      if (!card) return;

      let started = false;
      const obs = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting && !started) {
            started = true;
            // Small delay so card is fully visible first
            setTimeout(function() {
              animateCardBorder(card, exp.color, exp.skills);
            }, 400);
            obs.unobserve(card);
          }
        });
      }, { threshold: 0.4 });

      obs.observe(card);
    });
  }

  /* ── Init ── */
  document.addEventListener('DOMContentLoaded', function() {
    // Small delay to let page fully render
    setTimeout(function() {
      initSkillsBorderTrain();
      initExpCardTrains();
    }, 600);
  });

})();
