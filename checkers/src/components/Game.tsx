import React, {useState} from 'react';
import Board from './Board';
import {GameState, Square} from '../types';
import './Game.css';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';

const initialBoard: Square[][] = Array(8).fill(null).map((_, row) =>
    Array(8).fill(null).map((_, col) => ({
        row,
        col,
        piece: (row < 3 && (row + col) % 2 === 1) ? {color: 'black', isKing: false} :
            (row > 4 && (row + col) % 2 === 1) ? {color: 'red', isKing: false} : null
    }))
);

const initialState: GameState = {
    board: initialBoard,
    currentPlayer: 'red',
    selectedPiece: null,
    possibleMoves: []
};

const calculateScore = (board: Square[][]) => {
    let redScore = 0;
    let blackScore = 0;
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col].piece;
            if (piece) {
                if (piece.color === 'red') redScore++;
                if (piece.color === 'black') blackScore++;
            }
        }
    }
    return {redScore, blackScore};
};

const Game: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>(initialState);

    const {redScore, blackScore} = calculateScore(gameState.board);

    const handleMovePiece = (fromRow: number, fromCol: number, toRow: number, toCol: number): void => {
        movePiece(fromRow, fromCol, toRow, toCol);
    };

    const movePiece = (fromRow: number, fromCol: number, toRow: number, toCol: number): void => {
        const {board, currentPlayer} = gameState;
        const newBoard = board.map(row => row.map(square => ({...square})));
        const piece = newBoard[fromRow][fromCol].piece;
        newBoard[fromRow][fromCol].piece = null;
        newBoard[toRow][toCol].piece = piece;

        // Handle capture
        if (Math.abs(toRow - fromRow) === 2 && Math.abs(toCol - fromCol) === 2) {
            const capturedRow = (fromRow + toRow) / 2;
            const capturedCol = (fromCol + toCol) / 2;
            newBoard[capturedRow][capturedCol].piece = null;
        }

        // Check for king promotion
        if (piece && ((piece.color === 'red' && toRow === 0) || (piece.color === 'black' && toRow === 7))) {
            piece.isKing = true;
        }

        setGameState({
            ...gameState,
            board: newBoard,
            currentPlayer: currentPlayer === 'red' ? 'black' : 'red',
            selectedPiece: null,
            possibleMoves: []
        });
        // Check for king promotion
        if (piece && ((piece.color === 'red' && toRow === 0) || (piece.color === 'black' && toRow === 7))) {
            piece.isKing = true;
        }

        setGameState({
            ...gameState,
            board: newBoard,
            currentPlayer: currentPlayer === 'red' ? 'black' : 'red',
            selectedPiece: null,
            possibleMoves: []
        });
        const selectedPiece = {row: fromRow, col: fromCol};

        if (selectedPiece) {
            const newBoard = board.map(row => row.map(square => ({...square})));
            const piece = newBoard[selectedPiece.row][selectedPiece.col].piece;
            newBoard[selectedPiece.row][selectedPiece.col].piece = null;
            newBoard[toRow][toCol].piece = piece;

            // Check for king promotion
            if (piece && ((piece.color === 'red' && toRow === 0) || (piece.color === 'black' && toRow === 7))) {
                piece.isKing = true;
            }

            setGameState({
                ...gameState,
                board: newBoard,
                currentPlayer: currentPlayer === 'red' ? 'black' : 'red',
                selectedPiece: null,
                possibleMoves: []
            });
        }
    };

    const calculatePossibleMoves = (row: number, col: number, board: Square[][]): { row: number; col: number }[] => {
        const piece = board[row][col].piece;
        if (!piece) return [];

        const directions = piece.isKing 
            ? [[-1, -1], [-1, 1], [1, -1], [1, 1]]
            : piece.color === 'red'
                ? [[-1, -1], [-1, 1]]
                : [[1, -1], [1, 1]];

        const moves = directions.map(([dRow, dCol]) => ({row: row + dRow, col: col + dCol}))
            .filter(move => move.row >= 0 && move.row < 8 && move.col >= 0 && move.col < 8)
            .filter(move => !board[move.row][move.col].piece);

        // Add capture moves
        const captureMoves = directions.map(([dRow, dCol]) => ({
            row: row + 2 * dRow,
            col: col + 2 * dCol,
            capturedRow: row + dRow,
            capturedCol: col + dCol
        }))
        .filter(move => move.row >= 0 && move.row < 8 && move.col >= 0 && move.col < 8)
        .filter(move => {
            const capturedPiece = board[move.capturedRow][move.capturedCol].piece;
            return capturedPiece && capturedPiece.color !== piece.color && !board[move.row][move.col].piece;
        })
        .map(move => ({row: move.row, col: move.col}));

        return [...moves, ...captureMoves];
    };

    const handleSquareClick = (row: number, col: number): void => {
        const {board, currentPlayer, selectedPiece} = gameState;
        const clickedSquare = board[row][col];

        if (selectedPiece) {
            // Prevent moving if the selected piece is not of the current player
            const selectedPieceSquare = board[selectedPiece.row][selectedPiece.col];
            if (selectedPieceSquare.piece?.color !== currentPlayer) return;

            // Move piece if the clicked square is a valid move
            const isMoveValid = gameState.possibleMoves.some(move => move.row === row && move.col === col);
            if (isMoveValid) {
                movePiece(selectedPiece.row, selectedPiece.col, row, col);
                const newBoard = board.map(row => row.map(square => ({...square})));
                const piece = newBoard[selectedPiece.row][selectedPiece.col].piece;
                newBoard[selectedPiece.row][selectedPiece.col].piece = null;
                newBoard[row][col].piece = piece;

                // Check for king promotion
                if (piece && ((piece.color === 'red' && row === 0) || (piece.color === 'black' && row === 7))) {
                    piece.isKing = true;
                }

                setGameState({
                    ...gameState,
                    board: newBoard,
                    currentPlayer: currentPlayer === 'red' ? 'black' : 'red',
                    selectedPiece: null,
                    possibleMoves: []
                });
            } else {
                // Deselect piece if the clicked square is not a valid move
                setGameState({
                    ...gameState,
                    selectedPiece: null,
                    possibleMoves: []
                });
            }
        } else if (clickedSquare.piece && clickedSquare.piece.color === currentPlayer) {
            // Select piece if the clicked square contains a piece of the current player
            const possibleMoves = calculatePossibleMoves(row, col, board);
            setGameState({
                ...gameState,
                selectedPiece: {row, col},
                possibleMoves
            });
        }
    };

    const handleDropPiece = (fromRow: number, fromCol: number, toRow: number, toCol: number): void => {
        const {board, currentPlayer} = gameState;
        const selectedPiece = {row: fromRow, col: fromCol};

        // Prevent moving if the selected piece is not of the current player
        const selectedPieceSquare = board[selectedPiece.row][selectedPiece.col];
        if (selectedPieceSquare.piece?.color !== currentPlayer) return;

        // Prevent moving if the selected piece is not of the current player
        if (selectedPieceSquare.piece?.color !== currentPlayer) return;

        if (selectedPiece) {
            // Move piece if the clicked square is a valid move
            const isMoveValid = gameState.possibleMoves.some(move => move.row === toRow && move.col === toCol);
            if (isMoveValid) {
                movePiece(fromRow, fromCol, toRow, toCol);
                const selectedPiece = {row: fromRow, col: fromCol};

                // Prevent moving if the selected piece is not of the current player
                const selectedPieceSquare = board[selectedPiece.row][selectedPiece.col];
                if (selectedPieceSquare.piece?.color !== currentPlayer) return;

                if (selectedPiece) {
                    const newBoard = board.map(row => row.map(square => ({...square})));
                    const piece = newBoard[selectedPiece.row][selectedPiece.col].piece;
                    if (isMoveValid) {
                        const newBoard = board.map(row => row.map(square => ({...square})));
                        const piece = newBoard[selectedPiece.row][selectedPiece.col].piece;
                        newBoard[selectedPiece.row][selectedPiece.col].piece = null;
                        newBoard[toRow][toCol].piece = piece;

                        // Check for king promotion
                        if (piece && ((piece.color === 'red' && toRow === 0) || (piece.color === 'black' && toRow === 7))) {
                            piece.isKing = true;
                        }

                        setGameState({
                            ...gameState,
                            board: newBoard,
                            currentPlayer: currentPlayer === 'red' ? 'black' : 'red',
                            selectedPiece: null,
                            possibleMoves: []
                        });
                    }
                }
            }
        }

    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="game">
                <div className="scoreboard">
                    <div className="score">
                        <div>Red</div>
                        <div>{redScore}</div>
                    </div>
                    <div>Current Turn: {gameState.currentPlayer}</div>
                    <div className="score">
                        <div>Black</div>
                        <div>{blackScore}</div>
                    </div>
                </div>
                <Board board={gameState.board} onSquareClick={handleSquareClick} onDropPiece={handleDropPiece}
                       onMovePiece={handleMovePiece} animateMove selectedPiece={gameState.selectedPiece}
                       possibleMoves={gameState.possibleMoves}/>
            </div>
        </DndProvider>
    );
}
export default Game;