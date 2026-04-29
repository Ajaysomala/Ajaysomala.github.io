/* GLOBE.JS — 3D Tech Globe */
(function () {
  const canvas = document.getElementById('techGlobe');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const SIZE = canvas.width;
  const R = SIZE * 0.42;
  const cx = SIZE / 2, cy = SIZE / 2;

  const techs = [
    'Python','TensorFlow','Flask','OpenCV','Pandas','NumPy',
    'Keras','Scikit-learn','Docker','MySQL','NLP','GenAI',
    'FastAPI','FAISS','RAG','PyTorch','MongoDB','AWS',
    'Git','Streamlit','LSTM','CNN','ETL','Bash',
  ];

  function fibonacci(n) {
    const pts = [], golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < n; i++) {
      const y = 1 - (i/(n-1))*2, r = Math.sqrt(1-y*y), theta = golden*i;
      pts.push({ x: Math.cos(theta)*r, y, z: Math.sin(theta)*r, label: techs[i % techs.length] });
    }
    return pts;
  }

  const points = fibonacci(48);
  let rotY = 0, rotX = 0.25, dragging = false, lastX = 0, lastY = 0;

  canvas.addEventListener('mousedown', e => { dragging=true; lastX=e.clientX; lastY=e.clientY; });
  window.addEventListener('mouseup', () => { dragging=false; });
  window.addEventListener('mousemove', e => {
    if (!dragging) return;
    rotY += (e.clientX - lastX)*0.008; rotX += (e.clientY - lastY)*0.005;
    lastX=e.clientX; lastY=e.clientY;
  });
  canvas.addEventListener('touchstart', e => { dragging=true; lastX=e.touches[0].clientX; lastY=e.touches[0].clientY; }, { passive:true });
  window.addEventListener('touchend', () => { dragging=false; });
  window.addEventListener('touchmove', e => {
    if(!dragging) return;
    rotY += (e.touches[0].clientX-lastX)*0.008; rotX += (e.touches[0].clientY-lastY)*0.005;
    lastX=e.touches[0].clientX; lastY=e.touches[0].clientY;
  }, { passive:true });

  function rotate(p) {
    let x = p.x*Math.cos(rotY) - p.z*Math.sin(rotY);
    let z = p.x*Math.sin(rotY) + p.z*Math.cos(rotY);
    let y2 = p.y*Math.cos(rotX) - z*Math.sin(rotX);
    let z2 = p.y*Math.sin(rotX) + z*Math.cos(rotX);
    return { x, y:y2, z:z2, label:p.label };
  }

  function draw() {
    ctx.clearRect(0, 0, SIZE, SIZE);

    /* Globe wireframe */
    ctx.beginPath(); ctx.arc(cx,cy,R,0,Math.PI*2);
    ctx.strokeStyle='rgba(255,255,255,0.07)'; ctx.lineWidth=1; ctx.stroke();

    /* Latitude lines */
    for (let i=1;i<5;i++) {
      const lat = (i/5)*Math.PI - Math.PI/2;
      const ry = R*Math.cos(lat+rotX);
      const y  = cy + R*Math.sin(lat+rotX);
      if (Math.abs(ry) < 4) continue;
      ctx.beginPath(); ctx.ellipse(cx,y,Math.abs(ry),Math.abs(ry)*0.18,0,0,Math.PI*2);
      ctx.strokeStyle='rgba(255,255,255,0.05)'; ctx.lineWidth=0.6; ctx.stroke();
    }
    /* Longitude lines */
    for (let i=0;i<6;i++) {
      const lon = (i/6)*Math.PI*2 + rotY;
      ctx.beginPath(); ctx.ellipse(cx,cy,Math.abs(Math.sin(lon))*R,R,0,0,Math.PI*2);
      ctx.strokeStyle='rgba(255,255,255,0.05)'; ctx.lineWidth=0.6; ctx.stroke();
    }

    const projected = points.map(p => {
      const r = rotate(p);
      const scale = (r.z + 1.6) / 2.6;
      return { sx:cx+r.x*R, sy:cy+r.y*R, z:r.z, scale, label:r.label };
    }).sort((a,b) => a.z - b.z);

    for (const p of projected) {
      const front = p.z > -0.2;
      const alpha = front ? Math.min(0.9, 0.4 + 0.5*p.scale) : 0.1;
      const rad   = front ? Math.max(2.5, 3.5*p.scale) : 1.5;

      /* Dot */
      ctx.beginPath(); ctx.arc(p.sx,p.sy,rad,0,Math.PI*2);
      ctx.fillStyle = `rgba(255,255,255,${alpha})`; ctx.fill();

      /* Glow ring on front dots */
      if (front && p.scale > 0.7) {
        ctx.beginPath(); ctx.arc(p.sx,p.sy,rad*2.2,0,Math.PI*2);
        ctx.fillStyle = `rgba(255,255,255,${0.04*p.scale})`; ctx.fill();
      }

      /* Label — only front-facing, readable size */
      if (front && p.scale > 0.6) {
        const fs = Math.round(Math.min(12, 8 + 5*p.scale));
        ctx.font = `${fs}px 'JetBrains Mono', monospace`;
        ctx.fillStyle = `rgba(255,255,255,${Math.min(0.85, alpha*0.8)})`;
        ctx.textAlign = 'center';
        ctx.fillText(p.label, p.sx, p.sy - rad - 5);
      }
    }

    if (!dragging) rotY += 0.004;
    requestAnimationFrame(draw);
  }
  draw();
})();
