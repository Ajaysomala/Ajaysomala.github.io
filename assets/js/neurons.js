/* NEURONS.JS — White Neural Network Background */
(function () {
  const canvas = document.getElementById('neuronCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const isMobile = window.innerWidth < 768;
  const NODE_COUNT   = isMobile ? 50 : 100;
  const CONNECT_DIST = isMobile ? 110 : 155;
  const MOUSE_DIST   = 175;
  const SPEED        = 0.25;
  let W, H, nodes, mouse = { x: -9999, y: -9999 };

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createNodes() {
    nodes = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * SPEED,
      vy: (Math.random() - 0.5) * SPEED,
      r: Math.random() * 1.5 + 0.5,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (const n of nodes) {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
      const d = Math.hypot(mouse.x - n.x, mouse.y - n.y);
      if (d < MOUSE_DIST) {
        const f = (MOUSE_DIST - d) / MOUSE_DIST * 0.007;
        n.vx += (mouse.x - n.x) * f * 0.5;
        n.vy += (mouse.y - n.y) * f * 0.5;
        const sp = Math.hypot(n.vx, n.vy);
        if (sp > SPEED * 2.8) { n.vx = n.vx / sp * SPEED * 2.8; n.vy = n.vy / sp * SPEED * 2.8; }
      }
    }

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < CONNECT_DIST) {
          const near = Math.min(Math.hypot(mouse.x-a.x,mouse.y-a.y), Math.hypot(mouse.x-b.x,mouse.y-b.y)) < MOUSE_DIST;
          const alpha = (near ? 0.2 : 0.065) * (1 - d / CONNECT_DIST);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
          ctx.lineWidth = near ? 0.75 : 0.45;
          ctx.stroke();
        }
      }
    }

    for (const n of nodes) {
      const md     = Math.hypot(mouse.x - n.x, mouse.y - n.y);
      const bright = md < MOUSE_DIST ? 0.75 + 0.25*(1 - md/MOUSE_DIST) : 0.22;
      const rad    = md < MOUSE_DIST ? n.r*(1 + 0.7*(1 - md/MOUSE_DIST)) : n.r;
      ctx.beginPath();
      ctx.arc(n.x, n.y, rad, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${bright})`;
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); createNodes(); }, { passive: true });
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
  window.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });
  resize(); createNodes(); draw();
})();
