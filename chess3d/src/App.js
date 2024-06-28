import React from 'react';
import ChessGame from './components/ChessGame.tsx';

const App = () => {
    console.log('Rendering App component');
    return (
        <div style={{width: '100%', height: '100%'}}>
            <ChessGame/>
        </div>
    );
};

export default App;