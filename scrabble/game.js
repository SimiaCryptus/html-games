// Constants for game settings
const BOARD_SIZE = 15;
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

// Initialize the game board
function initBoard() {
  console.log('Initializing game board...');
  board = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(null));
  renderBoard();
  currentPlayerTiles = []; // Reset player tiles when initializing the board
  score = 0; // Reset score when initializing the board
  document.getElementById('score-display').textContent = 'Score: 0'; // Update score display
}

// Render the game board
function renderBoard() {
  console.log('Rendering game board...');
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
      cellElement.ondrop = (event) => dropTile(event);
      cellElement.ondragover = (event) => allowDrop(event);
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
}

// Allow dropping tiles
function allowDrop(event) {
  console.log('Allowing tile drop...');
  event.preventDefault();
}

// Handle dropping tiles on the board
function dropTile(event) {
  event.preventDefault();
  const data = event.dataTransfer.getData("text");
  const tile = document.getElementById(data);
  const target = event.target;
  console.log(`Dropping tile ${tile.textContent} at row ${target.getAttribute('data-row')}, col ${target.getAttribute('data-col')}`);

  if (target.className === 'game-cell' && !target.firstChild) {
    target.appendChild(tile);
    updateGameState(tile, target);
  }
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

// Initialize the game on load
window.onload = initBoard;