import React, {useState} from 'react';
import {convertFromAscii} from '../utils/asciiConverter.ts';
import {MoveHistory} from '../utils/moveHistory.ts';
import {ErrorMessage} from './ErrorMessage.tsx';

interface UtilityMenuProps {
    resetGame: () => void;
    getBoardState: () => any[];
    setBoardState: (state: any[]) => void;
    undoMove: () => void;
    redoMove: () => void;
    moveHistory: MoveHistory;
    setMoveHistory: (history: MoveHistory) => void;
    setCurrentTurn: (turn: 'white' | 'black') => void;
    setCapturedPieces: (pieces: any[]) => void;
    onClose: () => void;
    chessGameRef: React.MutableRefObject<any>;
}

const UtilityMenu: React.FC<UtilityMenuProps> = ({
                                                     resetGame,
                                                     getBoardState,
                                                     setBoardState,
                                                     undoMove,
                                                     redoMove,
                                                     moveHistory,
                                                     setMoveHistory,
                                                     setCurrentTurn,
                                                     setCapturedPieces,
                                                     onClose,
                                                     chessGameRef
                                                 }) => {
    // ... (other code remains unchanged)
    const [, setUpdateTrigger] = useState({});
    const [asciiArt, setAsciiArt] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const handleExport = () => {
        console.log('Exporting board state...');
        try {
            const ascii = chessGameRef.current.getAsciiRepresentation();
            console.log('Board state converted to ASCII');
            console.debug('ASCII representation:', ascii);
            setAsciiArt(ascii);
            console.log('Board state exported successfully');
            setError(null);
        } catch (error) {
            console.error('Error exporting board state:', error);
            setError('Failed to export board state. Please try again.');
        }
    };

    const handleImport = () => {
        console.log('Importing board state...');
        try {
            const boardState = convertFromAscii(asciiArt);
            console.log('ASCII successfully converted to board state');
            console.debug('Converted board state:', boardState);
            setBoardState(boardState);

            // Create new move history with the imported state as initial state
            const newMoveHistory = new MoveHistory();
            newMoveHistory.resetWithNewState(boardState);
            setMoveHistory(newMoveHistory);

            const currentPlayerRegex = /Current turn: (white|black)/;
            const currentPlayer = asciiArt.match(currentPlayerRegex)![1] as 'white' | 'black';
            setCurrentTurn(currentPlayer);

            // Clear captured pieces
            setCapturedPieces([]);

            console.log('Board state updated, move history reset, and game state initialized');

            setError(null);
            onClose();
        } catch (error) {
            console.error('Error importing board state:', error);
            setError('Invalid ASCII art format. Please check your input.');
        }
    };

    const handleReset = () => {
        console.log('Resetting game...');
        resetGame();
        // Reset move history
        const newMoveHistory = new MoveHistory();
        setMoveHistory(newMoveHistory);
        console.log('Game reset complete and move history cleared');
        onClose();
    };

    const handleUndo = () => {
        console.log('Undoing last move...');
        try {
            undoMove();
            // const updatedBoardState = getBoardState();
            // chessGameRef.current?.setBoardState(updatedBoardState);
            // console.log('Move undone');
            setError(null);
        } catch (error) {
            console.error('Error undoing move:', error);
            setError('Failed to undo move. No more moves to undo.');
        }
    };

    const handleRedo = () => {
        console.log('Redoing last undone move...');
        try {
            redoMove();
            // const updatedBoardState = getBoardState();
            // chessGameRef.current.setBoardState(updatedBoardState);
            // console.log('Move redone');
            setError(null);
        } catch (error) {
            console.error('Error redoing move:', error);
            setError('Failed to redo move. No more moves to redo.');
        }
    };

    const currentMoves = moveHistory.getMoveHistory();

    return (
        <div className="utility-menu modal-content">
            <h2>Utility Menu</h2>
            <button onClick={handleReset}>Reset Game</button>
            <button onClick={handleExport}>Export Board</button>
            <button onClick={handleImport}>Import Board</button>
            <button onClick={handleUndo}>Undo Move</button>
            <button onClick={handleRedo}>Redo Move</button>
            <textarea
                value={asciiArt}
                onChange={(e) => {
                    console.log('ASCII art input changed');
                    setAsciiArt(e.target.value);
                    setError(null);
                }}
                placeholder="Paste ASCII art here to import board state"
                rows={10}
                cols={50}
            />
            {error && <ErrorMessage message={error}/>}
            <div className="move-log">
                <h3>Move Log</h3>
                <ul>
                    {currentMoves.length > 0
                        ? currentMoves.map((move, index) => (
                            <li key={index}>{index + 1}. {move.piece.color} {move.piece.type} {move.from.join(',')} to {move.to.join(',')}</li>
                        ))
                        : <li>No moves yet</li>
                    }
                </ul>
            </div>
        </div>
    );
};

export default UtilityMenu;