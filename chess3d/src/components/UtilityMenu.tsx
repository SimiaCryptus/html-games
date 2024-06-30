import React, {useState} from 'react';
import {convertFromAscii, convertToAscii} from '../utils/asciiConverter.ts';
import {MoveHistory} from '../utils/moveHistory.ts';

interface UtilityMenuProps {
    resetGame: () => void;
    getBoardState: () => string[][];
    setBoardState: (state: string[][]) => void;
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

    const [asciiArt, setAsciiArt] = useState<string>('');

    const handleExport = () => {
        console.log('Exporting board state...');
        const boardState = getBoardState();
        console.debug('Current board state:', boardState);
        const ascii = convertToAscii(boardState);
        console.log('Board state converted to ASCII');
        console.debug('ASCII representation:', ascii);
        setAsciiArt(ascii);
        console.log('ASCII art set in state');
    };

    const handleImport = () => {
        console.log('Importing board state...');
        try {
            console.debug('Attempting to convert ASCII to board state:', asciiArt);
            const boardState = convertFromAscii(asciiArt);
            console.log('ASCII successfully converted to board state');
            console.debug('Converted board state:', boardState);
            setBoardState(boardState);
            console.log('Board state updated');
            onClose();
            console.log('Utility menu closed');
        } catch (error) {
            console.error('Error importing board state:', error);
            alert('Invalid ASCII art format. Please check your input.');
        }
    };

    const handleReset = () => {
        console.log('Resetting game...');
        resetGame();
        console.log('Game reset complete');
        onClose();
        console.log('Utility menu closed');
    };

    const handleUndo = () => {
        console.log('Undoing last move...');
        undoMove();
        console.log('Move undone');
        onClose();
        console.log('Utility menu closed');
    };

    console.log('Rendering UtilityMenu component');
    return (
        <div className="utility-menu modal-content">
             {/* ... (existing JSX) */}
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
                }}
                placeholder="Paste ASCII art here to import board state"
                rows={10}
                cols={50}
            />
            <div className="move-log">
                <h3>Move Log</h3>
                <ul>
                    {moveHistory.getMoveCount() > 0 ? (
                        moveHistory.getMoveHistory().map((move, index) => (
                            <li key={index}>{moveHistory.formatMove(move)}</li>
                        ))
                    ) : (
                        <li>No moves yet</li>
                    )}
                </ul>
            </div>
             {/* ... (rest of the JSX) */}
            <button className="close-button" onClick={() => {
                console.log('Closing utility menu');
                onClose();
            }}>Close
            </button>
        </div>
    );
};

console.log('UtilityMenu component defined');
export default UtilityMenu;