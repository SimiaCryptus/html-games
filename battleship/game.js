// Constants
const GRID_SIZE = 10;
const SHIP_SIZES = [5, 4, 3, 3, 2]; // Example ship sizes: Carrier, Battleship, Cruiser, Submarine, Destroyer


// Game boards
let playerBoard = [];
let computerBoard = [];
let playerShots = [];
//on document load
document.addEventListener('DOMContentLoaded', function () {

// Rendering functions
    function renderBoard(board, boardId) {
        const boardElement = document.getElementById(boardId).querySelector('.grid');
        boardElement.innerHTML = ''; // Clear previous board
        board.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const cellElement = document.createElement('div');
                cellElement.className = 'cell';
                cellElement.id = `grid-cell-${boardId}-${rowIndex}-${colIndex}`;
                if (boardId === 'opponentBoard') {
                    cellElement.addEventListener('click', () => playerAttack(rowIndex, colIndex));
                }
                boardElement.appendChild(cellElement);
            });
        });
    }

// Player actions
    function playerAttack(row, col) {
        if (playerShots[row][col] === 0) {
            console.log(`Player attacking at [${row}, ${col}]`);
            let hit = checkForHits(computerBoard, row, col);
            console.log(`Hit result: ${hit}`);
            updateBoard(playerShots, row, col, hit);
            computerTurn();
            checkGameOver();
        }
    }

// Utility functions
    function initBoard() {
        let board = [];
        for (let i = 0; i < GRID_SIZE; i++) {
            board.push(new Array(GRID_SIZE).fill(0));
        }
        return board;
    }

    function placeShips(board) {
        SHIP_SIZES.forEach(size => {
            let placed = false;
            while (!placed) {
                let direction = Math.random() > 0.5 ? 'H' : 'V'; // Horizontal or Vertical
                let row = Math.floor(Math.random() * GRID_SIZE);
                let col = Math.floor(Math.random() * GRID_SIZE);
                if (canPlaceShip(board, row, col, size, direction)) {
                    for (let i = 0; i < size; i++) {
                        board[row][col] = 1;
                        if (direction === 'H') col++; else row++;
                    }
                    placed = true;
                }
            }
        });
    }

    function canPlaceShip(board, row, col, size, direction) {
        for (let i = 0; i < size; i++) {
            if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE || board[row][col] === 1) {
                return false;
            }
            if (direction === 'H') col++; else row++;
        }
        return true;
    }

    function checkForHits(board, row, col) {
        console.log(`Checking for hits at [${row}, ${col}] on board:`, board);
        return board[row][col] === 1;
    }

    function updateBoard(board, row, col, hit) {
        board[row][col] = hit ? 'X' : 'O'; // X for hit, O for miss
        console.log(`Updating board at [${row}, ${col}]: ${board[row][col]}`);
        const cell = document.querySelector(`#grid-cell-${board === playerShots ? 'opponentBoard' : 'playerBoard'}-${row}-${col}`);
        cell.className = hit ? 'hit' : 'miss';
    }

// Game initialization
    function startGame() {
        playerBoard = initBoard();
        computerBoard = initBoard();
        playerShots = initBoard();
        computerShots = initBoard();

        placeShips(playerBoard);
        placeShips(computerBoard);

        renderBoard(playerBoard, 'playerBoard');
        renderBoard(computerBoard, 'opponentBoard');
        // Bind UI elements here if necessary
        // Bind UI elements here if necessary
    }

// Computer actions
    function computerTurn() {
        let row, col;
        do {
            row = Math.floor(Math.random() * GRID_SIZE);
            col = Math.floor(Math.random() * GRID_SIZE);
            console.log(`Computer trying to attack at [${row}, ${col}]`);
        } while (computerShots[row][col] !== 0);
        console.log(`Computer attacks at [${row}, ${col}]`);

        let hit = checkForHits(playerBoard, row, col);
        console.log(`Computer hit result: ${hit}`);
        updateBoard(computerShots, row, col, hit);
    }

// Check game over
    function checkGameOver() {
        console.log("Checking if game is over");
        let playerAllShipsSunk = computerShots.every(row => row.every(cell => cell !== 1));
        let computerAllShipsSunk = playerShots.every(row => row.every(cell => cell !== 1));
        if (playerAllShipsSunk) {
            alert("Computer wins!");
            console.log("Game over: Computer wins!");
            return true;
        } else if (computerAllShipsSunk) {
            alert("Player wins!");
            console.log("Game over: Player wins!");
            return true;
        }
        return false;
    }

// Event listeners
    document.getElementById('start-game').addEventListener('click', startGame);
    startGame(); // Automatically start the game when the page loads
});


// Additional functions to handle UI updates and game status messages would be implemented here