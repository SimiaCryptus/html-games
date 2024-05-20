document.addEventListener('DOMContentLoaded', () => {
    const newGameButton = document.getElementById('new-game');
    const resetGameButton = document.getElementById('reset-game');
    const pits = document.querySelectorAll('.pit, .store');

    newGameButton.addEventListener('click', startNewGame);
    resetGameButton.addEventListener('click', resetGame);

    pits.forEach(pit => {
        pit.addEventListener('click', handlePitClick);
    });

    startNewGame();
});

function startNewGame() {
    // Initialize game state
    initializeGameState();
    updateGameBoard();
    updateGameStatus();
}

function resetGame() {
    // Reset game state
    initializeGameState();
    updateGameBoard();
    updateGameStatus();
}

function handlePitClick(event) {
    const pitId = event.target.id;
    // Handle the game logic for a pit click
    processMove(pitId);
    updateGameBoard();
    updateGameStatus();
}

function updateGameBoard() {
    const pits = document.querySelectorAll('.pit');
    const store1 = document.getElementById('store-1');
    const store2 = document.getElementById('store-2');

    pits.forEach((pit, index) => {
        pit.innerHTML = '';
        const stoneCount = gameState.pits[index];
        for (let i = 0; i < stoneCount; i++) {
            const stone = document.createElement('img');
            stone.src = 'stone.png';
            stone.classList.add('stone');
            pit.appendChild(stone);
        }
    });

    store1.innerHTML = '';
    for (let i = 0; i < gameState.stores[0]; i++) {
        const stone = document.createElement('img');
        stone.src = 'stone.png';
        stone.classList.add('stone');
        store1.appendChild(stone);
    }

    store2.innerHTML = '';
    for (let i = 0; i < gameState.stores[1]; i++) {
        const stone = document.createElement('img');
        stone.src = 'stone.png';
        stone.classList.add('stone');
        store2.appendChild(stone);
    }
}

function updateGameStatus() {
    const playerTurn = document.getElementById('player-turn');
    const gameStatus = document.getElementById('game-status');

    if (gameState.gameOver) {
        gameStatus.textContent = `Game Over! Player ${gameState.winner} wins!`;
    } else {
        playerTurn.textContent = `Player ${gameState.currentPlayer}'s Turn`;
        gameStatus.textContent = '';
    }
}