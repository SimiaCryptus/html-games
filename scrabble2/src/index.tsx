import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.tsx';
import {BrowserRouter} from 'react-router-dom';
import '@fontsource/roboto';

console.log('Initializing application...');

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <div style={{height: '100vh', width: '100vw', margin: '0', padding: '0'}}>
                <App/>
            </div>
        </BrowserRouter>
    </React.StrictMode>
    ,
    document.getElementById('root')
);

console.log('Application initialized successfully.');