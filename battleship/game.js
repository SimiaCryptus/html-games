// Constants
const GRID_SIZE = 10;
const SHIP_SIZES = [5, 4, 3, 3, 2]; // Example ship sizes: Carrier, Battleship, Cruiser, Submarine, Destroyer
const SHIP_NAMES = ['Carrier', 'Battleship', 'Cruiser', 'Submarine', 'Destroyer'];


// Game boards
let playerBoard = [];
let computerBoard = [];
let playerShots = [];
//on document load
document.addEventListener('DOMContentLoaded', function () {

// Rendering functions
    function renderBoard(board, boardId) {
        const boardElement = document.getElementById(boardId).querySelector('.grid');
        const statusId = boardId === 'playerBoard' ? 'playerStatus' : 'opponentStatus';
        const statusElement = document.getElementById(statusId);
        
        boardElement.innerHTML = ''; // Clear previous board
       console.log(`Rendering board for ${boardId}`);
        board.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const cellElement = document.createElement('div');
                cellElement.className = 'cell';
                if (cell === 1 && boardId === 'playerBoard') {
                    cellElement.classList.add('ship');
                }
                cellElement.className = 'cell';
                cellElement.id = `grid-cell-${boardId}-${rowIndex}-${colIndex}`;
                if (boardId === 'opponentBoard') {
                    cellElement.addEventListener('click', () => playerAttack(rowIndex, colIndex));
                   console.log(`Adding click event listener to cell at [${rowIndex}, ${colIndex}]`);
                }
                boardElement.appendChild(cellElement);
            });
        });

        statusElement.innerHTML = ''; // Clear previous status
       console.log(`Updating status display for ${boardId}`);
        SHIP_NAMES.forEach((name, index) => {
            const shipElement = document.createElement('div');
            shipElement.className = 'ship';
            shipElement.textContent = name;
            shipElement.dataset.size = SHIP_SIZES[index];
            shipElement.dataset.hits = 0;
            shipElement.id = `${boardId}-ship-${index}`;
            statusElement.appendChild(shipElement);
           console.log(`Added status for ${name} with size ${SHIP_SIZES[index]}`);
        });
    }

// Player actions
    function playerAttack(row, col) {
        if (playerShots[row][col] === 0) {
           console.log(`Player attack initiated at [${row}, ${col}]`);
            console.log(`Player attacking at [${row}, ${col}]`);
            let hit = checkForHits(computerBoard, row, col);
           console.log(`Player attack result at [${row}, ${col}]: ${hit ? 'Hit' : 'Miss'}`);
            console.log(`Hit result: ${hit}`);
            updateBoard(playerShots, row, col, hit);
            updateStatus('opponentBoard', row, col, hit);
            computerTurn();
            checkGameOver();
        }
    }

// Utility functions
    function initBoard() {
       console.log("Initializing board...");
        console.log("Initializing board...");
        let board = [];
        for (let i = 0; i < GRID_SIZE; i++) {
            board.push(new Array(GRID_SIZE).fill(0));
        }
       console.log("Board initialized with all cells set to 0");
        return board;
    }

    function placeShips(board) {
       console.log("Starting to place ships on the board...");
        console.log("Placing ships on the board...");
        SHIP_SIZES.forEach(size => {
            let placed = false;
            while (!placed) {
                let direction = Math.random() > 0.5 ? 'H' : 'V'; // Horizontal or Vertical
                let row = Math.floor(Math.random() * GRID_SIZE);
                let col = Math.floor(Math.random() * GRID_SIZE);
               // Adjust starting position if the ship could go out of bounds
               if (direction === 'H' && col + size > GRID_SIZE) col -= (col + size - GRID_SIZE);
               if (direction === 'V' && row + size > GRID_SIZE) row -= (row + size - GRID_SIZE);
                if (canPlaceShip(board, row, col, size, direction) && isValidPlacement(row, col, size, direction)) {
                    for (let i = 0; i < size; i++) {
                       board[row][col] = size; // Use size to uniquely identify ship parts
                        if (direction === 'H') col++; else row++;
                    }
                    placed = true;
                   console.log(`Ship of size ${size} placed at starting position [${row}, ${col}] going ${direction}`);
                    console.log(`Ship of size ${size} placed at [${row}, ${col}] going ${direction}`);
                }
       console.log("All ships placed on the board");
            }
        });
    }

    function isValidPlacement(row, col, size, direction) {
        if (direction === 'H' && (col + size > GRID_SIZE)) return false;
        if (direction === 'V' && (row + size > GRID_SIZE)) return false;
        return true;
    }
    function canPlaceShip(board, row, col, size, direction) {
       console.log(`Attempting to place ship of size ${size} at [${row}, ${col}] in ${direction} direction`);
        console.log(`Attempting to place ship of size ${size} at [${row}, ${col}] in ${direction} direction`);
        for (let i = 0; i < size; i++) {
           if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE || board[row][col] > 0) {
                return false;
            }
            // Check adjacent cells to ensure ships do not touch
            const adjacentCells = [
                board[row][col - 1], // Left cell
                board[row - 1] ? board[row - 1][col] : undefined, // Top cell
                board[row - 1] && board[row - 1][col - 1] // Top-left cell
            ];
            if (adjacentCells.some(cell => cell === 1)) {
                return false;
            }
            if (direction === 'H') col++; else row++;
        }
       console.log(`Ship placement at [${row}, ${col}] successful`);
        console.log(`Ship placement at [${row}, ${col}] successful`);
        return true;
    }

    function checkForHits(board, row, col) {
        console.log(`Checking for hits at [${row}, ${col}] on board:`, board);
       if (board[row][col] > 0) {
           console.log(`Hit detected at [${row}, ${col}]`);
           return true;
       } else {
           console.log(`No hit at [${row}, ${col}]`);
           return false;
       }
    }

    function updateBoard(board, row, col, hit) {
        board[row][col] = hit ? 'X' : 'O'; // X for hit, O for miss
        console.log(`Updating board at [${row}, ${col}]: ${board[row][col]}`);
        const cell = document.querySelector(`#grid-cell-${board === playerShots ? 'opponentBoard' : 'playerBoard'}-${row}-${col}`);
       cell.className = hit ? 'cell hit' : 'cell miss'; // Ensure class 'cell' is not removed
    }

    function updateStatus(boardId, row, col, hit) {
        if (hit) {
            // Determine which ship has been hit based on its starting position and size
           const board = boardId === 'playerBoard' ? playerBoard : computerBoard;
           const shipSize = board[row][col];
           const shipIndex = SHIP_SIZES.indexOf(shipSize); // Find the index based on ship size
        if (shipIndex === -1) {
            console.error(`No ship found at position [${row}, ${col}] on ${boardId}`);
            return;
        }
            const shipElement = document.getElementById(`${boardId}-ship-${shipIndex}`);
        if (!shipElement) {
            console.error(`No HTML element found for ship index ${shipIndex} on ${boardId}`);
            return;
        }
            const hits = parseInt(shipElement.dataset.hits) + 1;
            shipElement.dataset.hits = hits;
           console.log(`Updating hits for ${SHIP_NAMES[shipIndex]}: ${hits}`);
           if (hits === parseInt(shipElement.dataset.size)) { // Ensure hits must exactly match the ship size
                shipElement.classList.add('sunk');
                console.log(`${SHIP_NAMES[shipIndex]} has been sunk!`);
            }
        }
    }

// Game initialization
    function startGame() {
        console.log("Starting game...");
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

    // Function to get positions of a ship
    function getShipPositions(board, shipIndex, size) {
        const positions = [];
        for (let row = 0; row < GRID_SIZE; row++) {
            for (let col = 0; col < GRID_SIZE; col++) {
                if (board[row][col] === shipIndex + 1) { // Assuming shipIndex + 1 is used to mark ships uniquely
                    positions.push({ row, col });
                    if (positions.length === size) {
                        return positions;
                    }
                }
            }
        }
        return positions;
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
        updateStatus('playerBoard', row, col, hit);
    }

// Check game over
    function checkGameOver() {
        console.log("Checking if game is over");
    let playerAllShipsSunk = playerBoard.every((row, rowIndex) => row.every((cell, colIndex) => cell < 2 || computerShots[rowIndex][colIndex] === 'X'));
    let computerAllShipsSunk = computerBoard.every((row, rowIndex) => row.every((cell, colIndex) => cell < 2 || playerShots[rowIndex][colIndex] === 'X'));
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