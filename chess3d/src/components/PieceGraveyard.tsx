import React, {useMemo} from 'react';
import ChessPiece from './ChessPiece.tsx';

interface PieceGraveyardProps {
    capturedPieces: { type: string, color: string }[];
}

const PIECE_SPACING = 0.75;
const GRAVEYARD_SCALE = 0.3;
const PIECES_PER_ROW = 4;

const GRAVEYARD_POSITIONS = {
    white: [0, -1.5, 0],
    black: [7, -1.5, 7]
} as const;

const calculatePosition = (index: number, color: string): [number, number, number] => [
    color === 'white'
        ? (index % PIECES_PER_ROW) * PIECE_SPACING
        : -(index % PIECES_PER_ROW) * PIECE_SPACING,
    Math.floor(index / PIECES_PER_ROW) * PIECE_SPACING,
    color === 'white'
        ? 0
        : -Math.floor(index / PIECES_PER_ROW) * PIECE_SPACING
];

const PieceGraveyard: React.FC<PieceGraveyardProps> = ({capturedPieces}) => {
    const whiteCapturedPieces = useMemo(() => capturedPieces.filter(piece => piece.color === 'white'), [capturedPieces]);
    const blackCapturedPieces = useMemo(() => capturedPieces.filter(piece => piece.color === 'black'), [capturedPieces]);

    const renderPieces = (pieces: { type: string, color: string }[], color: 'white' | 'black') => (
        <group position={GRAVEYARD_POSITIONS[color]}>
            {pieces.map((piece, index) => {
                const position = calculatePosition(index, color);
                return <ChessPiece
                    key={index}
                    type={piece.type}
                    color={piece.color}
                    position={position}
                    scale={[GRAVEYARD_SCALE, GRAVEYARD_SCALE, GRAVEYARD_SCALE]}
                    isSelected={false}
                />
            })}
        </group>
    );

    return (
        <group>
            {renderPieces(whiteCapturedPieces, 'white')}
            {renderPieces(blackCapturedPieces, 'black')}
        </group>
    );
};

export default React.memo(PieceGraveyard);