import ChessPiece from "../components/ChessPiece.tsx";

export interface Move {
    piece: ChessPiece;
    from: [number, number, number];
    to: [number, number, number];
    capturedPiece?: ChessPiece;
}

class MoveHistory {
     private moves: Move[] = [];
    private undoneMoves: Move[] = [];
    private readonly className = 'MoveHistory';

    constructor(moves: Move[] = []) {
        console.log(`${this.className} initialized with ${moves.length} moves`);
         this.moves = [...moves];
    }

    addMove(move: Move): void {
        this.moves.push(move);
        this.undoneMoves = [];
        console.info(`${this.className}: Move added - ${this.formatMove(move)}`);
        console.debug(`${this.className}: Current move count: ${this.moves.length}`);
    }

    getLastMove(): Move | null {
        return this.moves.length > 0 ? this.moves[this.moves.length - 1] : null;
    }

    getMoveHistory(): Move[] {
        console.debug(`${this.className}: Retrieving move history. Total moves: ${this.moves.length}`);
        return [...this.moves];
    }

    clear(): void {
        const previousCount = this.moves.length;
        this.moves = [];
        this.undoneMoves = [];
        console.info(`${this.className}: Move history cleared. Previous move count: ${previousCount}`);
    }

    undoLastMove(): Move | null {
        if (this.moves.length > 0) {
            const undoneMove = this.moves.pop()!;
            this.undoneMoves.push(undoneMove);
            console.info(`${this.className}: Last move undone - ${this.formatMove(undoneMove)}`);
            return undoneMove;
        }
        return null;
    }

    redoMove(): Move | null {
        if (this.undoneMoves.length > 0) {
            const redoneMove = this.undoneMoves.pop()!;
            this.moves.push(redoneMove);
            console.info(`${this.className}: Move redone - ${this.formatMove(redoneMove)}`);
            return redoneMove;
        }
        return null;
    }

    canUndo(): boolean {
        return this.moves.length > 0;
    }

    canRedo(): boolean {
        return this.undoneMoves.length > 0;
    }

    private formatMove(move: Move): string {
        const from = `${String.fromCharCode(97 + move.from[0])}${move.from[1] + 1}`;
        const to = `${String.fromCharCode(97 + move.to[0])}${move.to[1] + 1}`;
        const captureInfo = move.capturedPiece ? ` x ${move.capturedPiece.type}` : '';
        return `${move.piece.color} ${move.piece.type} ${from}-${to}${captureInfo}`;
    }

    clone(): MoveHistory {
        const clonedHistory = new MoveHistory();
        clonedHistory.moves = [...this.moves];
        clonedHistory.undoneMoves = [...this.undoneMoves];
        return clonedHistory;
    }

    getMovesCount(): number {
        return this.moves.length;
    }

    getUndoneMovesCount(): number {
        return this.undoneMoves.length;
    }
}

export {MoveHistory};