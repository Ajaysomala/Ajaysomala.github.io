/* WORLD.JS — 3D Scene Objects */
(function () {
  const P3D = window.Portfolio3D;
  if (!P3D || !P3D.scene) return;
  const { scene, THREE } = P3D;

  /* ── 1. 3D Neuron Particle Field ── */
  const NODE_COUNT = window.innerWidth < 768 ? 120 : 280;
  const positions  = new Float32Array(NODE_COUNT * 3);
  const nodeData   = [];

  for (let i = 0; i < NODE_COUNT; i++) {
    const spread = 28;
    const x = (Math.random() - 0.5) * spread;
    const y = (Math.random() - 0.5) * spread * 0.6;
    const z = (Math.random() - 0.5) * spread * 0.5 - 5;
    positions[i * 3]     = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    nodeData.push({
      x, y, z,
      ox: x, oy: y, oz: z,
      vx: (Math.random() - 0.5) * 0.008,
      vy: (Math.random() - 0.5) * 0.008,
      vz: (Math.random() - 0.5) * 0.004,
    });
  }

  const nodeGeo = new THREE.BufferGeometry();
  nodeGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const nodeMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.06,
    transparent: true,
    opacity: 0.7,
    sizeAttenuation: true,
  });

  const nodesMesh = new THREE.Points(nodeGeo, nodeMat);
  scene.add(nodesMesh);

  /* ── 2. Connection lines between nearby nodes ── */
  const MAX_CONNECTIONS = window.innerWidth < 768 ? 200 : 500;
  const linePositions   = new Float32Array(MAX_CONNECTIONS * 6);
  const lineGeo   = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
  lineGeo.setDrawRange(0, 0);

  const lineMat = new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.08,
  }));
  scene.add(lineMat);

  /* ── 3. Floating Geometric Shapes ── */
  const shapes = [];
  const geoTypes = [
    () => new THREE.IcosahedronGeometry(0.55, 0),
    () => new THREE.OctahedronGeometry(0.6, 0),
    () => new THREE.TetrahedronGeometry(0.6, 0),
    () => new THREE.IcosahedronGeometry(0.4, 1),
  ];

  const wireMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true,
    transparent: true,
    opacity: 0.12,
  });

  const solidMat = new THREE.MeshStandardMaterial({
    color: 0x111111,
    transparent: true,
    opacity: 0.6,
    roughness: 0.8,
    metalness: 0.2,
  });

  const shapePositions = [
    [-7,  2, -4], [ 7,  3, -6], [ 0, -4, -3],
    [-5, -2, -8], [ 6, -3, -5], [-3,  4, -7],
    [ 4,  1, -9], [-8,  0, -6],
  ];

  shapePositions.forEach(([x, y, z], i) => {
    const geoFn  = geoTypes[i % geoTypes.length];
    const geo    = geoFn();
    const solid  = new THREE.Mesh(geo, solidMat.clone());
    const wire   = new THREE.Mesh(geo, wireMat.clone());
    const group  = new THREE.Group();
    group.add(solid);
    group.add(wire);
    group.position.set(x, y, z);
    group.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );
    const s = 0.7 + Math.random() * 0.6;
    group.scale.set(s, s, s);
    scene.add(group);
    shapes.push({
      group,
      rx: (Math.random() - 0.5) * 0.004,
      ry: (Math.random() - 0.5) * 0.005,
      rz: (Math.random() - 0.5) * 0.003,
      floatSpeed: 0.0008 + Math.random() * 0.0012,
      floatAmp: 0.3 + Math.random() * 0.4,
      floatOffset: Math.random() * Math.PI * 2,
      baseY: y,
    });
  });

  /* ── 4. Distant star field ── */
  const starCount = window.innerWidth < 768 ? 400 : 800;
  const starPos   = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    starPos[i * 3]     = (Math.random() - 0.5) * 80;
    starPos[i * 3 + 1] = (Math.random() - 0.5) * 60;
    starPos[i * 3 + 2] = (Math.random() - 0.5) * 60 - 20;
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  const starMesh = new THREE.Points(starGeo, new THREE.PointsMaterial({
    color: 0xffffff, size: 0.04, transparent: true, opacity: 0.35,
  }));
  scene.add(starMesh);

  /* ── Animate ── */
  let mouse3D = { x: 0, y: 0 };
  window.addEventListener('mousemove', e => {
    mouse3D.x = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouse3D.y = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  let t = 0;
  const CONNECT_DIST = 5.5;

  function updateWorld(scrollProgress) {
    t += 0.01;

    /* Animate nodes */
    let connCount = 0;
    for (let i = 0; i < NODE_COUNT; i++) {
      const n = nodeData[i];
      n.x += n.vx; n.y += n.vy; n.z += n.vz;
      if (Math.abs(n.x - n.ox) > 3) n.vx *= -1;
      if (Math.abs(n.y - n.oy) > 2) n.vy *= -1;
      if (Math.abs(n.z - n.oz) > 1.5) n.vz *= -1;
      positions[i * 3]     = n.x;
      positions[i * 3 + 1] = n.y;
      positions[i * 3 + 2] = n.z;
    }
    nodeGeo.attributes.position.needsUpdate = true;

    /* Connection lines */
    for (let i = 0; i < NODE_COUNT && connCount < MAX_CONNECTIONS; i++) {
      for (let j = i + 1; j < NODE_COUNT && connCount < MAX_CONNECTIONS; j++) {
        const a = nodeData[i], b = nodeData[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
        if (d < CONNECT_DIST) {
          const base = connCount * 6;
          linePositions[base]     = a.x; linePositions[base + 1] = a.y; linePositions[base + 2] = a.z;
          linePositions[base + 3] = b.x; linePositions[base + 4] = b.y; linePositions[base + 5] = b.z;
          connCount++;
        }
      }
    }
    lineGeo.attributes.position.needsUpdate = true;
    lineGeo.setDrawRange(0, connCount * 2);

    /* Animate shapes */
    shapes.forEach(s => {
      s.group.rotation.x += s.rx;
      s.group.rotation.y += s.ry;
      s.group.rotation.z += s.rz;
      s.group.position.y = s.baseY + Math.sin(t * s.floatSpeed * 100 + s.floatOffset) * s.floatAmp;
    });

    /* Slow star rotation */
    starMesh.rotation.y = t * 0.0015;
    starMesh.rotation.x = t * 0.0008;

    /* Mouse parallax on the whole scene */
    scene.rotation.y += (mouse3D.x * 0.025 - scene.rotation.y) * 0.04;
    scene.rotation.x += (-mouse3D.y * 0.015 - scene.rotation.x) * 0.04;
  }

  // Expose for scroll3d
  window.Portfolio3D.updateWorld = updateWorld;
  window.Portfolio3D.shapes = shapes;
})();
