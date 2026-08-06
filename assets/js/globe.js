/* GLOBE.JS — Interactive 2D tech stack globe */
(function () {
  const canvas = document.getElementById("techGlobe");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const size = 360;
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  ctx.scale(dpr, dpr);

  const labels = [
    "Python", "TensorFlow", "FastAPI", "RAG", "FAISS",
    "LangChain", "Flask", "SQL", "CNN", "LSTM",
    "Docker", "NLP", "Pandas", "Scikit", "Keras",
  ];

  const nodes = labels.map((label, i) => {
    const phi = Math.acos(-1 + (2 * i) / labels.length);
    const theta = Math.sqrt(labels.length * Math.PI) * phi;
    return {
      label,
      x: Math.cos(theta) * Math.sin(phi),
      y: Math.sin(theta) * Math.sin(phi),
      z: Math.cos(phi),
    };
  });

  let rotY = 0.15;
  let rotX = 0.25;
  let drag = false;
  let lastX = 0;
  let lastY = 0;
  let auto = true;

  function project(n) {
    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);
    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);
    let x = n.x;
    let y = n.y;
    let z = n.z;
    let x1 = x * cosY - z * sinY;
    let z1 = z * cosY + x * sinY;
    let y1 = y * cosX - z1 * sinX;
    z = z1 * cosX + y * sinX;
    const scale = 120;
    return {
      x: size / 2 + x1 * scale,
      y: size / 2 + y1 * scale,
      z,
      alpha: (z + 1) / 2,
    };
  }

  function draw() {
    ctx.clearRect(0, 0, size, size);

    /* Orbital rings */
    ctx.strokeStyle = "rgba(0,212,170,0.15)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(size / 2, size / 2, 128, 48, -0.4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(size / 2, size / 2, 110, 110, 0, 0, Math.PI * 2);
    ctx.stroke();

    const projected = nodes.map((n) => ({ n, p: project(n) }));
    projected.sort((a, b) => a.p.z - b.p.z);

    /* Links */
    for (let i = 0; i < projected.length; i++) {
      for (let j = i + 1; j < projected.length; j++) {
        const a = projected[i].p;
        const b = projected[j].p;
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        if (dx * dx + dy * dy < 9000 && a.z > -0.2 && b.z > -0.2) {
          ctx.strokeStyle = `rgba(0,212,170,${0.08 * Math.min(a.alpha, b.alpha)})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    projected.forEach(({ n, p }) => {
      const r = 2.2 + p.alpha * 2.2;
      ctx.fillStyle = `rgba(0,212,170,${0.35 + p.alpha * 0.55})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fill();
      if (p.alpha > 0.45) {
        ctx.font = `${10 + p.alpha * 3}px "IBM Plex Mono", monospace`;
        ctx.fillStyle = `rgba(232,230,227,${0.35 + p.alpha * 0.55})`;
        ctx.textAlign = "center";
        ctx.fillText(n.label, p.x, p.y - 8);
      }
    });

    if (auto && !drag) rotY += 0.004;
    requestAnimationFrame(draw);
  }

  canvas.addEventListener("pointerdown", (e) => {
    drag = true;
    auto = false;
    lastX = e.clientX;
    lastY = e.clientY;
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!drag) return;
    rotY += (e.clientX - lastX) * 0.005;
    rotX += (e.clientY - lastY) * 0.005;
    rotX = Math.max(-1, Math.min(1, rotX));
    lastX = e.clientX;
    lastY = e.clientY;
  });
  canvas.addEventListener("pointerup", () => {
    drag = false;
    setTimeout(() => { auto = true; }, 1800);
  });

  draw();
})();
