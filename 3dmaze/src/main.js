import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.165.0/three.module.js';
import { OrbitControls } from './OrbitControls.js';
import { createMaze } from './maze.js';
import { createPlayer, handlePlayerControls } from './player.js';

let scene, camera, renderer, player;
 let controls;

function init() {
    console.log('Initializing the game...');
    
    // Create the scene
    scene = new THREE.Scene();
    console.log('Scene created.');

    // Create the camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1.6, 0); // Position the camera at the player's eye level
    console.log('Camera created and positioned.');

    // Create the renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('game-container').appendChild(renderer.domElement);
    console.log('Renderer created and added to the DOM.');

    // Create OrbitControls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Enable damping (inertia)
    controls.dampingFactor = 0.25; // Damping factor
    controls.screenSpacePanning = false; // Do not allow panning
    controls.minDistance = 1; // Minimum zoom distance
    controls.maxDistance = 500; // Maximum zoom distance
    console.log('OrbitControls created and configured.');

    // Add basic lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    console.log('Ambient light added to the scene.');

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);
    console.log('Directional light added to the scene.');

    // Create the maze
    createMaze(scene);
    console.log('Maze created.');

    // Create the player
    player = createPlayer(scene);
    console.log('Player created.');
    handlePlayerControls(player, camera);
    console.log('Player controls initialized.');

    // Start the animation loop
    animate();
    console.log('Animation loop started.');
}

function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Update controls
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    console.log('Window resized. Camera and renderer updated.');
});

// Initialize the game when the window loads
window.onload = init;