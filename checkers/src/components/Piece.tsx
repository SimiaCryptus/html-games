import React from 'react';
import './Piece.css';
import {useDrag} from 'react-dnd';
import {ItemTypes} from '../constants';

interface PieceProps {
    isKing: boolean;
    isRed: boolean;
    row: number;
    col: number;
    onMovePiece: (fromRow: number, fromCol: number, toRow: number, toCol: number) => void;
    onDropPiece: (fromRow: number, fromCol: number, toRow: number, toCol: number) => void;
    isSelected: boolean; // Add isSelected prop
}

const Piece: React.FC<PieceProps> = ({isKing, isRed, row, col, onMovePiece, onDropPiece, isSelected}) => {
    const className = `piece ${isRed ? 'red' : 'black'} ${isKing ? 'king' : ''} ${isSelected ? 'selected' : ''}`;

    const [{isDragging}, drag] = useDrag({
        type: ItemTypes.PIECE,
        item: {fromRow: row, fromCol: col},
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
        end: (item, monitor) => {
            const delta = monitor.getDifferenceFromInitialOffset();
            if (delta) {
                const toRow = Math.round(row + delta.y / 50);
                const toCol = Math.round(col + delta.x / 50);
                onDropPiece(row, col, toRow, toCol);
            }
        },
    });

    const pieceStyle = {
        opacity: isDragging ? 0.5 : 1,
        transition: 'transform 0.3s',
    };

    return (
        <div className={className} ref={drag} style={pieceStyle}>
            {isKing && <span className="crown">♔</span>}
        </div>
    );
};

export default Piece;