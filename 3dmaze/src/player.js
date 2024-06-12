// import * as THREE from 'three';
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.165.0/three.module.js';
export function createPlayer(scene) {
    console.log('Creating player...');
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    const player = new THREE.Mesh(geometry, material);
    scene.add(player);
    console.log('Player created and added to the scene.');

    return player;
}

export function handlePlayerControls(player, camera) {
    console.log('Initializing player controls...');
    const moveSpeed = 0.1;
    const rotationSpeed = 0.02;

    const keys = {
        forward: false,
        backward: false,
        left: false,
        right: false
    };

    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'ArrowUp':
            case 'w':
                keys.forward = true;
                break;
            case 'ArrowDown':
            case 's':
                keys.backward = true;
                break;
            case 'ArrowLeft':
            case 'a':
                keys.left = true;
                break;
            case 'ArrowRight':
            case 'd':
                keys.right = true;
                break;
        }
        console.log(`Key down: ${event.key}`);
    });

    document.addEventListener('keyup', (event) => {
        switch (event.key) {
            case 'ArrowUp':
            case 'w':
                keys.forward = false;
                break;
            case 'ArrowDown':
            case 's':
                keys.backward = false;
                break;
            case 'ArrowLeft':
            case 'a':
                keys.left = false;
                break;
            case 'ArrowRight':
            case 'd':
                keys.right = false;
                break;
        }
        console.log(`Key up: ${event.key}`);
    });

    function updatePlayerPosition() {
        if (keys.forward) {
            player.position.z -= moveSpeed;
        }
        if (keys.backward) {
            player.position.z += moveSpeed;
        }
        if (keys.left) {
            player.position.x -= moveSpeed;
        }
        if (keys.right) {
            player.position.x += moveSpeed;
        }

        // Update camera position to follow the player
        camera.position.set(player.position.x, player.position.y + 1.6, player.position.z);
        camera.lookAt(player.position.x, player.position.y, player.position.z - 1);
        //console.log(`Player position updated to (${player.position.x}, ${player.position.y}, ${player.position.z}).`);
    }

    function animate() {
        requestAnimationFrame(animate);
        updatePlayerPosition();
    }

    animate();
    console.log('Player controls animation loop started.');

}