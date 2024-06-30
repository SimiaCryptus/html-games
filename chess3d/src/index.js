import React from 'react';
import App from './App';
import './index.css';
import {DEBUG} from './config';

import {createRoot} from 'react-dom/client';

// Add performance mark at the start
performance.mark('chess3d-init-start');

// Helper function for logging
const log = (message, ...args) => {
    console.log(`[Chess3D %c${message}`, 'color: #4CAF50; font-weight: bold;', ...args);
};

// Helper function for error logging
const logError = (message, ...args) => {
    console.error(`[Chess3D ERROR] %c${message}`, 'color: #FF5252; font-weight: bold;', ...args);
};

console.group('Chess3D Application Initialization');
log('Application starting...', `Debug mode: ${DEBUG}`);

// Add performance mark for initialization start
performance.mark('chess3d-init-start');

// Add performance tracking
const startTime = performance.now();

// Add global error handler
window.onerror = function (message, source, lineno, colno, error) {
    logError('Global error:', message, 'at', source, lineno, colno);
    logError('Error object:', error);
    // TODO: Send this error to your error tracking service
    console.trace('Error stack trace:');
};

// Add unhandled promise rejection handler
window.onunhandledrejection = function (event) {
    logError('Unhandled promise rejection:', event.reason);
    // TODO: Send this error to your error tracking service
    console.trace('Rejection stack trace:');
};

const container = document.getElementById('root');
log('Initializing React application', 'Container:', container);

if (!container) {
    logError('Root container not found. Aborting render.');
    console.groupEnd();
    throw new Error('Root container not found');
}

const root = createRoot(container);
log('React root created', 'Root:', root);

try {
    log(`Rendering app in ${DEBUG ? 'debug' : 'production'} mode`);
    console.time('App Render Time');
    root.render(
        DEBUG ? (
            <React.StrictMode>
                <App/>
            </React.StrictMode>
        ) : (
            <React.Profiler id="Chess3D App"
                            onRender={(id, phase, actualDuration, baseDuration, startTime, commitTime) => {
                                log(`Component ${id} ${phase}:`,
                                    `\nActual duration: ${actualDuration.toFixed(2)}ms`,
                                    `\nBase duration: ${baseDuration.toFixed(2)}ms`,
                                    `\nStart time: ${startTime.toFixed(2)}ms`,
                                    `\nCommit time: ${commitTime.toFixed(2)}ms`
                                );
                            }}>
                <App/>
            </React.Profiler>
        )
    );
    console.timeEnd('App Render Time');
    log('React application rendered successfully', 'Container:', container);
} catch (error) {
    logError('Error rendering React application:', error);
    // TODO: Show a user-friendly error message here
    console.trace('Render error stack trace:');
}

const endTime = performance.now();
log('Application initialization complete', `Total time: ${(endTime - startTime).toFixed(2)}ms`);
console.groupEnd();

// Add performance marks
performance.mark('chess3d-init-end');
performance.measure('Chess3D Initialization', 'chess3d-init-start', 'chess3d-init-end');

// Log performance measures
performance.getEntriesByType('measure').forEach(measure => {
    console.log(`%c${measure.name}: ${measure.duration.toFixed(2)}ms`, 'color: #2196F3; font-weight: bold;');
});