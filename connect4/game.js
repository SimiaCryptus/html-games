// Constants for the game
const ROWS = 6;
const COLUMNS = 7;
const EMPTY = 0;
const PLAYER1 = 1;
const PLAYER2 = 2;

// Game state
let board = [];
let currentPlayer = PLAYER1;
let gameActive = true;

// Initialize the game board
function initBoard() {
    board = [];
    for (let row = 0; row < ROWS; row++) {
        board[row] = [];
        for (let col = 0; col < COLUMNS; col++) {
            board[row][col] = EMPTY;
        }
    }
    currentPlayer = PLAYER1;
    gameActive = true;
    updateUI();
    updateStatus("Welcome to Connect 4! Player 1's turn.");
}

// Function to drop a disc into a column
function playMove(column) {
    if (!gameActive) return;

    for (let row = ROWS - 1; row >= 0; row--) {
        if (board[row][column] === EMPTY) {
            board[row][column] = currentPlayer;
            if (checkWin(row, column)) {
                gameActive = false;
                updateStatus(`Player ${currentPlayer} wins!`);
            } else if (checkDraw()) {
                gameActive = false;
                updateStatus("It's a draw!");
            } else {
                currentPlayer = currentPlayer === PLAYER1 ? PLAYER2 : PLAYER1;
                updateStatus(`Player ${currentPlayer}'s turn`);
            }
            updateUI();
            return;
        }
    }
}

// Check for a win
function checkWin(row, col) {
    return (checkLine(row, col, 0, 1) || // Check horizontal
            checkLine(row, col, 1, 0) || // Check vertical
            checkLine(row, col, 1, 1) || // Check diagonal (down-right)
            checkLine(row, col, 1, -1)); // Check diagonal (down-left)
}

// Check a line for four of the same player's discs
function checkLine(row, col, deltaRow, deltaCol) {
    let count = 0;
    let r = row;
    let c = col;

    // Check in one direction
    while (r >= 0 && r < ROWS && c >= 0 && c < COLUMNS && board[r][c] === currentPlayer) {
        count++;
        r += deltaRow;
        c += deltaCol;
    }

    r = row - deltaRow;
    c = col - deltaCol;

    // Check in the opposite direction
    while (r >= 0 && r < ROWS && c >= 0 && c < COLUMNS && board[r][c] === currentPlayer) {
        count++;
        r -= deltaRow;
        c -= deltaCol;
    }

    return count >= 4;
}

// Check for a draw
function checkDraw() {
    return board.every(row => row.every(cell => cell !== EMPTY));
}

// Update the game UI
function updateUI() {
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';
    board.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            const cellDiv = document.createElement('div');
            cellDiv.className = 'cell';
            cellDiv.dataset.column = colIndex;
            cellDiv.dataset.row = rowIndex;
            cellDiv.onclick = () => playMove(colIndex);
            if (cell === PLAYER1) {
                const disc = document.createElement('div');
                disc.className = 'disc red-disc';
                cellDiv.appendChild(disc);
            } else if (cell === PLAYER2) {
                const disc = document.createElement('div');
                disc.className = 'disc yellow-disc';
                cellDiv.appendChild(disc);
            }
            gameBoard.appendChild(cellDiv);
        });
    });
}

// Update the status message
function updateStatus(message) {
    const statusElement = document.getElementById('gameStatus');
    statusElement.textContent = message;
}

// Event listener for the restart button
document.getElementById('resetButton').addEventListener('click', initBoard);

// Initialize the game when the page loads
window.onload = initBoard;