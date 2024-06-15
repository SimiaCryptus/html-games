// gameLogic.ts

import {isCheck, isCheckmate} from './moveLogic';

export interface Move {
    row: number;
    col: number;
}

export interface GameState {
    board: string[][];
    currentTurn: string;
    moveLog: string[];
    status: string;
    gameOver: boolean;
    gameId: string | null;
    playerColor: string;
    lastMoveTime: string | null;
}

export class ChessGame {
    board: string[][] = [];
    currentTurn: string = '';
    gameOver: boolean = false;
    status: string = '';
    moveLog: string[] = [];
    gameId: string | null = null;
    playerColor: string = '';
    opponentMoveCallback: (() => void) | null = null;
    isOnlineGame: boolean = false;
    opponentMoveInterval: NodeJS.Timeout | null = null;
    lastMoveTime: string | null = null;

    constructor(state?: GameState) {
        if (state) {
            this.setGameState(state);
        } else {
            this.board = this.initializeBoard();
            this.currentTurn = 'white';
            this.gameOver = false;
            this.status = "White's turn";
            this.moveLog = [];
            this.gameId = null;
            this.playerColor = 'white';
            this.opponentMoveCallback = null;
            this.isOnlineGame = false;
            this.opponentMoveInterval = null;
            this.lastMoveTime = null;
        }
    }

    setGameId(gameId: string) {
        this.gameId = gameId;
    }

    setPlayerColor(color: string) {
        this.playerColor = color;
    }

    setOpponentMoveCallback(callback: () => void) {
        this.opponentMoveCallback = callback;
    }

    getGameState(): GameState {
        return {
            board: this.board,
            currentTurn: this.currentTurn,
            moveLog: this.moveLog,
            status: this.status,
            gameOver: this.gameOver,
            gameId: this.gameId,
            playerColor: this.playerColor,
            lastMoveTime: this.lastMoveTime
        };
    }

    setGameState(state: GameState) {
        this.board = state.board;
        this.currentTurn = state.currentTurn;
        this.moveLog = state.moveLog;
        this.status = state.status;
        this.gameOver = state.gameOver;
        this.status = `${this.currentTurn === 'white' ? 'White' : 'Black'}'s turn`;
        this.moveLog = state.moveLog;
        this.gameId = state.gameId;
        this.playerColor = state.playerColor;
        this.lastMoveTime = state.lastMoveTime;
        if (this.opponentMoveCallback) {
            this.opponentMoveCallback();
        }
    }

    initializeBoard(): string[][] {
        const board = new Array(8).fill(null).map(() => new Array(8).fill(''));

        for (let i = 0; i < 8; i++) {
            board[1][i] = 'P';
            board[6][i] = 'p';
        }

        const lineup = ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'].map(piece => piece.toUpperCase());
        lineup.forEach((piece, index) => {
            board[7][index] = piece.toLowerCase();
            board[0][index] = piece;
        });

        return board;
    }

    movePiece(start: string, end: string, possibleMoves: Move[]): boolean {
        const [startRow, startCol] = this.parsePosition(start);
        const [endRow, endCol] = this.parsePosition(end);

        if (!this.isValidMove(startRow, startCol, endRow, endCol, possibleMoves)) {
            this.status = 'Invalid move';
            return false;
        }

        const capturedPiece = this.board[endRow][endCol];
        const movingPiece = this.board[startRow][startCol];
        this.board[endRow][endCol] = this.board[startRow][startCol];
        this.board[startRow][startCol] = '';

        this.logMove(start, end, capturedPiece ? capturedPiece : '');

        this.currentTurn = this.currentTurn === 'white' ? 'black' : 'white';

        if (this.isCheck()) {
            if (this.isCheckmate()) {
                this.status = `${this.currentTurn} is in checkmate`;
                this.gameOver = true;
            } else {
                this.status = `${this.currentTurn} is in check`;
            }
        } else {
            this.status = `${this.currentTurn === 'white' ? 'White' : 'Black'}'s turn`;
        }
        console.table(this.board.map(row => row.map(piece => piece ? piece : '  ')));

        this.lastMoveTime = new Date().toISOString();

        if (this.isOnlineGame && this.gameId) {
            sendGameState(this.getGameState());
        }

        return true;
    }

    logMove(start: string, end: string, capturedPiece: string) {
        const piece = this.board[this.parsePosition(end)[0]][this.parsePosition(end)[1]];
        let move = `${piece}${start}${capturedPiece ? 'x' : ''}${end}`;
        if (capturedPiece) {
            move += ` (captured ${capturedPiece})`;
        }
        this.moveLog.push(move);
    }

    isValidMove(startRow: number, startCol: number, endRow: number, endCol: number, possibleMoves: Move[]): boolean {
        if (startRow < 0 || startRow >= 8 || startCol < 0 || startCol >= 8 ||
            endRow < 0 || endRow >= 8 || endCol < 0 || endCol >= 8) {
            console.log("Invalid move: " + [startRow, startCol, endRow, endCol])
            return false;
        }
        const piece = this.board[startRow][startCol];
        if (!piece) {
            console.log("Invalid move: No piece at the start position")
            return false;
        }
        const targetPiece = this.board[endRow][endCol];
        if (targetPiece && ((this.currentTurn === 'white' && targetPiece === targetPiece.toUpperCase()) || (this.currentTurn === 'black' && targetPiece === targetPiece.toLowerCase()))) {
            return false;
        }
        if ((this.currentTurn === 'white' && piece !== piece.toUpperCase()) || (this.currentTurn === 'black' && piece !== piece.toLowerCase())) {
            console.log("Invalid move: Not the player's piece")
            return false;
        }
        let b = possibleMoves.some(move => move.row === endRow && move.col === endCol);
        if (!b) console.log("Invalid move: " + [startRow, startCol] + ' -> ' + [endRow, endCol] + " not in possible moves: ", possibleMoves)
        return b;
    }

    isCheck(): boolean {
        return isCheck(this.board, this.currentTurn);
    }

    isCheckmate(): boolean {
        return isCheckmate(this.board, this.currentTurn);
    }

    parsePosition(position: string): [number, number] {
        const row = 8 - parseInt(position[1]);
        const col = position.charCodeAt(0) - 'a'.charCodeAt(0);
        return [row, col];
    }

    startPollingForOpponentMove() {
        if (this.opponentMoveInterval) {
            clearInterval(this.opponentMoveInterval);
        }
        this.opponentMoveInterval = setInterval(async () => {
            const gameState = await receiveGameState(this.gameId!);
            if (gameState && gameState.currentTurn !== this.currentTurn && gameState.lastMoveTime !== this.lastMoveTime) {
                this.setGameState(gameState);
                if (this.opponentMoveCallback) {
                    this.opponentMoveCallback();
                }
            }
        }, 3000);
    }

    stopPollingForOpponentMove() {
        if (this.opponentMoveInterval) {
            clearInterval(this.opponentMoveInterval);
            this.opponentMoveInterval = null;
        }
    }
}

// Function to send the game state to the server
async function sendGameState(gameState: GameState) {
    const response = await fetch(`https://httprelay.io/${gameState.gameId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(gameState)
    });
    if (!response.ok) {
        console.error('Failed to send game state:', response.statusText);
    }
}

// Function to receive the game state from the server
async function receiveGameState(gameId: string): Promise<GameState | null> {
    const response = await fetch(`https://httprelay.io/${gameId}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    });
    if (response.ok) {
        const gameState = await response.json();
        return gameState;
    } else {
        console.error('Failed to receive game state:', response.statusText);
        return null;
    }
}