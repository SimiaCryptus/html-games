let gameState;

function initializeGameState() {
    gameState = {
        pits: Array(12).fill(4), // 12 pits with 4 stones each
        stores: [0, 0], // Two stores, one for each player
        currentPlayer: 1, // Player 1 starts
        gameOver: false
    };
}

function processMove(pitId) {
    if (gameState.gameOver) return;

    const pitIndex = parseInt(pitId.split('-')[1]) - 1;
    const player = pitIndex < 6 ? 1 : 2;

    // Check if the pit belongs to the current player
    if (gameState.currentPlayer !== player) return;

    let stones = gameState.pits[pitIndex];
    gameState.pits[pitIndex] = 0;

    let currentIndex = pitIndex;
    while (stones > 0) {
        currentIndex = (currentIndex + 1) % 14;

        // Skip opponent's store
        if ((currentIndex === 6 && gameState.currentPlayer === 2) || (currentIndex === 13 && gameState.currentPlayer === 1)) {
            continue;
        }

        if (currentIndex < 12) {
            gameState.pits[currentIndex]++;
        } else {
            gameState.stores[gameState.currentPlayer - 1]++;
        }

        stones--;
    }

    // Check for capture
    if (currentIndex < 12 && gameState.pits[currentIndex] === 1 && Math.floor(currentIndex / 6) === gameState.currentPlayer - 1) {
        const oppositeIndex = 11 - currentIndex;
        gameState.stores[gameState.currentPlayer - 1] += gameState.pits[oppositeIndex] + 1;
        gameState.pits[currentIndex] = 0;
        gameState.pits[oppositeIndex] = 0;
    }

    // Check for extra turn
    if ((currentIndex === 6 && gameState.currentPlayer === 1) || (currentIndex === 13 && gameState.currentPlayer === 2)) {
        return;
    }

    // Switch player
    gameState.currentPlayer = gameState.currentPlayer === 1 ? 2 : 1;

    checkGameEnd();
}

function checkGameEnd() {
    const player1Pits = gameState.pits.slice(0, 6);
    const player2Pits = gameState.pits.slice(6, 12);

    if (player1Pits.every(pit => pit === 0) || player2Pits.every(pit => pit === 0)) {
        gameState.gameOver = true;

        // Move remaining stones to the respective stores
        gameState.stores[0] += player1Pits.reduce((a, b) => a + b, 0);
        gameState.stores[1] += player2Pits.reduce((a, b) => a + b, 0);

        gameState.pits.fill(0);

        // Determine the winner
        if (gameState.stores[0] > gameState.stores[1]) {
            gameState.winner = 1;
        } else if (gameState.stores[1] > gameState.stores[0]) {
            gameState.winner = 2;
        } else {
            gameState.winner = 'draw';
        }
    }
}

function getGameState() {
    return gameState;
}