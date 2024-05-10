// Data structure to hold questions and answers
let categories = {}; // Initialize empty object for categories

// Function to update the scoreboard
function updateScoreBoard() {
    const scoreBoard = document.getElementById('scoreBoard');
    scoreBoard.innerHTML = ''; // Clear existing scoreboard content
    players.forEach((player, index) => {
        const playerScore = document.createElement('div');
        playerScore.id = `playerScore${index}`;
        playerScore.innerHTML = `Player ${index + 1}: <span>${player.score}</span>`;
        scoreBoard.appendChild(playerScore);
    });
    highlightCurrentPlayer();
}

// Function to highlight the current player
function highlightCurrentPlayer() {
    players.forEach((player, index) => {
        const playerScore = document.getElementById(`playerScore${index}`);
        if (index === currentPlayerIndex) {
           playerScore.classList.add('current-player');
           playerScore.style.backgroundColor = '#4CAF50'; // Green background for clarity
        } else {
           playerScore.classList.remove('current-player');
           playerScore.style.backgroundColor = ''; // Revert to default
        }
    });
}


function setupPlayers() {
    const numPlayers = document.getElementById('numPlayers').value;
    players = Array.from({length: numPlayers}, () => ({score: 0}));
    initGame();
    document.getElementById('playerSetup').style.display = 'none';
    document.getElementById('gameBoard').style.display = 'block';
    updateScoreBoard(); // Initialize the scoreboard
    log("updateScoreBoard function is not defined. Please implement if needed.");
};

let currentScore = 0;
let currentQuestion = null;
let players = [];
let currentPlayerIndex = 0;

function log(message) {
    console.log(`[Jeopardy] ${message}`);
}

// Initialize game board
function initGame() {
   fetch('questions.json')
        .then(response => response.json())
        .then(data => {
            categories = data;
            buildGameBoard();
        })
        .catch(error => log("Failed to load questions: " + error));
    // Moved the existing game board setup into a new function
}

function buildGameBoard() {
    if (document.getElementById('gameBoard').children.length > 0) {
        log("Game board already initialized.");
        return; // Prevent re-initialization if already set up
    }
    const board = document.getElementById('gameBoard');
    for (const category in categories) {
        const column = document.createElement('div');
        column.className = 'category-column';
        const header = document.createElement('div');
        header.className = 'category-header';
        header.textContent = category;
        column.appendChild(header);

        const points = categories[category];
        for (const point in points) {
            const pointButton = document.createElement('button');
            pointButton.className = 'point-button';
            pointButton.textContent = point;
            pointButton.onclick = () => selectQuestion(category, point);
            log(`Created point button for ${category} ${point}`);
            column.appendChild(pointButton);
        }
        board.appendChild(column);
    }
    updateScoreBoard(); // Ensure scoreboard is updated after initialization
}

// Handle selecting a question
function selectQuestion(category, point) {
    const questionList = categories[category][point];
    const questionIndex = Math.floor(Math.random() * questionList.length); // Randomly select a question from the list
    const questionData = questionList[questionIndex];
    currentQuestion = questionData;
    document.getElementById('questionModal').style.display = 'block';
    log(`Selected question: ${questionData.question}`);
    log(`Answer: ${questionData.answer}`);
    document.getElementById('questionText').textContent = questionData.question;
}

// Handle submitting an answer
function submitAnswer() {
    const userAnswer = document.getElementById('answer-input').value;
    if (userAnswer.toLowerCase() === currentQuestion.answer.toLowerCase()) {
        updateScore(100); // Update score positively
        log(`User answered correctly: ${userAnswer}`);
        alert("Correct!");
    } else {
        updateScore(-100); // Penalize for wrong answer
        log(`User answered incorrectly: ${userAnswer}`);
        alert("Wrong! The correct answer was: " + currentQuestion.answer);
    }
    log(`Current score: ${currentScore}`);
    document.getElementById('questionModal').style.display = 'none';
    document.getElementById('answer-input').value = ''; // Clear input field
}

// Update the game score
function updateScore(amount) {
    players[currentPlayerIndex].score += amount;
    document.getElementById(`playerScore${currentPlayerIndex}`).innerHTML = `Player ${currentPlayerIndex + 1}: <span>${players[currentPlayerIndex].score}</span>`;
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length; // Move to the next player
    highlightCurrentPlayer(); // Update the current player highlight
}


// Event listener for answer submission
document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('questionModal').style.display = 'none';
});

// Initialize the game when the window loads
window.onload = initGame;