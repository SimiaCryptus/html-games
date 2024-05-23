// Import necessary modules
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

// Initialize Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Initialize WebSocket Server
const wss = new WebSocket.Server({ server });

// Game state and utility functions
let games = {}; // Stores game state for each session
let gameID = 0; // Unique identifier for each game session

// Function to create a new game session
function createGame() {
    let newGameID = ++gameID;
    games[newGameID] = {
        players: [],
        state: {
            // Initial game state
        }
    };
    return newGameID;
}

// WebSocket connection handler
wss.on('connection', function connection(ws) {
    let assignedGameID = createGame(); // Assign a new game session for each connection
    games[assignedGameID].players.push(ws);

    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
        let parsedMessage = JSON.parse(message);

        // Handle different types of messages
        switch (parsedMessage.type) {
            case 'move':
                // Process player move
                handlePlayerMove(assignedGameID, parsedMessage);
                break;
            case 'join':
                // Handle new player joining
                handlePlayerJoin(assignedGameID, ws);
                break;
            // Add more cases as needed
        }
    });

    ws.on('close', function() {
        // Handle player disconnection
        handlePlayerDisconnect(assignedGameID, ws);
    });
});

// Function to handle player moves
function handlePlayerMove(gameID, moveData) {
    // Update game state based on the move
    // Broadcast updated state to all players
    games[gameID].players.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                type: 'update',
                state: games[gameID].state
            }));
        }
    });
}

// Function to handle new player joining
function handlePlayerJoin(gameID, ws) {
    // Add player to the game session
    console.log(`Player joined game ${gameID}`);
}

// Function to handle player disconnection
function handlePlayerDisconnect(gameID, ws) {
    // Remove player from the game session
    console.log(`Player left game ${gameID}`);
    games[gameID].players = games[gameID].players.filter(player => player !== ws);
}

// Start the server
server.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});