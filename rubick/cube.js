import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.164.1/three.module.js';

export function createRubiksCube() {
    const group = new THREE.Group();
    const colors = [
        0xff0000, // Red
        0x00ff00, // Green
        0x0000ff, // Blue
        0xffff00, // Yellow
        0xffa500, // Orange
        0xffffff  // White
    ];

    const faceMaterials = colors.map(color => new THREE.MeshBasicMaterial({ color }));

    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            for (let z = -1; z <= 1; z++) {
                const geometry = new THREE.BoxGeometry(1, 1, 1);

                // Assign materials to each face of the cube
                const materials = [
                    faceMaterials[0], // Right face
                    faceMaterials[1], // Left face
                    faceMaterials[2], // Top face
                    faceMaterials[3], // Bottom face
                    faceMaterials[4], // Front face
                    faceMaterials[5]  // Back face
                ];

                const cube = new THREE.Mesh(geometry, materials);
                cube.position.set(x, y, z);
                group.add(cube);
            }
        }
    }

    return group;
}