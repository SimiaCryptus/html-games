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

let chessboard = [...initialState];
let currentPlayer = 'white';
let selectedPiece = null; // Variable to track the currently selected piece

// Function to initialize the game
function initializeGame() {
    const boardElement = document.getElementById('chessboard');
    boardElement.innerHTML = '';
    chessboard.forEach((row, rowIndex) => {
        row.forEach((piece, colIndex) => {
            const square = document.createElement('div');
            square.className = `square ${(rowIndex + colIndex) % 2 === 0 ? 'even' : 'odd'}`;
            square.id = `${rowIndex}-${colIndex}`;
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
        movePiece(selectedPiece, {row, col});
        selectedPiece = null;
    } else {
        selectedPiece = {row, col};
        showPossibleMoves(row, col);
    }
    updateBoard();
}

// Function to move a piece
function movePiece(from, to) {
    const piece = chessboard[from.row][from.col];
    chessboard[from.row][from.col] = '';
    chessboard[to.row][to.col] = piece;
    updateStatus(`${currentPlayer === 'white' ? 'Black' : 'White'}'s turn`);
    currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
}

// Function to show possible moves
function showPossibleMoves(row, col) {
    // Placeholder for showing possible moves
    console.log(`Possible moves for ${row},${col}`);
}

// Function to update the board display after a move
function updateBoard() {
    initializeGame();
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
document.addEventListener('DOMContentLoaded', initializeGame);