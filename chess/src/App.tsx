import React from 'react';
import { useState } from 'react';
import ChessBoard from './components/ChessBoard';
import MoveLogModal from './components/MoveLogModal';
import OnlinePlayModal from './components/OnlinePlayModal';
import TextMoveModal from './components/TextMoveModal';
import SaveLoadModal from './components/SaveLoadModal';
import './styles/App.scss';

const App: React.FC = () => {
    const [showMoveLogModal, setShowMoveLogModal] = useState(false);
    const [showOnlinePlayModal, setShowOnlinePlayModal] = useState(false);
    const [showTextMoveModal, setShowTextMoveModal] = useState(false);
    const [showSaveLoadModal, setShowSaveLoadModal] = useState(false);
    const [moveLog, setMoveLog] = useState<string[]>([]);

    const handleOpenMoveLogModal = () => setShowMoveLogModal(true);
    const handleCloseMoveLogModal = () => setShowMoveLogModal(false);

    const handleOpenOnlinePlayModal = () => setShowOnlinePlayModal(true);
    const handleCloseOnlinePlayModal = () => setShowOnlinePlayModal(false);

    const handleOpenTextMoveModal = () => setShowTextMoveModal(true);
    const handleCloseTextMoveModal = () => setShowTextMoveModal(false);

    const handleOpenSaveLoadModal = () => setShowSaveLoadModal(true);
    const handleCloseSaveLoadModal = () => setShowSaveLoadModal(false);

    const handleStartGame = (gameId: string, color: string) => {
        // Implement start game logic
    };

    const handleJoinGame = (gameId: string, color: string) => {
        // Implement join game logic
    };

    const handleLeaveGame = () => {
        // Implement leave game logic
    };

    const handleSubmitMove = (moveText: string) => {
        // Implement submit move logic
    };

    const handleImportLayout = (layout: string) => {
        // Implement import layout logic
    };

    const handleExportLayout = () => {
        // Implement export layout logic
        return '';
    };

    return (
        <div className="app">
            <h1>Chess Game</h1>
            <div id="buttons-container">
                <button id="undo">Undo</button>
                <button id="redo">Redo</button>
                <button id="reset">Reset Game</button>
                <button id="save-load-button" onClick={handleOpenSaveLoadModal}>Save/Load</button>
                <button id="text-move-button" onClick={handleOpenTextMoveModal}>Text Move</button>
                <button id="online-play-button" onClick={handleOpenOnlinePlayModal}>Online Play</button>
                <button id="move-log-button" onClick={handleOpenMoveLogModal}>View Move Log</button>
                <button id="save-load-button">Save/Load</button>
                <button id="text-move-button">Text Move</button>
                <button id="online-play-button">Online Play</button>
            </div>
            <div id="game-container">
                <ChessBoard/>
            </div>
            {showMoveLogModal && <MoveLogModal moveLog={moveLog} onClose={handleCloseMoveLogModal} />}
            {showOnlinePlayModal && (
                <OnlinePlayModal
                    onStartGame={handleStartGame}
                    onJoinGame={handleJoinGame}
                    onLeaveGame={handleLeaveGame}
                    onClose={handleCloseOnlinePlayModal}
                />
            )}
            {showTextMoveModal && <TextMoveModal onSubmitMove={handleSubmitMove} onClose={handleCloseTextMoveModal} />}
            {showSaveLoadModal && (
                <SaveLoadModal
                    onImportLayout={handleImportLayout}
                    onExportLayout={handleExportLayout}
                    onClose={handleCloseSaveLoadModal}
                />
            )}
        </div>
    );
};

export default App;