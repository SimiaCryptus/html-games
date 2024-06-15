import {PieceMovement} from "./pieceMovement";
import {Move} from "./gameLogic";
import {getPieceColor, pieceAt} from "./moveLogic";

export class BishopMovement implements PieceMovement {
    pieceColor: string;

    constructor(pieceColor: string) {
        this.pieceColor = pieceColor;
    }

    getPossibleMoves(row: number, col: number, board: string[][]): Move[] {
        const moves: Move[] = [];
        for (let i = 1; row + i < 8 && col + i < 8; i++) {
            if (pieceAt(row + i, col + i, board)) {
                if (getPieceColor(row + i, col + i, board) !== this.pieceColor) moves.push({
                    row: row + i,
                    col: col + i
                });
                break;
            }
            moves.push({row: row + i, col: col + i});
        }
        for (let i = 1; row + i < 8 && col - i >= 0; i++) {
            if (pieceAt(row + i, col - i, board)) {
                if (getPieceColor(row + i, col - i, board) !== this.pieceColor) moves.push({
                    row: row + i,
                    col: col - i
                });
                break;
            }
            moves.push({row: row + i, col: col - i});
        }
        for (let i = 1; row - i >= 0 && col + i < 8; i++) {
            if (pieceAt(row - i, col + i, board)) {
                if (getPieceColor(row - i, col + i, board) !== this.pieceColor) moves.push({
                    row: row - i,
                    col: col + i
                });
                break;
            }
            moves.push({row: row - i, col: col + i});
        }
        for (let i = 1; row - i >= 0 && col - i >= 0; i++) {
            if (pieceAt(row - i, col - i, board)) {
                if (getPieceColor(row - i, col - i, board) !== this.pieceColor) moves.push({
                    row: row - i,
                    col: col - i
                });
                break;
            }
            moves.push({row: row - i, col: col - i});
        }
        return moves;
    }
}