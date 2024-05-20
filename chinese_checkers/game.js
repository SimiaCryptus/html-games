document.addEventListener('DOMContentLoaded', () => {
    const playerCountSelect = document.getElementById('player-count');
    const startGameButton = document.getElementById('start-game');
    const resetGameButton = document.getElementById('reset-game');
    const boardContainer = document.getElementById('board-container');
    const boardCanvas = document.getElementById('board');
    const ctx = boardCanvas.getContext('2d');

    let gameState = {
        playerCount: 0,
        currentPlayer: 1,
        pieces: [],
        board: []
    };

    startGameButton.addEventListener('click', startGame);
    resetGameButton.addEventListener('click', resetGame);

    function startGame() {
        const playerCount = parseInt(playerCountSelect.value);
        initializeBoard(playerCount);
    }

    function resetGame() {
        ctx.clearRect(0, 0, boardCanvas.width, boardCanvas.height);
        drawBoard();
        gameState = {
            playerCount: 0,
            currentPlayer: 1,
            pieces: [],
            board: []
        };
    }

    function initializeBoard(playerCount) {
        resetGame();
        gameState.playerCount = playerCount;

        for (let i = 1; i <= playerCount; i++) {
            addPlayerPieces(i);
        }

        // Initialize board state
        gameState.board = createEmptyBoard();
    }

    function drawBoard() {
        // Draw the hexagonal grid for the Chinese Checkers board
        const hexRadius = 20;
        const hexHeight = Math.sqrt(3) * hexRadius;
        const hexWidth = 2 * hexRadius;
        const hexVerticalSpacing = hexHeight * 3 / 4;

        const boardWidth = 17;
        const boardHeight = 17;

        ctx.strokeStyle = '#000';
        for (let row = 0; row < boardHeight; row++) {
            for (let col = 0; col < boardWidth; col++) {
                if (isValidHex(row, col)) {
                    const x = col * hexWidth * 3 / 4 + (row % 2) * hexWidth / 2 + hexRadius;
                    const y = row * hexVerticalSpacing + hexRadius;
                    drawHexagon(x, y, hexRadius);
                }
            }
        }
    }

    function isValidHex(row, col) {
        // Define the valid hexagon positions for a Chinese Checkers board
        const validHexes = [
            [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0],
            [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
            [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
            [0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0]
        ];
        return validHexes[row] && validHexes[row][col];
    }

    function drawHexagon(x, y, radius) {
        const angle = Math.PI / 3;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            ctx.lineTo(x + radius * Math.cos(angle * i), y + radius * Math.sin(angle * i));
        }
        ctx.closePath();
        ctx.stroke();
    }

    function addPlayerPieces(playerNumber) {
        const positions = getPlayerStartPositions(playerNumber);
        positions.forEach(pos => {
            const piece = document.createElement('div');
            piece.classList.add('piece', `player${playerNumber}`);
            piece.style.left = `${pos.x}px`;
            piece.style.top = `${pos.y}px`;
            piece.dataset.player = playerNumber;
            piece.dataset.x = pos.x;
            piece.dataset.y = pos.y;
            piece.addEventListener('click', () => selectPiece(piece));
            boardContainer.appendChild(piece);
            gameState.pieces.push(piece);
        });
    }

    function getPlayerStartPositions(playerNumber) {
        // Placeholder positions for each player
        // Actual positions need to be calculated based on the board layout
        const positions = {
            1: [{x: 180, y: 60}, {x: 200, y: 80}, {x: 220, y: 100}],
            2: [{x: 380, y: 60}, {x: 400, y: 80}, {x: 420, y: 100}],
            3: [{x: 180, y: 460}, {x: 200, y: 480}, {x: 220, y: 500}],
            4: [{x: 380, y: 460}, {x: 400, y: 480}, {x: 420, y: 500}],
            5: [{x: 280, y: 60}, {x: 300, y: 80}, {x: 320, y: 100}],
            6: [{x: 280, y: 460}, {x: 300, y: 480}, {x: 320, y: 500}]
        };
        return positions[playerNumber] || [];
    }

    function createEmptyBoard() {
        // Create a 2D array representing the board state
        const board = Array.from({length: 13}, () => Array(13).fill(null));
        return board;
    }

    function selectPiece(piece) {
        // Handle piece selection and movement
        const player = parseInt(piece.dataset.player);
        if (player !== gameState.currentPlayer) {
            alert(`It's player ${gameState.currentPlayer}'s turn!`);
            return;
        }

        // Highlight selected piece and show possible moves
        highlightPiece(piece);
        showPossibleMoves(piece);
    }

    function highlightPiece(piece) {
        // Remove highlight from all pieces
        gameState.pieces.forEach(p => p.classList.remove('highlighted'));
        // Highlight the selected piece
        piece.classList.add('highlighted');
    }

    function showPossibleMoves(piece) {
        // Calculate and display possible moves for the selected piece
        const x = parseInt(piece.dataset.x);
        const y = parseInt(piece.dataset.y);
        const possibleMoves = calculatePossibleMoves(x, y);

        possibleMoves.forEach(move => {
            const moveIndicator = document.createElement('div');
            moveIndicator.classList.add('move-indicator');
            moveIndicator.style.left = `${move.x}px`;
            moveIndicator.style.top = `${move.y}px`;
            moveIndicator.addEventListener('click', () => movePiece(piece, move.x, move.y));
            boardContainer.appendChild(moveIndicator);
        });
    }

    function calculatePossibleMoves(x, y) {
        // Placeholder for move calculation logic
        // Actual logic needs to consider board boundaries and existing pieces
        return [
            {x: x + 20, y: y},
            {x: x - 20, y: y},
            {x: x, y: y + 20},
            {x: x, y: y - 20}
        ];
    }

    function movePiece(piece, newX, newY) {
        // Move the piece to the new position
        piece.style.left = `${newX}px`;
        piece.style.top = `${newY}px`;
        piece.dataset.x = newX;
        piece.dataset.y = newY;

        // Update the game state
        updateGameState(piece, newX, newY);

        // Switch to the next player
        gameState.currentPlayer = (gameState.currentPlayer % gameState.playerCount) + 1;
    }

    function updateGameState(piece, newX, newY) {
        // Update the board state and piece positions
        const oldX = parseInt(piece.dataset.x);
        const oldY = parseInt(piece.dataset.y);
        gameState.board[oldY][oldX] = null;
        gameState.board[newY][newX] = piece;
    }

    // Draw the initial board
    drawBoard();
});