# Markdown Error Reporter - Chrome Extension

The Markdown Error Reporter is a Chrome extension that captures errors and console logs from web pages and generates error reports in markdown format. This extension is designed to assist developers in debugging and troubleshooting web applications.

## Features

- Captures errors and console logs from web pages
- Generates error reports in markdown format
- Provides a popup interface to generate reports on demand
- Supports capturing bug report URLs from meta tags
- Offers customizable report formats (markdown or plain text)

## Installation

1. Clone the repository or download the source code.
2. Open Google Chrome and navigate to `chrome://extensions`.
3. Enable "Developer mode" using the toggle switch in the top right corner.
4. Click on "Load unpacked" and select the directory containing the extension source code.
5. The Markdown Error Reporter extension should now be installed and visible in the extensions list.

## Usage

1. Navigate to a web page where you want to capture errors and logs.
2. Click on the Markdown Error Reporter extension icon in the Chrome toolbar to open the popup.
3. Click on the "Generate Report" button to capture the current errors and logs.
4. The generated report will be displayed in the popup window.
5. You can copy the report and use it for debugging or sharing with others.

## Configuration

- The extension captures errors and logs by default. If you want to customize the captured data, you can modify the `captureConsole.js` file.
- The bug report URL is captured from the `<meta name="bug-report-url">` tag on the web page. Make sure to include this meta tag with the appropriate URL if you want to include it in the generated report.
- The extension supports two report formats: markdown (default) and plain text. You can select the desired format using the dropdown in the popup.

## File Structure

- `manifest.json`: The extension manifest file that defines the extension's properties, permissions, and components.
- `background.js`: The background script that handles the extension's background tasks and message passing.
- `content.js`: The content script that runs in the context of web pages and captures errors and logs.
- `captureConsole.js`: The script injected into web pages to capture console logs.
- `popup.html`: The HTML file for the extension's popup interface.
- `popup.js`: The JavaScript file that handles the popup functionality and generates reports.
- `popup.css`: The CSS file for styling the popup interface.
- `reportGenerator.js`: The script that formats the captured logs and errors into markdown or plain text format.

## Development

1. Make changes to the extension's source code files as needed.
2. Test the extension by loading it in Chrome as an unpacked extension.
3. Use the Chrome Developer Tools to debug and inspect the extension's behavior.
4. Iterate on the code and test until the desired functionality is achieved.

## Contributions

Contributions to the Markdown Error Reporter extension are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request on the GitHub repository.

## License

This extension is open-source and released under the Apache License 2.0. You are free to use, modify, and distribute the code as needed. For more details, please refer to the [LICENSE](../LICENSE) file.

