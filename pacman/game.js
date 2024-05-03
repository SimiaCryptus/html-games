const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let gameOverFlag = false;
const tileSize = 20;
const numRows = 20;
const numCols = 20;
const gameSpeed = 200; // ms per move

canvas.width = numCols * tileSize;
canvas.height = numRows * tileSize;

let score = 0;
let gameInterval;
let pacman = {
    x: 9,
    y: 9,
    direction: 'RIGHT'
};
let ghosts = [
    {x: 3, y: 3, direction: 'LEFT'}
];
let board = [];

function initBoard() {
    board = Array(numRows).fill().map(() => Array(numCols).fill(0));
    // Place walls (1) and dots (2)
    // This is just a simple example; you'd set up the board based on your game design
    for (let i = 0; i < numCols; i++) {
        board[0][i] = 1;
        board[numRows - 1][i] = 1;
        if (i > 0 && i < numRows - 1) {
            board[i][0] = 1;
            board[i][numCols - 1] = 1;
            for (let j = 1; j < numCols - 1; j++) {
                board[i][j] = 2;
            }
        }
    }
    board[pacman.y][pacman.x] = 0; // Clear the initial position of Pacman
}

function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < numRows; y++) {
        for (let x = 0; x < numCols; x++) {
            if (board[y][x] === 1) {
                ctx.fillStyle = 'blue';
                ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
            } else if (board[y][x] === 2) {
                ctx.fillStyle = 'yellow';
                ctx.fillRect(x * tileSize + tileSize / 3, y * tileSize + tileSize / 3, tileSize / 3, tileSize / 3);
            }
        }
    }

    // Draw Pacman
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(pacman.x * tileSize + tileSize / 2, pacman.y * tileSize + tileSize / 2, tileSize / 2, 0, Math.PI * 2);
    ctx.fill();

    // Draw Ghosts
    ghosts.forEach(ghost => {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(ghost.x * tileSize + tileSize / 2, ghost.y * tileSize + tileSize / 2, tileSize / 2, 0, Math.PI * 2);
        ctx.fill();
    });
}

function updateGame() {
    movePacman();
    moveGhosts();
    checkCollisions();
    drawBoard();
    updateScore();
    drawBoard();
    updateScore();
    if (!gameOverFlag) {
        requestAnimationFrame(updateGame);
    }
}

function movePacman() {
    // Implement Pacman movement logic based on direction
    // This is a simplified placeholder logic
    switch (pacman.direction) {
        case 'LEFT':
            if (pacman.x > 0 && board[pacman.y][pacman.x - 1] !== 1) pacman.x--;
            break;
        case 'RIGHT':
            if (pacman.x < numCols - 1 && board[pacman.y][pacman.x + 1] !== 1) pacman.x++;
            break;
        case 'UP':
            if (pacman.y > 0 && board[pacman.y - 1][pacman.x] !== 1) pacman.y--;
            break;
        case 'DOWN':
            if (pacman.y < numRows - 1 && board[pacman.y + 1][pacman.x] !== 1) pacman.y++;
            break;
    }
}

function moveGhosts() {
    // Improved random movement for ghosts
    ghosts.forEach(ghost => {
        let possibleDirections = [];
        if (ghost.x > 0 && board[ghost.y][ghost.x - 1] !== 1) possibleDirections.push('LEFT');
        if (ghost.x < numCols - 1 && board[ghost.y][ghost.x + 1] !== 1) possibleDirections.push('RIGHT');
        if (ghost.y > 0 && board[ghost.y - 1][ghost.x] !== 1) possibleDirections.push('UP');
        if (ghost.y < numRows - 1 && board[ghost.y + 1][ghost.x] !== 1) possibleDirections.push('DOWN');

        if (possibleDirections.length > 0) {
            const randomIndex = Math.floor(Math.random() * possibleDirections.length);
            const direction = possibleDirections[randomIndex];
            switch (direction) {
                case 'LEFT':
                    ghost.x--;
                    break;
                case 'RIGHT':
                    ghost.x++;
                    break;
                case 'UP':
                    ghost.y--;
                    break;
                case 'DOWN':
                    ghost.y++;
                    break;
            }
        }
    });
}

function checkCollisions() {
    // Check for collisions with ghosts
    ghosts.forEach(ghost => {
        if (ghost.x === pacman.x && ghost.y === pacman.y) {
            gameOver();
        }
    });

    // Check for dot collection
    if (board[pacman.y][pacman.x] === 2) {
        board[pacman.y][pacman.x] = 0;
        score += 10;
    }
}

function updateScore() {
    document.getElementById('scoreValue').innerText = `${score}`;
}

function gameOver() {
    gameOverFlag = true;
    alert('Game Over!');
}

function startGame() {
    initBoard();
    drawBoard();
    gameOverFlag = false;
    requestAnimationFrame(updateGame);
}

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowLeft':
            pacman.direction = 'LEFT';
            break;
        case 'ArrowRight':
            pacman.direction = 'RIGHT';
            break;
        case 'ArrowUp':
            pacman.direction = 'UP';
            break;
        case 'ArrowDown':
            pacman.direction = 'DOWN';
            break;
    }
});

// Touch controls for mobile devices
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', (event) => {
    touchStartX = event.changedTouches[0].screenX;
    touchStartY = event.changedTouches[0].screenY;
}, false);

document.addEventListener('touchmove', (event) => {
    event.preventDefault(); // Prevent scrolling when touching the canvas
}, false);

document.addEventListener('touchend', (event) => {
    const touchEndX = event.changedTouches[0].screenX;
    const touchEndY = event.changedTouches[0].screenY;
    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;

    if (Math.abs(dx) > Math.abs(dy)) {
        // Horizontal movement
        if (dx > 0) {
            pacman.direction = 'RIGHT';
        } else {
            pacman.direction = 'LEFT';
        }
    } else {
        // Vertical movement
        if (dy > 0) {
            pacman.direction = 'DOWN';
        } else {
            pacman.direction = 'UP';
        }
    }
}, false);

document.getElementById('start-button').addEventListener('click', startGame);