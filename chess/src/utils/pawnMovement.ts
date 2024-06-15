import {PieceMovement} from "./pieceMovement";
import {Move} from "./gameLogic";
import {getPieceColor, pieceAt} from "./moveLogic";

export class PawnMovement implements PieceMovement {
    pieceColor: string;

    constructor(pieceColor: string) {
        this.pieceColor = pieceColor;
    }

    getPossibleMoves(row: number, col: number, board: string[][]): Move[] {
        const moves: Move[] = [];
        const direction = this.pieceColor === 'white' ? 1 : -1;
        const startRow = this.pieceColor === 'white' ? 1 : 6;
        if (row === startRow && !pieceAt(row + direction, col, board) && !pieceAt(row + 2 * direction, col, board)) {
            moves.push({row: row + 2 * direction, col}); // Double move from starting position
        }
        if (!pieceAt(row + direction, col, board)) { // Single move forward
            moves.push({row: row + direction, col});
        }
        const leftDiagonal = col - 1;
        if (leftDiagonal >= 0 && pieceAt(row + direction, leftDiagonal, board) && getPieceColor(row + direction, leftDiagonal, board) !== this.pieceColor) {
            moves.push({row: row + direction, col: leftDiagonal}); // Capture move
        }
        const rightDiagonal = col + 1;
        if (rightDiagonal < 8 && pieceAt(row + direction, rightDiagonal, board) && getPieceColor(row + direction, rightDiagonal, board) !== this.pieceColor) {
            moves.push({row: row + direction, col: rightDiagonal}); // Capture move
        }
        return moves;
    }
}