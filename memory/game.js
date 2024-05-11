document.addEventListener('DOMContentLoaded', () => {
    const startGameButton = document.querySelector('#start-game');
    startGameButton.addEventListener('click', startGame);
    const resetButton = document.querySelector('#reset-button');
    resetButton.addEventListener('click', resetGame);

    const cardArray = [
        { name: 'card1', img: 'card1.png' },
        { name: 'card1', img: 'card1.png' },
        { name: 'card2', img: 'card2.png' },
        { name: 'card2', img: 'card2.png' },
        { name: 'card3', img: 'card3.png' },
        { name: 'card3', img: 'card3.png' },
        { name: 'card4', img: 'card4.png' },
        { name: 'card4', img: 'card4.png' },
        { name: 'card5', img: 'card5.png' },
        { name: 'card5', img: 'card5.png' },
        { name: 'card6', img: 'card6.png' },
        { name: 'card6', img: 'card6.png' },
        { name: 'card7', img: 'card7.png' },
        { name: 'card7', img: 'card7.png' },
        { name: 'card8', img: 'card8.png' },
        { name: 'card8', img: 'card8.png' }
    ];

    function resetGame() {
        cardsChosen = [];
        cardsChosenIds = [];
        cardsWon = [];
        resultDisplay.querySelector('#move-counter').textContent = '0';
        grid.innerHTML = '';
        const width = document.querySelector('#board-width').value;
        const height = document.querySelector('#board-height').value;
        createBoard(width, height);
    document.querySelector('#setup-area').style.display = 'block'; // Show setup area when game resets
    document.querySelector('#start-game').style.display = 'block'; // Show start game button when game resets
        createBoard();
    }

    const grid = document.querySelector('#game-board');
    const resultDisplay = document.querySelector('#score-area');  // Corrected to match the actual ID in HTML
    let cardsChosen = [];
    let cardsChosenIds = [];
    let cardsWon = [];
    let playerScores = [];
    let currentPlayer = 0;
   let isChecking = false;  // Flag to prevent flipping more cards during check

    function startGame() {
        const numPlayers = document.querySelector('#num-players').value;
        const boardWidth = document.querySelector('#board-width').value;
        const boardHeight = document.querySelector('#board-height').value;
        initializeGame(numPlayers, boardWidth, boardHeight);
    document.querySelector('#setup-area').style.display = 'none'; // Hide setup area when game starts
    document.querySelector('#start-game').style.display = 'none'; // Hide start game button when game starts
    }
    // Function to create the board
    function createBoard(width, height) {
        const numCards = width * height;
        cardArray.sort(() => 0.5 - Math.random());
        cardArray.length = numCards;  // Adjust array size based on board dimensions
        cardArray.sort(() => 0.5 - Math.random());
        for (let i = 0; i < cardArray.length; i++) {
            const card = document.createElement('img');
            card.setAttribute('src', 'blank.png');
            card.setAttribute('data-id', i);
            card.addEventListener('click', flipCard);
            grid.appendChild(card);
        }
    }

    // Check for matches
    function checkForMatch() {
        const cards = document.querySelectorAll('img');
        const optionOneId = cardsChosenIds[0];
        const optionTwoId = cardsChosenIds[1];

        if (cardsChosen[0] === cardsChosen[1]) {
            displayMessage('You found a match!');
            cards[optionOneId].setAttribute('src', 'white.png');
            cards[optionTwoId].setAttribute('src', 'white.png');
            cardsWon.push(cardsChosen);
            playerScores[currentPlayer]++;
        } else {
            cards[optionOneId].setAttribute('src', 'blank.png');
            cards[optionTwoId].setAttribute('src', 'blank.png');
            displayMessage('Sorry, try again');
        }
        cardsChosen = [];
        cardsChosenIds = [];
        resultDisplay.querySelector('#move-counter').textContent = cardsWon.length;  // Correctly update the move counter
        if (cardsWon.length === cardArray.length / 2) {
            resultDisplay.querySelector('#move-counter').textContent = 'Congratulations! You found them all!';
        }
       isChecking = false;  // Reset flag after check
    }
    function initializeGame(numPlayers, width, height) {
        playerScores = new Array(parseInt(numPlayers)).fill(0);
        currentPlayer = 0;
        updatePlayerTurn();
        createBoard(width, height);
    }

    function updatePlayerTurn() {
        const playerTurnDisplay = document.querySelector('#player-turn');
        playerTurnDisplay.textContent = `Player ${currentPlayer + 1}'s turn`;
    }
    function displayMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.textContent = message;
        messageElement.classList.add('message');
        grid.appendChild(messageElement);
        setTimeout(() => messageElement.remove(), 1000);
    }

    // Flip your card
    function flipCard() {
       if (isChecking) return;  // Prevent flipping more cards if currently checking
        let cardId = this.getAttribute('data-id');
        cardsChosen.push(cardArray[cardId].name);
        cardsChosenIds.push(cardId);
        this.setAttribute('src', cardArray[cardId].img);
        if (cardsChosen.length === 2) {
           isChecking = true;  // Set flag when two cards are flipped
            setTimeout(checkForMatch, 2500);
        }
    }

    createBoard();
});