const STORAGE_KEY = 'chessGameState';

// Define the initial state of the chessboard
const initialState = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
];
// Create an instance of ChessGame
const game = new ChessGame();
let gameHistory = [];
let currentStateIndex = -1;

let selectedPiece = null; // Variable to track the currently selected piece
let currentPlayer = 'white';

// Removed the declaration of 'game' here to avoid conflict with gameLogic.js

function showPossibleMoves(row, col) {
    const piece = chessboard[row][col];
    const possibleMoves = getPossibleMoves(piece, row, col);
    possibleMoves.forEach(move => {
        console.log(`Possible move to [${move.row}, ${move.col}]`);
        const square = document.getElementById(`${move.row}-${move.col}`);
        if (square) {
            square.classList.add('highlight');
        }
    });
}

// Function to save the current state
function saveState() {
    const currentState = JSON.stringify(chessboard);
    if (currentStateIndex < gameHistory.length - 1) {
        gameHistory = gameHistory.slice(0, currentStateIndex + 1);
    }
    gameHistory.push(currentState);
    currentStateIndex++;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameHistory));
}

// Function to undo the last move
function undo() {
    if (currentStateIndex > 0) {
        currentStateIndex--;
        chessboard = JSON.parse(gameHistory[currentStateIndex]);
        chessboard = JSON.parse(gameHistory[currentStateIndex]);
        updateBoard();
    }
}

// Function to redo the last undone move
function redo() {
    if (currentStateIndex < gameHistory.length - 1) {
        currentStateIndex++;
        const nextState = JSON.parse(gameHistory[currentStateIndex]);
        chessboard = nextState;
        updateBoard();
    }
}

let chessboard = gameHistory.length > 0 ? JSON.parse(gameHistory[currentStateIndex]) : [...initialState];

// Load the saved game state from local storage
const savedHistory = localStorage.getItem(STORAGE_KEY);
if (savedHistory) {
    gameHistory = JSON.parse(savedHistory);
    currentStateIndex = gameHistory.length - 1;
    chessboard = JSON.parse(gameHistory[currentStateIndex]);
    updateBoard(); // Ensure the board is updated with the loaded state
}

// Function to handle piece clicks
// Function to clear highlighted squares
// Function to initialize the game
function initializeGame() {
    const boardElement = document.getElementById('chessboard');
    boardElement.innerHTML = '';
    chessboard.forEach((row, rowIndex) => {
        row.forEach((piece, colIndex) => {
            saveState();
            const square = document.createElement('div');
            square.className = `square ${(rowIndex + colIndex) % 2 === 0 ? 'even' : 'odd'}`;
            square.id = `${rowIndex}-${colIndex}`;
            square.dataset.row = rowIndex;
            square.dataset.col = colIndex;
            if (piece) {
                const pieceElement = document.createElement('div');
                pieceElement.className = `chess-piece ${getPieceColor(piece)} ${getPieceType(piece)}`;
                const img = document.createElement('img');
                img.src = getPieceImageUrl(piece);
                img.className = 'chess-piece';
                pieceElement.appendChild(img);
                square.appendChild(pieceElement);
            }
            boardElement.appendChild(square);
            square.addEventListener('click', () => handleSquareClick(rowIndex, colIndex));
        });
    });
}

// Function to handle square clicks
function handleSquareClick(row, col) {
    console.log(`Square clicked: ${row}, ${col}`);
    if (selectedPiece) {
        console.log(`Selected piece: ${selectedPiece.row}, ${selectedPiece.col}`);
        const piece = getPieceType(chessboard[selectedPiece.row][selectedPiece.col]);
        if (piece === '') return;
        // Remove highlights only if a different piece is selected or the same piece is reselected
        if (selectedPiece.row !== row || selectedPiece.col !== col) {
            removeHighlights();
        }
    } else {
        console.log('No piece selected');
    }
    if (selectedPiece && (selectedPiece.row === row && selectedPiece.col === col)) {
        // Deselect the piece if the same square is clicked again
        selectedPiece = null;
    } else if (selectedPiece) {
        const from = {row: selectedPiece.row, col: selectedPiece.col};
        const to = {row, col};
        const startPos = `${String.fromCharCode(97 + selectedPiece.col)}${8 - selectedPiece.row}`;
        const endPos = `${String.fromCharCode(97 + col)}${8 - row}`;
        console.log(`Attempting to move from ${startPos} to ${endPos}`);
        console.log(`Moving piece ${chessboard[selectedPiece.row][selectedPiece.col]} from [${selectedPiece.row}, ${selectedPiece.col}] to [${row}, ${col}]`);
        if (isValidMove(selectedPiece, to)) {
            movePiece(from, to);
            game.movePiece(startPos, endPos);
            selectedPiece = null;
            // Highlights are removed after the move is made
            removeHighlights();
        }
    } else {
        // Select the piece and highlight possible moves
        selectedPiece = {row, col};  // Set the selected piece
        highlightPossibleMoves(row, col);
        console.log(`Selected piece: ${selectedPiece.row}, ${selectedPiece.col}`);
    }
    updateBoard();
}

// Function to move a piece
function movePiece(from, to) {
    const piece = chessboard[from.row][from.col];
    console.log(`Moving piece ${piece} from [${from.row}, ${from.col}] to [${to.row}, ${to.col}]`);
    chessboard[from.row][from.col] = '';
    chessboard[to.row][to.col] = piece;
    // currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
    updateStatus(`${currentPlayer === 'white' ? 'White' : 'Black'}'s turn`);
    currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
}

// Function to highlight possible moves
function highlightPossibleMoves(row, col) {
    const piece = chessboard[row][col];
    console.log(`Highlighting possible moves for ${piece} at [${row}, ${col}]`);
    const possibleMoves = getPossibleMoves(piece, row, col);
    console.log(`Possible moves for ${piece} at [${row}, ${col}]:`, possibleMoves);
    if (!possibleMoves || possibleMoves.length === 0) {
        console.log('No moves')
        return;
    }
    possibleMoves.forEach(move => {
        const square = document.querySelector(`[data-row="${move.row}"][data-col="${move.col}"]`);
        if (square) square.classList.add('highlight');
    });
}

// Function to remove highlights from the board
function removeHighlights() {
    const squares = document.querySelectorAll('.square');
    squares.forEach(square => {
        square.classList.remove('highlight');
    });
}

// Function to get possible moves for a piece (placeholder)
function getPossibleMoves(piece, row, col) {
    console.log(`Getting possible moves for ${piece} at [${row}, ${col}]`);
    // Placeholder for getting possible moves based on piece type and position
    // Return an array of {row, col} objects representing possible moves
    const moves = [];
    const pieceType = piece ? getPieceType(piece) : null;
    if (!pieceType) return [];
    const pieceColor = getPieceColor(piece);
    if (pieceType === 'pawn') {
        const direction = pieceColor === 'white' ? -1 : 1;
        const startRow = pieceColor === 'white' ? 6 : 1;
        if (row === startRow) {
            moves.push({row: row + direction * 2, col: col});
        }
        moves.push({row: row + direction, col: col});
        // Diagonal capture moves
        const leftDiagonal = col - 1;
        const rightDiagonal = col + 1;
        if (leftDiagonal >= 0 && chessboard[row + direction][leftDiagonal] &&
            getPieceColor(chessboard[row + direction][leftDiagonal]) !== pieceColor) {
            moves.push({row: row + direction, col: leftDiagonal});
        }
        if (rightDiagonal < 8 && chessboard[row + direction][rightDiagonal] &&
            getPieceColor(chessboard[row + direction][rightDiagonal]) !== pieceColor) {
            moves.push({row: row + direction, col: rightDiagonal});
        }
    } else if (pieceType === 'rook') {
        for (let i = 1; i < 8; i++) {
            moves.push({row: row + i, col: col});
            moves.push({row: row - i, col: col});
            moves.push({row: row, col: col + i});
            moves.push({row: row, col: col - i});
        }
    } else if (pieceType === 'knight') {
        moves.push({row: row + 2, col: col + 1});
        moves.push({row: row + 2, col: col - 1});
        moves.push({row: row - 2, col: col + 1});
        moves.push({row: row - 2, col: col - 1});
        moves.push({row: row + 1, col: col + 2});
        moves.push({row: row + 1, col: col - 2});
        moves.push({row: row - 1, col: col + 2});
        moves.push({row: row - 1, col: col - 2});
    } else if (pieceType === 'bishop') {
        for (let i = 1; i < 8; i++) {
            moves.push({row: row + i, col: col + i});
            moves.push({row: row + i, col: col - i});
            moves.push({row: row - i, col: col + i});
            moves.push({row: row - i, col: col - i});
        }
    } else if (pieceType === 'queen') {
        for (let i = 1; i < 8; i++) {
            moves.push({row: row + i, col: col});
            moves.push({row: row - i, col: col});
            moves.push({row: row, col: col + i});
            moves.push({row: row, col: col - i});
            moves.push({row: row + i, col: col + i});
            moves.push({row: row + i, col: col - i});
            moves.push({row: row - i, col: col + i});
            moves.push({row: row - i, col: col - i});
        }
    } else if (pieceType === 'king') {
        moves.push({row: row + 1, col: col});
        moves.push({row: row - 1, col: col});
        moves.push({row: row, col: col + 1});
        moves.push({row: row, col: col - 1});
        moves.push({row: row + 1, col: col + 1});
        moves.push({row: row + 1, col: col - 1});
        moves.push({row: row - 1, col: col + 1});
        moves.push({row: row - 1, col: col - 1});
    }
    // Filter out moves that are off the board
    return moves.filter(move => move.row >= 0 && move.row < 8 && move.col >= 0 && move.col < 8);
}

// Function to check if a move is valid
function isValidMove(selectedPiece, to) {
    const from = {row: selectedPiece.row, col: selectedPiece.col};
    if (to.row < 0 || to.row >= 8 || to.col < 0 || to.col >= 8) {
        return false;
    }
    const piece = chessboard[from.row][from.col];
    const possibleMoves = getPossibleMoves(piece, selectedPiece.row, selectedPiece.col);
    return possibleMoves.some(move => move.row === to.row && move.col === to.col);
}

// Function to update the board display after a move
function updateBoard() {
    const boardElement = document.getElementById('chessboard');
    boardElement.innerHTML = '';
    chessboard.forEach((row, rowIndex) => {
        row.forEach((piece, colIndex) => {
            const square = document.createElement('div');
            square.className = `square ${(rowIndex + colIndex) % 2 === 0 ? 'even' : 'odd'}`;
            square.id = `${rowIndex}-${colIndex}`;
            square.dataset.row = rowIndex;
            square.dataset.col = colIndex;
            if (piece) {
                const pieceElement = document.createElement('div');
                pieceElement.className = `chess-piece ${getPieceColor(piece)} ${getPieceType(piece)}`;
                const img = document.createElement('img');
                img.src = getPieceImageUrl(piece);
                img.className = 'chess-piece';
                pieceElement.appendChild(img);
                square.appendChild(pieceElement);
            } else {
                square.innerHTML = '';
            }
            boardElement.appendChild(square);
            square.addEventListener('click', () => handleSquareClick(rowIndex, colIndex));
        });
    });
    if (selectedPiece) {
        highlightPossibleMoves(selectedPiece.row, selectedPiece.col);
    }
}

// Helper function to get piece color
function getPieceColor(piece) {
    return piece === piece.toUpperCase() ? 'white' : 'black';
}

// Helper function to get piece type
function getPieceType(piece) {
    const types = {
        'p': 'pawn', 'r': 'rook', 'n': 'knight', 'b': 'bishop', 'q': 'queen', 'k': 'king',
        'P': 'pawn', 'R': 'rook', 'N': 'knight', 'B': 'bishop', 'Q': 'queen', 'K': 'king'
    };
    return types[piece.toLowerCase()];
}

// Function to get the image URL for a chess piece
function getPieceImageUrl(piece) {
    const color = piece === piece.toUpperCase() ? 'l' : 'd';
    const typeCode = {
        'p': 'p', 'r': 'r', 'n': 'n', 'b': 'b', 'q': 'q', 'k': 'k'
    }[piece.toLowerCase()];
    return `img/Chess_${typeCode}${color}t60.png`;
}

// Function to update the game status
function updateStatus(message) {
    const statusElement = document.getElementById('status');
    statusElement.textContent = message;
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initializeGame, 0);  // Defer initialization to allow the UI thread to remain responsive
    document.getElementById('undo').addEventListener('click', undo);
    document.getElementById('redo').addEventListener('click', redo);
});