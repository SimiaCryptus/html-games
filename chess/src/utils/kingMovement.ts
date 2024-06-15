import {PieceMovement} from "./pieceMovement";
import {Move} from "./gameLogic";
import {getPieceColor, pieceAt} from "./moveLogic";

export class KingMovement implements PieceMovement {
    pieceColor: string;

    constructor(pieceColor: string) {
        this.pieceColor = pieceColor;
    }

    getPossibleMoves(row: number, col: number, board: string[][]): Move[] {
        const moves: Move[] = [];
        const kingMoves = [
            {row: row + 1, col: col},
            {row: row - 1, col: col},
            {row: row, col: col + 1},
            {row: row, col: col - 1},
            {row: row + 1, col: col + 1},
            {row: row + 1, col: col - 1},
            {row: row - 1, col: col + 1},
            {row: row - 1, col: col - 1}
        ];
        kingMoves.forEach(move => {
            if (move.row >= 0 && move.row < 8 && move.col >= 0 && move.col < 8) {
                if (!pieceAt(move.row, move.col, board) || getPieceColor(move.row, move.col, board) !== this.pieceColor) {
                    moves.push(move);
                }
            }
        });
        return moves;
    }
}