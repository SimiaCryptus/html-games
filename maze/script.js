// Importing the maze data from mazeData.js
import mazeData from './mazeData.js';

// Select the first level as default
const { grid: maze, start, end } = mazeData.levels[0];
const startPosition = { row: start.y, col: start.x };
const endPosition = { row: end.y, col: end.x };
// Variables to track the player's position and game status
let playerPosition = {...startPosition};
let gameRunning = false;
let timerInterval;
let timeElapsed = 0;

// Function to initialize the game
function initializeGame() {
    document.getElementById('resetButton').addEventListener('click', restartGame);
    document.getElementById('startButton').addEventListener('click', startGame);
    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    drawMaze();
    placePlayer();
}

let touchStartX = 0;
let touchStartY = 0;

function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
    event.preventDefault();
}

function handleTouchMove(event) {
    if (!touchStartX || !touchStartY) {
        return;
    }

    let touchMoveX = event.touches[0].clientX;
    let touchMoveY = event.touches[0].clientY;
    let diffX = touchStartX - touchMoveX;
    let diffY = touchStartY - touchMoveY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal movement
        if (diffX > 0) {
            // Left swipe
            handleKeyPress({ key: 'ArrowLeft' });
        } else {
            // Right swipe
            handleKeyPress({ key: 'ArrowRight' });
        }
    } else {
        // Vertical movement
        if (diffY > 0) {
            // Up swipe
            handleKeyPress({ key: 'ArrowUp' });
        } else {
            // Down swipe
            handleKeyPress({ key: 'ArrowDown' });
        }
    }

    // Reset values
    touchStartX = 0;
    touchStartY = 0;
    event.preventDefault();
}
// Function to draw the maze
function drawMaze() {
    const mazeContainer = document.getElementById('gameArea');
    mazeContainer.innerHTML = ''; // Clear previous maze

    maze.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell', cell === 1 ? 'wall' : 'path');
            if (rowIndex === endPosition.row && colIndex === endPosition.col) {
                cellElement.classList.add('end');
            }
            cellElement.style.top = `${rowIndex * 20}px`;
            cellElement.style.left = `${colIndex * 20}px`;
            mazeContainer.appendChild(cellElement);
        });
    });
}

// Function to place the player in the starting position
function placePlayer() {
    const playerElement = document.createElement('div');
    playerElement.id = 'player';
    playerElement.style.top = `${playerPosition.row * 20}px`;
    playerElement.style.left = `${playerPosition.col * 20}px`;
    document.getElementById('gameArea').appendChild(playerElement);
}

// Function to handle key press events
function handleKeyPress(event) {
    if (!gameRunning) {
        startGame();
    }

    let newPosition = {...playerPosition};
    switch (event.key) {
        case 'ArrowUp':
            newPosition.row--;
            break;
        case 'ArrowDown':
            newPosition.row++;
            break;
        case 'ArrowLeft':
            newPosition.col--;
            break;
        case 'ArrowRight':
            newPosition.col++;
            break;
        default:
            return; // Ignore other keys
    }

    if (isValidMove(newPosition)) {
        updatePlayerPosition(newPosition);
        checkWinCondition();
    }
}

// Function to check if the move is valid
function isValidMove(position) {
    return maze[position.row] && maze[position.row][position.col] === 0;
}

// Function to update the player's position
function updatePlayerPosition(position) {
    playerPosition = position;
    const playerElement = document.getElementById('player');
    playerElement.style.top = `${position.row * 20}px`;
    playerElement.style.left = `${position.col * 20}px`;
}

// Function to check win condition
function checkWinCondition() {
    if (playerPosition.row === endPosition.row && playerPosition.col === endPosition.col) {
        clearInterval(timerInterval);
        gameRunning = false;
        alert('Congratulations! You have completed the maze.');
    }
}

// Function to start the game
function startGame() {
    if (gameRunning) return; // Prevent restarting the game if it's already running
    gameRunning = true;
    timerInterval = setInterval(() => {
        timeElapsed++;
        document.getElementById('timer').textContent = formatTime(timeElapsed);
    }, 1000);
}

// Function to format time from seconds to MM:SS format
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${padZero(minutes)}:${padZero(remainingSeconds)}`;
}

// Helper function to pad time values with zero
function padZero(number) {
    return number.toString().padStart(2, '0');
}

// Function to restart the game
function restartGame() {
    if (!gameRunning) startGame(); // Ensure game starts if not already running when reset
    clearInterval(timerInterval);
    timeElapsed = 0;
    document.getElementById('timer').textContent = '00:00';
    playerPosition = {...startPosition};
    placePlayer();
    gameRunning = false;
}

// Initialize the game when the window loads
window.onload = initializeGame;