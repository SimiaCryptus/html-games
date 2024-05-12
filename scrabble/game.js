import { reinitializeDragAndDrop } from './dragdrop.js';
// Constants for game settings
const BOARD_SIZE = 15;
const RACK_SIZE = 7;
const LETTER_VALUES = {
  A: 1, B: 3, C: 3, D: 2, E: 1,
  F: 4, G: 2, H: 4, I: 1, J: 8,
  K: 5, L: 1, M: 3, N: 1, O: 1,
  P: 3, Q: 10, R: 1, S: 1, T: 1,
  U: 1, V: 4, W: 4, X: 8, Y: 4,
  Z: 10
};

// Game state
let board = [];
let currentPlayerTiles = [];
let score = 0;
let tilesRemaining = 100;

// Initialize the game board
function initBoard() {
  console.log('Initializing game board...');
  board = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(null));
  renderBoard();
  currentPlayerTiles = []; // Reset player tiles when initializing the board
  score = 0; // Reset score when initializing the board
  tilesRemaining = 100; // Reset remaining tiles count
  document.getElementById('score-display').textContent = 'Score: 0'; // Update score display
    console.log('Reinitializing drag and drop after initializing board');
}

// Render the game board
function renderBoard() {
  const boardElement = document.getElementById('game-board');
  boardElement.innerHTML = ''; // Clear previous board

  board.forEach((row, rowIndex) => {
    const rowElement = document.createElement('div');
    rowElement.className = 'game-row'; // Correct class name for consistency
    row.forEach((cell, cellIndex) => {
      const cellElement = document.createElement('div');
      cellElement.className = 'game-cell'; // Correct class name for consistency
      cellElement.setAttribute('data-row', rowIndex);
      cellElement.setAttribute('data-col', cellIndex);
      if (cell) {
        const tileElement = document.createElement('span');
        tileElement.textContent = cell.letter;
        tileElement.className = 'tile';
        cellElement.appendChild(tileElement);
      }
      rowElement.appendChild(cellElement);
    });
    boardElement.appendChild(rowElement);
  });
  reinitializeDragAndDrop(); // Ensure drag and drop is initialized after the board is rendered
}

// Draw tiles for the player's rack
function drawTiles() {
  const tileRack = document.getElementById('tile-rack');
  tileRack.innerHTML = ''; // Clear previous tiles

  for (let i = 0; i < RACK_SIZE; i++) {
    if (tilesRemaining > 0) {
      const letter = getRandomLetter();
      const tileElement = createTileElement(letter);
      currentPlayerTiles.push(tileElement);
      tileRack.appendChild(tileElement);
    console.log('Allowing tile drop...');
      tilesRemaining--;
    }
  }
  // Ensure the DOM updates are completed before reinitializing drag and drop
  requestAnimationFrame(() => {
    reinitializeDragAndDrop(); // Ensure drag and drop is initialized after tiles are drawn
  });
}

// Create a tile element
function createTileElement(letter) {
  const tileElement = document.createElement('div');
  tileElement.textContent = letter;
  tileElement.className = 'tile';
  tileElement.id = `tile-${letter}-${Date.now()}`; // Unique id for each tile
  tileElement.draggable = true;
  return tileElement;
}

// Get a random letter from the pool of available tiles
function getRandomLetter() {
  const letters = Object.keys(LETTER_VALUES);
  const randomIndex = Math.floor(Math.random() * letters.length);
  return letters[randomIndex];
}

// Update game state after placing a tile
function updateGameState(tile, target) {
  console.log('Updating game state...');
  const row = target.getAttribute('data-row');
  const col = target.getAttribute('data-col');
  board[row][col] = { letter: tile.textContent, value: LETTER_VALUES[tile.textContent.toUpperCase()] };
  // Remove tile from player's rack
  const tileIndex = currentPlayerTiles.findIndex(t => t.id === tile.id); // Use id to find index
  if (tileIndex > -1) {
    currentPlayerTiles.splice(tileIndex, 1);
  }
  updateScore();
}

// Validate words formed on the board
function validateWord() {
  console.log('Validating word...');
  // Placeholder for word validation logic
}

// Calculate and update scores
function updateScore() {
  // Placeholder for score calculation
  console.log('Updating score...');
  let newScore = 0;
  board.forEach(row => {
    row.forEach(cell => {
      if (cell) {
        newScore += cell.value;
      }
    });
  });
  score = newScore;
  document.getElementById('score-display').textContent = `Score: ${score}`;
  console.log(`Current score: ${score}`);
}

// Event listeners for game controls
document.getElementById('submit-word').addEventListener('click', validateWord);
document.getElementById('reset-game').addEventListener('click', initBoard); // Reset game functionality

// Initialize the game and draw tiles on load
window.onload = () => {
  initBoard();
  drawTiles();
};