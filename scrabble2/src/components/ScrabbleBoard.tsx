import React from 'react';
import Tile from './Tile.tsx';
import {Grid} from '@mui/material';
import './ScrabbleBoard.css';

interface ScrabbleBoardProps {
    board: (Tile | null)[][];
    specialTiles?: { [key: string]: string };
    tempBoard: (Tile | null)[][];
    onBoardClick: (x: number, y: number) => void;
    onTileSelect: (x: number, y: number) => void;
    selectedTile: { x: number, y: number } | null;
    onTileMove: (fromX: number, fromY: number, toX: number, toY: number) => void;
    selectedTempTile: { x: number, y: number } | null;
    currentPlayer: number;
}

const ScrabbleBoard: React.FC<ScrabbleBoardProps> = ({
                                                         board,
                                                         specialTiles = {},
                                                         tempBoard,
                                                         onBoardClick,
                                                         onTileSelect,
                                                         selectedTile,
                                                         onTileMove,
                                                         selectedTempTile,
                                                         currentPlayer
                                                     }) => {

    console.log('Rendering ScrabbleBoard with initial layout:', board);
    console.log('Rendering ScrabbleBoard with temporary layout:', tempBoard);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, x: number, y: number) => {
        e.dataTransfer.setData('text/plain', `${x},${y}`);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, x: number, y: number) => {
        const data = e.dataTransfer.getData('text/plain');
        const [fromX, fromY] = data.split(',').map(Number);
        onTileMove(fromX, fromY, x, y);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleTileClick = (x: number, y: number) => {
        if (tempBoard[y][x]) {
            onTileSelect(x, y);
        } else {
            onBoardClick(x, y);
        }
    };

    return (
        <Grid container spacing={0.25} className="scrabble-board">
            {board.map((row, rowIndex) => (
                <Grid container item key={rowIndex} spacing={0.25}>
                    {row.map((tile, colIndex) => (
                        <Grid item key={colIndex} onClick={() => handleTileClick(colIndex, rowIndex)}>
                            <div
                                style={{position: 'relative'}}
                                draggable={!!tempBoard[rowIndex][colIndex]}
                                onDragStart={(e) => handleDragStart(e, colIndex, rowIndex)}
                                onDrop={(e) => handleDrop(e, colIndex, rowIndex)}
                                onDragOver={handleDragOver}
                            >
                                <Tile
                                    letter={tempBoard[rowIndex][colIndex]?.letter || tile?.letter || ''}
                                    points={tempBoard[rowIndex][colIndex]?.value || tile?.value || 0}
                                    isTemporary={!!tempBoard[rowIndex][colIndex]}
                                    isSelected={(selectedTile?.x === colIndex && selectedTile?.y === rowIndex) || (selectedTempTile?.x === colIndex && selectedTempTile?.y === rowIndex)}
                                    specialType={specialTiles[`${rowIndex},${colIndex}`]}
                                />
                                {specialTiles && specialTiles[`${rowIndex},${colIndex}`] && !tile && !tempBoard[rowIndex][colIndex] && (
                                    <div style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                        zIndex: 1,
                                        pointerEvents: 'none'
                                    }}>
                                        {specialTiles[`${rowIndex},${colIndex}`]}
                                    </div>
                                )}
                            </div>
                        </Grid>
                    ))}
                </Grid>
            ))}
        </Grid>
    );
};

export default ScrabbleBoard;