// Constants for game settings
const BOARD_SIZE = 8; // 8x8 board

// Render the game board and pieces
function renderBoard() {
    const boardElement = document.getElementById('game-board');
    // Remove only game cells to preserve laser paths
    document.querySelectorAll('.gameCell').forEach(cell => cell.remove());
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            const cell = gameState.board[i][j];
            const cellElement = document.createElement('div');
            cellElement.className = 'gameCell';
            if (cell) {
                const pieceElement = document.createElement('div');
                pieceElement.className = 'piece ' + cell.type + ' ' + cell.player;
                if (cell.type === 'mirror') {
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
    currentPlayer: 'Player1',
    gameActive: true,
};

// Initialize the game board with default setup
function initGameBoard() {
    gameState.board = new Array(BOARD_SIZE).fill(null).map(() => new Array(BOARD_SIZE).fill(null));
    // Randomize positions for two kings
    const randomPosition1 = { x: Math.floor(Math.random() * BOARD_SIZE), y: Math.floor(Math.random() * BOARD_SIZE) };
    const randomPosition2 = { x: Math.floor(Math.random() * BOARD_SIZE), y: Math.floor(Math.random() * BOARD_SIZE) };
    gameState.board[randomPosition1.x][randomPosition1.y] = {type: 'king', player: 'Player1', hit: false};
    gameState.board[randomPosition2.x][randomPosition2.y] = {type: 'king', player: 'Player2', hit: false};
    // Add mirrors or other pieces
    gameState.board[3][3] = {type: 'mirror', orientation: '45deg'};
    gameState.board[4][4] = {type: 'mirror', orientation: '135deg'};
    // Adding mirrors for Player 2
    gameState.board[2][2] = {type: 'mirror', orientation: '225deg', player: 'Player2'};
    gameState.board[5][5] = {type: 'mirror', orientation: '315deg', player: 'Player2'};
    renderBoard(); // Call renderBoard to display the board
}

// Function to switch the current player
function switchPlayer() {
    gameState.currentPlayer = gameState.currentPlayer === 'Player1' ? 'Player2' : 'Player1';
    console.log(`Switched player to ${gameState.currentPlayer}`);
}

// Check if the move is valid
function isValidMove(startX, startY, endX, endY) {
    console.log(`Checking if move from (${startX}, ${startY}) to (${endX}, ${endY}) is valid`);
    // Check if the start position contains a piece
    if (!gameState.board[startX][startY]) {
        console.error('No piece at start position');
        return false;
    }

    // Check if there is a piece at the start position
    if (!gameState.board[startX][startY]) {
        console.error('No piece at start position');
        return false;
    }

    // Implement logic to check if the move is valid
    // Check if the destination cell is empty, within board limits, and not the same as the start position
    return endX >= 0 && endX < BOARD_SIZE && endY >= 0 && endY < BOARD_SIZE && !(startX === endX && startY === endY) && gameState.board[endX][endY] === null;
}

// Move a piece on the board
function movePiece(startX, startY, endX, endY) {
    if (!isValidMove(startX, startY, endX, endY)) {
        console.error(`Invalid move from (${startX}, ${startY}) to (${endX}, ${endY})`);
        console.error('Invalid move');
        return;
    }
    console.log(`Moving piece from (${startX}, ${startY}) to (${endX}, ${endY})`);
    gameState.board[endX][endY] = gameState.board[startX][startY];
    gameState.board[startX][startY] = null;
    switchPlayer();
    checkGameStatus(); // Immediate check for simplification, remove setTimeout if not needed
    renderBoard(); // Update the visual state of the board after the move
    console.log(`Board state after move: ${JSON.stringify(gameState.board)}`);
}

// Calculate the path of the laser
function calculateLaserPath() {
    console.log('Calculating laser path...');
    // Example implementation for laser path calculation
    let laserX = 0; // Starting position of the laser
    let laserY = 0;
    let direction = 'east'; // Assuming the laser starts pointing east
    const boardElement = document.getElementById('game-board');
    let pathElements = document.querySelectorAll('.laser-path');
    pathElements.forEach(el => el.remove()); // Clear previous laser paths
    while (laserX >= 0 && laserX < BOARD_SIZE && laserY >= 0 && laserY < BOARD_SIZE) {
        let cell = gameState.board[laserX][laserY];
        let laserCell = document.createElement('div');
        laserCell.className = 'laser-path';
        laserCell.classList.add(`laser-${direction}`);
        console.log(`Rendering laser path at (${laserX}, ${laserY})`);
        let boardRect = boardElement.getBoundingClientRect();
        laserCell.style.top = boardRect.top + (laserX * boardRect.height / BOARD_SIZE) + (boardRect.height / BOARD_SIZE / 2) + 'px';
        laserCell.style.left = boardRect.left + (laserY * boardRect.width / BOARD_SIZE) + (boardRect.width / BOARD_SIZE / 2) + 'px';
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
    console.log(`Laser path ended at (${laserX}, ${laserY})`);
}

// Check if the game is over (king is hit by the laser)
function checkGameStatus() {
    // Reset hit status for all kings before checking
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
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
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            let cell = gameState.board[i][j];
            if (cell && cell.type === 'king' && cell.hit) {
                kingHit = true;
                console.log(`King hit at (${i}, ${j})`);
                gameState.gameActive = false;
                console.log(`${gameState.currentPlayer === 'Player1' ? 'Player2' : 'Player1'} wins! Game over.`);
                //alert(`${gameState.currentPlayer === 'Player1' ? 'Player2' : 'Player1'} wins! Game over.`);
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
    while (laserX >= 0 && laserX < BOARD_SIZE && laserY >= 0 && laserY < BOARD_SIZE) {
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
    }
});

// Initialize the game
initGameBoard();