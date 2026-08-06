/* SCENE.JS — Three.js core */
window.Portfolio3D = (function () {
  if (typeof THREE === "undefined") return {};

  const canvas = document.getElementById("neuralCanvas");
  if (!canvas) return {};

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.1,
    200
  );
  camera.position.set(0, 0, 28);

  scene.fog = new THREE.FogExp2(0x070708, 0.028);

  const ambient = new THREE.AmbientLight(0xffffff, 0.35);
  scene.add(ambient);

  [
    { pos: [12, 8, 10], i: 0.45 },
    { pos: [-10, -4, 6], i: 0.25 },
  ].forEach(({ pos, i }) => {
    const light = new THREE.PointLight(0x00d4aa, i, 80);
    light.position.set(...pos);
    scene.add(light);
  });

  window.addEventListener(
    "resize",
    () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    },
    { passive: true }
  );

  return { scene, camera, renderer, THREE };
})();
