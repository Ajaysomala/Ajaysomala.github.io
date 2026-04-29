/* SCENE.JS — Three.js Core Setup */
window.Portfolio3D = (function () {
  if (typeof THREE === 'undefined') return {};

  const canvas   = document.getElementById('threeCanvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 18);

  // Fog for depth
  scene.fog = new THREE.FogExp2(0x000000, 0.022);

  // Ambient light
  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambient);

  // Point lights for depth
  const lights = [
    { pos: [10, 10, 10], intensity: 0.6 },
    { pos: [-10, -5, 5], intensity: 0.3 },
    { pos: [0, -10, -10], intensity: 0.2 },
  ];
  lights.forEach(({ pos, intensity }) => {
    const l = new THREE.PointLight(0xffffff, intensity, 60);
    l.position.set(...pos);
    scene.add(l);
  });

  // Resize handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }, { passive: true });

  return { scene, camera, renderer, THREE };
})();
