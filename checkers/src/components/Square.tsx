import React from 'react';
import './Square.css';
import Piece from './Piece';
import {Piece as PieceType} from '../types';

interface SquareProps {
    row: number,
    col: number,
    piece: PieceType | null,
    onClick: () => void,
    onMovePiece: (fromRow: number, fromCol: number, toRow: number, toCol: number) => void,
    onDropPiece: (fromRow: number, fromCol: number, toRow: number, toCol: number) => void,
    animateMove?: boolean,
    isSelected: boolean | null,
    isPossibleMove: boolean
}

const Square: React.FC<SquareProps> = ({
                                           row,
                                           col,
                                           piece,
                                           onClick,
                                           onMovePiece,
                                           onDropPiece,
                                           animateMove,
                                           isSelected,
                                           isPossibleMove
                                       }) => {
    const isDark = (row + col) % 2 === 1;
    const className = `square ${isDark ? 'dark' : 'light'} ${isSelected ? 'selected' : ''} ${isPossibleMove ? 'possible-move' : ''}`;

    return (
        <div className={className} onClick={onClick}>
            {piece &&
                <Piece isKing={piece.isKing} isRed={piece.color === 'red'} row={row} col={col} onMovePiece={onMovePiece}
                       isSelected={!!isSelected}
                       onDropPiece={onDropPiece}/>}
        </div>
    );
};

export default Square;