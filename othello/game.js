document.addEventListener('DOMContentLoaded', () => {
    const boardSize = 8;
    const gameBoard = document.getElementById('board'); // Corrected to match HTML
    let board = [];
    let currentPlayer = 'Black';

   function indicatePossibleMoves() {
      console.log('Indicating possible moves for', currentPlayer);
       for (let i = 0; i < boardSize; i++) {
           for (let j = 0; j < boardSize; j++) {
               if (board[i][j] === '' && isMoveValid(i, j, currentPlayer.toLowerCase())) {
                   const cell = gameBoard.children[i * boardSize + j];
                   cell.classList.add('possible-move');
                  console.log(`Possible move at ${i}, ${j}`);
               }
           }
       }
   }

   function isMoveValid(row, col, color) {
       if (board[row][col] !== '') return false;
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
              console.log(`Move valid at ${row}, ${col} in direction ${dx}, ${dy}`);
           }
       });
      if (!valid) console.log(`Move not valid at ${row}, ${col}`);
       return valid;
   }
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
       indicatePossibleMoves();
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
                cell.classList.remove('possible-move'); // Ensure all cells are reset before indicating new moves
                   cell.classList.remove('possible-move'); // Remove indication from previous moves
                }
            }
        }
    }

    function handleCellClick(event) {
        const row = parseInt(event.target.dataset.row);
        const col = parseInt(event.target.dataset.col);
       console.log(`Cell clicked at ${row}, ${col}`);
        if (board[row][col] !== '') return;
        if (placeDisc(row, col, currentPlayer.toLowerCase())) {
            currentPlayer = currentPlayer === 'Black' ? 'White' : 'Black';
            updateBoard();
           indicatePossibleMoves(); // Ensure possible moves are indicated after every move
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
       console.log(`Placing disc at ${row}, ${col} for ${color}`);
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
                   console.log(`Flipping disc at ${fx}, ${fy}`);
                });
            }
        });

        if (!valid) console.log(`Placement not valid at ${row}, ${col}`);
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