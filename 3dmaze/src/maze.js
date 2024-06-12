// import * as THREE from 'three';
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.165.0/three.module.js';
const MAZE_WIDTH = 10;
const MAZE_HEIGHT = 10;
const WALL_HEIGHT = 2;
const WALL_THICKNESS = 0.1;

export function createMaze(scene) {
    console.log('Generating maze...');
    const maze = generateMaze(MAZE_WIDTH, MAZE_HEIGHT);
    const wallMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });

    for (let x = 0; x < MAZE_WIDTH; x++) {
        for (let y = 0; y < MAZE_HEIGHT; y++) {
            if (maze[x][y] === 1) {
                const wall = createWall(x, y, wallMaterial);
                scene.add(wall);
                console.log(`Wall added at position (${x}, ${y}).`);
            }
        }
    }
    console.log('Maze generation completed.');
}

function generateMaze(width, height) {
    console.log('Starting maze generation...');
    const maze = Array.from({ length: width }, () => Array(height).fill(1));
    const stack = [];
    const directions = [
        [0, 1], [1, 0], [0, -1], [-1, 0]
    ];

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function isValid(x, y) {
        return x >= 0 && y >= 0 && x < width && y < height;
    }

    function carve(x, y) {
        maze[x][y] = 0;
        shuffle(directions);

        for (const [dx, dy] of directions) {
            const nx = x + dx * 2;
            const ny = y + dy * 2;

            if (isValid(nx, ny) && maze[nx][ny] === 1) {
                maze[x + dx][y + dy] = 0;
                carve(nx, ny);
            }
        }
    }

    carve(1, 1);
    console.log('Maze generation finished.');
    return maze;
}

function createWall(x, y, material) {
    const geometry = new THREE.BoxGeometry(1, WALL_HEIGHT, WALL_THICKNESS);
    const wall = new THREE.Mesh(geometry, material);
    wall.position.set(x, WALL_HEIGHT / 2, y);
    console.log(`Wall created at position (${x}, ${y}).`);
    return wall;
}