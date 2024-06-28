import React from 'react';
import App from './App';
import './index.css';

import {createRoot} from 'react-dom/client';

const container = document.getElementById('root');
console.log('Initializing React application');
const root = createRoot(container);
root.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
);
console.log('React application rendered');