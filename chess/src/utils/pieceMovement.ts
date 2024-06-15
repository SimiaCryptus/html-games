import {Move} from "./gameLogic";

export interface PieceMovement {
    getPossibleMoves(row: number, col: number, board: string[][]): Move[];
}