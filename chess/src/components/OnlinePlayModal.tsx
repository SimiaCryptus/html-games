import React, {useState} from 'react';

interface OnlinePlayModalProps {
    onStartGame: (gameId: string, color: string) => void;
    onJoinGame: (gameId: string, color: string) => void;
    onLeaveGame: () => void;
    onClose: () => void;
}

const OnlinePlayModal: React.FC<OnlinePlayModalProps> = ({onStartGame, onJoinGame, onLeaveGame, onClose}) => {
    const [gameId, setGameId] = useState('');
    const [color, setColor] = useState('');

    const handleStartGame = () => {
        onStartGame(gameId, color);
        onClose();
    };

    const handleJoinGame = () => {
        onJoinGame(gameId, color);
        onClose();
    };

    return (
        <div className="modal" id="online-play-modal">
            <div className="modal-content">
                <span className="close-online-play" onClick={onClose}>&times;</span>
                <input
                    type="text"
                    id="game-id-input"
                    placeholder="Enter Game ID"
                    value={gameId}
                    onChange={(e) => setGameId(e.target.value)}
                />
                <input
                    type="text"
                    id="player-color-input"
                    placeholder="Enter Player Color (white or black)"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                />
                <button id="start-online-game" onClick={handleStartGame}>Start Game</button>
                <button id="join-online-game" onClick={handleJoinGame}>Join Game</button>
                <button id="leave-online-game" onClick={onLeaveGame}>Leave Game</button>
            </div>
        </div>
    );
};

export default OnlinePlayModal;
