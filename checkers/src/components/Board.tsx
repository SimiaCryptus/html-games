import React from 'react';
import Square from './Square';
import './Board.css';
import {Square as SquareType} from '../types';
import {useDrop} from 'react-dnd';
import {ItemTypes} from '../constants';

interface BoardProps {
    board: SquareType[][];
    onSquareClick: (row: number, col: number) => void;
    onDropPiece: (fromRow: number, fromCol: number, toRow: number, toCol: number) => void;
    onMovePiece: (fromRow: number, fromCol: number, toRow: number, toCol: number) => void;
    animateMove: boolean;
    selectedPiece: { row: number; col: number } | null;
    possibleMoves: { row: number; col: number }[];
}

const Board: React.FC<BoardProps> = ({
                                         board,
                                         onSquareClick,
                                         onDropPiece,
                                         onMovePiece,
                                         animateMove,
                                         selectedPiece,
                                         possibleMoves
                                     }) => {

    const [, drop] = useDrop({
        accept: ItemTypes.PIECE,
        drop: (item: { fromRow: number; fromCol: number }, monitor) => {
            const delta = monitor.getDifferenceFromInitialOffset();
            if (delta) {
                const toRow = Math.round(item.fromRow + delta.y / 50);
                const toCol = Math.round(item.fromCol + delta.x / 50);
                onDropPiece(item.fromRow, item.fromCol, toRow, toCol);
            }
        },
    });

    const renderSquare = (row: number, col: number): JSX.Element => {
        const isSelected = selectedPiece && selectedPiece.row === row && selectedPiece.col === col;
        const isPossibleMove = possibleMoves.some(move => move.row === row && move.col === col);
        return <Square key={`${row}-${col}`} row={row} col={col} piece={board[row][col].piece}
                       onClick={() => onSquareClick(row, col)} onMovePiece={onMovePiece || (() => {
        })} onDropPiece={onDropPiece} animateMove={animateMove}
                       isSelected={isSelected} isPossibleMove={isPossibleMove}/>;
    };

    const createBoard = () => {
        let squares = [];
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                squares.push(renderSquare(row, col));
            }
        }
        return squares;
    };

    return (
        <div className="board" ref={drop}>
            {createBoard()}
        </div>
    );
};

export default Board;