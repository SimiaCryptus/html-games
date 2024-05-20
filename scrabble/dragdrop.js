import {getBoardState, updateGameState} from './game.js'; // Import revertTilePlacement function // Import updateStatusDisplay function // Import validateWord function

const BOARD_SIZE = 15;

function logFunctionCall(functionName, ...args) {
    console.log(`Function called: ${functionName} with arguments:`, args);
}

function logFunctionReturn(functionName, returnValue) {
    console.log(`Function returned: ${functionName} with value:`, returnValue);
}

let lastPlacedTile = null; // Ensure lastPlacedTile is defined
export let selectedTile = null; // Track the selected tile for click-to-place interaction

document.addEventListener('DOMContentLoaded', () => {
    logFunctionCall('DOMContentLoaded');
    console.log('Initializing game...');
    console.log('Current board state:', JSON.stringify(getBoardState()));
    initializeDragAndDrop();
    console.log('Drag and drop initialized.');
    initializeDropZones();
    initializeClickToPlace();

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
        cell.addEventListener('click', handleCellClick); // Add click event for cells
    });
}

export function handleDragStart(event) {
    logFunctionCall('handleDragStart', event);
    console.log(`Drag started for tile ${event.target.textContent}`);
    if (event.target.classList.contains('placed')) {
        return; // Prevent dragging of placed tiles
    }
    event.dataTransfer.setData('text/plain', event.target.id);
    event.dataTransfer.effectAllowed = 'move';
    if (event.target && event.target.classList) {
        event.target.classList.add('dragging'); // Cannot read properties of undefined (reading 'add')
    }
}

export function handleDragOver(event) {
    logFunctionCall('handleDragOver', event);
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
}

export function handleDragEnter(event) {
    logFunctionCall('handleDragEnter', event);
    console.log('Drag entered a drop zone');
    event.preventDefault();
    if (event.target.classList.contains('game-cell') && !event.target.firstChild) {
        event.target.classList.add('over'); // Only add 'over' class if drop is valid
    }
}

export function handleDragLeave(event) {
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
    if (!draggableElement) {
        console.error(`Draggable element with ID ${id} not found.`);
        return;
    }
    let dropZone = event.target;

    // Ensure that the dropZone is correctly targeted, considering that the drop might be on a child element or the tile itself
    dropZone = dropZone.closest('.game-cell');

    if (!draggableElement) return; // Ensure draggableElement is valid
    console.log(`Attempting to drop tile ${draggableElement.textContent} into cell at position (${dropZone.getAttribute('data-row')}, ${dropZone.getAttribute('data-col')})`); // Cannot read properties of null (reading 'textContent')
    console.log(`Draggable element ID: ${draggableElement.id}`);
    if (dropZone && !dropZone.querySelector('.tile')) { // Simplified check for dropZone emptiness
        dropZone.appendChild(draggableElement);
        dropZone.classList.remove('over');
        updateGameState(draggableElement, dropZone); // Update game state when a tile is dropped
        draggableElement.style.display = 'flex'; // Ensure the tile is displayed correctly
        draggableElement.style.justifyContent = 'center'; // Center the tile content
        draggableElement.classList.remove('selected'); // Remove the 'selected' class from the placed tile
        draggableElement.removeEventListener('dragstart', handleDragStart); // Remove dragstart event listener
        draggableElement.removeEventListener('mousedown', handleTileClick); // Remove mousedown event listener
        draggableElement.removeAttribute('draggable'); // Make the tile non-draggable after placement
        draggableElement.style.pointerEvents = 'none'; // Disable pointer events to make the tile non-clickable
        draggableElement.classList.add('placed'); // Add a class to indicate the tile is placed
        selectedTile = null; // Clear the selected tile after dropping
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
        if (tile.classList.contains('placed')) {
            return; // Skip adding event listeners to placed tiles
        }
        tile.addEventListener('dragstart', handleDragStart);
        tile.addEventListener('dragend', handleDragEnd);
        tile.addEventListener('mousedown', handleTileClick); // Change click to mousedown event for tiles
        console.log('Drag and drop event listeners added to tiles');
    });
    // Removed the premature call to initializeDropZones to avoid reference errors
    console.log('Initialization of drag and drop completed, awaiting drop zone setup...');

}

export function initializeClickToPlace() {
    logFunctionCall('initializeClickToPlace');
    const tiles = document.querySelectorAll('.tile');
    const cells = document.querySelectorAll('.game-cell');

    tiles.forEach(tile => {
        tile.addEventListener('mousedown', handleTileClick); // Change click to mousedown event for tiles
    });

    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });
}

export function handleTileClick(event) {
    logFunctionCall('handleTileClick', event);
    if (selectedTile) {
        if (selectedTile.classList.contains('placed')) {
            return; // Prevent selecting placed tiles
        }
        selectedTile.classList.remove('selected');
    }
    selectedTile = event.target.closest('.tile'); // Ensure the clicked element is the tile itself or its child
    selectedTile.classList.add('selected');
    console.log(`Tile ${selectedTile.textContent} selected for placement.`);
}

export function handleCellClick(event) {
    logFunctionCall('handleCellClick', event);
    // Prevent placing a tile if the cell already contains a placed tile
    if (event.target.closest('.tile.placed')) {
        console.log('Cannot place a tile on top of an already placed tile.');
        return;
    }
    if (event.target.closest('.tile.placed')) {
        console.log('Cannot place a tile on top of an already placed tile.');
        return;
    }
    if (!selectedTile) {
        console.log('No tile selected for placement.');
        return;
    }
    const dropZone = event.target.closest('.game-cell');
    if (dropZone && !dropZone.querySelector('.tile')) { // Check if the cell doesn't already have a tile
        dropZone.appendChild(selectedTile);
        updateGameState(selectedTile, dropZone);
        selectedTile.classList.remove('selected'); // Remove the 'selected' class from the placed tile
        selectedTile.style.display = 'flex'; // Ensure the tile is displayed correctly
        selectedTile.style.justifyContent = 'center'; // Center the tile content
        selectedTile.removeEventListener('dragstart', handleDragStart); // Remove dragstart event listener
        selectedTile.removeEventListener('mousedown', handleTileClick); // Remove mousedown event listener
        selectedTile.removeAttribute('draggable'); // Make the tile non-draggable after placement
        selectedTile.style.pointerEvents = 'none'; // Disable pointer events to make the tile non-clickable
        selectedTile.classList.add('placed'); // Add a class to indicate the tile is placed
        selectedTile = null;
        console.log('Tile placed successfully.');
    } else {
        console.log('Invalid drop location or cell already occupied.');
    }
}