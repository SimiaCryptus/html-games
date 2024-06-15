import {PieceMovement} from "./pieceMovement";
import {Move} from "./gameLogic";
import {RookMovement} from "./rookMovement";
import {BishopMovement} from "./bishopMovement";

export class QueenMovement implements PieceMovement {
    pieceColor: string;

    constructor(pieceColor: string) {
        this.pieceColor = pieceColor;
    }

    getPossibleMoves(row: number, col: number, board: string[][]): Move[] {
        const rookMoves = new RookMovement(this.pieceColor).getPossibleMoves(row, col, board);
        const bishopMoves = new BishopMovement(this.pieceColor).getPossibleMoves(row, col, board);
        return [...rookMoves, ...bishopMoves];
    }
}