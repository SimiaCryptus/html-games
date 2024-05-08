// Content script to capture errors and logs from web pages

// Inject script file to capture console logs
const script = document.createElement('script');
script.src = chrome.runtime.getURL('captureConsole.js');
script.type = 'module';
document.documentElement.appendChild(script);



// Listen for logs from the page context
window.addEventListener('message', function(event) {
    if (event.source === window && event.data.type === 'CAPTURED_LOGS') {
        chrome.runtime.sendMessage({type: 'LOGS_RECEIVED', logs: event.data.logs});
    }
});


// Corrected method to addListener for listening to specific commands
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if(request.action === 'GET_CAPTURED_LOGS') {
        window.postMessage({ type: 'GET_CAPTURED_LOGS' }, '*');
    }
    return true;  // Required to use sendResponse asynchronously
});