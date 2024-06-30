import React, {useState} from 'react';
import {convertFromAscii, convertToAscii} from '../utils/asciiConverter.ts';
import {MoveHistory} from '../utils/moveHistory.ts';
import {ErrorMessage} from './ErrorMessage.tsx';


interface UtilityMenuProps {
    resetGame: () => void;
    getBoardState: () => any[];
    setBoardState: (state: any[]) => void;
    undoMove: () => void;
    moveHistory: MoveHistory;
    onClose: () => void;
}

const UtilityMenu: React.FC<UtilityMenuProps> = ({
                                                     resetGame,
                                                     getBoardState,
                                                     setBoardState,
                                                     undoMove,
                                                     moveHistory,
                                                     onClose,
                                                 }) => {
    const [, forceUpdate] = useState({});

    // ... (existing code)
    const [asciiArt, setAsciiArt] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const handleExport = () => {
        console.log('Exporting board state...');
        try {
            const boardState = getBoardState();
            const ascii = convertToAscii(boardState);
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
            console.log('Board state updated');
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
        console.log('Game reset complete');
        onClose();
    };

    const handleUndo = () => {
        console.log('Undoing last move...');
        undoMove();
        forceUpdate({});
        console.log('Move undone');
    };

    const currentMoves = moveHistory.getMoveHistory();

    return (
        // ... (existing JSX)
        <div className="utility-menu modal-content">
            <h2>Utility Menu</h2>
            <button onClick={handleReset}>Reset Game</button>
            <button onClick={handleExport}>Export Board</button>
            <button onClick={handleImport}>Import Board</button>
            <button onClick={handleUndo}>Undo Move</button>
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
                    {currentMoves.length > 0 ? (
                        currentMoves.map((move, index) => (
                            <li key={index}>
                                {index + 1}. {moveHistory.formatMove(move)}
                            </li>
                        ))
                    ) : (
                        <li>No moves yet</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default UtilityMenu;