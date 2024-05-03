document.addEventListener('DOMContentLoaded', () => {
    const boardSize = 8;
    const gameBoard = document.getElementById('board'); // Corrected to match HTML
    let board = [];
    let currentPlayer = 'Black';

    function initializeBoard() {
        gameBoard.innerHTML = '';
        board = [];
        for (let i = 0; i < boardSize; i++) {
            let row = [];
            for (let j = 0; j < boardSize; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell'; // Corrected to match CSS
                cell.dataset.row = i;
                cell.dataset.col = j;
                cell.addEventListener('click', handleCellClick);
                gameBoard.appendChild(cell);
                row.push('');
            }
            board.push(row);
        }
        setInitialPieces();
        updateBoard();
        updateCurrentPlayerDisplay();
    }

    function setInitialPieces() {
        board[3][3] = 'white';
        board[3][4] = 'black';
        board[4][3] = 'black';
        board[4][4] = 'white';
    }

    function updateBoard() {
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                const cell = gameBoard.children[i * boardSize + j];
                if (board[i][j]) {
                    cell.innerHTML = `<div class="disc ${board[i][j]}"></div>`;
                } else {
                    cell.innerHTML = '';
                }
            }
        }
    }

    function handleCellClick(event) {
        const row = parseInt(event.target.dataset.row);
        const col = parseInt(event.target.dataset.col);
        if (board[row][col] !== '') return;
        if (placeDisc(row, col, currentPlayer.toLowerCase())) {
            currentPlayer = currentPlayer === 'Black' ? 'White' : 'Black';
            updateBoard();
            updateCurrentPlayerDisplay();
            checkGameOver();
        }
    }

    function updateCurrentPlayerDisplay() {
        const currentPlayerDisplay = document.getElementById('playerTurn');
        if (currentPlayerDisplay) {
            currentPlayerDisplay.textContent = `Current Player: ${currentPlayer}`;
        }
    }

    function placeDisc(row, col, color) {
        let valid = false;
        const directions = [
            [-1, 0], [1, 0], [0, -1], [0, 1],
            [-1, -1], [-1, 1], [1, -1], [1, 1]
        ];

        directions.forEach(([dx, dy]) => {
            let x = row + dx;
            let y = col + dy;
            let cellsToFlip = [];
            while (x >= 0 && x < boardSize && y >= 0 && y < boardSize && board[x][y] !== '' && board[x][y] !== color) {
                cellsToFlip.push([x, y]);
                x += dx;
                y += dy;
            }
            if (x >= 0 && x < boardSize && y >= 0 && y < boardSize && board[x][y] === color && cellsToFlip.length > 0) {
                valid = true;
                board[row][col] = color;
                cellsToFlip.forEach(([fx, fy]) => {
                    board[fx][fy] = color;
                });
            }
        });

        return valid;
    }

    function checkGameOver() {
        // Simple game over check: no empty cells
        if (!board.some(row => row.includes(''))) {
            alert('Game over!');
        }
    }

    document.getElementById('newGameButton').addEventListener('click', initializeBoard); // No change needed, but ensure it matches HTML after correction
    initializeBoard();
});