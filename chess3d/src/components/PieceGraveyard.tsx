import React, {useEffect} from 'react';
import ChessPiece from './ChessPiece.tsx';

interface PieceGraveyardProps {
    capturedPieces: { type: string, color: string }[];
}

const PieceGraveyard: React.FC<PieceGraveyardProps> = ({capturedPieces}) => {
    useEffect(() => {
        console.log('Captured pieces updated:', capturedPieces);
    }, [capturedPieces]);

    const whiteCapturedPieces = capturedPieces.filter(piece => piece.color === 'white');
    const blackCapturedPieces = capturedPieces.filter(piece => piece.color === 'black');

    console.log('White captured pieces:', whiteCapturedPieces.length);
    console.log('Black captured pieces:', blackCapturedPieces.length);

    const renderPieces = (pieces, color) => (
        <group position={color === 'white' ? [0, -1.5, 0] : [7, -1.5, 7]}>
            {pieces.map((piece, index) => (
                <ChessPiece
                    key={index}
                    type={piece.type}
                    color={piece.color}
                    position={[
                        color === 'white'
                            ? index % 4 * 0.75
                            : -(index % 4) * 0.75,
                        Math.floor(index / 4) * 0.75,
                        color === 'white'
                            ? 0
                            : -Math.floor(index / 4) * 0.75
                    ]}
                    scale={[0.3, 0.3, 0.3]}
                    onClick={() => {
                    }}
                    isSelected={false}
                />
            ))}
        </group>
    );

    return (
        <group>
            {renderPieces(whiteCapturedPieces, 'white')}
            {renderPieces(blackCapturedPieces, 'black')}
        </group>
    );
};

export default PieceGraveyard;