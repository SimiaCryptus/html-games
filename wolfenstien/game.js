// Importing Three.js from a CDN
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.164.1/three.module.js';

// Setting up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Handling window resize to ensure the game scales correctly
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Adding a simple cube to the scene
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Setting the camera position
camera.position.z = 5;

// Function to animate the scene
function animate() {
    requestAnimationFrame(animate);

    // Rotating the cube for visual effect
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    // Rendering the scene and camera
    renderer.render(scene, camera);
}

animate();

// Implementing basic keyboard controls for movement
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            camera.position.z -= 0.1;
            break;
        case 'ArrowDown':
            camera.position.z += 0.1;
            break;
        case 'ArrowLeft':
            camera.position.x -= 0.1;
            break;
        case 'ArrowRight':
            camera.position.x += 0.1;
            break;
    }
});