/* DRIVE-CONTROLS.JS — Mouse drives the car; scroll reveals chapters */
(function () {
  const D = window.Drive3D;
  if (!D || !D.car || !D.canvas) return;

  const { camera, renderer, scene, car, canvas, THREE, targetMark, BOUNDS, ZONES } = D;
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const hit = new THREE.Vector3();

  const state = {
    driving: false,
    target: new THREE.Vector3(0, 0, 6),
    velocity: new THREE.Vector3(),
    speed: 0,
    zone: 0,
    scrollZone: 0,
    hinted: false,
  };

  const MAX_SPEED = 0.42;
  const ACCEL = 0.018;
  const FRICTION = 0.92;
  const TURN = 0.12;

  function isUiTarget(el) {
    return !!(el && el.closest && el.closest(".hud-nav, .panel.is-active, a, button, input, textarea, label, form"));
  }
  function dismissHint() {
    if (state.hinted) return;
    state.hinted = true;
    const el = document.getElementById("driveHint");
    if (el) el.classList.add("is-gone");
  }

  function onDown(e) {
    if (isUiTarget(e.target)) return;
    state.driving = true;
    setPointer(e.clientX, e.clientY);
    dismissHint();
  }
  function onMove(e) {
    setPointer(e.clientX, e.clientY);
  }
  function onUp() {
    state.driving = false;
    targetMark.material.opacity = 0.2;
  }

  window.addEventListener("pointerdown", onDown);
  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onUp);
  canvas.style.pointerEvents = "auto";
  canvas.style.touchAction = "none";

  /* Keep setPointer using viewport coords when listening on window */
  function setPointer(clientX, clientY) {
    pointer.x = (clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    if (raycaster.ray.intersectPlane(plane, hit)) {
      hit.x = THREE.MathUtils.clamp(hit.x, -BOUNDS, BOUNDS);
      hit.z = THREE.MathUtils.clamp(hit.z, -90, 20);
      state.target.copy(hit);
      targetMark.position.x = hit.x;
      targetMark.position.z = hit.z;
      targetMark.material.opacity = state.driving ? 0.85 : 0.35;
    }
  }

  /* Scroll reveals chapters + gently warps car toward zone */
  const spacer = document.getElementById("scrollSpacer");
  const bar = document.getElementById("scroll-progress");

  function zoneFromScroll() {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const p = window.scrollY / max;
    if (bar) bar.style.width = p * 100 + "%";
    const idx = Math.min(ZONES.length - 1, Math.floor(p * ZONES.length));
    return { idx, p };
  }

  function goToZone(idx, scrollSync) {
    idx = Math.max(0, Math.min(ZONES.length - 1, idx));
    state.scrollZone = idx;
    const z = ZONES[idx];
    state.target.set(z.x, 0, z.z);
    targetMark.position.set(z.x, 0.08, z.z);
    targetMark.material.opacity = 0.7;
    state.driving = true;
    setTimeout(() => { state.driving = false; }, 900);
    setActivePanel(idx);
    if (scrollSync && spacer) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const y = (idx / Math.max(1, ZONES.length - 1)) * max;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
    dismissHint();
  }

  window.addEventListener("scroll", () => {
    const { idx } = zoneFromScroll();
    if (idx !== state.scrollZone) {
      state.scrollZone = idx;
      const z = ZONES[idx];
      state.target.set(z.x, 0, z.z);
      setActivePanel(idx);
    }
  }, { passive: true });

  /* Nav buttons */
  document.querySelectorAll(".hud-nav [data-zone]").forEach((btn) => {
    btn.addEventListener("click", () => goToZone(+btn.dataset.zone, true));
  });

  function nearestZone() {
    let best = 0;
    let bestD = Infinity;
    ZONES.forEach((z, i) => {
      const d = Math.hypot(car.position.x - z.x, car.position.z - z.z);
      if (d < bestD) { bestD = d; best = i; }
    });
    return { idx: best, dist: bestD };
  }

  function setActivePanel(idx) {
    state.zone = idx;
    document.querySelectorAll(".panel").forEach((p) => {
      p.classList.toggle("is-active", +p.dataset.zone === idx);
    });
    document.querySelectorAll(".hud-nav [data-zone]").forEach((b) => {
      b.classList.toggle("is-on", +b.dataset.zone === idx);
    });
  }

  /* Physics step */
  function stepCar() {
    const to = state.target.clone().sub(car.position);
    to.y = 0;
    const dist = to.length();

    if (state.driving && dist > 0.35) {
      to.normalize();
      state.velocity.x += to.x * ACCEL;
      state.velocity.z += to.z * ACCEL;
    } else {
      state.velocity.multiplyScalar(FRICTION);
    }

    const speed = state.velocity.length();
    if (speed > MAX_SPEED) state.velocity.multiplyScalar(MAX_SPEED / speed);

    car.position.x += state.velocity.x;
    car.position.z += state.velocity.z;
    car.position.x = THREE.MathUtils.clamp(car.position.x, -BOUNDS, BOUNDS);
    car.position.z = THREE.MathUtils.clamp(car.position.z, -90, 20);

    if (speed > 0.002) {
      const angle = Math.atan2(state.velocity.x, state.velocity.z);
      let diff = angle - car.rotation.y;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      car.rotation.y += diff * TURN;
      car.rotation.z += ((-diff * 0.35) - car.rotation.z) * 0.1;
      car.userData.wheels.forEach((w) => { w.rotation.x += speed * 3.2; });
    } else {
      car.rotation.z *= 0.9;
    }

    state.speed = speed;
    const speedEl = document.getElementById("speedVal");
    if (speedEl) speedEl.textContent = (speed * 100).toFixed(0);

    /* Auto-open panel when driving near a pad */
    const near = nearestZone();
    if (near.dist < 4.5 && near.idx !== state.zone) {
      setActivePanel(near.idx);
      state.scrollZone = near.idx;
    }
  }

  function chaseCam() {
    const back = new THREE.Vector3(
      Math.sin(car.rotation.y) * 11,
      0,
      Math.cos(car.rotation.y) * 11
    );
    const ideal = new THREE.Vector3(
      car.position.x - back.x * 0.15 + Math.sin(car.rotation.y) * -0.5,
      7.5,
      car.position.z + back.z
    );
    /* Keep camera mostly behind along +Z for readability of world */
    ideal.x = car.position.x * 0.65;
    ideal.y = 8.5;
    ideal.z = car.position.z + 14;

    camera.position.lerp(ideal, 0.07);
    camera.lookAt(car.position.x, 1.2, car.position.z - 2);
  }

  let last = performance.now();
  function loop(now) {
    requestAnimationFrame(loop);
    const t = now * 0.001;
    stepCar();
    chaseCam();
    if (D.tickWorld) D.tickWorld(t);
    renderer.render(scene, camera);
    last = now;
  }

  /* Boot */
  function start() {
    setActivePanel(0);
    zoneFromScroll();
    requestAnimationFrame(loop);
    const loader = document.getElementById("loader");
    const barEl = document.getElementById("loaderBar");
    let p = 0;
    const iv = setInterval(() => {
      p += 8 + Math.random() * 12;
      if (barEl) barEl.style.width = Math.min(100, p) + "%";
      if (p >= 100) {
        clearInterval(iv);
        if (loader) loader.classList.add("is-done");
      }
    }, 120);
  }

  if (document.readyState === "complete") start();
  else window.addEventListener("load", start);

  window.Drive3D.goToZone = goToZone;
  window.Drive3D.state = state;
})();
