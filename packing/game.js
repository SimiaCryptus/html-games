const canvas = document.getElementById('game-board');
const context = canvas.getContext('2d');
const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 30;
const LINES_PER_LEVEL = 10;

        console.log('Rotation complete. Current shape:', this.shape);

canvas.width = COLS * BLOCK_SIZE;
canvas.height = ROWS * BLOCK_SIZE;

class Piece {
    constructor(type) {
        this.type = type;
        this.initShape();
        // Initialize more properties and methods as needed
    }

    initShape() {
        const shapes = {
            'I': [
                [1, 1, 1, 1]
            ],
            'L': [
                [0, 0, 1],
                [1, 1, 1]
            ],
            'J': [
                [1, 0, 0],
                [1, 1, 1]
            ],
            'O': [
                [1, 1],
                [1, 1]
            ],
            'T': [
                [0, 1, 0],
                [1, 1, 1]
            ],
            'S': [
                [0, 1, 1],
                [1, 1, 0]
            ],
            'Z': [
                [1, 1, 0],
                [0, 1, 1]
            ]
        };
        this.shape = shapes[this.type];
        this.x = Math.floor((COLS - this.shape[0].length) / 2);
        this.y = 0;
    }

    rotate(direction) {
        console.log('Rotating piece. Current shape:', this.shape);
        console.log('Rotation direction:', direction);
        const newShape = this.shape[0].map((_, index) =>
            this.shape.map(row => row[index])
        );
        console.log('New shape after rotation:', newShape);
        if (direction > 0) newShape.forEach(row => row.reverse());
        else newShape.reverse();
        console.log('New shape after direction adjustment:', newShape);
        console.log('Checking if new position is valid. x:', this.x, 'y:', this.y);
        if (this.isValidMove(this.x, this.y, newShape)) {
            console.log('New position is valid. Updating shape.');
            this.shape = newShape;
        } else {
            console.log('New position is not valid. Rotation canceled.');
        }
    }

    draw() {
        // Example logic to draw the piece on the board
        context.fillStyle = 'red'; // Placeholder color
        // Assuming piece data structure as 2D array where 1 represents filled block
        this.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    drawBlock(this.x + x, this.y + y, context.fillStyle);
                }
            });
        });
    }

    moveDown() {
        // Example logic to move the piece down
        this.y += 1;
        if (!this.isValidMove(this.x, this.y, this.shape)) {
            this.y -= 1; // Revert move if not valid
            this.lock(); // Lock the piece and switch to a new one
        }
    }

    // Additional methods to support moveDown
    isValidMove(x, y, shape) {
        // Placeholder for valid move checking logic
        for (let i = 0; i < shape.length; i++) {
            for (let j = 0; j < shape[i].length; j++) {
                if (shape[i][j]) {
                    let newX = x + j;
                    let newY = y + i;
                    if (newX < 0 || newX >= COLS || newY >= ROWS || board[newY][newX]) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    lock() {
        // Lock the piece on the board
        this.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    board[this.y + y][this.x + x] = value;
                }
            });
        });
        
        // Check for completed lines
        let clearedLines = 0;
        for (let y = 0; y < ROWS; y++) {
            if (board[y].every(cell => cell !== 0)) {
                board.splice(y, 1);
                board.unshift(Array(COLS).fill(0));
                clearedLines++;
            }
        }
        updateScore(clearedLines);
        
        // Create a new piece
        currentPiece = createPiece();
        
        // Check if the game is over
        checkGameOver();
    }
}

let board = [];
let currentPiece;
let gameRunning = false;
let score = 0;
let lines = 0;
let level = 1;
let dropStart = Date.now();
let gameOver = false;

function resetBoard() {
    board = Array.from({length: ROWS}, () => Array(COLS).fill(0));
}

function createPiece() {
    const pieces = 'ILJOTSZ';
    const rand = pieces[Math.floor(Math.random() * pieces.length)];
    console.log('Creating new piece:', rand);
    return new Piece(rand);
}

function drawBoard() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            if (board[y][x] !== 0) {
                drawBlock(x, y, board[y][x]);
            }
        }
    }
    if (currentPiece) {
        currentPiece.draw();
    }
}

function drawBlock(x, y, color) {
    context.fillStyle = color;
    context.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    context.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

function drop() {
    let now = Date.now();
    let delta = now - dropStart;
    if (!gameRunning) return;
    if (delta > 1000 - level * 100) {
        currentPiece.moveDown();
        dropStart = Date.now();
    }
    drawBoard();
    if (!gameOver) {
        requestAnimationFrame(drop);
    }
}

function updateScore(clearedLines) {
    score += clearedLines * 10;
    lines += clearedLines;
    if (lines >= LINES_PER_LEVEL) {
        level++;
        lines -= LINES_PER_LEVEL;
    }
    document.getElementById('score').innerText = score;
    // Ensure level display element exists and is updated correctly
    const levelElement = document.getElementById('level');
    if (levelElement) {
        levelElement.innerText = level;
    }
    if (!gameRunning) return;
    if (document.getElementById('level')) {
        document.getElementById('level').innerText = level;
    }
}

function checkGameOver() {
    if (!gameRunning) return;
    // Actual game over logic
    gameOver = board[0].some(cell => cell !== 0); // Check if any cell in the top row is not empty
    console.log('Checking game over. Status:', gameOver);
    if (gameOver) {
        alert("Game Over!");
    }
}

function startGame() {
    resetBoard();
    currentPiece = createPiece();
    console.log('Game started. Current piece:', currentPiece.type);
    gameRunning = true;  // Corrected multiple assignments to gameRunning
    gameOver = false;
    score = 0;
    lines = 0;
    level = 1;
    updateScore(0);
    dropStart = Date.now();  // Ensure the drop timer is reset when the game starts
    drop();
}

document.addEventListener('keydown', (event) => {
    if (!gameRunning) return;
    switch (event.key) {
        case 'ArrowLeft':
            if (currentPiece.isValidMove(currentPiece.x - 1, currentPiece.y, currentPiece.shape)) {
                currentPiece.x -= 1;
            }
            break;
        case 'ArrowRight':
            if (currentPiece.isValidMove(currentPiece.x + 1, currentPiece.y, currentPiece.shape)) {
                currentPiece.x += 1;
            }
            break;
        case 'ArrowDown':
            currentPiece.moveDown();
            break;
    case 'ArrowUp':
        while (currentPiece.isValidMove(currentPiece.x, currentPiece.y + 1, currentPiece.shape)) {
            currentPiece.y++;
        }
        currentPiece.lock();
        break;
        case 'q':
            // Rotate piece counter-clockwise
            currentPiece.rotate(-1);
            break;
        case 'w':
            // Rotate piece clockwise
            currentPiece.rotate(1);
            break;
    }
    drawBoard();
});
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('startButton').addEventListener('click', startGame);
});