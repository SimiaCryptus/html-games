import React, {useCallback, useEffect, useRef, useState} from 'react';
import Modal from './components/Modal.tsx';
import UtilityMenu from './components/UtilityMenu.tsx';
import MenuIcon from './components/MenuIcon.tsx';
import {BASE_PATH, DEBUG} from './config';
import ChessGame from "./components/ChessGame.tsx";

const App = () => {
    console.log('[App] Rendering App component');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState(null);

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
        console.log('[App] BASE_PATH:', BASE_PATH);
    }, []);

    const handleError = useCallback((error) => {
        console.error('[App] Error in App:', error);
        setError(error);
    }, []);

    const handleChessGameError = useCallback((error) => {
        console.error('[App] Error in ChessGame:', error);
        handleError(error);
    }, [handleError]);

    const chessGameRef = useRef();

    console.log('[App] About to render ');
    return (

        <div style={{width: '100%', height: '100%'}}>
            <MenuIcon onClick={openModal}/>
            <ChessGame
                openUtilityMenu={openModal}
                onError={handleChessGameError}
                basePath={BASE_PATH}
                chessGameRef={chessGameRef}
            />
            {error && <div style={{color: 'red'}}>Error: {error.message}</div>}
            <Modal isOpen={isModalOpen} onClose={closeModal}>

                <UtilityMenu
                    resetGame={() => {
                        chessGameRef.current?.resetGame();
                    }}
                    getBoardState={() => chessGameRef.current?.getBoardState() || []}
                    setBoardState={(state) => {
                        chessGameRef.current?.setBoardState(state);
                    }}
                    undoMove={() => chessGameRef.current?.undoMove()}
                    moveHistory={chessGameRef.current?.moveHistory || []}
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