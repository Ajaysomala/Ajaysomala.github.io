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

  // ── AI Neural Network Background ──
  // Nodes connect with synaptic pulses — CNN/neural net vibe
  (function neuralNet() {
    const canvas = document.createElement('canvas');
    canvas.id    = 'bg-neural';
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:1;pointer-events:none;opacity:1;';
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
    const NODE_COUNT = isMobile ? 35 : 70;
    const CONNECT_DIST = isMobile ? 130 : 160;

    function isDark() {
      return document.documentElement.getAttribute('data-theme') !== 'light';
    }

    // Star color palettes
    const DARK_COLORS  = ['255,255,255','180,220,255','200,235,255','240,248,255','150,200,255','210,225,255'];
    const LIGHT_COLORS = ['100,80,190','70,110,210','90,130,235','55,90,195','130,90,210','80,140,230'];

    function getNodeColor() {
      const palette = document.documentElement.getAttribute('data-theme') !== 'light'
        ? DARK_COLORS : LIGHT_COLORS;
      return palette[Math.floor(Math.random() * palette.length)];
    }

    // Create nodes — each is a unique star
    const nodes = Array.from({ length: NODE_COUNT }, function () {
      return {
        x:  Math.random() * window.innerWidth,
        y:  Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r:  Math.random() * 1.8 + 0.8,
        pulse: Math.random() * Math.PI * 2,
        color: getNodeColor(),
        twinkleSpeed: 0.015 + Math.random() * 0.02,
      };
    });

    // Synaptic pulses travelling along edges
    const pulses = [];
    function spawnPulse() {
      // Pick two connected nodes
      for (let attempt = 0; attempt < 10; attempt++) {
        const a = Math.floor(Math.random() * nodes.length);
        const b = Math.floor(Math.random() * nodes.length);
        if (a === b) continue;
        const dx = nodes[a].x - nodes[b].x;
        const dy = nodes[a].y - nodes[b].y;
        if (Math.sqrt(dx*dx+dy*dy) < CONNECT_DIST) {
          pulses.push({ a, b, t: 0, speed: 0.008 + Math.random()*0.012 });
          break;
        }
      }
    }

    let pulseTimer = 0;

    function frame(now) {
      requestAnimationFrame(frame);
      ctx.clearRect(0, 0, W, H);

      const dark = isDark();
      // Deep Space palette — stars, ice blue, silver white
      // Works on both dark (space) and light (constellation) themes
      const nodeColors = dark
        ? ['255,255,255', '180,220,255', '200,230,255', '240,248,255', '150,200,255']
        : ['120,100,200', '80,120,220',  '100,140,240', '60,100,200',  '140,100,220'];
      const nodeColor  = nodeColors[Math.floor(Math.random() * nodeColors.length)];
      const lineColor  = dark ? '180,220,255' : '100,130,220';
      const pulseColor = dark ? '220,240,255'  : '180,200,255';

      // Move nodes
      nodes.forEach(function(n) {
        n.x += n.vx; n.y += n.vy;
        n.pulse += n.twinkleSpeed || 0.02;
        if (n.x < 0) n.x = W; if (n.x > W) n.x = 0;
        if (n.y < 0) n.y = H; if (n.y > H) n.y = 0;
      });

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist/CONNECT_DIST) * (dark ? 0.18 : 0.22);
            const lCol = dark ? '180,215,255' : '100,120,220';
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(${lCol},${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // Draw synaptic pulses
      pulseTimer++;
      if (pulseTimer % 18 === 0 && pulses.length < 12) spawnPulse();

      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.t += p.speed;
        if (p.t >= 1) { pulses.splice(i,1); continue; }
        const na = nodes[p.a], nb = nodes[p.b];
        const px = na.x + (nb.x - na.x) * p.t;
        const py = na.y + (nb.y - na.y) * p.t;
        const alpha = Math.sin(p.t * Math.PI) * (dark ? 0.85 : 0.9);
        // Glow effect
        // Ice blue shooting star pulse
        const pCol = dark ? '200,235,255' : '150,180,255';
        const grad = ctx.createRadialGradient(px, py, 0, px, py, 8);
        grad.addColorStop(0, `rgba(${pCol},${alpha})`);
        grad.addColorStop(0.4, `rgba(${pCol},${alpha * 0.5})`);
        grad.addColorStop(1, `rgba(${pCol},0)`);
        ctx.beginPath();
        ctx.arc(px, py, 8, 0, Math.PI*2);
        ctx.fillStyle = grad;
        ctx.fill();
        // Bright core
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI*2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
      }

      // Draw nodes — each with its own star color
      nodes.forEach(function(n) {
        const breathe = 0.4 + Math.sin(n.pulse) * 0.2;
        const col = n.color;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(${col},${breathe * (dark ? 0.75 : 0.7)})`;
        ctx.fill();
        // Star glow ring
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 4);
        grad.addColorStop(0, `rgba(${col},${breathe * (dark ? 0.3 : 0.2)})`);
        grad.addColorStop(1, `rgba(${col},0)`);
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 4, 0, Math.PI*2);
        ctx.fillStyle = grad;
        ctx.fill();
      });
    }

    requestAnimationFrame(frame);
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
