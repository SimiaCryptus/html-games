document.addEventListener('DOMContentLoaded', () => {
    const startGameButton = document.querySelector('#start-game');
    startGameButton.addEventListener('click', startGame);
    const resetButton = document.querySelector('#reset-button');
    resetButton.addEventListener('click', resetGame);

    let cardArray = [
        {name: 'card1', img: 'card1.png'},
        {name: 'card1', img: 'card1.png'},
        {name: 'card2', img: 'card2.png'},
        {name: 'card2', img: 'card2.png'},
        {name: 'card3', img: 'card3.png'},
        {name: 'card3', img: 'card3.png'},
        {name: 'card4', img: 'card4.png'},
        {name: 'card4', img: 'card4.png'},
        {name: 'card5', img: 'card5.png'},
        {name: 'card5', img: 'card5.png'},
        {name: 'card6', img: 'card6.png'},
        {name: 'card6', img: 'card6.png'},
        {name: 'card7', img: 'card7.png'},
        {name: 'card7', img: 'card7.png'},
        {name: 'card8', img: 'card8.png'},
        {name: 'card8', img: 'card8.png'}
    ];

    function resetGame() {
        console.log('[RESET GAME] Resetting game...');
        cardsChosen = [];
        cardsChosenIds = [];
        cardsWon = [];
        resultDisplay.querySelector('#move-counter').textContent = '0';
        grid.innerHTML = '';
        const width = document.querySelector('#board-width').value;
        const height = document.querySelector('#board-height').value;
        console.log(`[RESET GAME] Creating board with width: ${width}, height: ${height}`);
        createBoard(width, height);
        document.querySelector('#setup-area').style.display = 'block'; // Show setup area when game resets
        document.querySelector('#start-game').style.display = 'block'; // Show start game button when game resets
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
        console.log('[START GAME] Starting game...');
        const numPlayers = document.querySelector('#num-players').value;
        const boardWidth = document.querySelector('#board-width').value;
        const boardHeight = document.querySelector('#board-height').value;
        console.log(`[START GAME] Number of players: ${numPlayers}, Board width: ${boardWidth}, Board height: ${boardHeight}`);
        initializeGame(numPlayers, boardWidth, boardHeight);
        document.querySelector('#setup-area').style.display = 'none'; // Hide setup area when game starts
        document.querySelector('#start-game').style.display = 'none'; // Hide start game button when game starts
    }

    // Function to create the board
    function createBoard(width, height) {
        console.log(`[CREATE BOARD] Creating board with dimensions: ${width}x${height}`);
        const numCards = parseInt(width) * parseInt(height);
    const numPairs = Math.floor(numCards / 2);
        cardArray.sort(() => 0.5 - Math.random());
    if (numPairs > cardArray.length / 2) {
        generateHigherNumberedCards(numPairs * 2);
    }
    if (numPairs > cardArray.length / 2) {
        console.error(`[CREATE BOARD] Not enough cards to fill the board. Required pairs: ${numPairs}, Available pairs: ${cardArray.length / 2}`);
            return;
        }
    const cardsToUse = cardArray.slice(0, numPairs * 2);
    if (numCards % 2 !== 0) {
        cardsToUse.pop(); // Leave one card off if the number of requested cards is odd
    }
        grid.style.gridTemplateColumns = `repeat(${width}, auto)`;
        grid.style.gridTemplateRows = `repeat(${height}, auto)`;
    for (let i = 0; i < cardsToUse.length; i++) {
            const card = document.createElement('img');
            card.setAttribute('src', 'blank.png');
            card.setAttribute('data-id', i);
            card.addEventListener('click', flipCard);
            grid.appendChild(card);
        }
    }

    // Check for matches
    function checkForMatch() {
        console.log('[CHECK FOR MATCH] Checking for match...');
        const cards = document.querySelectorAll('img');
        const optionOneId = cardsChosenIds[0];
        const optionTwoId = cardsChosenIds[1];

        if (cardsChosen[0] === cardsChosen[1]) {
            console.log(`[CHECK FOR MATCH] Match found: ${cardsChosen[0]}`);
            displayMessage('You found a match!');
            cards[optionOneId].setAttribute('src', 'white.png');
            cards[optionTwoId].setAttribute('src', 'white.png');
            // Remove click event listeners from matched cards
            cards[optionOneId].removeEventListener('click', flipCard);
            cards[optionTwoId].removeEventListener('click', flipCard);
            cardsWon.push(cardsChosen);
            playerScores[currentPlayer]++;
        } else {
            console.log(`[CHECK FOR MATCH] No match: ${cardsChosen[0]} and ${cardsChosen[1]}`);
            cards[optionOneId].setAttribute('src', 'blank.png');
            cards[optionTwoId].setAttribute('src', 'blank.png');
            displayMessage('Sorry, try again');
        }
        cardsChosen = [];
        cardsChosenIds = [];
        resultDisplay.querySelector('#move-counter').textContent = cardsWon.length;  // Correctly update the move counter
        if (cardsWon.length === cardArray.length / 2) {
            console.log('[CHECK FOR MATCH] All matches found!');
            resultDisplay.querySelector('#move-counter').textContent = 'Congratulations! You found them all!';
        }
        isChecking = false;  // Reset flag after check
    }

    function initializeGame(numPlayers, width, height) {
        console.log(`[INITIALIZE GAME] Initializing game with ${numPlayers} players and board dimensions: ${width}x${height}`);
        playerScores = new Array(parseInt(numPlayers)).fill(0);
        currentPlayer = 0;
        updatePlayerTurn();
        createBoard(width, height);
    }

    function updatePlayerTurn() {
        console.log(`[UPDATE PLAYER TURN] Updating turn display: Player ${currentPlayer + 1}'s turn`);
        const playerTurnDisplay = document.querySelector('#player-turn');
        playerTurnDisplay.textContent = `Player ${currentPlayer + 1}'s turn`;
    }

    function displayMessage(message) {
        console.log(`[DISPLAY MESSAGE] Displaying message: ${message}`);
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
        console.log(`[FLIP CARD] Card flipped: ID=${cardId}, Name=${cardArray[cardId].name}`);
        cardsChosen.push(cardArray[cardId].name);
        cardsChosenIds.push(cardId);
        this.setAttribute('src', cardArray[cardId].img);
        if (cardsChosen.length === 2) {
            isChecking = true;  // Set flag when two cards are flipped
            setTimeout(checkForMatch, 2500);
        }
    }

    function generateHigherNumberedCards(numCards) {
        console.log(`[GENERATE HIGHER NUMBERED CARDS] Generating higher numbered cards to fill ${numCards} slots`);
        const baseCards = cardArray.slice(0, 10);  // Assuming first 10 cards are base cards
    let cardIndex = baseCards.length / 2 + 1;
    while (cardArray.length < numCards) {
         const hue = (cardIndex * 36) % 360;  // Adjust hue for color variation
            const newCard = {
                name: `card${cardIndex}`,
                img: `hsl(${hue}, 100%, 50%)`  // Generate HSL color
            };
            cardArray.push(newCard, newCard);  // Add pairs
            cardIndex++;
        }
    }

    console.log('[INIT] Creating initial board...');
    resetGame();
});