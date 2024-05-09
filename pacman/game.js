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
let lastPacmanMoveTime = 0;
let ghosts = [
    {x: 3, y: 3, direction: 'LEFT'},
    {x: 3, y: 16, direction: 'RIGHT'},
];
let board = [];

function initBoard() {
    board = Array(numRows).fill().map(() => Array(numCols).fill(1));

    // Generate symmetrical maze
    for (let y = 0; y < numRows / 2; y++) {
        for (let x = 0; x < numCols / 2; x++) {
            // Randomly decide to place a wall, ensuring symmetry
            const isWall = Math.random() < 0.2; // 30% chance to be a wall
            board[y][x] = isWall ? 1 : 0;
            board[y][numCols - x - 1] = isWall ? 1 : 0;
            board[numRows - y - 1][x] = isWall ? 1 : 0;
            board[numRows - y - 1][numCols - x - 1] = isWall ? 1 : 0;
        }
    }

    // Generate walls

    // Fill remaining spaces with dots
    for (let y = 1; y < numRows - 1; y++) {
        for (let x = 1; x < numCols - 1; x++) {
            if (board[y][x] === 0) {
                board[y][x] = 2;
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
    // console.log('Drawing Pacman at:', pacman.x, pacman.y);

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
    const now = Date.now();
    if (now - lastPacmanMoveTime < gameSpeed) return;
    lastPacmanMoveTime = now;
    // Implement Pacman movement logic based on direction
    // This is a simplified placeholder logic
    switch (pacman.direction) {
        case 'LEFT':
           if (board[pacman.y][(pacman.x - 1 + numCols) % numCols] !== 1) {
               pacman.x = (pacman.x - 1 + numCols) % numCols;
           }
            // console.log('Moving LEFT to:', pacman.x, pacman.y);
            break;
        case 'RIGHT':
           if (board[pacman.y][(pacman.x + 1) % numCols] !== 1) {
               pacman.x = (pacman.x + 1) % numCols;
           }
            // console.log('Moving RIGHT to:', pacman.x, pacman.y);
            break;
        case 'UP':
           if (board[(pacman.y - 1 + numRows) % numRows][pacman.x] !== 1) {
               pacman.y = (pacman.y - 1 + numRows) % numRows;
           }
            // console.log('Moving UP to:', pacman.x, pacman.y);
            break;
        case 'DOWN':
           if (board[(pacman.y + 1) % numRows][pacman.x] !== 1) {
               pacman.y = (pacman.y + 1) % numRows;
           }
            // console.log('Moving DOWN to:', pacman.x, pacman.y);
            break;
    }
}

function moveGhosts() {
    // Improved random movement for ghosts
    // Adding a delay to slow down ghost movement
    if (!this.lastMoveTime || (Date.now() - this.lastMoveTime > 500)) {
        this.lastMoveTime = Date.now();
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
            pacman.direction = 'LEFT'; // Corrected to set direction
                if (pacman.x > 0 && board[pacman.y][pacman.x - 1] !== 1) pacman.x--;
            break;
        case 'ArrowRight':
            pacman.direction = 'RIGHT';
            pacman.y += Math.round(tilesToMoveY); // Move Pacman based on finger movement
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
    if (event.target == canvas) {
        event.preventDefault();
        // Removed preventDefault here, will set listener as non-passive instead
    }
    touchStartX = event.changedTouches[0].screenX;
    touchStartY = event.changedTouches[0].screenY;
}, { passive: false }); // Set the listener as non-passive

document.addEventListener('touchmove', (event) => {
    event.preventDefault();
    const touchCurrentX = event.changedTouches[0].screenX;
    const touchCurrentY = event.changedTouches[0].screenY;
    const dx = touchCurrentX - touchStartX;
    const dy = touchCurrentY - touchStartY;
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
}, { passive: false }); // Set the listener as non-passive

document.getElementById('start-button').addEventListener('click', startGame);