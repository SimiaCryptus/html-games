import {backupState, revertTilePlacement, updateGameState, updateStatusDisplay, validateWord, getBoardState} from './game.js'; // Import revertTilePlacement function // Import updateStatusDisplay function // Import validateWord function

const BOARD_SIZE = 15;

function logFunctionCall(functionName, ...args) {
    console.log(`Function called: ${functionName} with arguments:`, args);
}

function logFunctionReturn(functionName, returnValue) {
    console.log(`Function returned: ${functionName} with value:`, returnValue);
}

let lastPlacedTile = null; // Ensure lastPlacedTile is defined
document.addEventListener('DOMContentLoaded', () => {
    logFunctionCall('DOMContentLoaded');
    console.log('Initializing game...');
    console.log('Current board state:', JSON.stringify(getBoardState()));
    initializeDragAndDrop();
    console.log('Drag and drop initialized.');
    initializeDropZones();

});


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
        console.log('Updated board state:', JSON.stringify(getBoardState()));
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


