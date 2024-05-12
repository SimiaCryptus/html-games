document.addEventListener('DOMContentLoaded', () => {
    initializeDragAndDrop();
    console.log('Drag and drop initialized.');
});

function initializeDragAndDrop() {
    const tiles = document.querySelectorAll('.tile');
    const slots = document.querySelectorAll('.tile-slot');

    tiles.forEach(tile => {
        tile.addEventListener('dragstart', handleDragStart);
        tile.addEventListener('dragend', handleDragEnd);
    });

    slots.forEach(slot => {
        slot.addEventListener('dragover', handleDragOver);
        slot.addEventListener('dragenter', handleDragEnter);
        slot.addEventListener('dragleave', handleDragLeave);
        slot.addEventListener('drop', handleDrop);
    });
}

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
    console.log('Tile dropped');
    event.preventDefault();
    const id = event.dataTransfer.getData('text/plain');
    const draggableElement = document.getElementById(id);
    const dropZone = event.target;

    // Check if the drop zone is a valid target and not already occupied
    if (dropZone.classList.contains('game-cell') && !dropZone.firstChild) { // Use classList.contains for class check
        dropZone.appendChild(draggableElement);
        dropZone.classList.remove('over');
        updateGameState(draggableElement, dropZone); // Update game state when a tile is dropped
    } else {
        // Handle invalid drop (e.g., slot already has a tile)
        console.log('Invalid drop location');
    }
}

function handleDragEnd(event) {
    console.log(`Drag ended for tile ${event.target.textContent}`);
    event.target.classList.remove('dragging');
    // Additional cleanup or state updates can be performed here
}