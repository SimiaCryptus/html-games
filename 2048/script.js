// File: script.js
let squares = []; // Declare squares at the global scope
let score = 0; // Initialize score at the global scope
let prevState = null;


document.addEventListener('DOMContentLoaded', () => {
    const gridDisplay = document.querySelector('#game-board');
    const scoreDisplay = document.querySelector('#score');
    const newGameButton = document.querySelector('#new-game-button');
    const backButton = document.querySelector('#back-button');
    const resultDisplay = document.querySelector('#game-over-message');
    const width = 4;
    score = loadGameState() ? loadGameState().score : 0; // Use the global score variable
    // If NaN, set score to 0
    if (isNaN(score)) {
        score = 0;
    }
    let touchStartPos = {x: 0, y: 0};
    let touchEndPos = {x: 0, y: 0};

    function saveGameState() {
        const state = {
            score: score,
            tiles: squares.map(square => square.innerHTML),
            prevState: prevState
        };
        console.log('Saving state:', state);  // Add this line for debugging
        localStorage.setItem('gameState', JSON.stringify(state));
    }

    function loadGameState() {
        const saved = localStorage.getItem('gameState');
        return saved ? JSON.parse(saved) : null;
    }

    function handleTouchStart(e) {
        touchStartPos.x = e.touches[0].clientX;
        touchStartPos.y = e.touches[0].clientY;
    }

    function handleTouchMove(e) {
        // Prevent the default scrolling behavior for swipe gestures
        e.preventDefault();
    }

    function handleTouchEnd(e) {
        touchEndPos.x = e.changedTouches[0].clientX;
        touchEndPos.y = e.changedTouches[0].clientY;
        handleSwipeGesture();
    }

    function handleSwipeGesture() {
        const dx = touchEndPos.x - touchStartPos.x;
        const dy = touchEndPos.y - touchStartPos.y;
        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);

        if (Math.max(absDx, absDy) > 30) { // Threshold to determine a swipe
            if (absDx > absDy) {
                // Horizontal swipe
                if (dx > 0) {
                    savePrevState();
                    keyRight();
                } else {
                    savePrevState();
                    keyLeft();
                }
            } else {
                // Vertical swipe
                if (dy > 0) {
                    savePrevState();
                    keyDown();
                } else {
                    savePrevState();
                    keyUp();
                }
            }
            saveGameState();
        }
    }

    // Update the tile's visibility and class based on its value
    function updateTile(tile) {
        const value = parseInt(tile.innerHTML);
        tile.className = 'tile'; // Reset class
        if (value > 0) {
            tile.classList.add(`tile-${value}`);
            tile.innerHTML = value;
        } else {
            console.log('No previous state found');  // Log if no previous state exists
            tile.innerHTML = ' '; // Use empty string for zero value
        }
        tile.style.transform = 'translate(0, 0)'; // Reset position after animation
    }

    // Create a playing board
    function createBoard() {
        const savedState = loadGameState();
        for (let i = 0; i < width * width; i++) {
            let square = document.createElement('div');
            square.innerHTML = savedState ? savedState.tiles[i] : ' ';
            square.classList.add('tile'); // Add tile class to all squares
            updateTile(square);
            gridDisplay.appendChild(square);
            squares.push(square);
        }
        if (!savedState) {
            generate();
            generate();
        }
    }


    // Modify the generate function to update tiles after setting the value
    function generate() {
        const emptySquares = squares.filter(square => square.innerHTML == ' ');
        if (emptySquares.length > 0) {
            let randomNumber = Math.floor(Math.random() * emptySquares.length);
            emptySquares[randomNumber].innerHTML = 2;
            updateTile(emptySquares[randomNumber]);
            checkForGameOver();
        }
    }

    // Combine rows
    function combineRow() {
        let combined = false;
        for (let i = 0; i < 15; i++) {
            if (squares[i].innerHTML === squares[i + 1].innerHTML) {
                let combinedTotal = parseInt(squares[i].innerHTML) + parseInt(squares[i + 1].innerHTML);
                squares[i].innerHTML = combinedTotal;
                squares[i + 1].innerHTML = ' ';
                // If NaN, set score to 0
                if (isNaN(combinedTotal)) {
                    combinedTotal = 0;
                }
                score = isNaN(score) ? 0 : score;
                if (!isNaN(combinedTotal)) {
                    score += combinedTotal;
                }
                scoreDisplay.innerHTML = score;
                combined = true;
            }
        }
        checkForWin();
        return combined;
    }

    function moveTiles(direction, tiles) {
        tiles.forEach(tile => {
            tile.classList.add(`move-${direction}`);
            setTimeout(() => {
                tile.classList.remove(`move-${direction}`);
            }, 150); // Match the duration of the CSS transition
        });
    }

    function keyLeft() {
        if (moveLeft() || combineRow()) {
            combineRow();
            movedTiles = moveLeft();
            moveTiles('left', movedTiles);
            generate();
        }
    }

    function keyUp() {
        if (moveUp() || combineColumn()) {
            combineColumn();
            movedTiles = moveUp();
            moveTiles('up', movedTiles);
            generate();
        }
    }

    function keyDown() {
        if (moveDown() || combineColumn()) {
            combineColumn();
            movedTiles = moveDown();
            moveTiles('down', movedTiles);
            generate();
        }
    }

    function combineColumn() {
        let combined = false;
        // Logic for combining columns
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 12; j += 4) {
                let current = i + j;
                let next = current + 4;
                if (squares[current].innerHTML !== '' && squares[current].innerHTML === squares[next].innerHTML) {
                    let combinedTotal = parseInt(squares[current].innerHTML) * 2;
                    squares[current].innerHTML = combinedTotal;
                    squares[next].innerHTML = ' ';
                    score += isNaN(combinedTotal) ? 0 : parseInt(combinedTotal);
                    scoreDisplay.innerHTML = score;
                    updateTile(squares[current]);
                    updateTile(squares[next]);
                    combined = true;
                }
            }
        }
        return combined;
    }


    function moveLeft() {
        let moved = false;
        // Logic for moving tiles left
        for (let i = 0; i < 16; i++) {
            if (i % 4 === 0) {
                let row = [squares[i], squares[i + 1], squares[i + 2], squares[i + 3]];
                let filteredRow = row.map(square => parseInt(square.innerHTML) || 0).filter(val => val);
                let missing = 4 - filteredRow.length;
                let zeros = Array(missing).fill(0);
                let newRow = filteredRow.concat(zeros);
                newRow.forEach((newVal, index) => {
                    if (row[index].innerHTML != newVal) moved = true;
                    row[index].innerHTML = newVal;
                    updateTile(row[index]);
                });
            }
        }
        return moved;
    }

    function moveUp() {
        let moved = false;
        // Logic for moving tiles up
        for (let i = 0; i < 4; i++) {
            let column = [squares[i], squares[i + width], squares[i + width * 2], squares[i + width * 3]];
            let filteredColumn = column.map(square => parseInt(square.innerHTML) || 0).filter(val => val);
            let missing = 4 - filteredColumn.length;
            let zeros = Array(missing).fill(0);
            let newColumn = filteredColumn.concat(zeros);
            newColumn.forEach((newVal, index) => {
                if (column[index].innerHTML != newVal) moved = true;
                column[index].innerHTML = newVal;
                updateTile(column[index]);
            });
        }
        return moved;
    }

    function moveDown() {
        let moved = false;
        // Logic for moving tiles down
        for (let i = 0; i < 4; i++) {
            let column = [squares[i], squares[i + width], squares[i + width * 2], squares[i + width * 3]];
            let filteredColumn = column.map(square => parseInt(square.innerHTML) || 0).filter(val => val);
            let missing = 4 - filteredColumn.length;
            let zeros = Array(missing).fill(0);
            let newColumn = zeros.concat(filteredColumn);
            newColumn.forEach((newVal, index) => {
                if (column[index].innerHTML != newVal) moved = true;
                column[index].innerHTML = newVal;
                updateTile(column[index]);
            });
        }
        return moved;
    }

// Swipe right
    function moveRight() {
        let moved = false;
        // Logic for moving tiles right
        for (let i = 0; i < 16; i++) {
            if (i % 4 === 0) {
                let row = [squares[i], squares[i + 1], squares[i + 2], squares[i + 3]];
                let filteredRow = row.map(square => parseInt(square.innerHTML) || 0).filter(val => val);
                let missing = 4 - filteredRow.length;
                let zeros = Array(missing).fill(0);
                let newRow = zeros.concat(filteredRow);
                newRow.forEach((newVal, index) => {
                    if (row[index].innerHTML != newVal) moved = true;
                    row[index].innerHTML = newVal;
                    updateTile(row[index]);
                });
            }
        }
        return moved;
    }


    // Assign keycodes
    function control(e) {
        if (e.key === 'ArrowRight') {
            savePrevState();
            keyRight();
        } else if (e.key === 'ArrowLeft') {
            savePrevState();
            keyLeft();
        } else if (e.key === 'ArrowUp') {
            savePrevState();
            keyUp();
        } else if (e.key === 'ArrowDown') {
            savePrevState();
            keyDown();
        }
        saveGameState();
    }

    function savePrevState() {
        prevState = {
            score: score,
            tiles: squares.map(square => square.innerHTML),
            gameOver: resultDisplay.innerHTML !== ''
        };
    }

    document.addEventListener('keyup', control);
    gridDisplay.addEventListener('touchstart', handleTouchStart, {passive: false});
    gridDisplay.addEventListener('touchmove', handleTouchMove, {passive: false});
    gridDisplay.addEventListener('touchend', handleTouchEnd);

    function keyRight() {
        if (moveRight() || combineRow()) {
            combineRow();
            movedTiles = moveRight();
            moveTiles('up', movedTiles);
            generate();
        }
    }

    // Check for the number 2048 in the squares to win
    function checkForWin() {
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].innerHTML == 2048) {
                resultDisplay.innerHTML = 'You Win!';
                saveGameState();
                resultDisplay.innerHTML = prevState.gameOver ? 'Game Over' : '';
                document.addEventListener('keyup', control);
            }
        }
    }

    // Check if there are no zeros on the board to lose
    function checkForGameOver() {
        let zeros = 0;
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].innerHTML == 0) {
                zeros++;
            }
        }
        if (zeros === 0) {
            resultDisplay.innerHTML = 'Game Over';
            saveGameState();
            document.removeEventListener('keyup', control);
        }
    }

    newGameButton.addEventListener('click', () => {
        localStorage.removeItem('gameState');
        location.reload();
    });

    backButton.addEventListener('click', () => {
        console.log('Back button clicked');  // Log when the button is clicked
        if (prevState) {
            console.log('Previous state exists:', prevState);  // Log the previous state if it exists
            console.log('Loading previous state:', prevState);  // Add this line for debugging
            squares.forEach((square, index) => {
                square.innerHTML = prevState.tiles[index] === '0' ? ' ' : prevState.tiles[index];
                updateTile(square);
            });
            score = prevState.score;
            scoreDisplay.innerHTML = score;
            resultDisplay.innerHTML = prevState.gameOver ? 'Game Over' : '';
            if (prevState.gameOver) {
                document.removeEventListener('keyup', control);
            } else {
                document.addEventListener('keyup', control);
            }
            prevState = null;
        }
    });

    gridDisplay.addEventListener('click', () => {
        document.addEventListener('keyup', control);
    });
    createBoard();
});