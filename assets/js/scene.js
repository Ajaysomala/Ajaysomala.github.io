/* SCENE.JS — Three.js core for drive world */
window.Portfolio3D = (function () {
  if (typeof THREE === "undefined") return {};

  const canvas = document.getElementById("threeCanvas");
  if (!canvas) return {};

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x050507, 1);
  renderer.shadowMap.enabled = false;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x050507, 18, 85);

  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    200
  );
  camera.position.set(0, 8, 16);

  scene.add(new THREE.AmbientLight(0xffffff, 0.45));

  const sun = new THREE.DirectionalLight(0xffffff, 0.55);
  sun.position.set(10, 20, 8);
  scene.add(sun);

  const accent = new THREE.PointLight(0x00d4aa, 0.7, 60);
  accent.position.set(0, 6, 0);
  scene.add(accent);

  window.addEventListener(
    "resize",
    () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    },
    { passive: true }
  );

  return { scene, camera, renderer, THREE, accent };
})();
