// Importing the maze data from mazeData.js
import {generateMaze} from './mazeData.js';

// Helper function to find an open position in the maze
function findOpenPosition(grid, startX, startY) {
    console.log(`Finding open position starting from (${startX}, ${startY}). Grid size: ${grid.length}x${grid[0].length}`);
    for (let y = startY; y < grid.length; y++) {
        for (let x = startX; x < grid[y].length; x++) {
            if (grid[y][x] === 0) {
                console.log(`Open position found at (${x}, ${y}).`);
                return {x: x, y: y};
            }
        }
    }
    console.log(`No open position found. Returning fallback position (${startX}, ${startY}).`);
    return {x: startX, y: startY}; // Fallback to the original position if no open position is found
}

// Variables to store maze size
let mazeWidth = 50;
let mazeHeight = calculateMazeHeight(mazeWidth);
let cellSize = 20; // Default cell size
// Generate the initial maze
let {grid: maze, end} = generateMaze(50, 50);
let start = {x: 1, y: 1};
let startPosition = {row: start.y, col: start.x};
let endPosition = end ? {row: end.y, col: end.x} : {row: 1, col: 1}; // Fallback to (1, 1) if end is null
// Variables to track the player's position and game status
let playerPosition = {...startPosition};
let gameRunning = false;
let timerInterval;
let timeElapsed = 0;

 // Function to initialize the game and show the modal
function initializeKeyboardControls() {
    document.addEventListener('keydown', handleKeyPress);
}
 
function initializeGame() {
    console.log(`Initializing game.`);
   const startButton = document.getElementById('startButton');
   const setSizeButton = document.getElementById('setSizeButton');
   const touchOverlay = document.getElementById('touchOverlay');
  const mazeWidthInput = document.getElementById('mazeWidth');
   
   if (startButton) {
       startButton.addEventListener('click', startGame);
   } else {
       console.error('startButton element not found.');
   }
   
   if (setSizeButton) {
       setSizeButton.addEventListener('click', setMazeSize);
   } else {
       console.error('setSizeButton element not found.');
   }
    
   if (touchOverlay) {
       touchOverlay.addEventListener('touchstart', handleTouchStart, {passive: false});
       touchOverlay.addEventListener('touchmove', handleTouchMove, {passive: false});
   } else {
       console.error('touchOverlay element not found.');
   }

  if (mazeWidthInput) {
      mazeWidthInput.addEventListener('input', setMazeSize);
  } else {
      console.error('mazeWidth input element not found.');
  }

    updateMazeHeight(); // Update maze height based on aspect ratio
    updateCellSize(); // Update cell size based on maze dimensions
    console.log(`Initial maze state:`);
    console.table(maze);
    drawMaze();
    placePlayer();
    console.log(`Game initialized.`);
   showGameModal();
}

initializeKeyboardControls();
 // Function to show the game modal
 function showGameModal() {
     const modal = document.getElementById('gameModal');
     modal.style.display = 'block';
 }
 
 // Function to hide the game modal
 function hideGameModal() {
     const modal = document.getElementById('gameModal');
     modal.style.display = 'none';
 }
function updateMazeHeight() {
    mazeHeight = calculateMazeHeight(mazeWidth);
    if (mazeHeight % 2 === 0) mazeHeight--; // Ensure height is odd
    document.getElementById('mazeHeight').value = mazeHeight;
    console.log(`Maze height updated to ${mazeHeight} based on aspect ratio.`);
}

function calculateMazeHeight(width) {
    const gameArea = document.getElementById('gameArea');
    const aspectRatio = gameArea.clientWidth / gameArea.clientHeight;
    let height = Math.floor(width / aspectRatio) - 1;
    if (height % 2 === 0) height--; // Ensure height is odd
    return height;
}

function updateCellSize() {
    const gameArea = document.getElementById('gameArea');
    const maxWidth = gameArea.clientWidth;
    const maxHeight = gameArea.clientHeight;
    cellSize = Math.min(Math.floor(maxWidth / mazeWidth), Math.floor(maxHeight / mazeHeight));
    console.log(`Cell size updated to ${cellSize}px. Max dimensions: ${maxWidth}x${maxHeight}`);
}

function setMazeSize() {
    console.log(`Setting maze size.`);
    mazeWidth = parseInt(document.getElementById('mazeWidth').value);
    if (isNaN(mazeWidth) || mazeWidth < 5 || mazeWidth > 500) {
        console.error('Invalid maze width. It should be between 5 and 500.');
        return;
    }
    updateMazeHeight();
    console.log(`New maze dimensions: ${mazeWidth}x${mazeHeight}`);
    const {grid: newGrid, end: newEnd} = generateMaze(mazeHeight, mazeWidth);
    maze = newGrid; // Directly update the local 'maze' variable
    // Ensure start and end are not placed inside walls
    start = findOpenPosition(newGrid, 1, 1);
    end = newEnd;
    console.log(`New start position: (${start.x}, ${start.y}). New end position: (${end.x}, ${end.y})`);
    startPosition = {row: start.y, col: start.x};
    endPosition = {row: end.y, col: end.x};
    updateCellSize(); // Update cell size based on new maze dimensions
    console.log(`Updated maze state:`);
    console.table(maze);
    drawMaze();
    placePlayer();
    console.log(`Maze size set to ${mazeWidth}x${mazeHeight}. Start position: (${start.x}, ${start.y}). End position: (${end.x}, ${end.y}).`);
}

let touchStartX = 0;
let touchStartY = 0;

function handleTouchStart(event) {
    const touch = event.touches[0];
    const gameArea = document.getElementById('gameArea');
    const rect = gameArea.getBoundingClientRect();
    touchStartX = touch.clientX - rect.left;
    touchStartY = touch.clientY - rect.top;
    event.preventDefault();
}

function handleTouchMove(event) {
    if (touchStartX === null || touchStartY === null) {
        return;
    }

    const touch = event.touches[0];
    const gameArea = document.getElementById('gameArea');
    const rect = gameArea.getBoundingClientRect();
    const touchMoveX = touch.clientX - rect.left;
    const touchMoveY = touch.clientY - rect.top;
    const diffX = touchStartX - touchMoveX;
    const diffY = touchStartY - touchMoveY;

    if (Math.abs(diffX) > cellSize / 2 || Math.abs(diffY) > cellSize / 2) {
        if (Math.abs(diffX) > Math.abs(diffY)) {
            // Horizontal movement
            if (diffX > 0) {
                // Left swipe
                handleKeyPress({key: 'ArrowLeft'});
            } else {
                // Right swipe
                handleKeyPress({key: 'ArrowRight'});
            }
        } else {
            // Vertical movement
            if (diffY > 0) {
                // Up swipe
                handleKeyPress({key: 'ArrowUp'});
            } else {
                // Down swipe
                handleKeyPress({key: 'ArrowDown'});
            }
        }
        // Reset start positions to allow continuous dragging
        touchStartX = touchMoveX;
        touchStartY = touchMoveY;
    }

    event.preventDefault();
}

function drawMaze() {
    const mazeContainer = document.getElementById('gameArea');
    mazeContainer.innerHTML = ''; // Clear previous maze
    console.log(`Drawing maze.`);

    maze.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell', cell === 1 ? 'wall' : 'path');
            if (rowIndex === endPosition.row && colIndex === endPosition.col) {
                cellElement.classList.add('end');
            }
            cellElement.style.width = `${cellSize}px`;
            cellElement.style.height = `${cellSize}px`;
            cellElement.style.top = `${rowIndex * cellSize}px`;
            cellElement.style.left = `${colIndex * cellSize}px`;
            mazeContainer.appendChild(cellElement);
        });
    });
    console.log(`Maze drawn.`);
}

// Function to place the player in the starting position
function placePlayer() {
    const playerElement = document.createElement('div');
    playerElement.id = 'player';
    playerElement.style.width = `${cellSize}px`;
    playerElement.style.height = `${cellSize}px`;
    playerElement.style.top = `${playerPosition.row * cellSize}px`;
    playerElement.style.left = `${playerPosition.col * cellSize}px`;
    document.getElementById('gameArea').appendChild(playerElement);
    console.log(`Player placed at starting position (${playerPosition.row}, ${playerPosition.col}).`);
}

// Function to handle key press events (arrow keys)
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
            console.log(`Unhandled key pressed: ${event.key}`);
            return; // Ignore other keys
    }

    if (isValidMove(newPosition)) {
        updatePlayerPosition(newPosition);
        checkWinCondition();
    } else {
        //console.log(`Invalid move to position (${newPosition.row}, ${newPosition.col}).`);
    }
}

// Function to check if the move is valid
function isValidMove(position) {
    //console.log(`Checking if move to position (${position.row}, ${position.col}) is valid.`);
    return maze[position.row] && maze[position.row][position.col] === 0;
}

// Function to update the player's position
function updatePlayerPosition(position) {
    playerPosition = position;
    const playerElement = document.getElementById('player');
    playerElement.style.top = `${position.row * cellSize}px`;
    playerElement.style.left = `${position.col * cellSize}px`;
    console.log(`Player position updated to (${position.row}, ${position.col}). Current player position:`);
}

// Function to check win condition
function checkWinCondition() {
    if (playerPosition.row === endPosition.row && playerPosition.col === endPosition.col) {
        clearInterval(timerInterval);
        gameRunning = false;
        console.log(`Player has reached the end position. Game won.`);
        alert('Congratulations! You have completed the maze.');
    } else {
        //console.log(`Player has not yet reached the end position.`);
    }
}

 // Function to start the game and hide the modal
function startGame() {
    if (gameRunning) return; // Prevent restarting the game if it's already running
   hideGameModal();
    gameRunning = true;
    console.log(`Game started.`);
    timerInterval = setInterval(() => {
        timeElapsed++;
        document.getElementById('timer').textContent = formatTime(timeElapsed);
        console.log(`Time elapsed: ${timeElapsed} seconds.`);
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

 // Function to restart the game and show the modal
function restartGame() {
    if (!gameRunning) startGame(); // Ensure game starts if not already running when reset
    clearInterval(timerInterval);
    timeElapsed = 0;
    document.getElementById('timer').textContent = '00:00';
    playerPosition = {...startPosition};
    placePlayer();
    gameRunning = false;
    console.log(`Game restarted. Current player position:`);
    console.table(playerPosition);
    console.log(`Game restarted.`);
   showGameModal();
}

// Initialize the game when the window loads
window.onload = initializeGame;