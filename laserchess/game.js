// Constants for game settings
const BOARD_WIDTH = 10; // Width of the board
const BOARD_HEIGHT = 8; // Height of the board

// Rotate the laser direction 90 degrees clockwise
function rotateLaserDirection(direction) {
    switch (direction) {
        case 'north':
            console.log("Rotating laser from north to east");
            return 'east';
        case 'east':
            console.log("Rotating laser from east to south");
            return 'south';
        case 'south':
            console.log("Rotating laser from south to west");
            return 'west';
        case 'west':
            console.log("Rotating laser from west to north");
            return 'north';
    }
}


// Render the game board and pieces
function renderBoard() {
    const boardElement = document.getElementById('game-board');
    // Remove only game cells to preserve laser paths
    document.querySelectorAll('.gameCell').forEach(cell => cell.remove());
    for (let i = 0; i < BOARD_HEIGHT; i++) { // Iterate through each row
        for (let j = 0; j < BOARD_WIDTH; j++) {
            const cell = gameState.board[i][j];
            const cellElement = document.createElement('div');
            cellElement.className = 'gameCell';
            if (cell) {
                const pieceElement = document.createElement('div');
                pieceElement.className = 'piece ' + cell.type + ' ' + cell.player;
        if (cell.type === 'mirror' || cell.type === 'switch') {
                    pieceElement.classList.add('orientation-' + cell.orientation);
                }
                pieceElement.dataset.x = i;
                pieceElement.dataset.y = j;
                cellElement.appendChild(pieceElement);
            } else {
                cellElement.dataset.x = i;
                cellElement.dataset.y = j;
            }
            boardElement.appendChild(cellElement);
        }
    }
}

// Game state
let gameState = {
    board: [],
    currentPlayer: 'Red',
    gameActive: true,
    redLaserDirection: 'east',
    blueLaserDirection: 'west',
};

// Initialize the game board with default setup
function initGameBoard() {
    // Clear the board
    gameState.board = Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(null));

    // Set up the Ace board layout
    // Row 8
    gameState.board[0][0] = { type: 'laser', player: 'Red', direction: 'south', orientation: '180deg' };
    gameState.board[7][9] = { type: 'laser', player: 'Blue', direction: 'north' };


    gameState.board[0][7] = { type: 'deflector', player: 'Red', orientation: '90deg' };
    gameState.board[0][6] = { type: 'defender', player: 'Red' };
    gameState.board[0][5] = { type: 'king', player: 'Red' };
    gameState.board[0][4] = { type: 'defender', player: 'Red' };

    // Row 7
    gameState.board[1][2] = { type: 'deflector', player: 'Red', orientation: '0deg' };
    // Row 6
    gameState.board[2][3] = { type: 'deflector', player: 'Blue', orientation: '90deg' };
    // Row 5
    gameState.board[3][0] = { type: 'deflector', player: 'Red', orientation: '180deg' };
    gameState.board[3][2] = { type: 'deflector', player: 'Blue', orientation: '270deg' };
    gameState.board[3][4] = { type: 'switch', player: 'Red' };
    gameState.board[3][5] = { type: 'switch', player: 'Red', orientation: '90deg' };
    gameState.board[3][7] = { type: 'deflector', player: 'Red', orientation: '270deg' };
    gameState.board[3][9] = { type: 'deflector', player: 'Blue', orientation: '90deg' };
    // Row 4
    gameState.board[4][0] = { type: 'deflector', player: 'Red', orientation: '270deg' };
    gameState.board[4][2] = { type: 'deflector', player: 'Blue', orientation: '90deg' };
    gameState.board[4][4] = { type: 'switch', player: 'Blue', orientation: '90deg' };
    gameState.board[4][5] = { type: 'switch', player: 'Blue' };
    gameState.board[4][7] = { type: 'deflector', player: 'Red', orientation: '180deg' };
    gameState.board[4][9] = { type: 'deflector', player: 'Blue' };
    // Row 3
    gameState.board[5][6] = { type: 'deflector', player: 'Red', orientation: '270deg' };
    // Row 2
    gameState.board[6][7] = { type: 'deflector', player: 'Blue', orientation: '180deg' };
    // Row 1
    gameState.board[7][2] = { type: 'deflector', player: 'Blue', orientation: '90deg' };
    gameState.board[7][3] = { type: 'defender', player: 'Blue' };
    gameState.board[7][4] = { type: 'king', player: 'Blue' };
    gameState.board[7][5] = { type: 'defender', player: 'Blue' };

    updateStatusMessage("Welcome to Laser Chess! Red's turn");
    renderBoard(); // Call renderBoard to display the board
}

// Function to update the status message
function updateStatusMessage(message) {
    const statusElement = document.getElementById('status-message');
    statusElement.textContent = message;
}

// Function to switch the current player
function switchPlayer() {
    gameState.currentPlayer = gameState.currentPlayer === 'Red' ? 'Blue' : 'Red';
    updateStatusMessage(`It's ${gameState.currentPlayer}'s turn`);
    console.log(`Player switched. It is now ${gameState.currentPlayer}'s turn.`);
    console.log(`Switched player to ${gameState.currentPlayer}`);
    console.log(`Game state after switching player: ${JSON.stringify(gameState)}`);
}

// Check if the move is valid
function isValidMove(startX, startY, endX, endY) {
    console.log(`Checking if move from (${startX}, ${startY}) to (${endX}, ${endY}) is valid`);
    console.log(`Current player: ${gameState.currentPlayer}, Piece player: ${gameState.board[startX][startY].player}`);
    // Ensure the start position contains a piece and it belongs to the current player
    if (!gameState.board[startX][startY] || gameState.board[startX][startY].player !== gameState.currentPlayer) {
        console.error('Cannot move opponent\'s piece');
        return false;
    }

    // Check if there is a piece at the start position
    if (!gameState.board[startX][startY]) {
        console.error('No piece at start position');
        return false;
    }

    // Additional checks for specific piece types if needed, only allow moving own defenders and deflectors
    const piece = gameState.board[startX][startY];
    if (['defender', 'deflector', 'king'].includes(piece.type)) {
        // Check if the destination cell is empty, within board limits, and not the same as the start position
        return endX >= 0 && endX < BOARD_HEIGHT && endY >= 0 && endY < BOARD_WIDTH && !(startX === endX && startY === endY) && gameState.board[endX][endY] === null;
    }
    // Default case for other pieces (like laser which should not be moved in a standard way)
    return false;
}

// Check if the rotation is valid
function isValidRotation(x, y) {
    console.log(`Checking if rotation at (${x}, ${y}) is valid`);
    // Check if there is a piece at the position
    if (!gameState.board[x][y]) {
        console.error('No piece at the position');
        return false;
    }
    // Check if the piece is a mirror
    if (gameState.board[x][y].type !== 'mirror') {
        console.error('Only mirrors can be rotated');
        return false;
    }
    // Check if the mirror belongs to the current player
    if (gameState.board[x][y].player !== gameState.currentPlayer) {
        console.error('Cannot rotate opponent\'s mirror');
        return false;
    }
    return true;
}

// Move a piece on the board
function movePiece(startX, startY, endX, endY) {
    if (!isValidMove(startX, startY, endX, endY)) {
        console.error(`Invalid move from (${startX}, ${startY}) to (${endX}, ${endY})`);
        console.log("Move validation failed. Move not executed.");
        console.error('Invalid move');
        return;
    }
    console.log(`Moving piece from (${startX}, ${startY}) to (${endX}, ${endY})`);
    gameState.board[endX][endY] = gameState.board[startX][startY];
    gameState.board[startX][startY] = null;
    console.log(`Board state after moving piece: ${JSON.stringify(gameState.board)}`);

    // Check if the moved piece is a mirror and update its orientation
    updateMirrorOrientation(endX, endY);

    if (gameState.board[endX][endY].type === 'laser' && gameState.board[endX][endY].player === 'Red') {
        gameState.redLaserDirection = rotateLaserDirection(gameState.redLaserDirection);
        gameState.board[endX][endY].direction = gameState.redLaserDirection;
    } else if (gameState.board[endX][endY].type === 'laser' && gameState.board[endX][endY].player === 'Blue') {
        gameState.blueLaserDirection = rotateLaserDirection(gameState.blueLaserDirection);
        gameState.board[endX][endY].direction = gameState.blueLaserDirection;
        console.log(`Blue laser direction updated to ${gameState.blueLaserDirection}`);
    }

    switchPlayer();
    checkGameStatus(); // Immediate check for simplification, remove setTimeout if not needed
    renderBoard(); // Update the visual state of the board after the move
    console.log(`Board state after move: ${JSON.stringify(gameState.board)}`);
}

// Update the orientation of a mirror when it is moved
function updateMirrorOrientation(x, y) {
    let mirror = gameState.board[x][y];
    if (mirror && mirror.type === 'mirror') {
        let currentOrientation = mirror.orientation;
        let newOrientation = rotateMirrorOrientation(currentOrientation);
        mirror.orientation = newOrientation;
        console.log(`Mirror at (${x}, ${y}) rotated from ${currentOrientation} to ${newOrientation}`);
    }
}

// Rotate the orientation of a mirror by 90 degrees
function rotateMirrorOrientation(orientation) {
    switch (orientation) {
        case '45deg':
            return '135deg';
        case '135deg':
            return '225deg';
        case '225deg':
            return '315deg';
        case '315deg':
            return '45deg';
    }
}

// Rotate a mirror on the board
function rotateMirror(x, y) {
    if (!isValidRotation(x, y)) {
        console.error(`Invalid rotation at (${x}, ${y})`);
        return;
    }
    console.log(`Rotating mirror at (${x}, ${y})`);
    let mirror = gameState.board[x][y];
    if (mirror.orientation === '45deg') {
        console.log(`Changing mirror orientation from 45deg to 135deg`);
        mirror.orientation = '135deg';
    } else if (mirror.orientation === '135deg') {
        console.log(`Changing mirror orientation from 135deg to 225deg`);
        mirror.orientation = '225deg';
    } else if (mirror.orientation === '225deg') {
        console.log(`Changing mirror orientation from 225deg to 315deg`);
        mirror.orientation = '315deg';
    } else if (mirror.orientation === '315deg') {
        console.log(`Changing mirror orientation from 315deg to 45deg`);
        mirror.orientation = '45deg';
    }
    switchPlayer();
    checkGameStatus();
    renderBoard();
    console.log(`Board state after rotation: ${JSON.stringify(gameState.board)}`);
}

// Calculate the path of the laser
function calculateLaserPath() {
    console.log('Calculating laser path...');
    console.log("Starting laser path calculation for both players");

    const boardElement = document.getElementById('game-board');
    let pathElements = document.querySelectorAll('.laser-path');
    pathElements.forEach(el => el.remove()); // Clear previous laser paths

    // Calculate laser path for Player 1
    let laserX = 0; // Starting X position of Player 1's laser
    let laserY = gameState.board[0].findIndex(cell => cell && cell.type === 'laser' && cell.player === 'Red'); // Starting Y position of Player 1's laser
    let direction = gameState.redLaserDirection; // Get the current direction of Player 1's laser
    while (laserX >= 0 && laserX < BOARD_HEIGHT && laserY >= 0 && laserY < BOARD_WIDTH) {
        let cell = gameState.board[laserX][laserY]; // Retrieve the cell at the current laser position
        let laserCell = document.createElement('div');
        laserCell.className = 'laser-path';
        console.log(`Laser path at (${laserX}, ${laserY}) with direction ${direction}`);
        laserCell.classList.add(`laser-${direction}`);
        console.log(`Rendering laser path at (${laserX}, ${laserY})`);
        let boardRect = boardElement.getBoundingClientRect();
        laserCell.style.top = boardRect.top + (laserX * boardRect.height / BOARD_HEIGHT) + (boardRect.height / BOARD_HEIGHT / 2) + 'px';
        laserCell.style.left = boardRect.left + (laserY * boardRect.width / BOARD_WIDTH) + (boardRect.width / BOARD_WIDTH / 2) + 'px';
        boardElement.appendChild(laserCell);
        if (cell && cell.type === 'mirror') {
            // Change direction based on mirror orientation
            if (cell.orientation === '45deg') {
                direction = direction === 'east' ? 'north' : 'west';
            } else if (cell.orientation === '135deg') {
                direction = direction === 'east' ? 'south' : 'east';
            } else if (cell.orientation === '225deg') {
                direction = direction === 'west' ? 'south' : 'west';
            } else if (cell.orientation === '315deg') {
                direction = direction === 'west' ? 'north' : 'east';
            }
            console.log(`Laser hit mirror at (${laserX}, ${laserY}), changing direction to ${direction}`);
        }
        // Move laser to next cell based on current direction
        console.log(`Laser moving from (${laserX}, ${laserY}) in direction ${direction}`);
        if (direction === 'east') laserY++;
        else if (direction === 'south') laserX++;
        else if (direction === 'west') laserY--;
        else if (direction === 'north') laserX--;
        // Check if the laser hits a king
        if (cell && cell.type === 'king') {
            cell.hit = true;
            console.log(`King hit at (${laserX}, ${laserY}).`);
            console.log(`Game state after king hit: ${JSON.stringify(gameState)}`);
        }
    }
    console.log(`Laser path ended at (${laserX}, ${laserY})`);
    console.log("Completed laser path calculation for Player 1");

    // Calculate laser path for Player 2
    laserX = BOARD_HEIGHT - 1; // Starting X position of Player 2's laser
    laserY = gameState.board[BOARD_HEIGHT - 1].findIndex(cell => cell && cell.type === 'laser' && cell.player === 'Blue'); // Starting Y position of Player 2's laser
    direction = gameState.blueLaserDirection; // Get the current direction of Player 2's laser
    while (laserX >= 0 && laserX < BOARD_HEIGHT && laserY >= 0 && laserY < BOARD_WIDTH) {
        let cell = gameState.board[laserX][laserY]; // Retrieve the cell at the current laser position
        let laserCell = document.createElement('div');
        laserCell.className = 'laser-path';
        laserCell.classList.add(`laser-${direction}`);
        console.log(`Rendering laser path at (${laserX}, ${laserY})`);
        let boardRect = boardElement.getBoundingClientRect();
        laserCell.style.top = boardRect.top + (laserX * boardRect.height / BOARD_HEIGHT) + (boardRect.height / BOARD_HEIGHT / 2) + 'px';
        laserCell.style.left = boardRect.left + (laserY * boardRect.width / BOARD_WIDTH) + (boardRect.width / BOARD_WIDTH / 2) + 'px';
        boardElement.appendChild(laserCell);
        if (cell && cell.type === 'mirror') {
            // Change direction based on mirror orientation
            if (cell.orientation === '45deg') {
                direction = direction === 'east' ? 'north' : 'west';
            } else if (cell.orientation === '135deg') {
                direction = direction === 'east' ? 'south' : 'east';
            } else if (cell.orientation === '225deg') {
                direction = direction === 'west' ? 'south' : 'west';
            } else if (cell.orientation === '315deg') {
                direction = direction === 'west' ? 'north' : 'east';
            }
            console.log(`Laser hit mirror at (${laserX}, ${laserY}), changing direction to ${direction}`);
        }
        // Move laser to next cell based on current direction
        if (direction === 'east') laserY++;
        else if (direction === 'south') laserX++;
        else if (direction === 'west') laserY--;
        else if (direction === 'north') laserX--;
        // Check if the laser hits a king
        if (cell && cell.type === 'king') {
            cell.hit = true;
            console.log(`King hit at (${laserX}, ${laserY}).`);
        }
    }
    console.log(`Laser path ended at (${laserX}, ${laserY})`);
}

// Check if the game is over (king is hit by the laser)
function checkGameStatus() {
    // Reset hit status for all kings before checking
    for (let i = 0; i < BOARD_HEIGHT; i++) {
        for (let j = 0; j < BOARD_WIDTH; j++) {
            let cell = gameState.board[i][j];
            if (cell && cell.type === 'king') {
                cell.hit = false;
            }
        }
    }
    console.log('Checking game status...');
    calculateLaserPath();
    // Check if any king is hit by the laser
    let kingHit = false;
    for (let i = 0; i < BOARD_HEIGHT; i++) {
        for (let j = 0; j < BOARD_WIDTH; j++) {
            let cell = gameState.board[i][j];
            if (cell && cell.type === 'king' && cell.hit) {
                kingHit = true;
                console.log(`King hit at (${i}, ${j})`);
                // For testing purposes, we will just log the message
                //gameState.gameActive = false;
                //updateStatusMessage(`${gameState.currentPlayer === 'Red' ? 'Blue' : 'Red'} wins! Game over.`);
                console.log(`${gameState.currentPlayer === 'Red' ? 'Blue' : 'Red'} wins! Game over.`);
                //alert(`${gameState.currentPlayer === 'Red' ? 'Blue' : 'Red'} wins! Game over.`);
            }
        }
    }
    if (!kingHit) {
        console.log('No king hit. Game continues.');
    }
}

// Check if a king at the given position is hit by the laser
function isKingHit(x, y) {
    let laserX = 0;
    let laserY = 0;
    let direction = 'east';
    while (laserX >= 0 && laserX < BOARD_HEIGHT && laserY >= 0 && laserY < BOARD_WIDTH) {
        if (laserX === x && laserY === y) {
            return true;
        }
        let cell = gameState.board[laserX][laserY];
        if (cell && cell.type === 'mirror') {
            if (cell.orientation === '45deg') {
                direction = direction === 'east' ? 'north' : 'west';
            } else if (cell.orientation === '135deg') {
                direction = direction === 'east' ? 'south' : 'east';
            } else if (cell.orientation === '225deg') {
                direction = direction === 'west' ? 'south' : 'west';
            } else if (cell.orientation === '315deg') {
                direction = direction === 'west' ? 'north' : 'east';
            }
        }
        if (direction === 'east') laserY++;
        else if (direction === 'south') laserX++;
        else if (direction === 'west') laserY--;
        else if (direction === 'north') laserX--;
    }
    return false;
}

// Event listener for piece movement
document.addEventListener('click', function (event) {
    let target = event.target;
    if (target.classList.contains('piece')) {
        let selected = document.querySelector('.selected');
        if (selected) {
            selected.classList.remove('selected');
        }
        console.log(`Piece at (${target.dataset.x}, ${target.dataset.y}) selected`);
        if (target !== selected) {
            target.classList.add('selected');
        }
    } else if (target.classList.contains('gameCell') && document.querySelector('.selected')) {
        let startX = parseInt(document.querySelector('.selected').dataset.x, 10);
        let startY = parseInt(document.querySelector('.selected').dataset.y, 10);
        console.log(`Destination cell (${target.dataset.x}, ${target.dataset.y}) clicked`);
        let endX = parseInt(target.dataset.x, 10);
        let endY = parseInt(target.dataset.y, 10);
        movePiece(startX, startY, endX, endY);
        let selectedElement = document.querySelector('.selected');
        if (selectedElement) {
            selectedElement.classList.remove('selected');
        }
    } else if (target.classList.contains('piece') && target.classList.contains('mirror')) {
        let x = parseInt(target.dataset.x, 10);
        let y = parseInt(target.dataset.y, 10);
        rotateMirror(x, y);
        if (selectedElement) {
            selectedElement.classList.remove('selected');
        }
    }
});

// Event listener for rotate button
document.getElementById('rotate-button').addEventListener('click', function () {
    let selectedElement = document.querySelector('.selected');
    if (selectedElement && selectedElement.classList.contains('mirror')) {
        let x = parseInt(selectedElement.dataset.x, 10);
        let y = parseInt(selectedElement.dataset.y, 10);
        rotateMirror(x, y);
    }
});

// Initialize the game
initGameBoard();
checkGameStatus();