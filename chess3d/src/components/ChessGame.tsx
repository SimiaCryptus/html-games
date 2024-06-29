import React, {useRef, useState, useEffect} from 'react';
import {Canvas} from '@react-three/fiber';
import {OrbitControls} from '@react-three/drei';
import ChessBoard from './ChessBoard.tsx';
import {Suspense} from 'react';
import PieceGraveyard from './PieceGraveyard.tsx';
import {Move, MoveHistory} from '../utils/moveHistory.ts';
import ErrorBoundary from './ErrorBoundary.jsx';

interface ChessGameProps {
    openUtilityMenu: () => void;
    onError: (error: Error) => void;
    basePath: string;
 }

const ChessGame: React.FC<ChessGameProps> = ({openUtilityMenu, onError, basePath}) => {
    console.log('[ChessGame] Rendering component');

    const [error, setError] = useState<Error | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [capturedPieces, setCapturedPieces] = useState<{ type: string, color: string }[]>([]);
    const [gameKey, setGameKey] = useState(0);
    const [boardState, setBoardState] = useState<string[][]>([]);
    const [currentTurn, setCurrentTurn] = useState<'white' | 'black'>('white');
    const moveHistoryRef = useRef(new MoveHistory());

    useEffect(() => {
        console.log('[ChessGame] Component mounted');
        setIsLoading(false);
        return () => {
            console.log('[ChessGame] Component unmounted');
        };
    }, []);

    useEffect(() => {
        if (error) {
            console.error('[ChessGame] Error occurred:', error);
            onError(error);
        }
    }, [error, onError]);

    useEffect(() => {
        console.log('[ChessGame] basePath:', basePath);
    }, [basePath]);

    const handleBoardStateChange = (newPositions) => {
        console.log('[ChessGame] Board state changed:', newPositions);
        setBoardState(newPositions);
        // TODO: Implement board state change logic
    };

    if (isLoading) {
        console.log('[ChessGame] Still loading...');
        return <div>Loading ChessGame...</div>;
    }

    if (error) {
        console.error('[ChessGame] Rendering error state:', error.message);
        return <div>Error: {error.message}</div>;
    }

     // ... rest of the component code ...

    const handleMove = (move: Move) => {
        console.log('[ChessGame] Handling move:', move);
        moveHistoryRef.current.addMove(move);
        // TODO: Implement move handling logic
    };

    const handleUndo = () => {
        console.log('[ChessGame] Attempting to undo last move');
        const lastMove = moveHistoryRef.current.undoLastMove();
        if (lastMove) {
            console.log('[ChessGame] Undoing move:', lastMove);
            // TODO: Implement undo logic
        } else {
            console.log('[ChessGame] No moves to undo');
        }
    };

    const handleResetGame = () => {
        console.log('[ChessGame] Resetting game');
        moveHistoryRef.current.clear();
        resetGame();
    }


    const handlePieceCapture = (piece: { type: string, color: string }) => {
        console.log('[ChessGame] Piece captured:', piece);
        setCapturedPieces(prevCapturedPieces => {
            const updatedCapturedPieces = [...prevCapturedPieces, piece];
            console.log('[ChessGame] Updated captured pieces:', updatedCapturedPieces);
            return updatedCapturedPieces;
        });
    };


    const switchTurn = () => {
        console.log('[ChessGame] Switching turn');
        setCurrentTurn(currentTurn === 'white' ? 'black' : 'white');
    };

    const resetGame = () => {
        console.log('[ChessGame] Resetting game state');
        setCapturedPieces([]);
        setCurrentTurn('white');
        setGameKey(prevKey => prevKey + 1);
        moveHistoryRef.current.clear();
    };

    console.log('[ChessGame] About to render Canvas');
    return (
        <div className="chess-container" style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <div className="turn-indicator">Current Turn: <span
                style={{color: currentTurn === 'white' ? '#e6d0b1' : '#b48764'}}>{currentTurn}</span></div>
            <ErrorBoundary onError={(err) => console.error('[ChessGame] ErrorBoundary caught an error:', err)}>
            <Canvas
                style={{width: '90vw', height: '90vh'}}
                camera={{position: [4, 10, 14], fov: 50}}
                onCreated={({ gl }) => {
                    console.log('[ChessGame] Canvas created');
                    gl.setClearColor('#34495e');
                }}
                onError={(error) => {
                    console.error('[ChessGame] Canvas error:', error);
                    setError(new Error('Canvas error: ' + error.message));
                }}
            >
                <Suspense fallback={<mesh><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color="gray" /></mesh>}>
                <ambientLight intensity={0.5}/>
                <pointLight position={[10, 10, 10]} intensity={1.5}/>
                <fog attach="fog" args={['#34495e', 0, 40]}/>
                <color attach="background" args={['#34495e']}/>
                <group key={gameKey}>
                    <ChessBoard
                        basePath={basePath}
                        onPieceCapture={handlePieceCapture}
                        currentTurn={currentTurn}
                        switchTurn={switchTurn}
                        resetGame={resetGame}
                        onBoardStateChange={handleBoardStateChange}
                        moveHistory={moveHistoryRef.current}
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
                </group>
                </Suspense>
            </Canvas>
            </ErrorBoundary>
        </div>
    );
};

export default ChessGame;