import {useEffect, useState} from 'react';
import ChessPiece from './ChessPiece';
import {ChessGame, Move} from '../utils/gameLogic';
import {getPossibleMoves} from '../utils/moveLogic';
import '../styles/ChessBoard.scss';

const ChessBoard: React.FC = () => {
    const [game, setGame] = useState(new ChessGame());
    const [selectedPiece, setSelectedPiece] = useState<{ row: number, col: number } | null>(null);
    const [possibleMoves, setPossibleMoves] = useState<Move[]>([]);
    const [currentPlayer, setCurrentPlayer] = useState<string>('white');

    useEffect(() => {
        setGame(new ChessGame());
    }, []);

    const handleSquareClick = (row: number, col: number) => {
        const piece = game.board[row][col];
        if (selectedPiece) {
            const startPos = `${String.fromCharCode(97 + selectedPiece.col)}${8 - selectedPiece.row}`;
            const endPos = `${String.fromCharCode(97 + col)}${8 - row}`;
            if (game.movePiece(startPos, endPos, possibleMoves)) {
                setSelectedPiece(null);
                setPossibleMoves([]);
                setCurrentPlayer(game.currentTurn === 'white' ? 'black' : 'white');
                setGame(new ChessGame(game.getGameState())); // Update the game state
            } else {
                setSelectedPiece({row, col});
                setPossibleMoves(getPossibleMoves(piece, row, col, game.board));
            }
        } else {
            setSelectedPiece({row, col});
            setPossibleMoves(getPossibleMoves(piece, row, col, game.board));
        }
    };

    // Placeholder for the chessboard setup
    return (
        <div>
            <div className="status">{`${currentPlayer === 'white' ? 'White' : 'Black'}'s turn`}</div>
            <div className="chessboard">
                {game.board.map((row, rowIndex) => (
                    <div key={rowIndex} className="row">
                        {row.map((piece, colIndex) => (
                            <div
                                key={colIndex}
                                className={`square ${(rowIndex + colIndex) % 2 === 0 ? 'even' : 'odd'} 
                                ${selectedPiece && selectedPiece.row === rowIndex && selectedPiece.col === colIndex ? 'selected' : ''} 
                                ${possibleMoves.some(move => move.row === rowIndex && move.col === colIndex) ? 'highlight' : ''}`}
                                onClick={() => handleSquareClick(rowIndex, colIndex)}
                            >
                                {piece && <ChessPiece piece={piece}/>}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChessBoard;