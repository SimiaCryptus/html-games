// Function to capture console logs (optional, based on requirements)
(function () {
    const originalConsoleLog = console.log;
    const originalConsoleInfo = console.info;
    const originalConsoleWarn = console.warn;
    const originalConsoleError = console.error;
    let capturedLogs = [];
    const getSourceLine = () => {
        const stack = new Error().stack;
        const stackLines = stack.split('\n');
        return stackLines.length > 2 ? stackLines[2].trim() : null;
    };
    console.log = function (...args) {
        capturedLogs.push({message: args.join(' '), timestamp: Date.now(), level: 'info'});
        originalConsoleLog.apply(console, args);
    };

    console.info = function (...args) {
        capturedLogs.push({message: args.join(' '), timestamp: Date.now(), level: 'info'});
        originalConsoleInfo.apply(console, args);
    };

    console.warn = function (...args) {
        capturedLogs.push({message: args.join(' '), timestamp: Date.now(), level: 'warn'});
        originalConsoleWarn.apply(console, args);
    };

    console.error = function (...args) {
        capturedLogs.push({message: args.join(' '), timestamp: Date.now(), level: 'error'});
        originalConsoleError.apply(console, args);
    };

    async function fetchCodeLine(fileUrl, lineNumber) {
        try {
            const response = await fetch(fileUrl);
            const text = await response.text();
            const lines = text.split('\n');
            return lines[lineNumber - 1].trim();  // Adjust because line numbers usually start from 1
        } catch (error) {
            console.error('Failed to fetch the source file:', error);
            return '';
        }
    }
    // Function to handle and log errors
    window.onerror = function (message, source, lineno, colno, error) {
        if (error && error.stack) {
            const stackLines = error.stack.split('\n');
            if (stackLines.length > 1) {
                // Assuming the error format is typical and the second line usually contains the error occurrence
                const match = /:(\d+):(\d+)/.exec(stackLines[1]);
                if (match) {
                    const fetchLine = parseInt(match[1], 10);
                    fetchCodeLine(source, fetchLine).then(line => {
                        capturedLogs.push({
                            message, url: source, line: lineno, column: colno, stack: error.stack, codeLine: line, timestamp: Date.now(), level: 'error'
                        });
                    });
                }
            }
        } else {
            const sourceLine = getSourceLine();
            capturedLogs.push({message, url: source, line: lineno, column: colno, stack: error ? error.stack : null, timestamp: Date.now(), level: 'error', codeLine: sourceLine});
        }
    };

    // Expose method to retrieve logs
    window.addEventListener('message', function (event) {
        if (event.source === window && event.data.type === 'GET_CAPTURED_LOGS') {
            window.postMessage({type: 'CAPTURED_LOGS', logs: capturedLogs}, '*');
        }
    });
})();