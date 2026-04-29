/* SCROLL3D.JS — Camera Movement + Render Loop */
(function () {
  const P3D = window.Portfolio3D;
  if (!P3D || !P3D.scene) return;
  const { scene, camera, renderer } = P3D;

  // Camera path: keyframes per section
  // Each section gets a camera position + rotation as you scroll through
  const SECTIONS = ['hero', 'about', 'experience', 'skills', 'projects', 'certifications', 'contact'];

  const cameraKeyframes = [
    { x: 0,   y: 0,    z: 18,  rx: 0,     ry: 0     }, // hero
    { x: -3,  y: 1.5,  z: 15,  rx: 0.04,  ry: 0.12  }, // about
    { x: 3,   y: -1,   z: 14,  rx: -0.03, ry: -0.10 }, // experience
    { x: -2,  y: 2,    z: 13,  rx: 0.06,  ry: 0.15  }, // skills
    { x: 2,   y: -2,   z: 14,  rx: -0.05, ry: -0.12 }, // projects
    { x: -1,  y: 1,    z: 15,  rx: 0.03,  ry: 0.08  }, // certs
    { x: 0,   y: 0,    z: 16,  rx: 0,     ry: 0     }, // contact
  ];

  let currentProgress = 0;  // 0–1 global scroll

  function lerp(a, b, t) { return a + (b - a) * t; }

  function getSectionProgress() {
    const totalH  = document.documentElement.scrollHeight - window.innerHeight;
    const scrollY = window.scrollY;
    return Math.max(0, Math.min(1, scrollY / totalH));
  }

  function getFrameAt(progress) {
    const segments = cameraKeyframes.length - 1;
    const scaled   = progress * segments;
    const idx      = Math.min(Math.floor(scaled), segments - 1);
    const t        = scaled - idx;
    const ease     = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    const a        = cameraKeyframes[idx];
    const b        = cameraKeyframes[idx + 1];
    return {
      x:  lerp(a.x,  b.x,  ease),
      y:  lerp(a.y,  b.y,  ease),
      z:  lerp(a.z,  b.z,  ease),
      rx: lerp(a.rx, b.rx, ease),
      ry: lerp(a.ry, b.ry, ease),
    };
  }

  // Depth pulse — shapes brighten as camera passes nearby
  function updateShapeDepth(progress) {
    if (!P3D.shapes) return;
    P3D.shapes.forEach((s, i) => {
      const phase   = i / P3D.shapes.length;
      const dist    = Math.abs(progress - phase);
      const bright  = Math.max(0, 1 - dist * 5);
      s.group.children.forEach(mesh => {
        if (mesh.material.wireframe) {
          mesh.material.opacity = 0.08 + bright * 0.3;
        } else {
          mesh.material.opacity = 0.5 + bright * 0.3;
        }
      });
    });
  }

  // Scroll progress bar
  const progressBar = document.getElementById('scroll-progress');

  window.addEventListener('scroll', () => {
    currentProgress = getSectionProgress();
    if (progressBar) progressBar.style.width = (currentProgress * 100) + '%';
  }, { passive: true });

  /* ── Render loop ── */
  let targetCam = { x: 0, y: 0, z: 18, rx: 0, ry: 0 };

  function render() {
    requestAnimationFrame(render);

    const frame = getFrameAt(currentProgress);

    // Smooth camera follow
    targetCam.x  += (frame.x  - targetCam.x)  * 0.04;
    targetCam.y  += (frame.y  - targetCam.y)  * 0.04;
    targetCam.z  += (frame.z  - targetCam.z)  * 0.04;
    targetCam.rx += (frame.rx - targetCam.rx) * 0.04;
    targetCam.ry += (frame.ry - targetCam.ry) * 0.04;

    camera.position.set(targetCam.x, targetCam.y, targetCam.z);
    camera.rotation.x = targetCam.rx;
    camera.rotation.y = targetCam.ry;

    // Update world objects
    if (P3D.updateWorld) P3D.updateWorld(currentProgress);
    updateShapeDepth(currentProgress);

    renderer.render(scene, camera);
  }

  // Start render after loader
  window.addEventListener('portfolioLoaded', () => {
    render();
  });

  // Also start immediately in case loader already done
  if (document.body.classList.contains('loaded')) render();

  // Fallback: start after 3.5s regardless
  setTimeout(() => {
    if (!document.body.classList.contains('loaded')) {
      document.body.classList.add('loaded');
      render();
    }
  }, 3500);
})();
