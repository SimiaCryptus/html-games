document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.game-button');
    const startButton = document.getElementById('start-button');
    const scoreDisplay = document.getElementById('score');
    let sequence = [];
    let userSequence = [];
    let score = 0;
    let isUserTurn = false;

    // Event listener for the start button
    startButton.addEventListener('click', startGame);

    // Event listeners for the game buttons
    buttons.forEach(button => {
        button.addEventListener('click', (event) => {
            if (!isUserTurn) return;
            const color = event.target.id;
            userSequence.push(color);
            highlightButton(color);
            checkUserSequence();
        });
    });

    // Function to start the game
    function startGame() {
        score = 0;
        sequence = [];
        userSequence = [];
        scoreDisplay.textContent = `Score: ${score}`;
        nextRound();
    }

    // Function to proceed to the next round
    function nextRound() {
        userSequence = [];
        isUserTurn = false;
        const colors = ['red', 'green', 'blue', 'yellow'];
        const nextColor = colors[Math.floor(Math.random() * colors.length)];
        sequence.push(nextColor);
        playSequence();
    }

    // Function to play the sequence
    function playSequence() {
        let delay = 500;
        sequence.forEach((color, index) => {
            setTimeout(() => {
                highlightButton(color);
            }, delay * (index + 1));
        });
        setTimeout(() => {
            isUserTurn = true;
        }, delay * sequence.length);
    }

    // Function to highlight a button
    function highlightButton(color) {
        const button = document.getElementById(color);
        button.classList.add('active');
        setTimeout(() => {
            button.classList.remove('active');
    }, 300);
    }

    // Function to check the user's sequence
    function checkUserSequence() {
        const currentStep = userSequence.length - 1;
        if (userSequence[currentStep] !== sequence[currentStep]) {
            alert('Game Over! Your score is ' + score);
            startGame();
            return;
        }
        if (userSequence.length === sequence.length) {
            score++;
            scoreDisplay.textContent = `Score: ${score}`;
            setTimeout(nextRound, 1000);
        }
    }
});