document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const submitButton = document.getElementById('submitGuess');
    const startButton = document.getElementById('startGame');
    // Removed restartButton as it is not used or defined in HTML
    let colorOptions = document.querySelectorAll('.colorOption');

    let secretCode = [];
    let currentGuess = [];
    const maxAttempts = 10;
    let attemptCount = 0;

    // Initialize or reset the game
    function initializeGame() {
        secretCode = generateSecretCode();
        gameBoard.innerHTML = '';
        attemptCount = 0;
        currentGuess = [];
        setupCurrentGuessDisplay(); // Setup the display area for current guess
        console.log('Secret Code:', secretCode); // For debugging purposes
        setupCurrentGuessDisplay(); // Setup the display area for current guess
        displayCurrentGuess(); // Ensure the current guess display is updated

        // Generate a random secret code
        function generateSecretCode() {
            const colors = ['red', 'blue', 'green', 'yellow', 'black', 'white'];
            return Array.from({length: 4}, () => colors[Math.floor(Math.random() * colors.length)]);
        }

        // Add color to current guess

    }

// Display the current guess on the game board
    function displayCurrentGuess() {
        const currentGuessContainer = document.getElementById('current-guess-container');
        currentGuessContainer.innerHTML = ''; // Clear previous entries
        currentGuess.forEach(color => {
            const colorDiv = document.createElement('div');
            colorDiv.className = 'peg';
            colorDiv.style.backgroundColor = color;
            currentGuessContainer.appendChild(colorDiv);
        });
    }

    // Check the user's guess against the secret code
    function checkGuess() {
        const feedback = {
            correctPosition: 0,
            correctColor: 0
        };

        const guessCopy = [...currentGuess];
        const codeCopy = [...secretCode];

        // First pass: check for correct position and color
        guessCopy.forEach((color, index) => {
            if (color === codeCopy[index]) {
                feedback.correctPosition++;
                guessCopy[index] = null;
                codeCopy[index] = null;
            }
        });

        // Second pass: check for correct color in the wrong position
        guessCopy.forEach((color, index) => {
            if (color && codeCopy.includes(color)) {
                feedback.correctColor++;
                codeCopy[codeCopy.indexOf(color)] = null;
            }
        });

        return feedback;
    }

    // Display the guess and feedback on the game board
    function displayGuessAndFeedback(feedback) {
        const row = document.createElement('div');
        row.className = 'guessRow';
        currentGuess.forEach(color => {
            const peg = document.createElement('div');
            peg.className = 'peg';
            peg.style.backgroundColor = color;
            row.appendChild(peg);
        });

        const feedbackContainer = document.createElement('div');
        feedbackContainer.className = 'feedbackContainer';
        feedbackContainer.textContent = `Correct Position: ${feedback.correctPosition}, Correct Color: ${feedback.correctColor}`;
        row.appendChild(feedbackContainer);

        gameBoard.appendChild(row);
    }

    // Event listeners
    colorOptions.forEach(option => {
        option.addEventListener('click', () => {
            addToGuess(option.dataset.color);
            displayCurrentGuess(); // Update the display after adding a color
        });
    });

    function addToGuess(color) {
        if (currentGuess.length < 4) {
            currentGuess.push(color);
            console.log('Current Guess:', currentGuess); // For debugging purposes
        }
    }

// Initialize the display area for current guess
    function setupCurrentGuessDisplay() {
        const currentGuessSection = document.getElementById('current-guess');
    currentGuessSection.innerHTML = ''; // Clear previous content if any
        const currentGuessContainer = document.createElement('div');
        currentGuessContainer.id = 'current-guess-container';
        currentGuessContainer.className = 'guessRow'; // Reuse the guessRow style for layout
        currentGuessSection.appendChild(currentGuessContainer);
    }

    submitButton.addEventListener('click', () => {
        if (currentGuess.length === 4) {
            const feedback = checkGuess();
            displayGuessAndFeedback(feedback);
            attemptCount++;
            if (feedback.correctPosition === 4 || attemptCount === maxAttempts) {
                alert(feedback.correctPosition === 4 ? 'You win!' : 'You lose! The correct code was ' + secretCode.join(', '));
                initializeGame();
            }
            currentGuess = [];
            displayCurrentGuess(); // Clear the current guess display after submitting
        } else {
            alert('Please select 4 colors.');
        }
    });

    startButton.addEventListener('click', initializeGame);

    initializeGame(); // Start the game initially
});