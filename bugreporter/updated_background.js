chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.type === 'LOGS_RECEIVED' && message.logs.some(log => log.level === 'error')) {
        chrome.browserAction.setIcon({path: "error_icon.png", tabId: sender.tab.id});
    } else {
        chrome.browserAction.setIcon({path: "normal_icon.png", tabId: sender.tab.id});
    }
});