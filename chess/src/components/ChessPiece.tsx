import React from 'react';
import '../styles/ChessPiece.scss';

interface ChessPieceProps {
    piece: string;
}

const ChessPiece: React.FC<ChessPieceProps> = ({piece}) => {
    const getPieceImageUrl = (piece: string) => {
        const color = piece === piece.toUpperCase() ? 'l' : 'd';
        const typeCode = {
            'p': 'p', 'r': 'r', 'n': 'n', 'b': 'b', 'q': 'q', 'k': 'k'
        }[piece.toLowerCase()];
        return `img/Chess_${typeCode}${color}t60.png`;
    };

    return (
        <div className="chess-piece">
            <img src={getPieceImageUrl(piece)} alt={piece}/>
        </div>
    );
};

export default ChessPiece;