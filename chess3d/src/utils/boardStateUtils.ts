import {ChessPiece, Move, MoveHistory} from './moveHistory';

// ... (existing code remains unchanged)
// Custom error class for invalid moves
class InvalidMoveError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidMoveError';
    }
}

function isValidPosition(position: number[]): boolean {
    return position &&
        position[0] >= 0 && position[0] < 8 &&
        position[1] >= 0 && position[1] < 8 &&
        Number.isInteger(position[0]) &&
        Number.isInteger(position[1]);
}

function isValidMove(move: Move): boolean {
    return isValidPosition([move.from[0], move.from[1]]) &&
        isValidPosition([move.to[0], move.to[1]]);
}

export function createBoardStateFromImport(importedState: ChessPiece[]): ChessPiece[] {
    console.log('Creating board state from imported state');

    if (importedState.length < 2) {
        console.error('Invalid imported state: Too few pieces', importedState);
        throw new Error('Invalid imported state: Too few pieces');
    }

    const kings = importedState.filter(piece => piece.type === 'king');
    if (kings.length !== 2) {
        console.error(`Invalid imported state: Incorrect number of kings (${kings.length})`, importedState);
        throw new Error(`Invalid imported state: Incorrect number of kings (${kings.length})`);
    }

    // Validate positions of all pieces
    for (const piece of importedState) {
        if (!isValidPosition(piece.position)) {
            console.error(`Invalid position for piece:`, piece);
            throw new Error(`Invalid position for ${piece.color} ${piece.type} at [${piece.position}]`);
        }
    }

    console.log(`New board state created with ${importedState.length} pieces`);
    return importedState;
}

export function applyMoveToBoard(boardState: ChessPiece[], move: Move): ChessPiece[] {
    const newBoardState = [...boardState];

    // Find and update the moving piece
    const movingPieceIndex = newBoardState.findIndex(
        piece => piece.position[0] === move.from[0] && piece.position[1] === move.from[1] && piece.type === move.piece.type
    );

    if (movingPieceIndex === -1) {
        throw new Error(`No piece found at position [${move.from}]`);
    }

    newBoardState[movingPieceIndex] = {...newBoardState[movingPieceIndex], position: move.to};

    // Remove captured piece if any
    if (move.capturedPiece) {
        const capturedPieceIndex = newBoardState.findIndex(
            piece => piece.position[0] === move.to[0] && piece.position[1] === move.to[1] && piece.type === move.capturedPiece.type
        );

        if (capturedPieceIndex !== -1) {
            newBoardState.splice(capturedPieceIndex, 1);
        }
    }

    return newBoardState;
}

export function calculateNewBoardState(moveHistory: MoveHistory): ChessPiece[] {
    // Initialize the board to the initial state from move history
    let boardState = moveHistory.getInitialState();

    console.log(`Calculating new board state from ${moveHistory.moves.length} moves`);

    // Apply each move in the history to the board state
    for (let i = 0; i < moveHistory.moves.length; i++) {
        const move = moveHistory.moves[i];

        if (!isValidMove(move)) {
            console.error(`Invalid move detected at index ${i}:`, move);
            throw new InvalidMoveError(`Invalid move at index ${i}`);
        }

        boardState = applyMoveToBoard(boardState, move);
    }

    if (boardState.length < 2) {
        console.error('Invalid board state: Too few pieces remaining', boardState);
        throw new Error('Invalid board state: Too few pieces remaining');
    }

    const kings = boardState.filter(piece => piece.type === 'king');
    if (kings.length !== 2) {
        console.error(`Invalid board state: Incorrect number of kings (${kings.length})`, boardState);
        throw new Error(`Invalid board state: Incorrect number of kings (${kings.length})`);
    }

    console.log(`New board state calculated with ${boardState.length} pieces`);
    return boardState;
}

// ... (rest of the file remains unchanged)
// ... rest of the file remains unchanged
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