/* SCROLL3D.JS — Scroll drives forward, chase camera, reveal sections */
(function () {
  const P3D = window.Portfolio3D;
  if (!P3D || !P3D.scene) return;
  const { camera, renderer } = P3D;

  let currentProgress = 0;
  let rendering = false;
  let last = performance.now();

  const progressBar = document.getElementById("scroll-progress");
  const sections = [
    "hero",
    "about",
    "experience",
    "skills",
    "projects",
    "certifications",
    "contact",
  ];

  function getProgress() {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    if (total <= 0) return 0;
    return Math.max(0, Math.min(1, window.scrollY / total));
  }

  function revealSections(progress) {
    const idx = progress * (sections.length - 0.01);
    sections.forEach((id, i) => {
      const el = document.getElementById(id);
      if (!el) return;
      const dist = Math.abs(idx - i);
      const active = dist < 0.85;
      el.classList.toggle("is-active-zone", dist < 0.55);
      el.classList.toggle("is-near-zone", active);
      /* Soft opacity for non-hero zones based on proximity */
      if (id === "hero") {
        el.style.opacity = progress < 0.12 ? "1" : String(Math.max(0.15, 1 - progress * 4));
      }
    });
  }

  window.addEventListener(
    "scroll",
    () => {
      currentProgress = getProgress();
      if (progressBar) progressBar.style.width = currentProgress * 100 + "%";
      revealSections(currentProgress);
    },
    { passive: true }
  );

  function chaseCamera(car, dt) {
    if (!car) return;
    const steer = (P3D.driveState && P3D.driveState.steer) || 0;

    const ideal = {
      x: car.position.x * 0.55 - steer * 1.5,
      y: 6.2,
      z: car.position.z + 11.5,
    };

    camera.position.x += (ideal.x - camera.position.x) * Math.min(1, 0.06 * dt);
    camera.position.y += (ideal.y - camera.position.y) * Math.min(1, 0.06 * dt);
    camera.position.z += (ideal.z - camera.position.z) * Math.min(1, 0.08 * dt);

    const look = {
      x: car.position.x * 0.3,
      y: 1.2,
      z: car.position.z - 6,
    };
    camera.lookAt(look.x, look.y, look.z);
  }

  function render(now) {
    requestAnimationFrame(render);
    const dt = Math.min(2.5, (now - last) / 16.67);
    last = now;

    currentProgress = getProgress();
    if (P3D.updateWorld) P3D.updateWorld(currentProgress, dt);
    chaseCamera(P3D.car, dt);
    renderer.render(P3D.scene, camera);
  }

  function start() {
    if (rendering) return;
    rendering = true;
    currentProgress = getProgress();
    revealSections(currentProgress);
    requestAnimationFrame(render);
  }

  window.addEventListener("portfolioLoaded", start);
  if (document.body.classList.contains("loaded")) start();
  setTimeout(() => {
    if (!document.body.classList.contains("loaded")) {
      document.body.classList.add("loaded");
      start();
    }
  }, 3500);
})();
