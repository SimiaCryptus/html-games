import React, {useState} from 'react';
import {Canvas} from '@react-three/fiber';
import {OrbitControls} from '@react-three/drei';
import ChessBoard from './ChessBoard.tsx';
import PieceGraveyard from './PieceGraveyard.tsx';

const ChessGame: React.FC = () => {
    console.log('Rendering ChessGame component');
    const [capturedPieces, setCapturedPieces] = useState<{ type: string, color: string }[]>([]);

    const handlePieceCapture = (piece: { type: string, color: string }) => {
        console.log(`Piece captured: ${piece.type} of color ${piece.color}`);
        setCapturedPieces(prevCapturedPieces => {
            const updatedCapturedPieces = [...prevCapturedPieces, piece];
            console.log('Updated captured pieces:', updatedCapturedPieces);
            return updatedCapturedPieces;
        });
    };
    const [currentTurn, setCurrentTurn] = useState<'white' | 'black'>('white');

    const switchTurn = () => {
        console.log(`Switching turn from ${currentTurn} to ${currentTurn === 'white' ? 'black' : 'white'}`);
        setCurrentTurn(currentTurn === 'white' ? 'black' : 'white');
    };

    return (
        <div className="chess-container" style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
    <div className="turn-indicator">Current Turn: <span style={{color: currentTurn === 'white' ? '#e6d0b1' : '#b48764'}}>{currentTurn}</span></div>
            <Canvas style={{width: '90vw', height: '90vh'}} camera={{position: [4, 10, 14], fov: 50}}>
            <ambientLight intensity={0.5}/>
            <pointLight position={[10, 10, 10]} intensity={1.5}/>
            <fog attach="fog" args={['#34495e', 0, 40]} />
            <color attach="background" args={['#34495e']} />
                <ChessBoard
                    onPieceCapture={handlePieceCapture}
                    currentTurn={currentTurn}
                    switchTurn={switchTurn}
                />
                <PieceGraveyard capturedPieces={capturedPieces}/>
                <OrbitControls
                    target={[4, 0, 4]}
                    enablePan={false}
                    minPolarAngle={Math.PI / 6}
                    maxPolarAngle={Math.PI / 2}
                minDistance={8}
                maxDistance={20}
                enableDamping
                dampingFactor={0.05}
                />
            </Canvas>
        </div>
    );
};

export default ChessGame;