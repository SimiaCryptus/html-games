# PowerShell script to build and run the project

# Function to check if a command exists
function CommandExists {
    param (
        [string]$command
    )
    $commandPath = (Get-Command $command -ErrorAction SilentlyContinue)
    return $commandPath -ne $null
}

# Check if Node.js is installed
if (-not (CommandExists "node")) {
    Write-Host "Node.js is not installed. Please install Node.js from https://nodejs.org/"
    exit 1
}

# Check if npm is installed
if (-not (CommandExists "npm")) {
    Write-Host "npm is not installed. Please install npm from https://www.npmjs.com/get-npm"
    exit 1
}

# Install dependencies
Write-Host "Installing dependencies..."
npm install

# Build the project
Write-Host "Building the project..."
 npm run clean
npm run build

# Start the development server
Write-Host "Starting the development server..."
npm start