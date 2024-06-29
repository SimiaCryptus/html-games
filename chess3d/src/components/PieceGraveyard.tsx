import React, {useCallback, useEffect, useMemo} from 'react';
import ChessPiece from './ChessPiece.tsx';

interface PieceGraveyardProps {
    capturedPieces: { type: string, color: string }[];
}

const PieceGraveyard: React.FC<PieceGraveyardProps> = ({capturedPieces}) => {
    const logPieceDetails = useCallback((pieces: { type: string, color: string }[], color: string) => {
        console.group(`${color} captured pieces (${pieces.length})`);
        pieces.forEach((piece, index) => {
            console.log(`${index + 1}. ${piece.color} ${piece.type}`);
        });
        console.groupEnd();
    }, []);

    const whiteCapturedPieces = useMemo(() => capturedPieces.filter(piece => piece.color === 'white'), [capturedPieces]);
    const blackCapturedPieces = useMemo(() => capturedPieces.filter(piece => piece.color === 'black'), [capturedPieces]);

    useEffect(() => {
        console.group('Captured pieces updated');
        console.log('Total captured pieces:', capturedPieces.length);
        console.log('White captured pieces:', whiteCapturedPieces.length);
        console.log('Black captured pieces:', blackCapturedPieces.length);
        logPieceDetails(whiteCapturedPieces, 'White');
        logPieceDetails(blackCapturedPieces, 'Black');
        console.groupEnd();
    }, [capturedPieces, whiteCapturedPieces, blackCapturedPieces, logPieceDetails]);

    const renderPieces = useCallback((pieces: { type: string, color: string }[], color: string) => (
        <group position={color === 'white' ? [0, -1.5, 0] : [7, -1.5, 7]}>
            {pieces.map((piece, index) => {
                const position = [
                    color === 'white'
                        ? index % 4 * 0.75
                        : -(index % 4) * 0.75,
                    Math.floor(index / 4) * 0.75,
                    color === 'white'
                        ? 0
                        : -Math.floor(index / 4) * 0.75
                ];
                console.log(`Rendering ${piece.color} ${piece.type} at position:`, position);
                return <ChessPiece
                    key={index}
                    type={piece.type}
                    color={piece.color}
                    position={position}
                    scale={[0.3, 0.3, 0.3]}
                    onClick={() => {
                        console.log(`Clicked on captured ${piece.color} ${piece.type} at index ${index}`, {
                            position,
                            scale: [0.3, 0.3, 0.3]
                        });
                    }}
                    isSelected={false}
                />
            })}
        </group>
    ), []);

    useEffect(() => {
        console.log('PieceGraveyard rendered', {
            whiteCapturedPieces: whiteCapturedPieces.length,
            blackCapturedPieces: blackCapturedPieces.length
        });
        return () => {
            console.log('PieceGraveyard unmounted');
        };
    }, [whiteCapturedPieces, blackCapturedPieces]);

    return (
        <group>
            {renderPieces(whiteCapturedPieces, 'white')}
            {renderPieces(blackCapturedPieces, 'black')}
        </group>
    );
};

export default PieceGraveyard;