import React, {Suspense, useEffect, useState} from 'react';
import {Canvas} from '@react-three/fiber';
import {OrbitControls} from '@react-three/drei';
import ChessBoard from './ChessBoard.tsx';
import PieceGraveyard from './PieceGraveyard.tsx';
import {ChessPiece, Move, MoveHistory} from '../utils/moveHistory.ts';
import ErrorBoundary from './ErrorBoundary.jsx';
import UtilityMenuProps from './UtilityMenu.tsx';
import {createBoardStateFromImport, getInitialBoardState} from '../utils/boardStateUtils.ts';
import {convertToAscii} from '../utils/asciiConverter.ts';

// ... (rest of the imports and interface definitions remain unchanged)
interface ChessGameProps {
    openUtilityMenu: () => void;
    onError: (error: Error) => void;
    basePath: string;
    chessGameRef: React.RefObject<UtilityMenuProps>;
}

export const ChessGame: React.FC<ChessGameProps> = ({openUtilityMenu, onError, basePath, chessGameRef}) => {
    // ... (other state declarations remain unchanged)

    // ... (state declarations and other functions remain unchanged)

    console.log('[ChessGame] Rendering component');

    const [error, setError] = useState<Error | null>(null);
    const [capturedPieces, setCapturedPieces] = useState<{ type: string, color: string }[]>([]);
    const [gameKey, setGameKey] = useState(0);
    const [boardState, setBoardState] = useState<ChessPiece[]>(getInitialBoardState());
    const [currentTurn, setCurrentTurn] = useState<'white' | 'black'>(() => {
        console.log('Initializing currentTurn');
        return 'white';
    });
 
     // ... (rest of the component code)
    const [moveHistory, setMoveHistory] = useState<MoveHistory>(() => {
        const history = new MoveHistory();
        history.resetWithNewState(getInitialBoardState());
        return history;
    });

    const handleImport = (newBoardState: ChessPiece[]) => {
        console.log('[ChessGame] Importing new board state');
        const validatedBoardState = createBoardStateFromImport(newBoardState);
        setBoardState(validatedBoardState);
        const newMoveHistory = new MoveHistory();
        newMoveHistory.resetWithNewState(validatedBoardState);
        setMoveHistory(newMoveHistory);
        setCurrentTurn('white');
        setCapturedPieces([]);
        setGameKey(prevKey => prevKey + 1); // Force re-render of ChessBoard
    };

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
        setMoveHistory((prevHistory) => {
            const newHistory = prevHistory.clone();
            newHistory.addMove(move);
            return newHistory;
        });
        setBoardState(prevState => {
            // ... (board state update logic remains unchanged)
            const newState = [...prevState];
            const movingPieceIndex = newState.findIndex(p =>
                p.position[0] === move.from[0] &&
                p.position[1] === move.from[1] &&
                p.position[2] === move.from[2] &&
                p.type === move.piece.type &&
                p.color === move.piece.color
            );
            if (movingPieceIndex !== -1) {
                newState[movingPieceIndex] = {...newState[movingPieceIndex], position: move.to};
            }
            // Remove captured piece if any
            if (move.capturedPiece) {
                const capturedIndex = newState.findIndex(p =>
                    p.position[0] === move.to[0] &&
                    p.position[1] === move.to[1] &&
                    p.position[2] === move.to[2] &&
                    p.type === move.capturedPiece.type &&
                    p.color === move.capturedPiece.color
                );
                if (capturedIndex !== -1) {
                    newState.splice(capturedIndex, 1);
                }
            }
            return newState;
        });
        switchTurn();
        if (move.capturedPiece && move.capturedPiece.type) {
            handlePieceCapture(move.capturedPiece);
        }
    };

    const handleUndo = () => {
        console.log('[ChessGame] Attempting to undo last move');
        setMoveHistory((prevHistory) => {
            const newHistory = prevHistory.clone();
            const result = newHistory.undoLastMove();
            if (result) {
                const lastMove = result;
                setBoardState(newHistory.getCurrentBoardState());
                setCurrentTurn(lastMove.piece.color === 'white' ? 'black' : 'white');
                if (lastMove.capturedPiece) {
                    setCapturedPieces(prev => prev.slice(0, -1));
                }
                return newHistory;
            }
            return newHistory;
        });
    };

    const handleRedo = () => {
        console.log('[ChessGame] Attempting to redo last undone move');
        setMoveHistory((prevHistory) => {
            const newHistory = prevHistory.clone();
            const result = newHistory.redoMove();
            if (result) {
                const redoneMove = result;
                setBoardState(newHistory.getCurrentBoardState());
                setCurrentTurn(redoneMove.piece.color === 'white' ? 'black' : 'white');
                if (redoneMove.capturedPiece) {
                    handlePieceCapture(redoneMove.capturedPiece);
                }
                return newHistory;
            }
            return newHistory;
        });
    };

    // ... (rest of the component remains unchanged)
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
        setCurrentTurn(prevTurn => {
            const newTurn = prevTurn === 'white' ? 'black' : 'white';
            console.log('[ChessGame] New turn:', newTurn);
            return newTurn;
        });
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
        setBoardState: handleImport,
        undoMove: handleUndo,
        redoMove: handleRedo,
        moveHistory: moveHistory,
        setMoveHistory: setMoveHistory,
        setCurrentTurn: setCurrentTurn,
        setCapturedPieces: setCapturedPieces,
    getAsciiRepresentation: () => {
        console.log('Getting ASCII representation. Current turn:', currentTurn);
        return convertToAscii(boardState, currentTurn || 'white');
    },
        onClose: openUtilityMenu
    };

    return (
        // ... (JSX remains unchanged)
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