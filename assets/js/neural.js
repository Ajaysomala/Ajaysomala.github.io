/* NEURAL.JS — Particle neural field + scroll camera */
(function () {
  const P3D = window.Portfolio3D;
  if (!P3D || !P3D.scene) return;

  const { scene, camera, renderer, THREE } = P3D;
  const prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    const c = document.getElementById("neuralCanvas");
    if (c) c.style.display = "none";
    return;
  }

  const COUNT = window.innerWidth < 768 ? 420 : 900;
  const positions = new Float32Array(COUNT * 3);
  const velocities = new Float32Array(COUNT * 3);

  for (let i = 0; i < COUNT; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 60;
    positions[i3 + 1] = (Math.random() - 0.5) * 40;
    positions[i3 + 2] = (Math.random() - 0.5) * 40;
    velocities[i3] = (Math.random() - 0.5) * 0.004;
    velocities[i3 + 1] = (Math.random() - 0.5) * 0.004;
    velocities[i3 + 2] = (Math.random() - 0.5) * 0.003;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0x00d4aa,
    size: 0.08,
    transparent: true,
    opacity: 0.75,
    depthWrite: false,
    sizeAttenuation: true,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  /* Connection lines — sparse neural edges */
  const LINE_COUNT = window.innerWidth < 768 ? 60 : 140;
  const linePositions = new Float32Array(LINE_COUNT * 6);
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
  const lineMat = new THREE.LineBasicMaterial({
    color: 0x00d4aa,
    transparent: true,
    opacity: 0.12,
  });
  const lines = new THREE.LineSegments(lineGeo, lineMat);
  scene.add(lines);

  function rebuildLinks() {
    const pos = geometry.attributes.position.array;
    for (let i = 0; i < LINE_COUNT; i++) {
      const a = Math.floor(Math.random() * COUNT) * 3;
      let b = Math.floor(Math.random() * COUNT) * 3;
      const dx = pos[a] - pos[b];
      const dy = pos[a + 1] - pos[b + 1];
      const dz = pos[a + 2] - pos[b + 2];
      if (dx * dx + dy * dy + dz * dz > 80) {
        b = a;
      }
      const o = i * 6;
      linePositions[o] = pos[a];
      linePositions[o + 1] = pos[a + 1];
      linePositions[o + 2] = pos[a + 2];
      linePositions[o + 3] = pos[b];
      linePositions[o + 4] = pos[b + 1];
      linePositions[o + 5] = pos[b + 2];
    }
    lineGeo.attributes.position.needsUpdate = true;
  }
  rebuildLinks();
  setInterval(rebuildLinks, 3200);

  /* Soft orbital rings */
  const ringGeo = new THREE.RingGeometry(8, 8.03, 128);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x00d4aa,
    transparent: true,
    opacity: 0.12,
    side: THREE.DoubleSide,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2.4;
  scene.add(ring);

  const ring2 = ring.clone();
  ring2.scale.set(1.35, 1.35, 1.35);
  ring2.material = ringMat.clone();
  ring2.material.opacity = 0.07;
  ring2.rotation.z = 0.4;
  scene.add(ring2);

  let targetX = 0;
  let targetY = 0;
  let scrollProgress = 0;
  let linkTick = 0;

  window.addEventListener(
    "pointermove",
    (e) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    },
    { passive: true }
  );

  window.addEventListener(
    "scroll",
    () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress = max > 0 ? window.scrollY / max : 0;
    },
    { passive: true }
  );

  let last = 0;
  function animate(t) {
    requestAnimationFrame(animate);
    const dt = Math.min((t - last) / 16.67, 2);
    last = t;

    const pos = geometry.attributes.position.array;
    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;
      pos[i3] += velocities[i3] * dt;
      pos[i3 + 1] += velocities[i3 + 1] * dt;
      pos[i3 + 2] += velocities[i3 + 2] * dt;
      if (Math.abs(pos[i3]) > 32) velocities[i3] *= -1;
      if (Math.abs(pos[i3 + 1]) > 22) velocities[i3 + 1] *= -1;
      if (Math.abs(pos[i3 + 2]) > 22) velocities[i3 + 2] *= -1;
    }
    geometry.attributes.position.needsUpdate = true;

    points.rotation.y += 0.00045 * dt;
    ring.rotation.z += 0.0008 * dt;
    ring2.rotation.z -= 0.0005 * dt;

    const camZ = 28 - scrollProgress * 10;
    const camY = scrollProgress * 4;
    camera.position.x += (targetX * 2.2 - camera.position.x) * 0.03;
    camera.position.y += (camY - targetY * 1.4 - camera.position.y) * 0.03;
    camera.position.z += (camZ - camera.position.z) * 0.04;
    camera.lookAt(0, scrollProgress * 2, 0);

    material.opacity = 0.45 + Math.sin(t * 0.001) * 0.12;
    linkTick++;
    if (linkTick % 90 === 0) rebuildLinks();

    renderer.render(scene, camera);
  }
  requestAnimationFrame(animate);
})();
