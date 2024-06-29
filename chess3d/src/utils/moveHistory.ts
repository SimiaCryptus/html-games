interface ChessPiece {
    type: string;
    color: string;
    position: [number, number, number];
}

interface Move {
    piece: ChessPiece;
    from: [number, number, number];
    to: [number, number, number];
    capturedPiece?: ChessPiece;
}

class MoveHistory {
    private moves: Move[] = [];
    private readonly className = 'MoveHistory';

    constructor() {
        console.log(`${this.className} initialized`);
    }

    addMove(move: Move): void {
        this.moves.push(move);
        console.info(`${this.className}: Move added - ${this.formatMove(move)}`);
        console.debug(`${this.className}: Current move count: ${this.moves.length}`);
    }

    undoLastMove(): Move | undefined {
        const move = this.moves.pop();
        if (move) {
            console.info(`${this.className}: Last move undone - ${this.formatMove(move)}`);
            console.debug(`${this.className}: Current move count: ${this.moves.length}`);
        } else {
            console.warn(`${this.className}: Attempted to undo move, but no moves in history`);
        }
        return move;
    }

    getMoveHistory(): Move[] {
        console.debug(`${this.className}: Retrieving move history. Total moves: ${this.moves.length}`);
        return [...this.moves];
    }

    clear(): void {
        const previousCount = this.moves.length;
        this.moves = [];
        console.info(`${this.className}: Move history cleared. Previous move count: ${previousCount}`);
    }

    getLastMove(): Move | undefined {
        const lastMove = this.moves[this.moves.length - 1];
        if (lastMove) {
            console.debug(`${this.className}: Retrieved last move - ${this.formatMove(lastMove)}`);
        } else {
            console.debug(`${this.className}: No last move available`);
        }
        return lastMove;
    }

    getMoveCount(): number {
        console.debug(`${this.className}: Current move count: ${this.moves.length}`);
        return this.moves.length;
    }

    toAscii(): string {
        const ascii = this.moves.map((move, index) => {
            const from = `${String.fromCharCode(97 + move.from[0])}${move.from[2] + 1}`;
            const to = `${String.fromCharCode(97 + move.to[0])}${move.to[2] + 1}`;
            return `${index + 1}. ${move.piece.color} ${move.piece.type} ${from}-${to}${move.capturedPiece ? ' x' : ''}`;
        }).join('\n');
        console.debug(`${this.className}: ASCII representation of move history generated`);
        console.log(`${this.className}: ASCII representation:\n${ascii}`);
        return ascii;
    }

    private formatMove(move: Move): string {
        const from = `${String.fromCharCode(97 + move.from[0])}${move.from[2] + 1}`;
        const to = `${String.fromCharCode(97 + move.to[0])}${move.to[2] + 1}`;
        const captureInfo = move.capturedPiece ? ` x ${move.capturedPiece.type}` : '';
        return `${move.piece.color} ${move.piece.type} ${from}-${to}${captureInfo}`;
    }
}

export {MoveHistory, Move, ChessPiece};