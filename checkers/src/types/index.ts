// Define the type for a single square on the board
export type Square = {
    row: number;
    col: number;
    piece: Piece | null;
};

// Define the type for a piece
export type Piece = {
    color: 'red' | 'black';
    isKing: boolean;
};

// Define the type for the board, which is a 2D array of squares
export type Board = Square[][];

// Define the type for the game state
export interface GameState {
    board: Board;
    currentPlayer: 'red' | 'black';
    selectedPiece: { row: number; col: number } | null;
    possibleMoves: { row: number; col: number }[];
}

// Define the type for the game actions
export type GameAction =
    | { type: 'SELECT_PIECE'; payload: { row: number; col: number } }
    | { type: 'MOVE_PIECE'; payload: { from: { row: number; col: number }; to: { row: number; col: number } } }
    | { type: 'END_TURN' };
