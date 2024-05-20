const STORAGE_KEY = 'chessGameState';

// Define the initial state of the chessboard
const initialState = [
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r']
];
// Create an instance of ChessGame
const game = new ChessGame();
let gameHistory = [];
let currentStateIndex = -1;

let selectedPiece = null; // Variable to track the currently selected piece
let currentPlayer = 'white';

let chessboard = gameHistory.length > 0 ? JSON.parse(gameHistory[currentStateIndex]) : [...initialState];

// Load the saved game state from local storage
const savedHistory = localStorage.getItem(STORAGE_KEY);

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
    const currentState = JSON.stringify({
        gameState: game.getGameState(),
        currentPlayer: game.currentTurn,
        moveLog: game.moveLog
    });
    if (currentStateIndex < gameHistory.length - 1) {
        gameHistory = gameHistory.slice(0, currentStateIndex + 1);
    }
    gameHistory.push(currentState);
    currentStateIndex++;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameHistory));
}

function undo() {
    if (currentStateIndex > 0) {
        currentStateIndex--;
        const state = JSON.parse(gameHistory[currentStateIndex]).gameState;
        game.setGameState(state);
        chessboard = state.board;
        currentPlayer = game.currentTurn;
        updateBoard();
    }
}

function redo() {
    if (currentStateIndex < gameHistory.length - 1) {
        currentStateIndex++;
        const state = JSON.parse(gameHistory[currentStateIndex]).gameState;
        game.setGameState(state);
        chessboard = state.board;
        currentPlayer = game.currentTurn;
        updateBoard();
    }
}

if (savedHistory) {
    gameHistory = JSON.parse(savedHistory);
    currentStateIndex = gameHistory.length - 1;
    const state = JSON.parse(gameHistory[currentStateIndex]).gameState;
    if (state) {
        game.setGameState(state);
        chessboard = state.board;
        currentPlayer = game.currentTurn;
        updateStatus(`${currentPlayer === 'white' ? 'White' : 'Black'}'s turn`);
    }
    updateBoard(); // Ensure the board is updated with the loaded state
}

// Function to handle piece clicks
// Function to clear highlighted squares
// Function to initialize the game
function initializeGame() {
    console.log('Game initialized.');
    const boardElement = document.getElementById('chessboard');
    boardElement.innerHTML = '';
    if (chessboard) chessboard.forEach((row, rowIndex) => {
        row.forEach((piece, colIndex) => {
            saveState();
            const square = document.createElement('div');
            square.className = `square ${(rowIndex + colIndex) % 2 === 0 ? 'even' : 'odd'}`;
            square.id = `${rowIndex}-${colIndex}`;
            square.dataset.row = rowIndex;
            square.dataset.col = colIndex;
            // Add coordinate display
            const coordinate = document.createElement('div');
            coordinate.className = 'coordinate';
            coordinate.textContent = `${String.fromCharCode(97 + colIndex)}${8 - rowIndex}`;
            square.appendChild(coordinate);
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
    if (selectedPiece && selectedPiece.row === row && selectedPiece.col === col && chessboard[row][col] !== '') {
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
            const capturedPiece = chessboard[to.row][to.col];
            const movingPlayer = currentPlayer
            const possibleMoves = getPossibleMoves(game.board[selectedPiece.row][selectedPiece.col], selectedPiece.row, selectedPiece.col);
            game.movePiece(startPos, endPos, possibleMoves);
            saveState(); // Save state after a move
            if (capturedPiece) {
                game.status = `${movingPlayer === 'white' ? 'White' : 'Black'} captured ${capturedPiece}`;
            }
            updateStatus(game.status); // Update the status after the move
            selectedPiece = null;
            // Highlights are removed after the move is made
            removeHighlights();
            updateBoard(); // Ensure the board is updated after a move
        }
    } else {
        // Select the piece and highlight possible moves
        selectedPiece = {row, col};  // Set the selected piece
        const piece = chessboard[row][col];
        if ((currentPlayer === 'white' && piece !== piece.toUpperCase()) || (currentPlayer === 'black' && piece !== piece.toLowerCase())) {
            console.log('Cannot select opponent\'s piece');
            selectedPiece = null;
            return;
        }
        highlightPossibleMoves(row, col);
        console.log(`Selected piece: ${selectedPiece.row}, ${selectedPiece.col}`);
    }
}

// Function to move a piece
function movePiece(from, to, capturedPiece) {
    const piece = chessboard[from.row][from.col];
    console.log(`Moving piece ${piece} from [${from.row}, ${from.col}] to [${to.row}, ${to.col}]`);
    chessboard[from.row][from.col] = '';
    chessboard[to.row][to.col] = piece;
    updateStatus(game.status); // Update the status after the move
    if (capturedPiece) {
        console.log(`Captured piece: ${capturedPiece}`);
    }
    currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
}

// Function to highlight possible moves
function highlightPossibleMoves(row, col) {
    const piece = chessboard[row][col];
    console.log(`Highlighting possible moves for ${piece} at [${row}, ${col}]`);
    const possibleMoves = getPossibleMoves(piece, row, col);
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
        const direction = pieceColor === 'white' ? 1 : -1;
        const startRow = pieceColor === 'white' ? 1 : 6;
        if (row === startRow) {
            moves.push({row: row + direction * 2, col: col});
        }
        if (!chessboard[row + direction][col]) { // Check if the square in front is empty
            moves.push({row: row + direction, col: col});
        }
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
        for (let i = row + 1; i < 8; i++) {
            if (chessboard[i][col]) {
                if (getPieceColor(chessboard[i][col]) !== pieceColor) moves.push({row: i, col: col});
                break;
            }
            moves.push({row: i, col: col});
        }
        for (let i = row - 1; i >= 0; i--) {
            if (chessboard[i][col]) {
                if (getPieceColor(chessboard[i][col]) !== pieceColor) moves.push({row: i, col: col});
                break;
            }
            moves.push({row: i, col: col});
        }
        for (let i = col + 1; i < 8; i++) {
            if (chessboard[row][i]) {
                if (getPieceColor(chessboard[row][i]) !== pieceColor) moves.push({row: row, col: i});
                break;
            }
            moves.push({row: row, col: i});
        }
        for (let i = col - 1; i >= 0; i--) {
            if (chessboard[row][i]) {
                if (getPieceColor(chessboard[row][i]) !== pieceColor) moves.push({row: row, col: i});
                break;
            }
            moves.push({row: row, col: i});
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
        for (let i = 1; row + i < 8 && col + i < 8; i++) {
            if (chessboard[row + i][col + i]) {
                if (getPieceColor(chessboard[row + i][col + i]) !== pieceColor) moves.push({
                    row: row + i,
                    col: col + i
                });
                break;
            }
            moves.push({row: row + i, col: col + i});
        }

        for (let i = 1; row + i < 8 && col - i >= 0; i++) {
            if (chessboard[row + i][col - i]) {
                if (getPieceColor(chessboard[row + i][col - i]) !== pieceColor) moves.push({
                    row: row + i,
                    col: col - i
                });
                break;
            }
            moves.push({row: row + i, col: col - i});
        }
        for (let i = 1; row - i >= 0 && col + i < 8; i++) {
            if (chessboard[row - i][col + i]) {
                if (getPieceColor(chessboard[row - i][col + i]) !== pieceColor) moves.push({
                    row: row - i,
                    col: col + i
                });
                break;
            }
            moves.push({row: row - i, col: col + i});
        }
        for (let i = 1; row - i >= 0 && col - i >= 0; i++) {
            if (chessboard[row - i][col - i]) {
                if (getPieceColor(chessboard[row - i][col - i]) !== pieceColor) moves.push({
                    row: row - i,
                    col: col - i
                });
                break;
            }
            moves.push({row: row - i, col: col - i});
        }
    } else if (pieceType === 'queen') {
        for (let i = row + 1; i < 8; i++) {
            if (chessboard[i][col]) {
                if (getPieceColor(chessboard[i][col]) !== pieceColor) moves.push({row: i, col: col});
                break;
            }
            moves.push({row: i, col: col});
        }
        for (let i = row - 1; i >= 0; i--) {
            if (chessboard[i][col]) {
                if (getPieceColor(chessboard[i][col]) !== pieceColor) moves.push({row: i, col: col});
                break;
            }
            moves.push({row: i, col: col});
        }
        for (let i = col + 1; i < 8; i++) {
            if (chessboard[row][i]) {
                if (getPieceColor(chessboard[row][i]) !== pieceColor) moves.push({row: row, col: i});
                break;
            }
            moves.push({row: row, col: i});
        }
        for (let i = col - 1; i >= 0; i--) {
            if (chessboard[row][i]) {
                if (getPieceColor(chessboard[row][i]) !== pieceColor) moves.push({row: row, col: i});
                break;
            }
            moves.push({row: row, col: i});
        }
        for (let i = 1; i < 8; i++) {
            if (row + i >= 8 || col + i >= 8) break;
            if (chessboard[row + i][col + i]) {
                if (getPieceColor(chessboard[row + i][col + i]) !== pieceColor) moves.push({
                    row: row + i,
                    col: col + i
                });
                break;
            }
            moves.push({row: row + i, col: col + i});
        }
        for (let i = 1; i < 8; i++) {
            if (row + i >= 8 || col - i < 0) break;
            if (chessboard[row + i][col - i]) {
                if (getPieceColor(chessboard[row + i][col - i]) !== pieceColor) moves.push({
                    row: row + i,
                    col: col - i
                });
                break;
            }
            moves.push({row: row + i, col: col - i});
        }
        for (let i = 1; i < 8; i++) {
            if (row - i < 0 || col + i >= 8) break;
            if (chessboard[row - i][col + i]) {
                if (getPieceColor(chessboard[row - i][col + i]) !== pieceColor) moves.push({
                    row: row - i,
                    col: col + i
                });
                break;
            }
            moves.push({row: row - i, col: col + i});
        }
        for (let i = 1; i < 8; i++) {
            if (row - i < 0 || col - i < 0) break;
            if (chessboard[row - i][col - i]) {
                if (getPieceColor(chessboard[row - i][col - i]) !== pieceColor) moves.push({
                    row: row - i,
                    col: col - i
                });
                break;
            }
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
    let filter = moves.filter(move => move.row >= 0 && move.row < 8 && move.col >= 0 && move.col < 8);
    console.log(`Possible moves for ${piece} at [${row}, ${col}]:`, JSON.stringify(filter));
    return filter;
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
    if (null == chessboard) return;
    chessboard.forEach((row, rowIndex) => {
        row.forEach((piece, colIndex) => {
            const square = document.createElement('div');
            square.className = `square ${(rowIndex + colIndex) % 2 === 0 ? 'even' : 'odd'}`;
            square.id = `${rowIndex}-${colIndex}`;
            square.dataset.row = rowIndex;
            square.dataset.col = colIndex;
            // Add coordinate display
            const coordinate = document.createElement('div');
            coordinate.className = 'coordinate';
            coordinate.textContent = `${String.fromCharCode(97 + colIndex)}${8 - rowIndex}`;
            square.appendChild(coordinate);
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
    console.table(chessboard.map(row => row.map(piece => piece ? piece : '  ')));
    if (selectedPiece) {
        highlightPossibleMoves(selectedPiece.row, selectedPiece.col);
    }
    updateMoveLog();
}

// Function to update the move log display
function updateMoveLog() {
    const moveLogElement = document.getElementById('move-log');
    moveLogElement.innerHTML = '';
    game.moveLog.forEach((move, index) => {
        const moveElement = document.createElement('div');
        moveElement.textContent = `${index + 1}. ${move}`;
        moveLogElement.appendChild(moveElement);
    });
}

// Helper function to get piece color
function getPieceColor(piece) {
    return piece === piece.toUpperCase() ? 'white' : 'black';

    return piece === piece.toUpperCase() ? 'white' : 'black';
}

// Helper function to get piece type
function getPieceType(piece) {
    const types = {
        'p': 'pawn', 'r': 'rook', 'n': 'knight', 'b': 'bishop', 'q': 'queen', 'k': 'king',
        'P': 'pawn', 'R': 'rook', 'N': 'knight', 'B': 'bishop', 'Q': 'queen', 'K': 'king'
    };
    return types[piece[piece.length - 1].toLowerCase()];
}

// Function to get the image URL for a chess piece
function getPieceImageUrl(piece) {
    const color = getPieceColor(piece) === 'white' ? 'l' : 'd';
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
    console.log('Initializing game...');
    setTimeout(initializeGame, 0);  // Defer initialization to allow the UI thread to remain responsive
    document.getElementById('undo').addEventListener('click', undo);
    document.getElementById('redo').addEventListener('click', redo);
    document.getElementById('import-layout').addEventListener('click', importLayout);
    document.getElementById('export-layout').addEventListener('click', exportLayout);
    document.getElementById('reset').addEventListener('click', resetGame);
    document.getElementById('save-load-button').addEventListener('click', openModal);
    document.querySelector('.close').addEventListener('click', closeModal);
    document.getElementById('text-move-button').addEventListener('click', openTextMoveModal);
    document.querySelector('.close-text-move').addEventListener('click', closeTextMoveModal);
    document.getElementById('submit-text-move').addEventListener('click', submitTextMove);
    window.addEventListener('click', (event) => {
        if (event.target === document.getElementById('move-log-modal')) {
            closeMoveLogModal();
        }
        if (event.target === document.getElementById('text-move-modal')) {
            closeTextMoveModal();
        }
    });
    document.getElementById('move-log-button').addEventListener('click', openMoveLogModal);
    document.querySelector('.close-move-log').addEventListener('click', closeMoveLogModal);

// Function to open the move log modal
    function openMoveLogModal() {
        document.getElementById('move-log-modal').style.display = 'block';
    }

// Function to close the move log modal
    function closeMoveLogModal() {
        document.getElementById('move-log-modal').style.display = 'none';
    }

// Function to open the text move modal
    function openTextMoveModal() {
        document.getElementById('text-move-modal').style.display = 'block';
    }

// Function to close the text move modal
    function closeTextMoveModal() {
        document.getElementById('text-move-modal').style.display = 'none';
    }

// Function to submit a text move
    function submitTextMove() {
        const moveText = document.getElementById('text-move-input').value.trim();
        if (moveText.length === 4) {
            const startPos = moveText.substring(0, 2);
            const endPos = moveText.substring(2, 4);
            console.log(`Attempting to move from ${startPos} to ${endPos}`);
            const [startRow, startCol] = game.parsePosition(startPos);
            const [endRow, endCol] = game.parsePosition(endPos);
            const from = {row: startRow, col: startCol};
            const to = {row: endRow, col: endCol};
            if (isValidMove(from, to)) {
                const capturedPiece = chessboard[endRow][endCol];
                const movingPlayer = currentPlayer;
                movePiece(from, to, capturedPiece);
                game.movePiece(startPos, endPos);
                saveState(); // Save state after a move
                if (capturedPiece) {
                    game.status = `${movingPlayer === 'white' ? 'White' : 'Black'} captured ${capturedPiece}`;
                }
                updateStatus(game.status); // Update the status after the move
                updateBoard(); // Update the board display
                closeTextMoveModal(); // Close the modal after the move
            } else {
                alert('Invalid move. Please try again.');
            }
        } else {
            alert('Invalid move notation. Please enter a move in the format "e2e4".');
        }
    }
});

// Function to open the modal
function openModal() {
    document.getElementById('modal').style.display = 'block';
}

// Function to close the modal
function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

// Function to reset the game
function resetGame() {
    chessboard = [...initialState];
    gameHistory = [];
    currentStateIndex = -1;
    selectedPiece = null;
    currentPlayer = game.currentTurn = 'white';
    game.board = game.initializeBoard();
    game.currentTurn = 'white';
    game.gameOver = false;
    game.status = "White's turn";
    game.moveLog = [];
    saveState();
    updateBoard();
    updateStatus(game.status);
}

// Function to import board layout from textarea
function importLayout() {
    const layoutText = document.getElementById('board-layout').value;
    try {
        const newLayout = parseAsciiBoard(layoutText);
        if (newLayout && validateBoardLayout(newLayout)) {
            chessboard = newLayout;
            saveState();
            updateBoard();
            alert('Board layout imported successfully.');
            console.log('Board layout imported successfully:', newLayout);
        } else {
            alert('Invalid board layout. Please ensure it is in the correct ASCII format.');
            console.error('Invalid board layout:', newLayout);
        }
    } catch (e) {
        console.error('Error importing layout:', e);
        alert('Invalid format. Please ensure the board layout is in valid ASCII format.');
    }
}

// Function to export board layout to textarea
function exportLayout() {
    const layoutText = generateAsciiBoard(chessboard);
    document.getElementById('board-layout').value = layoutText;
}

// Function to parse ASCII board layout
function parseAsciiBoard(ascii) {
    const rows = ascii.trim().split('\n');
    if (rows.length !== 8) return null;
    const board = rows.map(row => row.split('').map(char => char === ' ' ? '' : char));
    if (board.some(row => row.length !== 8)) return null;
    console.log('Parsed ASCII board layout:', board);
    return board;
}

// Function to validate the board layout
function validateBoardLayout(board) {
    if (!Array.isArray(board) || board.length !== 8) {
        console.error('Board layout must be an 8x8 array.');
        return false;
    }
    for (const row of board) {
        if (!Array.isArray(row) || row.length !== 8) {
            console.error('Each row in the board layout must be an array of length 8.');
            return false;
        }
    }
    console.log('Board layout is valid:', board);
    return true;
}

// Function to generate ASCII board layout
function generateAsciiBoard(board) {
    return board.map(row => row.map(piece => piece === '' ? ' ' : piece).join('')).join('\n');
}