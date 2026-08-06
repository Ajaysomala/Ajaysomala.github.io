/* DRIVE-SCENE.JS */
window.Drive3D = (function () {
  if (typeof THREE === "undefined") return {};
  const canvas = document.getElementById("threeCanvas");
  if (!canvas) return {};

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x07070a, 1);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x07070a, 25, 95);

  const camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.1,
    250
  );
  camera.position.set(0, 10, 18);

  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const sun = new THREE.DirectionalLight(0xffffff, 0.65);
  sun.position.set(12, 24, 10);
  scene.add(sun);
  const accent = new THREE.PointLight(0x00d4aa, 1.1, 40);
  accent.position.set(0, 4, 0);
  scene.add(accent);

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }, { passive: true });

  return { scene, camera, renderer, THREE, canvas, accent };
})();
