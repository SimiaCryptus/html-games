import {Move} from './gameLogic';
import {PieceMovement} from "./pieceMovement";
import {PawnMovement} from "./pawnMovement";
import {RookMovement} from "./rookMovement";
import {KnightMovement} from "./knightMovement";
import {BishopMovement} from "./bishopMovement";
import {QueenMovement} from "./queenMovement";
import {KingMovement} from "./kingMovement";

export function pieceAt(row: number, col: number, board: string[][]): boolean {
    return board[row][col] !== '';
}

export function getPieceColor(row: number, col: number, board: string[][]): string | null {
    const piece = board[row][col];
    if (!piece) return null;
    return piece === piece.toUpperCase() ? 'white' : 'black';
}

export function getPossibleMoves(piece: string, row: number, col: number, board: string[][]): Move[] {
    const pieceType = piece ? piece.toLowerCase() : null;
    if (!pieceType) return [];

    const pieceColor = piece === piece.toUpperCase() ? 'white' : 'black';
    let movement: PieceMovement;
    switch (pieceType) {
        case 'p':
            movement = new PawnMovement(pieceColor);
            break;
        case 'r':
            movement = new RookMovement(pieceColor);
            break;
        case 'n':
            movement = new KnightMovement(pieceColor);
            break;
        case 'b':
            movement = new BishopMovement(pieceColor);
            break;
        case 'q':
            movement = new QueenMovement(pieceColor);
            break;
        case 'k':
            movement = new KingMovement(pieceColor);
            break;
        default:
            return [];
    }

    return movement.getPossibleMoves(row, col, board);
}

export function isCheck(board: string[][], currentTurn: string): boolean {
    // Implement check logic
    const kingPosition = findKing(board, currentTurn);
    const opponentMoves = getAllOpponentMoves(board, currentTurn);
    return opponentMoves.some(move => move.row === kingPosition.row && move.col === kingPosition.col);
}

export function isCheckmate(board: string[][], currentTurn: string): boolean {
    // Implement checkmate logic
    if (!isCheck(board, currentTurn)) return false;
    const allMoves = getAllPossibleMoves(board, currentTurn);
    return allMoves.length === 0;
}

function findKing(board: string[][], currentTurn: string): { row: number, col: number } {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (board[row][col].toLowerCase() === 'k' && getPieceColor(row, col, board) === currentTurn) {
                return {row, col};
            }
        }
    }
    throw new Error('King not found');
}

function getAllOpponentMoves(board: string[][], currentTurn: string): Move[] {
    const opponentColor = currentTurn === 'white' ? 'black' : 'white';
    const opponentMoves: Move[] = [];
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (getPieceColor(row, col, board) === opponentColor) {
                opponentMoves.push(...getPossibleMoves(board[row][col], row, col, board));
            }
        }
    }
    return opponentMoves;
}

function getAllPossibleMoves(board: string[][], currentTurn: string): Move[] {
    const allMoves: Move[] = [];
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (getPieceColor(row, col, board) === currentTurn) {
                allMoves.push(...getPossibleMoves(board[row][col], row, col, board));
            }
        }
    }
    return allMoves;
}