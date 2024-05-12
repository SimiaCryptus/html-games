document.addEventListener('DOMContentLoaded', () => {
    initializeDragAndDrop();
    console.log('Drag and drop initialized.');
    initializeDropZones();

    function initializeDropZones() {
        const cells = document.querySelectorAll('.game-cell');
        console.log(`Initializing drop zones for ${cells.length} cells`);

        cells.forEach(cell => {
            cell.addEventListener('dragover', handleDragOver);
            cell.addEventListener('dragenter', handleDragEnter);
            cell.addEventListener('dragleave', handleDragLeave);
            cell.addEventListener('drop', handleDrop);
            console.log('Drag and drop event listeners added to drop zones');
        });
    }
});

function handleDragStart(event) {
    console.log(`Drag started for tile ${event.target.textContent}`);
    event.dataTransfer.setData('text/plain', event.target.id);
    event.dataTransfer.effectAllowed = 'move';
    event.target.classList.add('dragging');
}

function handleDragOver(event) {
    console.log('Dragging over a drop zone');
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
}

function handleDragEnter(event) {
    console.log('Drag entered a drop zone');
    event.preventDefault();
    event.target.classList.add('over');
}

function handleDragLeave(event) {
    event.target.classList.remove('over');
}

function handleDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    const id = event.dataTransfer.getData('text/plain');
    const draggableElement = document.getElementById(id);
    let dropZone = event.target;

    // Ensure that the dropZone is correctly targeted, considering that the drop might be on a child element
    if (!dropZone.classList.contains('game-cell')) {
        dropZone = dropZone.closest('.game-cell');
    }

    // Check if the drop zone is a valid target (game cell) and not already occupied
    if (dropZone.classList.contains('game-cell') && !dropZone.firstChild) { // Use classList.contains for class check
        dropZone.appendChild(draggableElement);
        dropZone.classList.remove('over');
        updateGameState(draggableElement, dropZone); // Update game state when a tile is dropped
        console.log('Tile dropped successfully');
    } else {
        // Handle invalid drop (e.g., slot already has a tile)
        console.log('Invalid drop location');
        console.error('Invalid tile or target');
    }
}

function handleDragEnd(event) {
    console.log(`Drag ended for tile ${event.target.textContent}`);
    event.target.classList.remove('dragging');
    // Additional cleanup or state updates can be performed here
}

function initializeDragAndDrop() {
    const tiles = document.querySelectorAll('.tile');
    console.log(`Initializing drag and drop for ${tiles.length} tiles`);
    // Remove existing event listeners to avoid duplicates
    tiles.forEach(tile => {
        tile.removeEventListener('dragstart', handleDragStart);
        tile.removeEventListener('dragend', handleDragEnd);
    });

    // Ensure that the tiles are interactable and the event listeners are properly attached
    tiles.forEach(tile => {
        if (!tile.getAttribute('draggable')) {
            tile.setAttribute('draggable', 'true');
        }
        tile.addEventListener('dragstart', handleDragStart);
        tile.addEventListener('dragend', handleDragEnd);
        console.log('Drag and drop event listeners added to tiles');
    });

}

// Ensure that drag and drop are re-initialized after new tiles are drawn
export function reinitializeDragAndDrop() {
    initializeDragAndDrop();
}
