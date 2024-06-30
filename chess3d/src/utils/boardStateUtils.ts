import {ChessPiece, Move, MoveHistory} from './moveHistory';

// Custom error class for invalid moves
class InvalidMoveError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidMoveError';
    }
}

function isValidPosition(position: number[]): boolean {
    return position.length === 3 &&
        position[0] >= 0 && position[0] < 8 &&
        position[1] >= 0 && position[1] < 8;
}

function isValidMove(move: Move): boolean {
    return isValidPosition([move.from[0], move.from[1]]) &&
        isValidPosition([move.to[0], move.to[1]]);
}

export function applyMoveToBoard(boardState: ChessPiece[], move: Move): ChessPiece[] {
    // Update the piece position
    const pieceIndex = boardState.findIndex(
        piece => piece.position[0] === move.from[0] && piece.position[1] === move.from[1]
    );
    if (pieceIndex === -1) {
        throw new InvalidMoveError(`No piece found at position ${move.from}`);
    }

    let movingPiece = boardState[pieceIndex];
    movingPiece.position = [move.to[0], move.to[1]];
    console.log(`Moved piece from ${move.from} to ${move.to}`);

    // Remove captured piece if any
    if (move.capturedPiece) {
        const capturedPieceIndex = boardState.findIndex(
            piece => piece.position[0] === move.to[0] && piece.position[1] === move.to[1]
        );
        if (capturedPieceIndex === -1) {
            throw new InvalidMoveError(`No piece found at capture position ${move.to}`);
        }
        boardState.splice(capturedPieceIndex, 1);
        console.log(`Captured piece removed at ${move.to}`);
    }

    return boardState;
}

export function calculateNewBoardState(moveHistory: MoveHistory): ChessPiece[] {
    // Initialize the board to its starting position
    let boardState = getInitialBoardState();

    console.log('Calculating new board state from move history:', moveHistory.moves);

    // Apply each move in the history to the board state
    for (let i = 0; i < moveHistory.moves.length; i++) {
        const move = moveHistory.moves[i];

        if (!isValidMove(move)) {
            throw new InvalidMoveError(`Invalid move at index ${i}: ${JSON.stringify(move)}`);
        }

        // Update the piece position
        const pieceIndex = boardState.findIndex(
            piece => piece.position[0] === move.from[0] && piece.position[1] === move.from[1]
        );
        if (pieceIndex === -1) {
            throw new InvalidMoveError(`No piece found at position ${move.from} for move at index ${i}`);
        }

        let movingPiece = boardState[pieceIndex];
        movingPiece.position = [move.to[0], move.to[1]];
        console.log(`Moved piece from ${move.from} to ${move.to}`);

        // Remove captured piece if any
        if (move.capturedPiece) {
            const capturedPieceIndex = boardState.findIndex(
                piece => piece.position[0] === move.to[0] && piece.position[1] === move.to[1]
            );
            if (capturedPieceIndex === -1) {
                throw new InvalidMoveError(`No piece found at capture position ${move.to} for move at index ${i}`);
            }
            boardState.splice(capturedPieceIndex, 1);
            console.log(`Captured piece removed at ${move.to}`);
        }
    }

    if (boardState.length < 2) {
        throw new Error('Invalid board state: Too few pieces remaining');
    }

    const kings = boardState.filter(piece => piece.type === 'king');
    if (kings.length !== 2) {
        throw new Error(`Invalid board state: Incorrect number of kings (${kings.length})`);
    }

    console.log('New board state calculated:', boardState);
    return boardState;
}

export function getInitialBoardState(): ChessPiece[] {
    // Return the complete initial setup of the chess board
    return [
        {type: 'rook', position: [0, 0], color: 'white'},
        {type: 'knight', position: [1, 0], color: 'white'},
        {type: 'bishop', position: [2, 0], color: 'white'},
        {type: 'queen', position: [3, 0], color: 'white'},
        {type: 'king', position: [4, 0], color: 'white'},
        {type: 'bishop', position: [5, 0], color: 'white'},
        {type: 'knight', position: [6, 0], color: 'white'},
        {type: 'rook', position: [7, 0], color: 'white'},
        ...Array(8).fill(null).map((_, i) => ({type: 'pawn', position: [i, 1], color: 'white'})),
        ...Array(8).fill(null).map((_, i) => ({type: 'pawn', position: [i, 6], color: 'black'})),
        {type: 'rook', position: [0, 7], color: 'black'},
        {type: 'knight', position: [1, 7], color: 'black'},
        {type: 'bishop', position: [2, 7], color: 'black'},
        {type: 'queen', position: [3, 7], color: 'black'},
        {type: 'king', position: [4, 7], color: 'black'},
        {type: 'bishop', position: [5, 7], color: 'black'},
        {type: 'knight', position: [6, 7], color: 'black'},
        {type: 'rook', position: [7, 7], color: 'black'},
    ];
}