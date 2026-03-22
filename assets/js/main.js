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

    // Create nodes
    const nodes = Array.from({ length: NODE_COUNT }, function () {
      return {
        x:  Math.random() * window.innerWidth,
        y:  Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r:  Math.random() * 2 + 1.2,
        pulse: Math.random() * Math.PI * 2, // phase offset
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
      const nodeColor  = dark ? '155,89,245' : '100,30,200';
      const lineColor  = dark ? '155,89,245' : '100,30,200';
      const pulseColor = dark ? '212,168,67'  : '160,100,0';

      // Move nodes
      nodes.forEach(function(n) {
        n.x += n.vx; n.y += n.vy;
        n.pulse += 0.02;
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
            const alpha = (1 - dist/CONNECT_DIST) * (dark ? 0.15 : 0.18);
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(${lineColor},${alpha})`;
            ctx.lineWidth = 0.7;
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
        const grad = ctx.createRadialGradient(px, py, 0, px, py, 6);
        grad.addColorStop(0, `rgba(${pulseColor},${alpha})`);
        grad.addColorStop(1, `rgba(${pulseColor},0)`);
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI*2);
        ctx.fillStyle = grad;
        ctx.fill();
        // Core dot
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI*2);
        ctx.fillStyle = `rgba(${pulseColor},${alpha})`;
        ctx.fill();
      }

      // Draw nodes
      nodes.forEach(function(n) {
        const breathe = 0.4 + Math.sin(n.pulse) * 0.2;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(${nodeColor},${breathe * (dark ? 0.55 : 0.65)})`;
        ctx.fill();
        // Node glow ring
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + 2, 0, Math.PI*2);
        ctx.strokeStyle = `rgba(${nodeColor},${breathe * 0.15})`;
        ctx.lineWidth = 1;
        ctx.stroke();
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
