import React, {useCallback, useRef, useState} from 'react';
import Modal from './components/Modal.tsx';
import UtilityMenu from './components/UtilityMenu.tsx';
import MenuIcon from './components/MenuIcon.tsx';
import { useEffect } from 'react';
import { BASE_PATH, DEBUG } from './config';
import ChessGame from "./components/ChessGame.tsx";

const App = () => {
    console.log('[App] Rendering App component');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    // let chessGame = ChessGame({openUtilityMenu: null, onError: null, basePath: null});
    const chessGameRef = useRef<ChessGame | null>(null);

    const openModal = () => {
        console.log('[App] Opening modal');
        setIsModalOpen(true);
    };
    const closeModal = () => {
        console.log('[App] Closing modal');
        setIsModalOpen(false);
    };

    useEffect(() => {
        console.log('[App] App component mounted');
        setIsLoading(false);
    }, []);

    useEffect(() => {
        console.log('[App] BASE_PATH:', BASE_PATH);
    }, []);

    const handleError = useCallback((error) => {
        console.error('[App] Error in App:', error);
        setError(error);
    }, []);

    const handleChessGameError = useCallback((error) => {
        console.error('[App] Error in ChessGame:', error);
        setChessGameError(error);
        handleError(error);
    }, [handleError]);

    console.log('[App] About to render ');
    return (
        <div style={{width: '100%', height: '100%'}}>
            <MenuIcon onClick={openModal}/>
            <ChessGame
                //ref={chessGameRef} // <- will cause "Function components cannot have string refs. We recommend using useRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref"
                        openUtilityMenu={openModal}
                        onError={handleChessGameError}
                        basePath={BASE_PATH}
                    />
            {error && <div style={{color: 'red'}}>Error: {error.message}</div>}
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <UtilityMenu
                    resetGame={() => {
                        chessGameRef.current?.handleResetGame();
                    }}
                    getBoardState={() => chessGameRef.current?.getBoardState() || []}
                    setBoardState={(state) => {
                        chessGameRef.current?.setBoardState(state);
                    }}
                    undoMove={() => chessGameRef.current?.handleUndo()}
                    moveHistory={chessGameRef.current?.getMoveHistory() || []}
                    onClose={closeModal}
                />
            </Modal>
        </div>
    );
};

if (DEBUG) {
    console.log('[App] Debug mode is enabled');
}

export default App;