import {MoveHistory, ChessPiece} from './moveHistory';

export function calculateNewBoardState(moveHistory: MoveHistory): ChessPiece[] {
    // Initialize the board to its starting position
    let boardState = getInitialBoardState();

    console.log('Calculating new board state from move history:', moveHistory.moves);

    // Apply each move in the history to the board state
    for (const move of moveHistory.moves) {
        // Update the piece position
        const pieceIndex = boardState.findIndex(
            piece => piece.position[0] === move.from[0] && piece.position[1] === move.from[2]
        );
        if (pieceIndex !== -1) {
            boardState[pieceIndex].position = [move.to[0], move.to[2], 0];
            console.log(`Moved piece from ${move.from} to ${move.to}`);
        }

        // Remove captured piece if any
        if (move.capturedPiece) {
            boardState = boardState.filter(
                piece => !(piece.position[0] === move.from[0] && piece.position[1] === move.from[2])
            );
            console.log(`Captured piece removed at ${move.to}`);
        }
    }

    console.log('New board state calculated:', boardState);
    return boardState;
}

export function getInitialBoardState(): ChessPiece[] {
    // Return the complete initial setup of the chess board
    return [
        {type: 'rook', position: [0, 0, 0], color: 'white'},
        {type: 'knight', position: [1, 0, 0], color: 'white'},
        {type: 'bishop', position: [2, 0, 0], color: 'white'},
        {type: 'queen', position: [3, 0, 0], color: 'white'},
        {type: 'king', position: [4, 0, 0], color: 'white'},
        {type: 'bishop', position: [5, 0, 0], color: 'white'},
        {type: 'knight', position: [6, 0, 0], color: 'white'},
        {type: 'rook', position: [7, 0, 0], color: 'white'},
        ...Array(8).fill(null).map((_, i) => ({type: 'pawn', position: [i, 1, 0], color: 'white'})),
        ...Array(8).fill(null).map((_, i) => ({type: 'pawn', position: [i, 6, 0], color: 'black'})),
        {type: 'rook', position: [0, 7, 0], color: 'black'},
        {type: 'knight', position: [1, 7, 0], color: 'black'},
        {type: 'bishop', position: [2, 7, 0], color: 'black'},
        {type: 'queen', position: [3, 7, 0], color: 'black'},
        {type: 'king', position: [4, 7, 0], color: 'black'},
        {type: 'bishop', position: [5, 7, 0], color: 'black'},
        {type: 'knight', position: [6, 7, 0], color: 'black'},
        {type: 'rook', position: [7, 7, 0], color: 'black'},
    ];
}