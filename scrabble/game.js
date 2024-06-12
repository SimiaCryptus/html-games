// Place the tile on the board if it's the first move or if it's adjacent to existing tiles

import {handleDragStart, handleTileClick, initializeClickToPlace} from "./dragdrop.js";
import { selectedTile } from "./dragdrop.js";

const EXCHANGE_TILE_COUNT = 7; // Number of tiles a player can exchange
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

function logFunctionCall(functionName, ...args) {
    console.log(`Function called: ${functionName} with arguments:`, args);
}

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

export function updateStatusDisplay(message) {
    console.log(`Called updateStatusDisplay with message: ${message}`);
    const statusDisplay = document.getElementById('status-display');
    if (statusDisplay) {
        statusDisplay.textContent = message;
    } else {
        console.error('Status display element not found.');
    }
}

export function revertTilePlacement() {
    console.log('Called revertTilePlacement');
    console.log('Board state before revert:', JSON.stringify(board));
    console.log('Player tiles before revert:', JSON.stringify(currentPlayerTiles));
    board = JSON.parse(JSON.stringify(boardBackup)); // Restore the board from the backup
    currentPlayerTiles = JSON.parse(JSON.stringify(currentPlayerTilesBackup)); // Restore the player's tiles from the backup
    console.log('Re-rendering board...');
    renderBoard(); // Re-render the board to reflect the reverted state
    console.log('Re-drawing tiles...');
    drawTiles(); // Re-draw the tiles to reflect the reverted state
    console.log('Board state after revert:', JSON.stringify(board));
    console.log('Player tiles after revert:', JSON.stringify(currentPlayerTiles));
}

// Extract a word from the board given a starting position and direction
export function getWord(row, col, isHorizontal) {
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
    return {word, row, col: start, isHorizontal};
    return word;
}

// Load the dictionary of valid words
function loadDictionary() {
    console.log('Called loadDictionary');
    fetch(DICTIONARY_URL)
        .then(response => response.text())
        .then(text => {
            validWords = new Set(text.split('\n').map(word => word.trim().toUpperCase()));
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
    backupState(); // Backup the initial state of the board
}

// Render the game board
function renderBoard() {
    console.log('Called renderBoard');
    const boardElement = document.getElementById('game-board');
    boardElement.innerHTML = ''; // Clear previous board

    board.forEach((row, rowIndex) => {
        const rowElement = document.createElement('div');
        rowElement.className = 'game-row';
        row.forEach((cell, cellIndex) => {
            const cellElement = document.createElement('div');
            cellElement.className = 'game-cell';
            cellElement.className = 'game-cell'; // Correct class name for consistency
            // Indicate the center of the board
            if (rowIndex === Math.floor(BOARD_SIZE / 2) && cellIndex === Math.floor(BOARD_SIZE / 2)) {
                cellElement.classList.add('center-cell');
            }
            if (isSpecialPosition(rowIndex, cellIndex) && getSpecialType(rowIndex, cellIndex) !== '') {
                const specialType = getSpecialType(rowIndex, cellIndex);
                cellElement.classList.add(specialType);
            }
            cellElement.setAttribute('data-row', rowIndex);
            cellElement.setAttribute('data-col', cellIndex);
            if (cell && cell.letter) { // Ensure that the cell object has a letter property before trying to display it
                const tileElement = document.createElement('span');
                tileElement.style.display = 'flex'; // Ensure the tile is displayed correctly
                tileElement.style.justifyContent = 'center'; // Center the tile content
                tileElement.textContent = cell.letter;
                tileElement.className = 'tile';
                tileElement.classList.add('placed'); // Add a class to indicate the tile is placed
                cellElement.appendChild(tileElement);
            }
            rowElement.appendChild(cellElement);
        });
        boardElement.appendChild(rowElement);
    });
    try {
        reinitializeDragAndDrop();
        console.log('Drop zones initialized successfully after rendering the board.');
    } catch (error) {
        console.error('Failed to initialize drop zones due to:', error);
    }
    initializeClickToPlace();
    // Moved reinitialization to ensure it happens after the board is fully rendered
}

// Draw tiles for the player's rack
function drawTiles() {
    console.log('Called drawTiles');
    const tileRack = document.getElementById('tile-rack');
    // Do not clear previous tiles, only fill up to RACK_SIZE
    const existingTiles = tileRack.querySelectorAll('.tile').length;
    const tilesToDraw = RACK_SIZE - existingTiles;

     for (let i = 0; i < tilesToDraw; i++) {
        if (tilesRemaining > 0) {
            const letter = getRandomLetter();
            const tileElement = createTileElement(letter);
            currentPlayerTiles.push(tileElement);
            tileRack.appendChild(tileElement.cloneNode(true)); // Append a clone of the tile to the rack
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
        initializeClickToPlace();
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
    tileElement.setAttribute('data-letter', letter); // Store the letter as a data attribute
    return tileElement;
}
const LETTER_DISTRIBUTION = {
    A: 9, B: 2, C: 2, D: 4, E: 12, F: 2, G: 3, H: 2, I: 9, J: 1, K: 1, L: 4,
    M: 2, N: 6, O: 8, P: 2, Q: 1, R: 6, S: 4, T: 6, U: 4, V: 2, W: 2, X: 1,
    Y: 2, Z: 1, _: 2  // Blank tiles
};
// Get a random letter from the pool of available tiles
function getRandomLetter() {
    console.log('Called getRandomLetter');
    const letters = [];
    Object.keys(LETTER_DISTRIBUTION).forEach(letter => {
        for (let i = 0; i < LETTER_DISTRIBUTION[letter]; i++) {
            letters.push(letter);
        }
    });
    const randomIndex = Math.floor(Math.random() * letters.length);
    return letters[randomIndex];
}

 // Modify drawTiles to fill up to RACK_SIZE
// Update game state after placing a tile
export function updateGameState(tile, target) {
    console.log('Called updateGameState');
    console.log('Updating game state...');
    const row = target.getAttribute('data-row');
    const col = target.getAttribute('data-col');
    // Ensure the first move is on the center tile for a standard 15x15 Scrabble board
    if (tile.classList.contains('placed')) {
        return; // Prevent updating game state for already placed tiles
    }
    if (!tile || !target) return; // Ensure tile and target are valid
    if (isFirstMove() && !(parseInt(row, 10) === 7 && parseInt(col, 10) === 7)) {
        console.error('The first tile must be placed at the center of the board.');
        console.log('Reverting tile placement due to incorrect starting position.');
        revertTilePlacement(); // Revert the placement if the first move is not at the center
        return;
    }
    board[row][col] = {letter: tile.textContent, value: LETTER_VALUES[tile.textContent.toUpperCase()]};
    const tileIndex = currentPlayerTiles.findIndex(t => t.getAttribute('data-letter') === tile.getAttribute('data-letter')); // Use data-letter attribute to find index
    if (tileIndex > -1) {
        currentPlayerTiles.splice(tileIndex, 1);
        //selectedTile = null; // Clear the selected tile after updating the game state
        console.log(`Tile ${tile.textContent} removed from player's rack.`);
    }
    tile.style.pointerEvents = 'none'; // Disable pointer events to make the tile non-clickable
    tile.removeEventListener('dragstart', handleDragStart); // Remove dragstart event listener
    tile.removeEventListener('mousedown', handleTileClick); // Remove mousedown event listener
    // Check if new words formed are valid
    lastPlacedTile = target; // Keep track of the last placed tile
}

export function getBoardState() {
    const boardState = [];
    for (let row = 0; row < BOARD_SIZE; row++) {
        const rowState = [];
        for (let col = 0; col < BOARD_SIZE; col++) {
            const cell = document.querySelector(`.game-cell[data-row="${row}"][data-col="${col}"] .tile`);
            rowState.push(cell ? cell.textContent : null);
        }
        boardState.push(rowState);
    }
    return boardState;
}

// Backup the current board state
export function backupState() {
    console.log('Called backupState');
    boardBackup = getBoardState();
    currentPlayerTilesBackup = JSON.parse(JSON.stringify(currentPlayerTiles));
}

// Check if it's the first move
function isFirstMove() {
    console.log('Called isFirstMove');
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
    console.log(`Called isAdjacentToExistingTiles with row: ${row}, col: ${col}`);
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
export function validateWord(word, row, col, isHorizontal) { // Adjust parameters to accept word string
    console.log(`Called validateWord with word: ${word}, row: ${row}, col: ${col}, isHorizontal: ${isHorizontal}`);
    console.log('Validating word...');
    console.log(`Word to validate: ${word} at position (${row}, ${col}) horizontally: ${isHorizontal}`);
    if (word && word.length >= MIN_WORD_LENGTH) {
        console.log(`Validating word of length ${word.length}: ${word.toUpperCase()}`);
        if (!validWords.has(word.toUpperCase())) {
            console.error(`The word ${word} is not valid.`);
            console.log(`Attempting to revert placement of word: ${word}`);
            console.log('Current board state before revert:', JSON.stringify(board));
            console.log('Current player tiles before revert:', JSON.stringify(currentPlayerTiles));
            console.log('Reverting tile placement...');
            revertTilePlacement();
            console.log('Board state after revert:', JSON.stringify(board));
            console.log('Player tiles after revert:', JSON.stringify(currentPlayerTiles));
            console.log(`Reverted placement of invalid word "${word}".`);
            return false; // Return validation result
        }
        updateScore(word); // Update the score based on the valid word
        return true;
    } else {
        console.log(`The word ${word} is invalid.`);
        return false; // Return null if the word is invalid
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
            const tileId = event.dataTransfer.getData('text');
            const tile = document.getElementById(tileId);
            if (!tile) {
                console.error(`Tile with ID ${tileId} not found.`);
                return;
            }
            if (tile.classList.contains('placed')) {
                return; // Prevent reinitializing drag and drop for placed tiles
            }
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
            tile.classList.add('dragging'); // Add dragging class to the tile being dragged
        });
    });
}


function getWordsFromBoard(boardState) {
    const words = [];
    // Check rows for words
    for (let row = 0; row < BOARD_SIZE; row++) {
        let word = '';
        let startCol = 0;
        for (let col = 0; col < BOARD_SIZE; col++) {
            if (boardState[row][col]) {
                if (word === '') startCol = col;
                word += boardState[row][col];
                console.log(`Word so far: ${word} at position (${row}, ${col})`);
            } else {
                if (word.length > 1) {
                    words.push({word, row, col: startCol, isHorizontal: true});
                    console.log(`Word found: ${word} at position (${row}, ${startCol})`);
                }
                word = '';
            }
        }
        if (word.length > 1) {
            words.push({word, row, col: startCol, isHorizontal: true});
            console.log(`Word found: ${word} at position (${row}, ${startCol})`);
        }
    }
    // Check columns for words
    for (let col = 0; col < BOARD_SIZE; col++) {
        let word = '';
        let startRow = 0;
        for (let row = 0; row < BOARD_SIZE; row++) {
            if (boardState[row][col]) {
                if (word === '') startRow = row;
                word += boardState[row][col];
                console.log(`Word so far: ${word} at position (${row}, ${col})`);
            } else {
                if (word.length > 1) {
                    words.push({word, row: startRow, col, isHorizontal: false});
                    console.log(`Word found: ${word} at position (${startRow}, ${col})`);
                }
                word = '';
            }
        }
        if (word.length > 1) {
            words.push({word, row: startRow, col, isHorizontal: false});
            console.log(`Word found: ${word} at position (${startRow}, ${col})`);
        }
    }
    return words;
}


document.getElementById('submit-word').addEventListener('click', () => {
    logFunctionCall('submit-word click event');
    const boardState = getBoardState();
    const wordsToValidate = getWordsFromBoard(boardState);
    if (wordsToValidate.length > 0) {
        let invalidWords = wordsToValidate.filter(wordObj => {
            logFunctionCall('wordsToValidate.forEach', wordObj);
            const validationResult = validateWord(wordObj.word, wordObj.row, wordObj.col, wordObj.isHorizontal === true);
            if (!validationResult) {
                console.log(`Invalid word "${wordObj.word}" detected at row ${wordObj.row}, col ${wordObj.col}, horizontal: ${wordObj.isHorizontal}`);
                console.log('Reverting tile placement...');
                console.log('Invalid word detected, reverting tile placement.');
                console.log('Current board state before revert:', JSON.stringify(boardState));
                revertTilePlacement(); // Revert the board and player's tiles to the backup state
                console.log('Reverted board state:', JSON.stringify(getBoardState()));
                const revertedBoardState = getBoardState();
                console.log('Board state after revert:', JSON.stringify(revertedBoardState));
                return true; // Exit the loop early if an invalid word is detected
            } else {
                console.log(`Valid word "${wordObj.word}" detected at row ${wordObj.row}, col ${wordObj.col}, horizontal: ${wordObj.isHorizontal}`);
                drawTiles(); // Draw new tiles after a valid word is placed
                return false; // Continue the loop if the word is valid
            }
        });
        if (invalidWords && invalidWords.length > 0) {
            updateStatusDisplay(`Invalid words detected: ${invalidWords.map(word => word.word).join(', ')}`);
        } else {
            updateStatusDisplay('All words are valid!');
            backupState(); // Backup the current board state and player's tiles
        }
    } else {
        console.error('No tile has been placed to validate.');
    }
}); // Validate all placed words dynamically

document.getElementById('reset-game').addEventListener('click', initBoard); // Reset game functionality

document.getElementById('exchange-tiles').addEventListener('click', () => {
    logFunctionCall('exchange-tiles click event');
    exchangeTiles();
});
 
// Initialize the game and draw tiles on load
window.onload = () => {
    initBoard(); // drawTiles is now called inside initBoard
};
 
// Exchange tiles function
function exchangeTiles() {
    console.log('Called exchangeTiles');
    if (tilesRemaining < EXCHANGE_TILE_COUNT) {
        console.log('Not enough tiles remaining to exchange.');
        updateStatusDisplay('Not enough tiles remaining to exchange.');
        return;
    }
    currentPlayerTiles.forEach(tile => {
        tile.remove(); // Remove tile from the rack
        tilesRemaining++;
    });
    currentPlayerTiles = [];
    drawTiles(); // Draw new tiles
    console.log('Tiles exchanged successfully.');
}