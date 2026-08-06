/* LOADER.JS — 3D Particle Intro */
(function () {
  const canvas = document.getElementById('loaderCanvas');
  const bar    = document.getElementById('loaderBar');
  const text   = document.getElementById('loaderText');
  const loader = document.getElementById('loader');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles = [], progress = 0, done = false;

  const messages = [
    'Initializing 3D Environment...',
    'Loading Neural Universe...',
    'Placing Geometric Objects...',
    'Calibrating Camera...',
    'Ready.'
  ];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  // Create converging particles
  function createParticles() {
    particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      tx: W / 2 + (Math.random() - 0.5) * 180,
      ty: H / 2 + (Math.random() - 0.5) * 60,
      size: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.6 + 0.2,
      speed: Math.random() * 0.018 + 0.006,
      t: 0,
    }));
  }

  function drawParticles(prog) {
    ctx.clearRect(0, 0, W, H);

    // Background grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.025)';
    ctx.lineWidth = 0.5;
    const spacing = 60;
    for (let x = 0; x < W; x += spacing) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += spacing) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    // Particles converging toward center
    for (const p of particles) {
      p.t = Math.min(p.t + p.speed * (prog / 100 + 0.3), 1);
      const ease = 1 - Math.pow(1 - p.t, 3);
      const cx = p.x + (p.tx - p.x) * ease;
      const cy = p.y + (p.ty - p.y) * ease;
      const alpha = p.alpha * (0.4 + 0.6 * ease);

      // Draw connection lines to nearby particles
      for (const q of particles) {
        const d = Math.hypot(cx - (q.x + (q.tx - q.x) * (1 - Math.pow(1 - q.t, 3))), cy - (q.y + (q.ty - q.y) * (1 - Math.pow(1 - q.t, 3))));
        if (d < 80 && d > 0) {
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(q.x + (q.tx - q.x) * (1 - Math.pow(1 - q.t, 3)), q.y + (q.ty - q.y) * (1 - Math.pow(1 - q.t, 3)));
          ctx.strokeStyle = `rgba(255,255,255,${0.04 * alpha})`;
          ctx.lineWidth = 0.4;
          ctx.stroke();
        }
      }

      ctx.beginPath();
      ctx.arc(cx, cy, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fill();
    }

    // Center glow grows with progress
    const glowR = 60 + prog * 1.4;
    const grd = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, glowR);
    grd.addColorStop(0, `rgba(255,255,255,${0.08 * prog/100})`);
    grd.addColorStop(1, 'transparent');
    ctx.beginPath(); ctx.arc(W/2, H/2, glowR, 0, Math.PI * 2);
    ctx.fillStyle = grd; ctx.fill();
  }

  // Animate progress
  let startTime = null;
  const DURATION = 2800;

  function animate(ts) {
    if (!startTime) startTime = ts;
    const elapsed = ts - startTime;
    progress = Math.min((elapsed / DURATION) * 100, 100);

    // Update bar
    bar.style.width = progress + '%';

    // Update message
    const idx = Math.min(Math.floor(progress / 22), messages.length - 1);
    text.textContent = messages[idx];

    drawParticles(progress);

    if (progress < 100) {
      requestAnimationFrame(animate);
    } else {
      // Fade out loader
      setTimeout(() => {
        loader.classList.add('hidden');
        // Trigger site reveal
        document.body.classList.add('loaded');
        window.dispatchEvent(new Event('portfolioLoaded'));
      }, 400);
    }
  }

  window.addEventListener('resize', () => { resize(); createParticles(); }, { passive: true });
  resize();
  createParticles();
  requestAnimationFrame(animate);
})();
