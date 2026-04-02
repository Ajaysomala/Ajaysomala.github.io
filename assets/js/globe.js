/* ═══════════════════════════════════════════════════
   GLOBE.JS — Rotating 3D Tech Stack Globe
   Skills orbit as labeled nodes on a wireframe sphere
   (Replaces old particle sphere — NO particles here)
═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  const canvas = document.getElementById('techGlobe');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // ── Tech skills to show on globe ──
  const skills = [
    { label: 'Python',      emoji: '🐍', color: '#9b59f5' },
    { label: 'TensorFlow',  emoji: '🧠', color: '#d4a843' },
    { label: 'Flask',       emoji: '⚗️',  color: '#9b59f5' },
    { label: 'OpenCV',      emoji: '👁',  color: '#d4a843' },
    { label: 'Pandas',      emoji: '🐼', color: '#9b59f5' },
    { label: 'Docker',      emoji: '🐳', color: '#2496ed' },
    { label: 'Git',         emoji: '🔀', color: '#f34f29' },
    { label: 'SQL',         emoji: '🗄️',  color: '#d4a843' },
    { label: 'NLP',         emoji: '💬', color: '#9b59f5' },
    { label: 'Keras',       emoji: '🔴', color: '#d4a843' },
    { label: 'NumPy',       emoji: '🔢', color: '#4dabcf' },
    { label: 'GenAI',       emoji: '✨', color: '#9b59f5' },
    { label: 'Scikit',      emoji: '📊', color: '#f89939' },
    { label: 'Django',      emoji: '🟩', color: '#092e20' },
    { label: 'REST API',    emoji: '🔗', color: '#d4a843' },
    { label: 'MediaPipe',   emoji: '🤲', color: '#9b59f5' },
  ];

  // ── Canvas sizing — bigger for impact ──
  const isMob = window.innerWidth < 768;
  const SIZE = isMob ? 300 : 480;
  const DPR  = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width  = SIZE * DPR;
  canvas.height = SIZE * DPR;
  canvas.style.width  = SIZE + 'px';
  canvas.style.height = SIZE + 'px';
  ctx.scale(DPR, DPR);

  const CX = SIZE / 2;
  const CY = SIZE / 2;
  const R  = SIZE * 0.38; // bigger sphere radius

  // ── Distribute skills on sphere surface (Fibonacci lattice) ──
  const nodes = skills.map(function (skill, i) {
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const theta = Math.acos(1 - 2 * (i + 0.5) / skills.length);
    const phi   = 2 * Math.PI * i / goldenRatio;
    return {
      x: Math.sin(theta) * Math.cos(phi),
      y: Math.sin(theta) * Math.sin(phi),
      z: Math.cos(theta),
      label: skill.label,
      emoji: skill.emoji,
      color: skill.color,
    };
  });

  // ── Draw wireframe lines between nearby nodes ──
  function drawWireframe(rotated) {
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const lineColor = isDark ? 'rgba(155,89,245,0.06)' : 'rgba(124,58,237,0.06)';

    for (let i = 0; i < rotated.length; i++) {
      for (let j = i + 1; j < rotated.length; j++) {
        const dx = rotated[i].rx - rotated[j].rx;
        const dy = rotated[i].ry - rotated[j].ry;
        const dz = rotated[i].rz - rotated[j].rz;
        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);

        if (dist < 1.1) {
          const sca = 600 / (600 + rotated[i].rz * R + 300);
          const scb = 600 / (600 + rotated[j].rz * R + 300);
          const ax  = CX + rotated[i].rx * R * sca;
          const ay  = CY + rotated[i].ry * R * sca;
          const bx  = CX + rotated[j].rx * R * scb;
          const by  = CY + rotated[j].ry * R * scb;
          const alpha = Math.min(sca, scb) * 0.3;

          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(bx, by);
          ctx.strokeStyle = lineColor;
          ctx.lineWidth   = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  // ── Rotation state ──
  let angleY  = 0;
  let angleX  = 0.25; // slight tilt
  let targetY = 0;
  let isDragging = false;
  let lastMouseX = 0;

  // Allow user to drag-rotate the globe
  canvas.addEventListener('mousedown', function (e) {
    isDragging = true;
    lastMouseX = e.clientX;
    canvas.style.cursor = 'grabbing';
  });
  document.addEventListener('mouseup', function () {
    isDragging = false;
    canvas.style.cursor = 'default';
  });
  document.addEventListener('mousemove', function (e) {
    if (!isDragging) return;
    const dx = e.clientX - lastMouseX;
    angleY += dx * 0.005;
    lastMouseX = e.clientX;
  });

  // Touch drag
  canvas.addEventListener('touchstart', function (e) {
    lastMouseX = e.touches[0].clientX;
  }, { passive: true });
  canvas.addEventListener('touchmove', function (e) {
    const dx = e.touches[0].clientX - lastMouseX;
    angleY += dx * 0.005;
    lastMouseX = e.touches[0].clientX;
  }, { passive: true });

  // ── Main render loop ──
  function render() {
    requestAnimationFrame(render);
    ctx.clearRect(0, 0, SIZE, SIZE);

    // Auto-rotate when not dragging
    if (!isDragging) angleY += 0.004;

    const cosY = Math.cos(angleY), sinY = Math.sin(angleY);
    const cosX = Math.cos(angleX), sinX = Math.sin(angleX);

    // Project 3D → 2D with simple perspective
    const rotated = nodes.map(function (n) {
      // Rotate around Y
      const rx1 = n.x * cosY - n.z * sinY;
      const rz1 = n.x * sinY + n.z * cosY;
      // Rotate around X
      const ry1 = n.y * cosX - rz1 * sinX;
      const rz2 = n.y * sinX + rz1 * cosX;
      return { rx: rx1, ry: ry1, rz: rz2, label: n.label, emoji: n.emoji, color: n.color };
    });

    // Draw wireframe first (below nodes)
    drawWireframe(rotated);

    // Sort by z (back-to-front painter's algorithm)
    rotated.sort(function (a, b) { return a.rz - b.rz; });

    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';

    rotated.forEach(function (n) {
      const fov  = 600;
      const sc   = fov / (fov + n.rz * R + 300);
      const px   = CX + n.rx * R * sc;
      const py   = CY + n.ry * R * sc;

      // Depth-based opacity (front = opaque, back = faint)
      const depth   = (n.rz + 1) / 2; // 0–1, 1=front
      const opacity = 0.25 + depth * 0.75;

      // Skip if too far back
      if (opacity < 0.3) return;

      const dotR = sc * 4;

      // ── Draw dot ──
      ctx.beginPath();
      ctx.arc(px, py, dotR, 0, Math.PI * 2);
      ctx.fillStyle = n.color + Math.round(opacity * 255).toString(16).padStart(2,'0');
      ctx.fill();

      // ── Draw label (only front-facing nodes) ──
      if (depth > 0.55) {
        const labelOpacity = (depth - 0.55) / 0.45;
        const fontSize     = Math.round(9 + sc * 3);

        ctx.font      = `500 ${fontSize}px 'JetBrains Mono', monospace`;
        ctx.textAlign = 'center';

        // Background pill
        const textWidth = ctx.measureText(n.label).width;
        const pillW     = textWidth + 10;
        const pillH     = fontSize + 5;
        const pillX     = px - pillW / 2;
        const pillY     = py + dotR + 4;

        ctx.fillStyle   = isDark
          ? `rgba(19,14,28,${labelOpacity * 0.85})`
          : `rgba(250,248,255,${labelOpacity * 0.85})`;
        ctx.beginPath();
        ctx.roundRect(pillX, pillY, pillW, pillH, 3);
        ctx.fill();

        // Label text
        ctx.fillStyle = isDark
          ? `rgba(240,236,255,${labelOpacity})`
          : `rgba(26,15,53,${labelOpacity})`;
        ctx.fillText(n.label, px, pillY + pillH - 5);
      }
    });
  }

  render();
})();
