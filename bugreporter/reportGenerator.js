// Script to format logs and errors into markdown format

/**
 * Generates a markdown formatted error report from an array of log objects.
 * @param {Array} logs - Array of log objects with properties message, url, line, and timestamp.
 * @returns {string} - Markdown formatted string.
 */
function generateMarkdownReport(logs) {
    let markdown = `# Error Report\n\n`;
    markdown += `Generated on: ${new Date().toLocaleString()}\n\n`;
    logs.forEach((log, index) => {
        markdown += `### Error ${index + 1}\n`;
        markdown += `**Message:** ${log.message}\n`;
        markdown += `**URL:** ${log.url}\n`;
        markdown += `**Line:** ${log.line}\n`;
        markdown += `**Stack Trace:** ${log.stack || 'N/A'}\n`;
        markdown += `**Timestamp:** ${new Date(log.timestamp).toLocaleString()}\n\n`;
    });
    return markdown;
}

 export { generateMarkdownReport };