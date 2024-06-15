import {PieceMovement} from "./pieceMovement";
import {Move} from "./gameLogic";
import {getPieceColor, pieceAt} from "./moveLogic";

export class RookMovement implements PieceMovement {
    pieceColor: string;

    constructor(pieceColor: string) {
        this.pieceColor = pieceColor;
    }

    getPossibleMoves(row: number, col: number, board: string[][]): Move[] {
        const moves: Move[] = [];
        for (let i = row + 1; i < 8; i++) {
            if (pieceAt(i, col, board)) {
                if (getPieceColor(i, col, board) !== this.pieceColor) moves.push({row: i, col});
                break;
            }
            moves.push({row: i, col});
        }
        for (let i = row - 1; i >= 0; i--) {
            if (pieceAt(i, col, board)) {
                if (getPieceColor(i, col, board) !== this.pieceColor) moves.push({row: i, col});
                break;
            }
            moves.push({row: i, col});
        }
        for (let i = col + 1; i < 8; i++) {
            if (pieceAt(row, i, board)) {
                if (getPieceColor(row, i, board) !== this.pieceColor) moves.push({row, col: i});
                break;
            }
            moves.push({row, col: i});
        }
        for (let i = col - 1; i >= 0; i--) {
            if (pieceAt(row, i, board)) {
                if (getPieceColor(row, i, board) !== this.pieceColor) moves.push({row, col: i});
                break;
            }
            moves.push({row, col: i});
        }
        return moves;
    }
}