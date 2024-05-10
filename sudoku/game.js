// game.js

    function giveHint() {
        // Implementation for providing hints to the user
        // This function should find an empty cell and fill it with the correct value from the solution
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
            let input = document.getElementById('sudoku-grid').rows[i].cells[j].querySelector('input');
                if (!input.value) {
                    input.value = solution[i][j];
                    showMessage('Hint applied. You can continue solving!');
                    return;
                }
            }
        }
        showMessage('No empty cells found. Try checking your solution!');
    }
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('sudoku-grid');
    const checkButton = document.getElementById('check-solution');
    const newGameButton = document.getElementById('new-game');
    const resetButton = document.getElementById('reset-game'); // Ensure this button exists or remove this line if not used
    const hintButton = document.getElementById('hint-button');
    const messageDisplay = document.createElement('div');
    messageDisplay.id = 'message-display';
    document.body.appendChild(messageDisplay);
    // Removed duplicate declaration of messageDisplay

    let solution = [
        [5, 3, 4, 6, 7, 8, 9, 1, 2],
        [6, 7, 2, 1, 9, 5, 3, 4, 8],
        [1, 9, 8, 3, 4, 2, 5, 6, 7],
        [8, 5, 9, 7, 6, 1, 4, 2, 3],
        [4, 2, 6, 8, 5, 3, 7, 9, 1],
        [7, 1, 3, 9, 2, 4, 8, 5, 6],
        [9, 6, 1, 5, 3, 7, 2, 8, 4],
        [2, 8, 7, 4, 1, 9, 6, 3, 5],
        [3, 4, 5, 2, 8, 6, 1, 7, 9]
    ];

    function initializeGrid() {
        grid.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            let row = grid.insertRow(i);
            for (let j = 0; j < 9; j++) {
                let cell = row.insertCell(j);
                let input = document.createElement('input');
                input.type = 'text';
                input.maxLength = 1;
                cell.appendChild(input);
                cell.classList.add('cell');
                input.addEventListener('input', () => validateInput(input, i, j));
            }
        }
    }

    function validateInput(cell, row, col) {
        const value = parseInt(cell.value);
        if (isNaN(value) || value < 1 || value > 9) {
            cell.classList.add('error');
            showMessage('Invalid input! Please enter numbers between 1 and 9.');
        } else {
            cell.classList.remove('error');
            messageDisplay.innerText = '';
        }
    }

    function checkSolution() {
        let isCorrect = true;
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                let userValue = parseInt(grid.rows[i].cells[j].querySelector('input').value);
                if (userValue !== solution[i][j]) {
                    isCorrect = false;
                    grid.rows[i].cells[j].classList.add('wrong');
                } else {
                    grid.rows[i].cells[j].classList.remove('wrong');
                }
            }
        }
        if (isCorrect) {
            showMessage('Congratulations! You solved the puzzle correctly!');
        } else {
            showMessage('Incorrect solution. Please try again.');
        }
    }

    function resetGame() {
        initializeGrid();
        showMessage('');
    }

    function showMessage(msg) {
        messageDisplay.innerText = msg;
    }

    newGameButton.addEventListener('click', resetGame);
    checkButton.addEventListener('click', checkSolution);
    resetButton.addEventListener('click', resetGame);
    hintButton.addEventListener('click', giveHint);

    // Initialize the game
    initializeGrid();
});