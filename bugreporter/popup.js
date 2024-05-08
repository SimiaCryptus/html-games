document.getElementById('generate-report-btn').addEventListener('click', function () {
    const selectedFormat = document.getElementById('report-format').value;
    console.log('Selected format:', selectedFormat);
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "GET_CAPTURED_LOGS"}, function (response) {
            console.log('Report generation initiated:', response)
        });
document.getElementById('copy-to-clipboard-btn').addEventListener('click', function () {
    const reportOutput = document.getElementById('report-output');
    reportOutput.select();
    document.execCommand('copy');
});
    });
});

function generateMarkdownReport(logs) {
    let markdown = `# Log Capture\n\n`;
    markdown += `Generated on: ${new Date().toLocaleString()}\n\n`;
    logs.forEach((log, index) => {
        const timeString = new Date(log.timestamp).toLocaleTimeString();
        markdown += `Error at ${timeString}: ${log.message}\n`;
        if(log.url) {
            const urlParts = log.url.split('/');
            const fileName = urlParts[urlParts.length - 1];
            if (log.line) markdown += `  File: ${fileName}:${log.line};\n`;
        }
        if (log.codeLine) markdown += `  CodeLine: ${log.codeLine};\n`;
        if (log.stack) {
            const simplifiedStack = log.stack.split('\n').map(s => s.trim()).join('\n    ');
            markdown += `  Stack: ${simplifiedStack};\n`;
        }
        markdown += `\n`;
    });
    return markdown;
}

// Corrected method to addListener for listening to specific commands
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === 'LOGS_RECEIVED') {
        const markdownReport = generateMarkdownReport(request.logs);
        console.log(markdownReport);
        if (markdownReport) {
            document.getElementById('report-output').value = markdownReport;
        } else {
            document.getElementById('report-output').value = 'No report available.';
        }
    }
    return true;  // Required to use sendResponse asynchronously
});