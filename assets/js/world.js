/* WORLD.JS — Bruno-Simon-style drive world (mouse steer, no map, no sound) */
(function () {
  const P3D = window.Portfolio3D;
  if (!P3D || !P3D.scene) return;
  const { scene, THREE, accent } = P3D;

  const WORLD_LEN = 140;
  const ROAD_HALF = 5.5;
  const ZONE_ZS = [0, -20, -40, -60, -80, -100, -120];

  /* ── Ground ── */
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(80, WORLD_LEN + 40),
    new THREE.MeshStandardMaterial({
      color: 0x0a0a0c,
      roughness: 0.95,
      metalness: 0.05,
    })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(0, 0, -WORLD_LEN / 2 + 10);
  scene.add(ground);

  /* ── Road ── */
  const road = new THREE.Mesh(
    new THREE.PlaneGeometry(ROAD_HALF * 2, WORLD_LEN + 20),
    new THREE.MeshStandardMaterial({
      color: 0x141418,
      roughness: 0.85,
      metalness: 0.1,
    })
  );
  road.rotation.x = -Math.PI / 2;
  road.position.set(0, 0.02, -WORLD_LEN / 2 + 10);
  scene.add(road);

  /* Center dashed line */
  const dashMat = new THREE.MeshBasicMaterial({ color: 0x00d4aa });
  for (let z = 12; z > -WORLD_LEN; z -= 3.2) {
    const dash = new THREE.Mesh(new THREE.PlaneGeometry(0.18, 1.4), dashMat);
    dash.rotation.x = -Math.PI / 2;
    dash.position.set(0, 0.04, z);
    scene.add(dash);
  }

  /* Road edge lines */
  const edgeMat = new THREE.MeshBasicMaterial({ color: 0x2a2a30 });
  [-ROAD_HALF, ROAD_HALF].forEach((x) => {
    const edge = new THREE.Mesh(
      new THREE.PlaneGeometry(0.12, WORLD_LEN + 20),
      edgeMat
    );
    edge.rotation.x = -Math.PI / 2;
    edge.position.set(x, 0.035, -WORLD_LEN / 2 + 10);
    scene.add(edge);
  });

  /* ── Grid helpers (subtle) ── */
  const grid = new THREE.GridHelper(100, 50, 0x1a1a20, 0x121216);
  grid.position.y = 0.01;
  grid.material.transparent = true;
  grid.material.opacity = 0.35;
  scene.add(grid);

  /* ── Landmark blocks along the path (section markers) ── */
  const landmarks = [];
  const labels = ["START", "ABOUT", "WORK", "STACK", "BUILD", "PROOF", "HELLO"];
  ZONE_ZS.forEach((z, i) => {
    const side = i % 2 === 0 ? -1 : 1;
    const group = new THREE.Group();

    const building = new THREE.Mesh(
      new THREE.BoxGeometry(2.2 + (i % 3) * 0.4, 1.5 + (i % 4) * 0.55, 2.2),
      new THREE.MeshStandardMaterial({
        color: 0x101014,
        roughness: 0.7,
        metalness: 0.25,
      })
    );
    building.position.y = building.geometry.parameters.height / 2;
    group.add(building);

    const wire = new THREE.LineSegments(
      new THREE.EdgesGeometry(building.geometry),
      new THREE.LineBasicMaterial({ color: 0x00d4aa, transparent: true, opacity: 0.35 })
    );
    wire.position.copy(building.position);
    group.add(wire);

    const pillar = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.08, 0.35),
      new THREE.MeshBasicMaterial({ color: 0x00d4aa })
    );
    pillar.position.set(0, building.geometry.parameters.height + 0.2, 0);
    group.add(pillar);

    group.position.set(side * (ROAD_HALF + 3.5 + (i % 2)), 0, z);
    scene.add(group);
    landmarks.push({ group, z, label: labels[i] });

    /* Floating ring markers on road */
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(1.6, 1.75, 48),
      new THREE.MeshBasicMaterial({
        color: 0x00d4aa,
        transparent: true,
        opacity: 0.22,
        side: THREE.DoubleSide,
      })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(0, 0.05, z);
    scene.add(ring);
  });

  /* ── Decorative floating nodes ── */
  const floaters = [];
  for (let i = 0; i < 28; i++) {
    const mesh = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.25 + Math.random() * 0.35, 0),
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.12,
      })
    );
    const x = (Math.random() > 0.5 ? 1 : -1) * (7 + Math.random() * 10);
    const y = 1.2 + Math.random() * 4;
    const z = 10 - Math.random() * WORLD_LEN;
    mesh.position.set(x, y, z);
    scene.add(mesh);
    floaters.push({
      mesh,
      baseY: y,
      speed: 0.4 + Math.random() * 0.8,
      phase: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.01,
    });
  }

  /* ── Particle dust ── */
  const DUST = window.innerWidth < 768 ? 180 : 420;
  const dustPos = new Float32Array(DUST * 3);
  for (let i = 0; i < DUST; i++) {
    dustPos[i * 3] = (Math.random() - 0.5) * 40;
    dustPos[i * 3 + 1] = Math.random() * 8;
    dustPos[i * 3 + 2] = 15 - Math.random() * (WORLD_LEN + 20);
  }
  const dust = new THREE.Points(
    new THREE.BufferGeometry().setAttribute(
      "position",
      new THREE.BufferAttribute(dustPos, 3)
    ),
    new THREE.PointsMaterial({
      color: 0x00d4aa,
      size: 0.06,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
    })
  );
  scene.add(dust);

  /* ── Vehicle (mouse-driven) ── */
  function makeCar() {
    const car = new THREE.Group();

    const body = new THREE.Mesh(
      new THREE.BoxGeometry(1.1, 0.35, 2.1),
      new THREE.MeshStandardMaterial({
        color: 0xf2f2f2,
        roughness: 0.35,
        metalness: 0.4,
      })
    );
    body.position.y = 0.35;
    car.add(body);

    const cabin = new THREE.Mesh(
      new THREE.BoxGeometry(0.85, 0.32, 1.0),
      new THREE.MeshStandardMaterial({
        color: 0x1a1a1e,
        roughness: 0.3,
        metalness: 0.5,
      })
    );
    cabin.position.set(0, 0.62, -0.1);
    car.add(cabin);

    const accentStripe = new THREE.Mesh(
      new THREE.BoxGeometry(1.12, 0.06, 0.2),
      new THREE.MeshBasicMaterial({ color: 0x00d4aa })
    );
    accentStripe.position.set(0, 0.42, 0.85);
    car.add(accentStripe);

    const wheelGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.18, 12);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111113, roughness: 0.9 });
    const wheelPositions = [
      [-0.55, 0.22, 0.7],
      [0.55, 0.22, 0.7],
      [-0.55, 0.22, -0.7],
      [0.55, 0.22, -0.7],
    ];
    wheelPositions.forEach(([x, y, z]) => {
      const w = new THREE.Mesh(wheelGeo, wheelMat);
      w.rotation.z = Math.PI / 2;
      w.position.set(x, y, z);
      car.add(w);
    });

    /* Headlights */
    [[-0.35, 0.35, 1.05], [0.35, 0.35, 1.05]].forEach(([x, y, z]) => {
      const light = new THREE.Mesh(
        new THREE.BoxGeometry(0.15, 0.08, 0.05),
        new THREE.MeshBasicMaterial({ color: 0x00d4aa })
      );
      light.position.set(x, y, z);
      car.add(light);
    });

    car.position.set(0, 0, 8);
    scene.add(car);
    return car;
  }

  const car = makeCar();

  /* ── Mouse / touch steering ── */
  const mouse = { x: 0, y: 0, nx: 0, ny: 0 };
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const hit = new THREE.Vector3();
  let targetX = 0;
  let driving = true;

  function updatePointer(clientX, clientY) {
    mouse.x = clientX;
    mouse.y = clientY;
    mouse.nx = (clientX / window.innerWidth) * 2 - 1;
    mouse.ny = -(clientY / window.innerHeight) * 2 + 1;
    pointer.set(mouse.nx, mouse.ny);
    raycaster.setFromCamera(pointer, P3D.camera);
    if (raycaster.ray.intersectPlane(groundPlane, hit)) {
      targetX = THREE.MathUtils.clamp(hit.x, -ROAD_HALF + 0.8, ROAD_HALF - 0.8);
    } else {
      targetX = THREE.MathUtils.clamp(mouse.nx * ROAD_HALF, -ROAD_HALF + 0.8, ROAD_HALF - 0.8);
    }
  }

  window.addEventListener(
    "pointermove",
    (e) => {
      if (!driving) return;
      updatePointer(e.clientX, e.clientY);
    },
    { passive: true }
  );

  /* Hide drive hint after first interaction */
  let hinted = false;
  function dismissHint() {
    if (hinted) return;
    hinted = true;
    const el = document.getElementById("driveHint");
    if (el) el.classList.add("is-gone");
  }
  window.addEventListener("pointerdown", dismissHint, { passive: true });
  window.addEventListener("wheel", dismissHint, { passive: true });

  /* ── State exposed to scroll driver ── */
  const state = {
    car,
    targetX: 0,
    posZ: 8,
    velZ: 0,
    steer: 0,
    progress: 0,
  };

  function updateWorld(progress, dt) {
    state.progress = progress;
    const t = performance.now() * 0.001;

    /* Scroll drives forward along -Z */
    const destZ = 8 - progress * (WORLD_LEN - 16);
    state.posZ += (destZ - state.posZ) * Math.min(1, 0.08 * (dt || 1));

    /* Mouse steers X */
    state.targetX += (targetX - state.targetX) * 0.08;
    const prevX = car.position.x;
    car.position.x += (state.targetX - car.position.x) * 0.12;
    car.position.z = state.posZ;
    car.position.y = 0;

    const dx = car.position.x - prevX;
    state.steer += (dx * 2.8 - state.steer) * 0.15;
    car.rotation.y = -state.steer * 0.9;
    car.rotation.z = -state.steer * 0.35;

    /* Wheel spin based on forward motion */
    const spin = (destZ - state.posZ) * 0.4;
    car.children.forEach((ch) => {
      if (ch.geometry && ch.geometry.type === "CylinderGeometry") {
        ch.rotation.x += 0.2 + Math.abs(spin);
      }
    });

    /* Accent light follows car */
    if (accent) {
      accent.position.x = car.position.x;
      accent.position.z = car.position.z;
      accent.position.y = 5;
    }

    /* Floaters */
    floaters.forEach((f) => {
      f.mesh.position.y = f.baseY + Math.sin(t * f.speed + f.phase) * 0.35;
      f.mesh.rotation.y += f.spin;
      f.mesh.rotation.x += f.spin * 0.6;
    });

    /* Landmark pulse when near */
    landmarks.forEach((lm) => {
      const d = Math.abs(car.position.z - lm.z);
      const near = Math.max(0, 1 - d / 10);
      lm.group.children.forEach((ch) => {
        if (ch.material && ch.material.opacity !== undefined && ch.type === "LineSegments") {
          ch.material.opacity = 0.2 + near * 0.55;
        }
      });
      lm.group.scale.setScalar(1 + near * 0.08);
    });

    dust.rotation.y = t * 0.02;
  }

  window.Portfolio3D.updateWorld = updateWorld;
  window.Portfolio3D.car = car;
  window.Portfolio3D.driveState = state;
  window.Portfolio3D.ZONE_ZS = ZONE_ZS;
})();
