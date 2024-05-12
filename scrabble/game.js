// Place the tile on the board if it's the first move or if it's adjacent to existing tiles

const BOARD_SIZE = 15;

const RACK_SIZE = 7;
const LETTER_VALUES = {
    A: 1,
    B: 3,
    C: 3,
    D: 2,
    E: 1,
    F: 4,
    G: 2,
    H: 4,
    I: 1,
    J: 8,
    K: 5,
    L: 1,
    M: 3,
    N: 1,
    O: 1,
    P: 3,
    Q: 10,
    R: 1,
    S: 1,
    T: 1,
    U: 1,
    V: 4,
    W: 4,
    X: 8,
    Y: 4,
    Z: 10
};

// Game state
// Path to the dictionary file
const DICTIONARY_URL = 'Collins_Scrabble_Words_2019.txt';
let board = Array.from({length: BOARD_SIZE}, () => Array(BOARD_SIZE).fill(null));
let validWords = new Set();
let currentPlayerTiles = [];
let score = 0;
let tilesRemaining = 100;
let lastPlacedTile = null; // Declare lastPlacedTile to keep track of the last placed tile globally

// Helper function to determine if a position is special
function isSpecialPosition(row, col) {
    // Define special positions here
    const specialPositions = {
        'double-word': [[1, 1], [2, 2], [3, 3], [4, 4], [10, 10], [11, 11], [12, 12], [13, 13], [1, 13], [2, 12], [3, 11], [4, 10], [10, 4], [11, 3], [12, 2], [13, 1]],
        'triple-letter': [[5, 1], [5, 2], [5, 3], [5, 4], [9, 10], [9, 11], [9, 12], [9, 13], [1, 5], [2, 5], [3, 5], [4, 5], [10, 9], [11, 9], [12, 9], [13, 9]]
    };
    return Object.keys(specialPositions).some(key => specialPositions[key].some(position => position[0] === row && position[1] === col));
}

// Helper function to get the special type based on position
function getSpecialType(row, col) {
    const specialPositions = {
        'double-word': [[1, 1], [2, 2], [3, 3], [4, 4], [10, 10], [11, 11], [12, 12], [13, 13], [1, 13], [2, 12], [3, 11], [4, 10], [10, 4], [11, 3], [12, 2], [13, 1]],
        'triple-letter': [[5, 1], [5, 2], [5, 3], [5, 4], [9, 10], [9, 11], [9, 12], [9, 13], [1, 5], [2, 5], [3, 5], [4, 5], [10, 9], [11, 9], [12, 9], [13, 9]]
    };
    for (let type in specialPositions) {
        if (specialPositions[type].some(position => position[0] === row && position[1] === col)) {
            return type;
        }
    }
    return '';
}

function revertTilePlacement(row, col) {
    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    const tile = cell.firstChild;
    if (tile) {
        document.getElementById('tile-rack').appendChild(tile); // Move the tile back to the rack
        board[row][col] = null; // Clear the cell on the board
    }
}

// Extract a word from the board given a starting position and direction
function getWord(row, col, isHorizontal) {
    let word = '';
    let start = col;

    let end = col;
    if (isHorizontal) {
        while (start > 0 && board[row][start - 1] !== null) start--;
        while (end < BOARD_SIZE - 1 && board[row][end + 1] !== null) end++;
        for (let i = start; i <= end; i++) {
            if (board[row][i]) word += board[row][i].letter;
        }
    } else {
        while (row > 0 && board[row - 1][col] !== null) row--;
        while (row < BOARD_SIZE - 1 && board[row + 1][col] !== null) row++;
        for (let i = row; i <= col; i++) {
            if (board[i][col]) word += board[i][col].letter;
        }
    }
    return word;
}

// Load the dictionary of valid words
function loadDictionary() {
    fetch(DICTIONARY_URL)
        .then(response => response.text())
        .then(text => {
            validWords = new Set(text.split('\n'));
            console.log('Dictionary loaded successfully');
        })
        .catch(error => {
            console.error('Failed to load the dictionary:', error);
        });
}

// Initialize the game board
function initBoard() {
    console.log('Initializing game board...');
    renderBoard();
    currentPlayerTiles = []; // Reset player tiles when initializing the board
    score = 0; // Reset score when initializing the board
    tilesRemaining = 100; // Reset remaining tiles count
    document.getElementById('score-display').textContent = 'Score: 0'; // Update score display
    drawTiles(); // Ensure tiles are drawn before initializing drag and drop
    loadDictionary(); // Load the dictionary when the game initializes
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
            // Apply special styles based on position
            if (isSpecialPosition(rowIndex, cellIndex) && getSpecialType(rowIndex, cellIndex) !== '') {
                const specialType = getSpecialType(rowIndex, cellIndex);
                cellElement.classList.add(specialType);
            }
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
    // Ensure drop zones are initialized after rendering the board
    try {
        reinitializeDragAndDrop();
        console.log('Drop zones initialized successfully after rendering the board.');
    } catch (error) {
        console.error('Failed to initialize drop zones due to:', error);
    }
    // Moved reinitialization to ensure it happens after the board is fully rendered
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
            console.log(`Tile ${letter} created and added to the rack.`);
            tilesRemaining--;
        }
    }
    console.log('Reinitializing drag and drop for newly drawn tiles');
    setTimeout(() => {
        try {
            reinitializeDragAndDrop();
            console.log('Drag and drop reinitialized successfully after drawing new tiles.');
        } catch (error) {
            console.error('Failed to reinitialize drag and drop due to:', error);
        }
    }, 0); // Use setTimeout to ensure DOM updates are complete
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
export function updateGameState(tile, target) {
    console.log('Updating game state...');
    const row = target.getAttribute('data-row');
    const col = target.getAttribute('data-col');
    // Ensure the first move is on the center tile for a standard 15x15 Scrabble board
    if (isFirstMove() && (row === 7 && col === 7)) {
        console.error('The first tile must be placed at the center of the board.');
        console.log('Reverting tile placement due to incorrect starting position.');
        revertTilePlacement(row, col);
        return;
    }
    board[row][col] = {letter: tile.textContent, value: LETTER_VALUES[tile.textContent.toUpperCase()]};
    // Remove tile from player's rack
    const tileIndex = currentPlayerTiles.findIndex(t => t.id === tile.id); // Use id to find index
    if (tileIndex > -1) {
        currentPlayerTiles.splice(tileIndex, 1);
    }
    updateScore();
    // Check if new words formed are valid
    validateWord(row, col, true); // Validate horizontally and vertically
    validateWord(row, col);
    lastPlacedTile = target; // Keep track of the last placed tile
}

// Check if it's the first move
function isFirstMove() {
    // Ensure board is initialized before checking if it's the first move
    // Ensure board is always initialized at the start of the game
    if (typeof board === 'undefined' || board === null) {
        console.error('Board not initialized or incorrectly defined.');
        initBoard(); // Initialize the board if it's not already done
        return true; // Treat as first move if board was uninitialized
    }
    return board.flat().every(cell => cell === null);
}

// Check if the tile placement is adjacent to existing tiles
function isAdjacentToExistingTiles(row, col) {
    console.log(`Checking adjacency for tile at position (${row}, ${col})`);
   const adjacentPositions = [
       [row - 1, col], // Up
       [row + 1, col], // Down
       [row, col - 1], // Left
       [row, col + 1]  // Right
   ].filter(([r, c]) => r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE); // Ensure positions are within board limits
    let isAdjacent = false;
    // Skip adjacency check if it's the first move
    if (isFirstMove()) {
        console.log('First move, skipping adjacency check.');
        return true;
    }
    adjacentPositions.forEach(([r, c]) => {
       const result = board[r][c] !== null;
        console.log(`Checking position (${r}, ${c}): ${result ? 'Adjacent' : 'Not adjacent'}`);
        if (result) isAdjacent = true;
    });
    console.log(`Tile at (${row}, ${col}) is ${isAdjacent ? '' : 'not '}adjacent to any existing tiles.`);
    if (!isAdjacent) {
        console.log(`Tile at (${row}, ${col}) failed adjacency check. Reverting placement.`);
        revertTilePlacement(row, col);
    }
    return isAdjacent;
}

// Validate words formed on the board
function validateWord(row, col, isHorizontal = true) { // Default to horizontal if not specified
    console.log('Validating word...');
    const word = getWord(row, col, isHorizontal); // This function needs to correctly extract the word considering both directions
    console.log(`Word to validate: ${word} at position (${row}, ${col}) horizontally: ${isHorizontal}`);
    if (word && word.length > 1) {
        console.log(`Validating word of length ${word.length}: ${word}`);
        if (!validWords.has(word.toUpperCase())) {
            console.error(`The word ${word} is not valid.`);
            console.log(`Attempting to revert placement of word: ${word}`);
            revertTilePlacement(row, col);
            console.log(`Reverted placement of invalid word "${word}".`);
            return; // Stop further processing if word is invalid
        }
    } else {
        console.log(`No valid word formed or word too short to validate: ${word}`);
        console.log(`Skipping validation for "${word}" due to insufficient length or missing tiles.`);
        return; // Stop further processing if word is too short
    }
    // Proceed with score calculation if word is valid
}

// Calculate and update scores
function updateScore(word = '') {
    // Placeholder for score calculation
    console.log('Updating score...');
    if (word) {
        let wordScore = 0;
        for (let char of word) {
            wordScore += LETTER_VALUES[char.toUpperCase()];
        }
        score += wordScore;
    }
    document.getElementById('score-display').textContent = `Score: ${score}`;
    console.log(`Current score: ${score}`);
}

// Reinitialize drag and drop functionality for game cells
function reinitializeDragAndDrop() {
    const gameCells = document.querySelectorAll('.game-cell');
    gameCells.forEach(cell => {
        cell.addEventListener('dragover', (event) => {
            event.preventDefault(); // Necessary to allow dropping
        });
        cell.addEventListener('drop', (event) => {
            event.preventDefault();
            const tile = document.getElementById(event.dataTransfer.getData('text'));
            // Prevent placing a tile if the cell is already occupied
            if (cell.firstChild) {
                console.error('This cell is already occupied.');
                return;
            }
            // Check if the move is valid before proceeding
            const row = parseInt(cell.getAttribute('data-row'), 10);
            const col = parseInt(cell.getAttribute('data-col'), 10);
            if (isAdjacentToExistingTiles(row, col) || isFirstMove()) {
                cell.appendChild(tile);
                updateGameState(tile, cell);
            }
        });
    });
    // Reinitialize drag functionality for tiles on the rack
    const tilesOnRack = document.querySelectorAll('.tile');
    tilesOnRack.forEach(tile => {
        tile.addEventListener('dragstart', (event) => {
            event.dataTransfer.setData('text', tile.id);
        });
    });
}
// Event listeners for game controls
document.getElementById('submit-word').addEventListener('click', () => {
    if (lastPlacedTile && lastPlacedTile.firstChild) {
        const row = parseInt(lastPlacedTile.getAttribute('data-row'), 10);
        const col = parseInt(lastPlacedTile.getAttribute('data-col'), 10);
        validateWord(row, col, true); // Validate horizontally
        validateWord(row, col, false); // Validate vertically
    } else {
        console.error('No tile has been placed to validate.');
    }
}); // Validate the last placed word dynamically
document.getElementById('reset-game').addEventListener('click', initBoard); // Reset game functionality

// Initialize the game and draw tiles on load
window.onload = () => {
    initBoard(); // drawTiles is now called inside initBoard
};