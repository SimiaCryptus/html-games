import ChessPiece from "../components/ChessPiece.tsx";

export interface Move {
    piece: ChessPiece;
    from: [number, number, number];
    to: [number, number, number];
    capturedPiece?: ChessPiece;
}

class MoveHistory {
    public moves: Move[] = [];
    private readonly className = 'MoveHistory';

    constructor(moves: Move[] = []) {
        console.log(`${this.className} initialized with ${moves.length} moves`);
        this.moves = moves;
    }

    addMove(move: Move): void {
        this.moves.push(move);
        console.info(`${this.className}: Move added - ${this.formatMove(move)}`);
        console.debug(`${this.className}: Current move count: ${this.moves.length}`);
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

    public formatMove(move: Move): string {
        const from = `${String.fromCharCode(97 + move.from[0])}${move.from[2] + 1}`;
        const to = `${String.fromCharCode(97 + move.to[0])}${move.to[2] + 1}`;
        const captureInfo = move.capturedPiece ? ` x ${move.capturedPiece.type}` : '';
        return `${move.piece.color} ${move.piece.type} ${from}-${to}${captureInfo}`;
    }
}

export {MoveHistory};