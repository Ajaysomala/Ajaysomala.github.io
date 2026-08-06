/* DRIVE-WORLD.JS — Playable world + vehicle (Bruno-Simon style, mouse drive) */
(function () {
  const D = window.Drive3D;
  if (!D || !D.scene) return;
  const { scene, THREE, accent } = D;

  const BOUNDS = 28;
  const ZONES = [
    { x: 0, z: 6, label: "HOME" },
    { x: -10, z: -8, label: "ABOUT" },
    { x: 12, z: -18, label: "WORK" },
    { x: -8, z: -30, label: "STACK" },
    { x: 10, z: -42, label: "BUILD" },
    { x: -12, z: -54, label: "PROOF" },
    { x: 0, z: -66, label: "HELLO" },
  ];

  /* Ground */
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(120, 160),
    new THREE.MeshStandardMaterial({ color: 0x0b0b0f, roughness: 1, metalness: 0 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(0, 0, -30);
  scene.add(ground);

  const grid = new THREE.GridHelper(100, 60, 0x1c1c24, 0x121218);
  grid.position.y = 0.02;
  grid.material.transparent = true;
  grid.material.opacity = 0.55;
  scene.add(grid);

  /* Roads — cross layout */
  function road(w, h, x, z) {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshStandardMaterial({ color: 0x16161c, roughness: 0.9, metalness: 0.05 })
    );
    m.rotation.x = -Math.PI / 2;
    m.position.set(x, 0.03, z);
    scene.add(m);
  }
  road(10, 120, 0, -30);
  road(80, 10, 0, -8);
  road(80, 10, 0, -30);
  road(80, 10, 0, -54);

  /* Lane marks */
  const dashMat = new THREE.MeshBasicMaterial({ color: 0x00d4aa });
  for (let z = 20; z > -90; z -= 3) {
    const d = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 1.2), dashMat);
    d.rotation.x = -Math.PI / 2;
    d.position.set(0, 0.05, z);
    scene.add(d);
  }

  /* Buildings / props around zones */
  const props = [];
  function box(x, z, sx, sy, sz, color) {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(sx, sy, sz),
      new THREE.MeshStandardMaterial({ color, roughness: 0.75, metalness: 0.2 })
    );
    mesh.position.set(x, sy / 2, z);
    scene.add(mesh);
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(mesh.geometry),
      new THREE.LineBasicMaterial({ color: 0x00d4aa, transparent: true, opacity: 0.25 })
    );
    edges.position.copy(mesh.position);
    scene.add(edges);
    props.push({ mesh, edges, baseZ: z });
  }

  const rng = (a, b) => a + Math.random() * (b - a);
  for (let i = 0; i < 40; i++) {
    const side = Math.random() > 0.5 ? 1 : -1;
    const x = side * rng(8, 26);
    const z = rng(15, -85);
    box(x, z, rng(1.5, 3.5), rng(1.2, 5.5), rng(1.5, 3.5), 0x101018);
  }

  /* Zone pads + pillars */
  const zoneMarkers = ZONES.map((zn, i) => {
    const g = new THREE.Group();
    const pad = new THREE.Mesh(
      new THREE.CircleGeometry(3.2, 48),
      new THREE.MeshBasicMaterial({ color: 0x00d4aa, transparent: true, opacity: 0.1 })
    );
    pad.rotation.x = -Math.PI / 2;
    g.add(pad);
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(3.0, 3.25, 64),
      new THREE.MeshBasicMaterial({ color: 0x00d4aa, transparent: true, opacity: 0.45, side: THREE.DoubleSide })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.06;
    g.add(ring);
    const pillar = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 2.4, 0.35),
      new THREE.MeshStandardMaterial({ color: 0x1a1a22, metalness: 0.4, roughness: 0.4 })
    );
    pillar.position.set(3.8, 1.2, 0);
    g.add(pillar);
    const tip = new THREE.Mesh(
      new THREE.BoxGeometry(0.45, 0.15, 0.45),
      new THREE.MeshBasicMaterial({ color: 0x00d4aa })
    );
    tip.position.set(3.8, 2.5, 0);
    g.add(tip);
    g.position.set(zn.x, 0, zn.z);
    scene.add(g);
    return { group: g, ring, ...zn, index: i };
  });

  /* Floating wire shapes */
  const floaters = [];
  for (let i = 0; i < 24; i++) {
    const m = new THREE.Mesh(
      new THREE.IcosahedronGeometry(rng(0.3, 0.7), 0),
      new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.14 })
    );
    m.position.set(rng(-22, 22), rng(1.5, 6), rng(12, -80));
    scene.add(m);
    floaters.push({ m, y: m.position.y, s: rng(0.5, 1.2), p: Math.random() * 6 });
  }

  /* Car */
  function buildCar() {
    const car = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(1.25, 0.38, 2.3),
      new THREE.MeshStandardMaterial({ color: 0xf4f4f4, roughness: 0.3, metalness: 0.45 })
    );
    body.position.y = 0.38;
    car.add(body);
    const cabin = new THREE.Mesh(
      new THREE.BoxGeometry(0.95, 0.36, 1.05),
      new THREE.MeshStandardMaterial({ color: 0x15151a, roughness: 0.25, metalness: 0.55 })
    );
    cabin.position.set(0, 0.68, -0.15);
    car.add(cabin);
    const stripe = new THREE.Mesh(
      new THREE.BoxGeometry(1.27, 0.07, 0.22),
      new THREE.MeshBasicMaterial({ color: 0x00d4aa })
    );
    stripe.position.set(0, 0.45, 0.95);
    car.add(stripe);
    [[-0.4, 0.38, 1.16], [0.4, 0.38, 1.16]].forEach(([x, y, z]) => {
      const hl = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.1, 0.06),
        new THREE.MeshBasicMaterial({ color: 0x00d4aa })
      );
      hl.position.set(x, y, z);
      car.add(hl);
    });
    const wgeo = new THREE.CylinderGeometry(0.24, 0.24, 0.2, 14);
    const wmat = new THREE.MeshStandardMaterial({ color: 0x0c0c10, roughness: 0.95 });
    car.userData.wheels = [];
    [[-0.62, 0.24, 0.75], [0.62, 0.24, 0.75], [-0.62, 0.24, -0.75], [0.62, 0.24, -0.75]].forEach(([x, y, z]) => {
      const w = new THREE.Mesh(wgeo, wmat);
      w.rotation.z = Math.PI / 2;
      w.position.set(x, y, z);
      car.add(w);
      car.userData.wheels.push(w);
    });
    car.position.set(0, 0, 8);
    scene.add(car);
    return car;
  }
  const car = buildCar();

  /* Target marker on ground */
  const targetMark = new THREE.Mesh(
    new THREE.RingGeometry(0.35, 0.5, 32),
    new THREE.MeshBasicMaterial({ color: 0x00d4aa, transparent: true, opacity: 0.0, side: THREE.DoubleSide })
  );
  targetMark.rotation.x = -Math.PI / 2;
  targetMark.position.y = 0.08;
  scene.add(targetMark);

  D.car = car;
  D.zones = zoneMarkers;
  D.ZONES = ZONES;
  D.targetMark = targetMark;
  D.BOUNDS = BOUNDS;
  D.floaters = floaters;
  D.accent = accent;

  D.tickWorld = function (t) {
    floaters.forEach((f) => {
      f.m.position.y = f.y + Math.sin(t * f.s + f.p) * 0.4;
      f.m.rotation.y += 0.005;
    });
    zoneMarkers.forEach((z) => {
      const d = car.position.distanceTo(new THREE.Vector3(z.x, 0, z.z));
      const near = Math.max(0, 1 - d / 12);
      z.ring.material.opacity = 0.25 + near * 0.55;
      z.ring.scale.setScalar(1 + near * 0.15);
    });
    if (accent) {
      accent.position.x = car.position.x;
      accent.position.z = car.position.z;
      accent.position.y = 3.5;
    }
  };
})();
