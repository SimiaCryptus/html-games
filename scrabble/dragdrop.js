import {updateGameState} from './game.js';
import {validateWord} from './game.js'; // Import validateWord function
import {getWord} from './game.js'; // Import getWord function
import {revertTilePlacement} from './game.js'; // Import revertTilePlacement function

function logFunctionCall(functionName, ...args) {
    console.log(`Function called: ${functionName} with arguments:`, args);
}
function logFunctionReturn(functionName, returnValue) {
    console.log(`Function returned: ${functionName} with value:`, returnValue);
 }

let lastPlacedTile = null; // Ensure lastPlacedTile is defined
document.addEventListener('DOMContentLoaded', () => {
    logFunctionCall('DOMContentLoaded');
    initializeDragAndDrop();
    console.log('Drag and drop initialized.');
    initializeDropZones();

});

function displayValidationResults(results) {
    logFunctionCall('displayValidationResults', results);
    const validationResultsElement = document.getElementById('validation-results');
    validationResultsElement.innerHTML = ''; // Clear previous results
    results.forEach(result => {
        const resultElement = document.createElement('div');
        resultElement.textContent = result;
        validationResultsElement.appendChild(resultElement);
    });
}

document.getElementById('submit-word').addEventListener('click', () => {
    logFunctionCall('submit-word click event');
   const boardState = getBoardState();
   const wordsToValidate = getWordsFromBoard(boardState);
   if (wordsToValidate.length > 0) {
        let validationResults = [];
       wordsToValidate.forEach(wordObj => {
            logFunctionCall('wordsToValidate.forEach', wordObj);
            const validationResult = validateWord(wordObj.word, wordObj.row, wordObj.col, wordObj.isHorizontal === true);
            if (validationResult) {
                validationResults.push(validationResult);
            } else {
                revertTilePlacement(); // Revert the board and player's tiles to the backup state
            }
        });
        displayValidationResults(validationResults);
    } else {
        console.error('No tile has been placed to validate.');
    }
}); // Validate all placed words dynamically

function getBoardState() {
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
function updateStatusDisplay(message) {
    logFunctionCall('updateStatusDisplay', message);
    const statusDisplay = document.getElementById('status-display');
    if (statusDisplay) {
        statusDisplay.textContent = message;
    } else {
        console.error('Status display element not found.');
    }
}

function initializeDropZones() {
    logFunctionCall('initializeDropZones');
    const cells = document.querySelectorAll('.game-cell');
    console.log(`Initializing drop zones for ${cells.length} cells`);

    cells.forEach(cell => {
        cell.addEventListener('dragover', handleDragOver);
        cell.addEventListener('dragenter', handleDragEnter);
        cell.addEventListener('dragleave', handleDragLeave);
        cell.addEventListener('drop', handleDrop);
    });
}

function handleDragStart(event) {
    logFunctionCall('handleDragStart', event);
    console.log(`Drag started for tile ${event.target.textContent}`);
    event.dataTransfer.setData('text/plain', event.target.id);
    event.dataTransfer.effectAllowed = 'move';
    if (event.target && event.target.classList) {
        event.target.classList.add('dragging'); // Cannot read properties of undefined (reading 'add')
    }
}

function handleDragOver(event) {
    logFunctionCall('handleDragOver', event);
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
}

function handleDragEnter(event) {
    logFunctionCall('handleDragEnter', event);
    console.log('Drag entered a drop zone');
    event.preventDefault();
    if (event.target.classList.contains('game-cell') && !event.target.firstChild) {
        event.target.classList.add('over'); // Only add 'over' class if drop is valid
    }
}

function handleDragLeave(event) {
    logFunctionCall('handleDragLeave', event);
    console.log('Drag left a drop zone');
    event.preventDefault();
    if (event.target.classList.contains('over')) {
        event.target.classList.remove('over');
    }
}

function handleDrop(event) {
    logFunctionCall('handleDrop', event);
    event.preventDefault();
    event.stopPropagation();
    const id = event.dataTransfer.getData('text/plain');
    const draggableElement = document.getElementById(id);
    let dropZone = event.target;

    // Ensure that the dropZone is correctly targeted, considering that the drop might be on a child element or the tile itself
    dropZone = dropZone.closest('.game-cell');

    if (!draggableElement) return; // Ensure draggableElement is valid
    console.log(`Attempting to drop tile ${draggableElement.textContent} into cell at position (${dropZone.getAttribute('data-row')}, ${dropZone.getAttribute('data-col')})`); // Cannot read properties of null (reading 'textContent')
    console.log(`Draggable element ID: ${draggableElement.id}`);
    // Check if the drop zone is a valid target (game cell) and not already occupied
    if (dropZone && !dropZone.firstChild) { // Simplified check for dropZone emptiness
        dropZone.appendChild(draggableElement);
        dropZone.classList.remove('over');
        updateGameState(draggableElement, dropZone); // Update game state when a tile is dropped
        console.log(`Tile ${draggableElement.textContent} successfully moved to position (${dropZone.getAttribute('data-row')}, ${dropZone.getAttribute('data-col')})`);
        console.log('Tile dropped successfully');
        lastPlacedTile = dropZone; // Update lastPlacedTile to the current drop zone
    } else {
        // Handle invalid drop (e.g., slot already has a tile)
        console.log('Invalid drop location');
        draggableElement.style.backgroundColor = 'red'; // Visual feedback for invalid move
        setTimeout(() => {
            draggableElement.style.backgroundColor = '';
        }, 1500); // Reset visual feedback after delay
        console.error('Invalid tile or target');
        console.log(`Failed to drop tile ${draggableElement.textContent} into cell at position (${dropZone.getAttribute('data-row')}, ${dropZone.getAttribute('data-col')})`);
        console.log(`Drop zone already occupied: ${dropZone.firstChild ? 'Yes' : 'No'}`);
    }
}

function handleDragEnd(event) {
    logFunctionCall('handleDragEnd', event);
    if (event.target && event.target.classList) {
        console.log(`Drag ended for tile ${event.target.textContent}`);
        event.target.classList.remove('dragging'); // Cannot read properties of undefined (reading 'remove')
        // Additional cleanup or state updates can be performed here
    }
}

function initializeDragAndDrop() {
    logFunctionCall('initializeDragAndDrop');
    const tiles = document.querySelectorAll('.tile');
    console.log(`Initializing drag and drop for ${tiles.length} tiles`);

    // Ensure that the tiles are interactable and the event listeners are properly attached
    tiles.forEach(tile => {
        if (!tile.getAttribute('draggable')) {
            tile.setAttribute('draggable', 'true');
        }
        tile.addEventListener('dragstart', handleDragStart);
        tile.addEventListener('dragend', handleDragEnd);
        console.log('Drag and drop event listeners added to tiles');
    });
    // Removed the premature call to initializeDropZones to avoid reference errors
    console.log('Initialization of drag and drop completed, awaiting drop zone setup...');

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
                    words.push({ word, row, col: startCol, isHorizontal: true });
                    console.log(`Word found: ${word} at position (${row}, ${startCol})`);
                }
                word = '';
            }
        }
        if (word.length > 1) {
            words.push({ word, row, col: startCol, isHorizontal: true });
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
                    words.push({ word, row: startRow, col, isHorizontal: false });
                    console.log(`Word found: ${word} at position (${startRow}, ${col})`);
                }
                word = '';
            }
        }
        if (word.length > 1) {
            words.push({ word, row: startRow, col, isHorizontal: false });
            console.log(`Word found: ${word} at position (${startRow}, ${col})`);
        }
    }
    return words;
}