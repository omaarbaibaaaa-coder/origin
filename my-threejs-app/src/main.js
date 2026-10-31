import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// 1. Import the official VRButton utility from Three.js
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 10);

const renderer = new THREE.WebGLRenderer({ antialias: true }); // Antialiasing makes VR look much smoother
renderer.setSize(window.innerWidth, window.innerHeight);

// 2. Enable WebXR in the renderer
renderer.xr.enabled = true;

const appDiv = document.getElementById('app');
if (appDiv) {
  appDiv.appendChild(renderer.domElement);
} else {
  document.body.appendChild(renderer.domElement);
}

// 3. Inject the VR Button into the DOM body
document.body.appendChild(VRButton.createButton(renderer));

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshNormalMaterial();
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const gridHelper = new THREE.GridHelper(10, 10);
scene.add(gridHelper);

// 4. IMPORTANT: Replace requestAnimationFrame with renderer.setAnimationLoop
// Standard requestAnimationFrame loops do not fire inside VR headsets.
renderer.setAnimationLoop(() => {
  controls.update(); 
  renderer.render(scene, camera);
});

window.addEventListener('resize', () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
