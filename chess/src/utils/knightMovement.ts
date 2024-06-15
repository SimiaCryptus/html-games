import {PieceMovement} from "./pieceMovement";
import {Move} from "./gameLogic";
import {getPieceColor, pieceAt} from "./moveLogic";

export class KnightMovement implements PieceMovement {
    pieceColor: string;

    constructor(pieceColor: string) {
        this.pieceColor = pieceColor;
    }

    getPossibleMoves(row: number, col: number, board: string[][]): Move[] {
        const moves: Move[] = [];
        const knightMoves = [
            {row: row + 2, col: col + 1},
            {row: row + 2, col: col - 1},
            {row: row - 2, col: col + 1},
            {row: row - 2, col: col - 1},
            {row: row + 1, col: col + 2},
            {row: row + 1, col: col - 2},
            {row: row - 1, col: col + 2},
            {row: row - 1, col: col - 2}
        ];
        knightMoves.forEach(move => {
            if (move.row >= 0 && move.row < 8 && move.col >= 0 && move.col < 8) {
                if (!pieceAt(move.row, move.col, board) || getPieceColor(move.row, move.col, board) !== this.pieceColor) {
                    moves.push(move);
                }
            }
        });
        return moves;
    }
}