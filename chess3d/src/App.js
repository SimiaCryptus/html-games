import React, {useCallback, useState} from 'react';
import Modal from './components/Modal.tsx';
import UtilityMenu from './components/UtilityMenu.tsx';
import MenuIcon from './components/MenuIcon.tsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { Suspense, lazy, useEffect } from 'react';
import { BASE_PATH, DEBUG } from './config';

const LazyChessGame = lazy(() => {
    console.log('[LazyChessGame] Starting lazy load of ChessGame component');
    return import(/* webpackChunkName: "ChessGame" */ './components/ChessGame.tsx')
        .then(module => {
            console.log('[LazyChessGame] ChessGame component loaded successfully');
            return module;
        })
        .catch(error => {
            console.error('[LazyChessGame] Error loading ChessGame component:', error.message, error.stack);
            throw error;
        });
});

const App = () => {
    console.log('[App] Rendering App component');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [chessGameError, setChessGameError] = useState(null);

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
            <ErrorBoundary onError={(err) => console.error('[App] Top-level ErrorBoundary caught an error:', err)}>
            <Suspense fallback={<div>Loading Chess Game... {chessGameError && `Error: ${chessGameError.message}`}</div>}>
                { isLoading ? (
                    <div>Loading...</div>
                ) : (
                    <LazyChessGame
                        openUtilityMenu={openModal}
                        onError={handleChessGameError}
                        basePath={BASE_PATH}
                    />
                )}
            </Suspense>
            </ErrorBoundary>
            {error && <div>Error: {error.message}</div>}
            {chessGameError && <div>Chess Game Error: {chessGameError.message}</div>}
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <UtilityMenu
                    resetGame={() => {/* Implement resetGame logic */
                        console.log('[App] Reset game requested');
                    }}
                    getBoardState={() => {/* Implement getBoardState logic */
                        console.log('[App] Get board state requested');
                    }}
                    setBoardState={(state) => {/* Implement setBoardState logic */
                        console.log('[App] Set board state requested', state);
                    }}
                    undoMove={() => {/* Implement undoMove logic */
                        console.log('[App] Undo move requested');
                    }}
                    moveHistory={[]} // Pass actual move history here
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