// gameLogic.js

class ChessGame {
    constructor() {
        this.board = this.initializeBoard();
        this.currentTurn = 'white';
        this.gameOver = false;
        this.status = "White's turn";
        this.moveLog = [];
        this.gameId = null; // Add gameId to track the game session
        this.playerColor = 'white'; // Add playerColor to track the player's color
        this.opponentMoveCallback = null; // Callback for opponent's move
        this.isOnlineGame = false; // Flag to check if the game is online
        this.opponentMoveInterval = null; // Interval to poll for opponent's move
        this.lastMoveTime = null; // Track the time of the last move
    }

    setGameId(gameId) {
        this.gameId = gameId;
    }

    setPlayerColor(color) {
        this.playerColor = color;
    }

    setOpponentMoveCallback(callback) {
        this.opponentMoveCallback = callback;
    }

    getGameState() {
        return {
            board: this.board,
            currentTurn: this.currentTurn,
            moveLog: this.moveLog,
            status: this.status,
             gameOver: this.gameOver,
             gameId: this.gameId, // Include gameId in the game state
             playerColor: this.playerColor, // Include playerColor in the game state
            lastMoveTime: this.lastMoveTime // Include lastMoveTime in the game state
        };
    }

    setGameState(state) {
        this.board = state.board;
        this.currentTurn = state.currentTurn;
        this.moveLog = state.moveLog;
        this.status = state.status;
        this.gameOver = state.gameOver;
        this.status = `${this.currentTurn === 'white' ? 'White' : 'Black'}'s turn`;
        this.moveLog = state.moveLog;
        this.gameId = state.gameId; // Set gameId from the state
        this.playerColor = state.playerColor; // Set playerColor from the state
        this.lastMoveTime = state.lastMoveTime; // Set lastMoveTime from the state
        if (this.opponentMoveCallback) {
            this.opponentMoveCallback();
        }
    }

    initializeBoard() {
        // Initialize the chess board with pieces in their starting positions
        // Simplified representation: each piece is represented by a string
        // Example: 'P' for pawn, 'K' for king, etc.
        const board = new Array(8).fill(null).map(() => new Array(8).fill(null));

        // Place pawns
        for (let i = 0; i < 8; i++) {
            board[1][i] = 'P';
            board[6][i] = 'p';
        }

        // Place other pieces
        const lineup = ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'].map(piece => piece.toUpperCase());
        lineup.forEach((piece, index) => {
            board[7][index] = piece.toLowerCase();
            board[0][index] = piece;
        });

        return board;
    }

    movePiece(start, end, possibleMoves) {
        // Validate and move a piece from start to end
        const [startRow, startCol] = this.parsePosition(start);
        const [endRow, endCol] = this.parsePosition(end);

        if (!this.isValidMove(startRow, startCol, endRow, endCol, possibleMoves)) {
            this.status = 'Invalid move';
            return false;
        }

        // Capture the piece if present
        const capturedPiece = this.board[endRow][endCol];

        // Move the piece
        const movingPiece = this.board[startRow][startCol];
        this.board[endRow][endCol] = this.board[startRow][startCol];
        this.board[startRow][startCol] = ''; // Use empty string to be consistent with initialState

        // Log the move
        this.logMove(start, end, capturedPiece ? capturedPiece : '');

        // Switch turn before checking for check/checkmate
        this.currentTurn = this.currentTurn === 'white' ? 'black' : 'white';
        currentPlayer = this.currentTurn;

        // Check for check/checkmate conditions
        if (this.isCheck()) {
            if (this.isCheckmate()) {
                this.status = `${this.currentTurn} is in checkmate`;
                this.gameOver = true;
            } else {
                this.status = `${this.currentTurn} is in check`;
            }
        } else {
            this.status = `${this.currentTurn === 'white' ? 'White' : 'Black'}'s turn`;
        }
        console.table(this.board.map(row => row.map(piece => piece ? piece : '  ')));

        // Update the last move time
        this.lastMoveTime = new Date().toISOString();

        // Send the updated game state to the server
        if (this.isOnlineGame && this.gameId) {
            sendGameState(this.getGameState());
        }

        return true;
    }

    logMove(start, end, capturedPiece) {
        const piece = this.board[this.parsePosition(end)[0]][this.parsePosition(end)[1]];
        let move = `${piece}${start}${capturedPiece ? 'x' : ''}${end}`;
        if (capturedPiece) {
            move += ` (captured ${capturedPiece})`;
        }
        this.moveLog.push(move);
    }

    isValidMove(startRow, startCol, endRow, endCol, possibleMoves) {
        if (startRow < 0 || startRow >= 8 || startCol < 0 || startCol >= 8 ||
            endRow < 0 || endRow >= 8 || endCol < 0 || endCol >= 8) {
            console.log("Invalid move: " + [startRow, startCol, endRow, endCol])
            return false;
        }
        const piece = this.board[startRow][startCol];
        if (!piece) {
            console.log("Invalid move: No piece at the start position")
            return false; // No piece at the start position
        }
        const targetPiece = this.board[endRow][endCol];
        if (targetPiece && ((this.currentTurn === 'white' && targetPiece === targetPiece.toUpperCase()) || (this.currentTurn === 'black' && targetPiece === targetPiece.toLowerCase()))) {
            console.log("Invalid move: Cannot capture a piece of the same color")
            return false; // Cannot capture a piece of the same color
        }
        if ((this.currentTurn === 'white' && piece !== piece.toUpperCase()) || (this.currentTurn === 'black' && piece !== piece.toLowerCase())) {
            console.log("Invalid move: Not the player's piece")
            return false; // Not the player's piece
        }
        let b = possibleMoves.some(move => move.row === endRow && move.col === endCol);
        if (!b) console.log("Invalid move: " + [startRow, startCol] + ' -> ' + [endRow, endCol] + " not in possible moves: ", possibleMoves)
        return b;
    }

    isCheck() {
        // Placeholder for check condition logic
        return false; // Simplified for demonstration
    }

    isCheckmate() {
        // Placeholder for checkmate condition logic
        return false; // Simplified for demonstration
    }

    parsePosition(position) {
        // Convert chess notation position (e.g., 'a1') to board array indices
        const row = 8 - parseInt(position[1]);
        const col = position.charCodeAt(0) - 'a'.charCodeAt(0);
        return [row, col];
    }

    startPollingForOpponentMove() {
        if (this.opponentMoveInterval) {
            clearInterval(this.opponentMoveInterval);
        }
        this.opponentMoveInterval = setInterval(async () => {
            const gameState = await receiveGameState(this.gameId);
            if (gameState && gameState.currentTurn !== this.currentTurn && gameState.lastMoveTime !== this.lastMoveTime) {
                this.setGameState(gameState);
                if (this.opponentMoveCallback) {
                    this.opponentMoveCallback();
                }
            }
        }, 3000); // Poll every 3 seconds
    }

    stopPollingForOpponentMove() {
        if (this.opponentMoveInterval) {
            clearInterval(this.opponentMoveInterval);
            this.opponentMoveInterval = null;
        }
    }
}

// Function to send the game state to the server
async function sendGameState(gameState) {
    const response = await fetch(`https://httprelay.io/${gameState.gameId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(gameState)
    });
    if (!response.ok) {
        console.error('Failed to send game state:', response.statusText);
    }
}

// Function to receive the game state from the server
async function receiveGameState(gameId) {
    const response = await fetch(`https://httprelay.io/${gameId}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    });
    if (response.ok) {
        const gameState = await response.json();
        return gameState;
    } else {
        console.error('Failed to receive game state:', response.statusText);
        return null;
    }
}