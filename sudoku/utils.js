/**
 * Shuffles an array using the Fisher-Yates (Durstenfeld) shuffle algorithm.
 * @param {Array} array - The array to shuffle.
 * @returns {Array} The shuffled array.
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
}

/**
 * Checks if the Sudoku board is completely filled.
 * @param {number[][]} board - The 9x9 Sudoku board.
 * @returns {boolean} True if the board is completely filled, false otherwise.
 */
function isBoardComplete(board) {
    for (let row of board) {
        for (let cell of row) {
            if (cell === 0) { // Assuming 0 represents an empty cell
                return false;
            }
        }
    }
    return true;
}

/**
 * Validates a Sudoku board to check if it follows Sudoku rules.
 * @param {number[][]} board - The 9x9 Sudoku board.
 * @returns {boolean} True if the board is valid, false otherwise.
 */
function validateBoard(board) {
    const size = 9;
    const boxSize = 3;

    // Check rows and columns
    for (let i = 0; i < size; i++) {
        const rowSet = new Set();
        const colSet = new Set();

        for (let j = 0; j < size; j++) {
            const rowVal = board[i][j];
            const colVal = board[j][i];

            if (rowVal !== 0) {
                if (rowSet.has(rowVal)) return false;
                rowSet.add(rowVal);
            }

            if (colVal !== 0) {
                if (colSet.has(colVal)) return false;
                colSet.add(colVal);
            }
        }
    }

    // Check 3x3 subgrids
    for (let row = 0; row < size; row += boxSize) {
        for (let col = 0; col < size; col += boxSize) {
            const boxSet = new Set();

            for (let r = 0; r < boxSize; r++) {
                for (let c = 0; c < boxSize; c++) {
                    const val = board[row + r][col + c];
                    if (val !== 0) {
                        if (boxSet.has(val)) return false;
                        boxSet.add(val);
                    }
                }
            }
        }
    }

    return true;
}

/**
 * Generates a random integer between min and max inclusive.
 * @param {number} min - The minimum value.
 * @param {number} max - The maximum value.
 * @returns {number} A random integer between min and max.
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export { shuffleArray, isBoardComplete, validateBoard, getRandomInt };