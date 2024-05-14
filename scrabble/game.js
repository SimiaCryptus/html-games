// Place the tile on the board if it's the first move or if it's adjacent to existing tiles

const BOARD_SIZE = 15;
const MIN_WORD_LENGTH = 2; // Define minimum word length for validation

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
let boardBackup = []; // Backup of the board state at the start of the turn
let validWords = new Set();
let currentPlayerTilesBackup = []; // Backup of the player's tiles at the start of the turn
let currentPlayerTiles = [];
let score = 0;
let tilesRemaining = 100;
let lastPlacedTile = null; // Declare lastPlacedTile to keep track of the last placed tile globally

// Helper function to determine if a position is special
function isSpecialPosition(row, col) {
    console.log(`Called isSpecialPosition with row: ${row}, col: ${col}`);
    // Define special positions here
    const specialPositions = {
        'double-word': [[1, 1], [2, 2], [3, 3], [4, 4], [10, 10], [11, 11], [12, 12], [13, 13], [1, 13], [2, 12], [3, 11], [4, 10], [10, 4], [11, 3], [12, 2], [13, 1]],
        'triple-letter': [[5, 1], [5, 2], [5, 3], [5, 4], [9, 10], [9, 11], [9, 12], [9, 13], [1, 5], [2, 5], [3, 5], [4, 5], [10, 9], [11, 9], [12, 9], [13, 9]]
    };
    return Object.keys(specialPositions).some(key => specialPositions[key].some(position => position[0] === row && position[1] === col));
}

// Helper function to get the special type based on position
function getSpecialType(row, col) {
    console.log(`Called getSpecialType with row: ${row}, col: ${col}`);
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

export function revertTilePlacement(row, col) {
    console.log(`Called revertTilePlacement with row: ${row}, col: ${col}`);
    board = JSON.parse(JSON.stringify(boardBackup)); // Restore the board from the backup
    renderBoard(); // Re-render the board to reflect the reverted state
    drawTiles(); // Re-draw the tiles to reflect the reverted state
    currentPlayerTiles = JSON.parse(JSON.stringify(currentPlayerTilesBackup)); // Restore the player's tiles from the backup
}

// Extract a word from the board given a starting position and direction
function getWord(row, col, isHorizontal) {
    console.log(`Called getWord with row: ${row}, col: ${col}, isHorizontal: ${isHorizontal}`);
    console.log(`Extracting word starting at (${row}, ${col}) horizontally: ${isHorizontal}`);
    let word = '';

    let start = isHorizontal ? col : row;
    let end = isHorizontal ? col : row;
    if (isHorizontal) {
        while (start > 0 && board[row][start - 1] !== null) start--;
        while (end < BOARD_SIZE - 1 && board[row][end + 1] !== null) end++;
        end++; // Include the last letter
        for (let i = start; i <= end; i++) {
            if (board[row][i]) word += board[row][i].letter;
        }
    } else {
        while (start > 0 && board[start - 1][col] !== null) start--;
        while (end < BOARD_SIZE - 1 && board[end + 1] !== null) end++;
        end++; // Include the last letter
        for (let i = start; i <= end; i++) {
            if (board[i] && board[i][col]) word += board[i][col].letter;
        }
    }
    console.log(`Extracted word: ${word}`);
    return { word, row, col: start, isHorizontal };
    return word;
}

// Load the dictionary of valid words
function loadDictionary() {
    console.log('Called loadDictionary');
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
    console.log('Called initBoard');
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
    console.log('Called renderBoard');
    const boardElement = document.getElementById('game-board');
    boardElement.innerHTML = ''; // Clear previous board

    board.forEach((row, rowIndex) => {
        const rowElement = document.createElement('div');
        rowElement.className = 'game-row'; // Correct class name for consistency
        row.forEach((cell, cellIndex) => {
            const cellElement = document.createElement('div');
            cellElement.className = 'game-cell'; // Correct class name for consistency
            // Indicate the center of the board
            if (rowIndex === Math.floor(BOARD_SIZE / 2) && cellIndex === Math.floor(BOARD_SIZE / 2)) {
                cellElement.classList.add('center-cell');
            }
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
    console.log('Called drawTiles');
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
    console.log(`Called createTileElement with letter: ${letter}`);
    const tileElement = document.createElement('div');
    tileElement.textContent = letter;
    tileElement.className = 'tile';
    tileElement.id = `tile-${letter}-${Date.now()}`; // Unique id for each tile
    tileElement.draggable = true;
    return tileElement;
}

// Get a random letter from the pool of available tiles
function getRandomLetter() {
    console.log('Called getRandomLetter');
    const letters = Object.keys(LETTER_VALUES);
    const randomIndex = Math.floor(Math.random() * letters.length);
    return letters[randomIndex];
}

// Update game state after placing a tile
export function updateGameState(tile, target) {
    console.log('Called updateGameState');
    console.log('Updating game state...');
    const row = target.getAttribute('data-row');
    const col = target.getAttribute('data-col');
    // Ensure the first move is on the center tile for a standard 15x15 Scrabble board
    if (!tile || !target) return; // Ensure tile and target are valid
    if (isFirstMove() && !(parseInt(row, 10) === 7 && parseInt(col, 10) === 7)) {
        console.error('The first tile must be placed at the center of the board.');
        console.log('Reverting tile placement due to incorrect starting position.');
        revertTilePlacement(row, col);
        return;
    }
    board[row][col] = {letter: tile.textContent, value: LETTER_VALUES[tile.textContent.toUpperCase()]};
    // Remove tile from player's rack
    const tileIndex = currentPlayerTiles.findIndex(t => t.id === tile.id); // Use id to find index
    if (tileIndex > -1) currentPlayerTiles.splice(tileIndex, 1); // Ensure valid index
    if (tileIndex > -1) {
        currentPlayerTiles.splice(tileIndex, 1);
    }
    // Check if new words formed are valid
    lastPlacedTile = target; // Keep track of the last placed tile
    backupBoardState(); // Backup the board state at the start of the turn
    backupPlayerTiles(); // Backup the player's tiles at the start of the turn
}

// Backup the current board state
function backupBoardState() {
    console.log('Called backupBoardState');
    boardBackup = JSON.parse(JSON.stringify(board));
}

// Backup the current player's tiles
function backupPlayerTiles() {
    console.log('Called backupPlayerTiles');
    currentPlayerTilesBackup = JSON.parse(JSON.stringify(currentPlayerTiles));
}
// Check if it's the first move
function isFirstMove() {
    console.log('Called isFirstMove');
    // Ensure board is initialized before checking if it's the first move
    // Ensure board is always initialized at the start of the game
    backupPlayerTiles(); // Backup the player's tiles at the start of the game
    if (typeof board === 'undefined' || board === null) {
        console.error('Board not initialized or incorrectly defined.');
        initBoard(); // Initialize the board if it's not already done
        return true; // Treat as first move if board was uninitialized
    }
    return board.flat().every(cell => cell === null);
}

// Check if the tile placement is adjacent to existing tiles
function isAdjacentToExistingTiles(row, col) {
    console.log(`Called isAdjacentToExistingTiles with row: ${row}, col: ${col}`);
    console.log(`Checking adjacency for tile at position (${row}, ${col})`);
    const adjacentPositions = [
        [row - 1, col], // Up
        [row + 1, col], // Down
        [row, col - 1], // Left
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
export function validateWord(word, row, col, isHorizontal) { // Adjust parameters to accept word string
    console.log(`Called validateWord with word: ${word}, row: ${row}, col: ${col}, isHorizontal: ${isHorizontal}`);
    console.log('Validating word...');
    console.log(`Word to validate: ${word} at position (${row}, ${col}) horizontally: ${isHorizontal}`);
    if (word && word.length >= MIN_WORD_LENGTH) {
        console.log(`Validating word of length ${word.length}: ${word.toUpperCase()}`);
        if (!validWords.has(word.toUpperCase())) {
            console.error(`The word ${word} is not valid.`);
            console.log(`Attempting to revert placement of word: ${word}`);
            revertTilePlacement(row, col);
            console.log(`Reverted placement of invalid word "${word}".`);
            return `The word ${word} is not valid.`; // Return validation result
        }
        updateScore(word); // Update the score based on the valid word
        return `The word ${word} is valid!`;
    } else {
        return null; // Return null if the word is invalid
    }
}

// Calculate and update scores
function updateScore(word = '') {
    console.log(`Called updateScore with word: ${word}`);
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
    console.log('Called reinitializeDragAndDrop');
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
    console.log('Submit word button clicked');
    if (lastPlacedTile && lastPlacedTile.firstChild) {
        const row = parseInt(lastPlacedTile.getAttribute('data-row'), 10);
        const col = parseInt(lastPlacedTile.getAttribute('data-col'), 10);
        const horizontalWord = getWord(row, col, true);
        const verticalWord = getWord(row, col, false);
        validateWord(horizontalWord.word, horizontalWord.row, horizontalWord.col, horizontalWord.isHorizontal); // Validate horizontally
        validateWord(verticalWord.word, verticalWord.row, verticalWord.col, verticalWord.isHorizontal); // Validate vertically
    } else {
        console.error('No tile has been placed to validate.');
    }
}); // Validate the last placed word dynamically and revert if invalid
document.getElementById('reset-game').addEventListener('click', initBoard); // Reset game functionality

// Initialize the game and draw tiles on load
window.onload = () => {
    console.log('Window onload event triggered');
    initBoard(); // drawTiles is now called inside initBoard
};