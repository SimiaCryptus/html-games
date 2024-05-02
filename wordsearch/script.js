// Constants
const gridSize = 10; // 10x10 grid
const words = ['hello', 'world', 'javascript', 'game']; // Words to find
let selectedCells = [];
let score = 0;
let gameTimer;
let timeRemaining = 300; // 5 minutes in seconds

// Elements
const gameBoard = document.getElementById('game-board');
const submitWordButton = document.getElementById('submit-word'); // Correcting the ID to match HTML
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const newGameButton = document.getElementById('new-game'); // Adding missing element reference

// Initialize the game
function initializeGame() {
    gameBoard.innerHTML = '';
    createGrid();
    placeWords();
    updateTimerDisplay();
    score = 0;
    updateScoreDisplay();
    clearInterval(gameTimer);
    timeRemaining = 300;
    displayWordList();
}

function displayWordList() {
    const wordList = document.getElementById('word-list-ul');
    wordList.innerHTML = '';
    words.forEach(word => {
        const listItem = document.createElement('li');
        listItem.textContent = word;
        wordList.appendChild(listItem);
    });
}

// Create the grid
function createGrid() {
    for (let i = 0; i < gridSize; i++) {
        const row = document.createElement('div');
        row.className = 'row';
        for (let j = 0; j < gridSize; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', () => selectCell(cell));
            row.appendChild(cell);
        }
        gameBoard.appendChild(row);
    }
}

// Place words in the grid
function placeWords() {
    const gridCells = Array.from(gameBoard.children).flatMap(row => Array.from(row.children));
    words.forEach(word => {
        let placed = false;
        while (!placed) {
            const direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';
            const startX = Math.floor(Math.random() * (gridSize - (direction === 'horizontal' ? word.length : 0)));
            const startY = Math.floor(Math.random() * (gridSize - (direction === 'vertical' ? word.length : 0)));
            let canPlace = true;
            for (let i = 0; i < word.length; i++) {
                const cellIndex = direction === 'horizontal'
                    ? startY * gridSize + startX + i
                    : (startY + i) * gridSize + startX;
                if (gridCells[cellIndex].textContent) {
                    canPlace = false;
                    break;
                }
            }
            if (canPlace) {
                for (let i = 0; i < word.length; i++) {
                    const cellIndex = direction === 'horizontal'
                        ? startY * gridSize + startX + i
                        : (startY + i) * gridSize + startX;
                    gridCells[cellIndex].textContent = word[i].toUpperCase();
                }
                placed = true;
            }
        }
    });
    // Fill remaining empty cells with random letters
    gridCells.forEach(cell => {
        if (!cell.textContent) {
            cell.textContent = String.fromCharCode(Math.floor(Math.random() * 26) + 65);
        }
    });
}

// Handle cell selection
function selectCell(cell) {
    cell.classList.toggle('selected');
    selectedCells.push(cell);
    if (selectedCells.length > 1) {
        const lastCell = selectedCells[selectedCells.length - 2];
        if (Math.abs(lastCell.dataset.row - cell.dataset.row) > 1 || Math.abs(lastCell.dataset.col - cell.dataset.col) > 1) {
            alert('Cells must be adjacent!');
            selectedCells.pop();
            cell.classList.toggle('selected');
        }
    }
}

// Check the formed word
function checkWord() {
    const formedWord = selectedCells.map(cell => cell.textContent).join('');
    if (words.includes(formedWord.toLowerCase())) {
        score += formedWord.length * 10; // 10 points per letter
        selectedCells.forEach(cell => cell.classList.add('correct'));
        alert('Correct!');
        const wordListItem = document.querySelector(`#word-list-ul li:nth-child(${words.indexOf(formedWord.toLowerCase()) + 1})`);
        wordListItem.classList.add('found');
        words.splice(words.indexOf(formedWord.toLowerCase()), 1); // Remove the found word from the list
    } else {
        alert('Try again!');
    }
    selectedCells.forEach(cell => cell.classList.remove('selected'));
    selectedCells = [];
    updateScoreDisplay();
}

// Update the score display
function updateScoreDisplay() {
    scoreDisplay.textContent = `Score: ${score}`;
}

// Timer functionality
function startTimer() {
    gameTimer = setInterval(() => {
        if (timeRemaining > 0) {
            timeRemaining--;
            updateTimerDisplay();
        } else {
            clearInterval(gameTimer);
            alert('Time up! Game over!');
        }
    }, 1000);
}

// Update timer display
function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    timerDisplay.textContent = `Time: ${minutes}:${seconds.toString().padStart(2, '0')}`;
}

newGameButton.addEventListener('click', () => {
    initializeGame();
    clearInterval(gameTimer);
    timeRemaining = 300;
    startTimer();
});

submitWordButton.addEventListener('click', checkWord);

// Initialize on load
document.addEventListener('DOMContentLoaded', initializeGame);