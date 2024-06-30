import React, {Suspense, useEffect, useState} from 'react';
import {Canvas} from '@react-three/fiber';
import {OrbitControls} from '@react-three/drei';
import ChessBoard from './ChessBoard.tsx';
import PieceGraveyard from './PieceGraveyard.tsx';
import {ChessPiece, Move, MoveHistory} from '../utils/moveHistory.ts';
import ErrorBoundary from './ErrorBoundary.jsx';
import UtilityMenuProps from './UtilityMenu.tsx';
import {calculateNewBoardState, getInitialBoardState} from '../utils/boardStateUtils.ts';

interface ChessGameProps {
    openUtilityMenu: () => void;
    onError: (error: Error) => void;
    basePath: string;
    chessGameRef: React.RefObject<UtilityMenuProps>;
}

export const ChessGame: React.FC<ChessGameProps> = ({openUtilityMenu, onError, basePath, chessGameRef}) => {

    console.log('[ChessGame] Rendering component');

    const [error, setError] = useState<Error | null>(null);
    const [capturedPieces, setCapturedPieces] = useState<{ type: string, color: string }[]>([]);
    const [gameKey, setGameKey] = useState(0);
    const [boardState, setBoardState] = useState<ChessPiece[]>(getInitialBoardState());
    const [currentTurn, setCurrentTurn] = useState<'white' | 'black'>('white');
    const [moveHistory, setMoveHistory] = useState<MoveHistory>(new MoveHistory());
    const [undoStack, setUndoStack] = useState<Move[]>([]);
    const [redoStack, setRedoStack] = useState<Move[]>([]);

    useEffect(() => {
        console.log('[ChessGame] Component mounted');
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
    };

    if (error) {
        console.error('[ChessGame] Rendering error state:', error.message);
        return <div>Error: {error.message}</div>;
    }

    const handleMove = (move: Move) => {
        console.log('[ChessGame] Handling move:', move);
        setMoveHistory(prevHistory => {
            const newHistory = new MoveHistory([...prevHistory.moves, move]);
            setBoardState(calculateNewBoardState(newHistory));
            setUndoStack(prevStack => [...prevStack, move]);
            setRedoStack([]); // Clear redo stack on new move
            return newHistory;
        });
        switchTurn();
    };

    const handleUndo = () => {
        console.log('[ChessGame] Attempting to undo last move');
        if (undoStack.length > 0) {
            const lastMove = undoStack[undoStack.length - 1];
            const newMoveHistory = new MoveHistory(moveHistory.moves.slice(0, -1));
            const newBoardState = calculateNewBoardState(newMoveHistory);
            setMoveHistory(newMoveHistory);
            setBoardState(newBoardState);
            setCurrentTurn(lastMove.piece.color === 'white' ? 'black' : 'white');
            if (lastMove.capturedPiece) {
                setCapturedPieces(prev => prev.filter((_, index) => index !== prev.length - 1));
            }
            setUndoStack(prevStack => prevStack.slice(0, -1));
            setRedoStack(prevStack => [...prevStack, lastMove]);
            // Trigger a re-render of the ChessBoard
            setGameKey(prevKey => prevKey + 1);
        }
    };

    const handleRedo = () => {
        console.log('[ChessGame] Attempting to redo last undone move');
        if (redoStack.length > 0) {
            const nextMove = redoStack[redoStack.length - 1];
            setMoveHistory(prevHistory => {
                const newHistory = new MoveHistory([...prevHistory.moves, nextMove]);
                const newBoardState = calculateNewBoardState(newHistory);
                setBoardState(newBoardState);
                setCurrentTurn(nextMove.piece.color === 'white' ? 'black' : 'white');
                if (nextMove.capturedPiece) {
                    setCapturedPieces(prev => [...prev, nextMove.capturedPiece]);
                }
                setRedoStack(prevStack => prevStack.slice(0, -1));
                setUndoStack(prevStack => [...prevStack, nextMove]);
                return newHistory;
            });
        }
    };

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
        setBoardState(getInitialBoardState());
        setMoveHistory(new MoveHistory());
    };

    const handleResetGame = resetGame;

    chessGameRef.current = {
        resetGame: handleResetGame,
        getBoardState: () => boardState,
        setBoardState: setBoardState,
        undoMove: handleUndo,
        redoMove: handleRedo,
        moveHistory: moveHistory,
        onClose: openUtilityMenu
    };

    return (
        <div className="chess-container" style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <div className="turn-indicator">Current Turn: <span
                style={{color: currentTurn === 'white' ? '#e6d0b1' : '#b48764'}}>{currentTurn}</span></div>
            <ErrorBoundary onError={(err) => console.error('[ChessGame] ErrorBoundary caught an error:', err)}>
                <Canvas
                    style={{width: '90vw', height: '90vh'}}
                    camera={{position: [4, 10, 14], fov: 50}}
                    onCreated={({gl}) => {
                        console.log('[ChessGame] Canvas created');
                        gl.setClearColor('#34495e');
                    }}
                    onError={(error) => {
                        console.error('[ChessGame] Canvas error:', error);
                        setError(new Error('Canvas error: ' + error.message));
                    }}
                >
                    <Suspense fallback={<mesh>
                        <boxGeometry args={[1, 1, 1]}/>
                        <meshStandardMaterial color="gray"/>
                    </mesh>}>
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
                                moveHistory={moveHistory}
                                boardState={boardState}
                                onMove={handleMove}
                            />
                            // ... (rest of the JSX)
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