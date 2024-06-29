import React, {forwardRef, useEffect, useState} from 'react';
import {extend, useThree} from '@react-three/fiber';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {Text} from '@react-three/drei';
import ChessPiece from './ChessPiece.tsx';
import {convertFromAscii, convertToAscii, validateAsciiArt} from '../utils/asciiConverter.ts';
import {MoveHistory} from '../utils/moveHistory.ts';
import { DEBUG } from '../config.js';

// ... (rest of the imports and code)
extend({OrbitControls});
extend({Text});

const CENTERING_FACTOR = 0.5;

const isSamePosition = (pos1, pos2) => {
    if (Math.abs(pos1[0] - pos2[0]) > CENTERING_FACTOR) return false;
    if (Math.abs(pos1[1] - pos2[1]) > CENTERING_FACTOR) return false;
    if (Math.abs(pos1[2] - pos2[2]) > CENTERING_FACTOR) return false;
    return true;
};

const calculatePossibleMoves = (piece, positions) => {
    let moves = [];
    const [x, , z] = piece.position;
    const isValidMove = (nx, nz) => nx >= 0 && nx < 8 && nz >= 0 && nz < 8;
    const isOccupied = (nx, nz) => positions.some(p => isSamePosition(p.position, [nx, CENTERING_FACTOR, nz]));
    const isOpponent = (nx, nz) => positions.some(p => p.color !== piece.color && isSamePosition(p.position, [nx, CENTERING_FACTOR, nz]));

    const addMove = (nx, nz) => {
        if (isValidMove(nx, nz) && (!isOccupied(nx, nz) || isOpponent(nx, nz))) {
            moves.push([nx, nz]);
        }
    };

    const addMovesInDirection = (dx, dz) => {
        for (let i = 1; i < 8; i++) {
            const nx = x + i * dx;
            const nz = z + i * dz;
            if (!isValidMove(nx, nz)) break;
            if (isOccupied(nx, nz)) {
                if (isOpponent(nx, nz)) {
                    addMove(nx, nz);
                }
                break;
            }
            addMove(nx, nz);
        }
    };

    switch (piece.type) {
        case 'pawn':
            const direction = piece.color === 'white' ? 1 : -1;
            const startRank = piece.color === 'white' ? 1 : 6;
            if (!isOccupied(x, z + direction)) {
                addMove(x, z + direction);
                if (z === startRank && !isOccupied(x, z + 2 * direction)) {
                    addMove(x, z + 2 * direction);
                }
            }
            if (isOpponent(x - 1, z + direction)) addMove(x - 1, z + direction);
            if (isOpponent(x + 1, z + direction)) addMove(x + 1, z + direction);
            break;
        case 'rook':
            addMovesInDirection(1, 0);
            addMovesInDirection(-1, 0);
            addMovesInDirection(0, 1);
            addMovesInDirection(0, -1);
            break;
        case 'knight':
            [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]].forEach(([dx, dz]) => {
                addMove(x + dx, z + dz);
            });
            break;
        case 'bishop':
            addMovesInDirection(1, 1);
            addMovesInDirection(-1, -1);
            addMovesInDirection(1, -1);
            addMovesInDirection(-1, 1);
            break;
        case 'queen':
            addMovesInDirection(1, 0);
            addMovesInDirection(-1, 0);
            addMovesInDirection(0, 1);
            addMovesInDirection(0, -1);
            addMovesInDirection(1, 1);
            addMovesInDirection(-1, -1);
            addMovesInDirection(1, -1);
            addMovesInDirection(-1, 1);
            break;
        case 'king':
            [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]].forEach(([dx, dz]) => {
                addMove(x + dx, z + dz);
            });
            break;
        default:
            break;
    }
    return moves;
};

const HIGHLIGHT_COLOR = '#90EE90';
const SELECTED_COLOR = '#ffd700';

const createChessBoard = (selectedPiece, possibleMoves, handleSquareClick) => {
    const squares = [];
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const color = (i + j) % 2 === 0 ? 'white' : 'black';
            const isPossibleMove = possibleMoves.some(move => move[0] === i && move[1] === j);
            const isSelected = selectedPiece && selectedPiece.position[0] === i && selectedPiece.position[2] === j;
            const materialColor = isSelected ? SELECTED_COLOR : (isPossibleMove ? HIGHLIGHT_COLOR : (color === 'white' ? '#e6d0b1' : '#b48764'));
            squares.push(
                <mesh position={[i, 0, j]} key={`${i}-${j}`} onClick={() => handleSquareClick(i, j)}>
                    <boxGeometry args={[1, 0.1, 1]}/>
                    <meshPhysicalMaterial color={materialColor} metalness={0.1} roughness={0.8} clearcoat={1}
                                          clearcoatRoughness={0.1} envMapIntensity={0.5}/>
                </mesh>
            );
        }
    }
    return squares;
};

const initialPositions = [
    // White pieces
    {type: 'rook', position: [0, 0.5, 0], color: 'white'},
    {type: 'knight', position: [1, 0.5, 0], color: 'white'},
    {type: 'bishop', position: [2, 0.5, 0], color: 'white'},
    {type: 'queen', position: [3, 0.5, 0], color: 'white'},
    {type: 'king', position: [4, 0.5, 0], color: 'white'},
    {type: 'bishop', position: [5, 0.5, 0], color: 'white'},
    {type: 'knight', position: [6, 0.5, 0], color: 'white'},
    {type: 'rook', position: [7, 0.5, 0], color: 'white'},
    // White pawns
    {type: 'pawn', position: [0, 0.5, 1], color: 'white'},
    {type: 'pawn', position: [1, 0.5, 1], color: 'white'},
    {type: 'pawn', position: [2, 0.5, 1], color: 'white'},
    {type: 'pawn', position: [3, 0.5, 1], color: 'white'},
    {type: 'pawn', position: [4, 0.5, 1], color: 'white'},
    {type: 'pawn', position: [5, 0.5, 1], color: 'white'},
    {type: 'pawn', position: [6, 0.5, 1], color: 'white'},
    {type: 'pawn', position: [7, 0.5, 1], color: 'white'},
    // Black pieces
    {type: 'rook', position: [0, 0.5, 7], color: 'black'},
    {type: 'knight', position: [1, 0.5, 7], color: 'black'},
    {type: 'bishop', position: [2, 0.5, 7], color: 'black'},
    {type: 'queen', position: [3, 0.5, 7], color: 'black'},
    {type: 'king', position: [4, 0.5, 7], color: 'black'},
    {type: 'bishop', position: [5, 0.5, 7], color: 'black'},
    {type: 'knight', position: [6, 0.5, 7], color: 'black'},
    {type: 'rook', position: [7, 0.5, 7], color: 'black'},
    // Black pawns
    {type: 'pawn', position: [0, 0.5, 6], color: 'black'},
    {type: 'pawn', position: [1, 0.5, 6], color: 'black'},
    {type: 'pawn', position: [2, 0.5, 6], color: 'black'},
    {type: 'pawn', position: [3, 0.5, 6], color: 'black'},
    {type: 'pawn', position: [4, 0.5, 6], color: 'black'},
    {type: 'pawn', position: [5, 0.5, 6], color: 'black'},
    {type: 'pawn', position: [6, 0.5, 6], color: 'black'},
    {type: 'pawn', position: [7, 0.5, 6], color: 'black'},
];

const Controls: React.FC = () => {
    const {camera, gl} = useThree();
    console.log('Initializing OrbitControls');
    const controls = React.useMemo(() => new OrbitControls(camera, gl.domElement), [camera, gl]);
    useEffect(() => {
        controls.minDistance = 5;
        controls.maxDistance = 20;

        // Add passive option to the wheel event listener
        const handleWheel = (event: WheelEvent): void => {
            event.preventDefault();
            controls.zoom += event.deltaY * 0.0003;
            console.log(`Zoom level changed: ${controls.zoom0}`);
        };
        gl.domElement.addEventListener('wheel', handleWheel, {passive: false});

        return () => {
            controls.dispose();
            gl.domElement.removeEventListener('wheel', handleWheel);
        };
    }, [camera, gl, controls]);
    return null;
};

interface ChessBoardProps {
    onPieceCapture: (piece: { type: string, color: string }) => void;
    currentTurn: 'white' | 'black';
    switchTurn: () => void;
    resetGame: () => void;
    onBoardStateChange: (positions: any[]) => void;
    moveHistory: MoveHistory;
}

const ChessBoard = forwardRef<any, ChessBoardProps>(({
                                                         currentTurn,
                                                         switchTurn,
                                                         onPieceCapture,
                                                         resetGame,
                                                         onBoardStateChange,
                                                         moveHistory
                                                     }, ref) => {
    console.log('Rendering ChessBoard component', { currentTurn, switchTurn, onPieceCapture, resetGame, onBoardStateChange, moveHistory });

    const getBoardStateAsAscii = (): string => {
        return convertToAscii(positions);
    };

    const setBoardStateFromAscii = (asciiArt: string): void => {
        if (validateAsciiArt(asciiArt)) {
            const newPositions = convertFromAscii(asciiArt);
            setPositions(newPositions);
            setSelectedPiece(null);
            setPossibleMoves([]);
            setBoardKey(boardKey + 1);
            onBoardStateChange(newPositions);
        } else {
            console.error('Invalid ASCII art format');
        }
    };

    useEffect(() => {
        if (DEBUG) {
            console.log('ChessBoard mounted. Props:', { currentTurn, switchTurn, onPieceCapture, resetGame, onBoardStateChange, moveHistory });
        }
    }, []);

    // ... (rest of the component code)
    const [animatingPiece, setAnimatingPiece] = useState<any>(null);
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [selectedPiece, setSelectedPiece] = useState<any>(null);
    const [possibleMoves, setPossibleMoves] = useState<[number, number][]>([]);
    const [boardKey, setBoardKey] = useState<number>(0);
    const [positions, setPositions] = useState<any[]>(initialPositions);

    const handlePieceClick = (piece: any): void => {
        if (piece.color !== currentTurn) {
            return;
        }
        setSelectedPiece(piece);
        setPossibleMoves(calculatePossibleMoves(piece, positions));
        setBoardKey(prevKey => prevKey + 1);
    };

    const handleResetGame = () => {
        setPositions(initialPositions);
        setSelectedPiece(null);
        setPossibleMoves([]);
        setGameOver(false);
        resetGame();
        setBoardKey(prevKey => prevKey + 1);
    };

    const handleSquareClick = (i, j) => {
        if (selectedPiece) {
            if (!possibleMoves.some(possibleMove => isSamePosition(possibleMove, [i, j]))) {
                return;
            }
            const capturedPiece = positions.find(piece =>
                isSamePosition(piece.position, [i, CENTERING_FACTOR, j]) &&
                piece.color !== selectedPiece.color
            ) || null;

            setAnimatingPiece({...selectedPiece, targetPosition: [i, CENTERING_FACTOR, j]});

            setTimeout(() => {
                const newPositions = positions.map(piece => {
                    if (isSamePosition(piece.position, selectedPiece.position)) {
                        return {...piece, position: [i, CENTERING_FACTOR, j]};
                    }
                    if (capturedPiece && isSamePosition(piece.position, capturedPiece.position)) {
                        return null;
                    }
                    return piece;
                }).filter(Boolean);

                setPositions(newPositions);
                setSelectedPiece(null);
                setPossibleMoves([]);
                setBoardKey(prevKey => prevKey + 1);
                switchTurn();
                setAnimatingPiece(null);
                if (onBoardStateChange) {
                    onBoardStateChange(newPositions);
                }
                moveHistory.addMove({
                    piece: selectedPiece,
                    from: selectedPiece.position,
                    to: [i, CENTERING_FACTOR, j],
                    capturedPiece: capturedPiece
                });
            }, 500);

            if (capturedPiece) {
                onPieceCapture(capturedPiece);
                if (capturedPiece && capturedPiece.type === 'king') {
                    setGameOver(true);
                }
            }
        }
    };

    React.useImperativeHandle(ref, () => ({
        getBoardStateAsAscii,
        setBoardStateFromAscii
    }));

    return (
        <group>
            <Controls/>
            <group key={boardKey}>
                {createChessBoard(selectedPiece, possibleMoves, handleSquareClick)}
            </group>
            {positions.map((piece, index) => (
                <React.Fragment key={index}>
                    <ChessPiece
                        key={index}
                        type={piece.type}
                        position={piece.position}
                        color={piece.color}
                        onClick={() => handlePieceClick(piece)}
                        isSelected={selectedPiece === piece}
                        isAnimating={animatingPiece && isSamePosition(animatingPiece.position, piece.position)}
                        targetPosition={animatingPiece && isSamePosition(animatingPiece.position, piece.position) ? animatingPiece.targetPosition : null}
                    />
                </React.Fragment>
            ))}
            <Text position={[4, 5, 4]} fontSize={1} color="white" anchorX="center" anchorY="middle">
                {gameOver ? `GAME OVER - ${currentTurn === 'white' ? 'BLACK' : 'WHITE'} WINS!` : ``}
            </Text>
            {gameOver && (
                <Text position={[4, 4, 4]} fontSize={0.5} color="white" anchorX="center" anchorY="middle"
                      onClick={handleResetGame}>
                    Click here to reset the game
                </Text>
            )}
            <pointLight position={[4, 10, 4]} intensity={1.5} color="#ffffff"/>
            <ambientLight intensity={0.5}/>
        </group>
    );
});

export default ChessBoard;