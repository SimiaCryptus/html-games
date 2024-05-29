document.addEventListener('DOMContentLoaded', () => {
    const startGameButton = document.querySelector('#start-game');
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
        {name: 'card8', img: 'card8.png'},
        {name: 'card9', img: 'card9.png'},
        {name: 'card9', img: 'card9.png'},
        {name: 'card10', img: 'card10.png'},
        {name: 'card10', img: 'card10.png'},
        {name: 'card11', img: 'card11.png'},
        {name: 'card11', img: 'card11.png'},
        {name: 'card12', img: 'card12.png'},
        {name: 'card12', img: 'card12.png'},
        {name: 'card13', img: 'card13.png'},
        {name: 'card13', img: 'card13.png'},
        {name: 'card14', img: 'card14.png'},
        {name: 'card14', img: 'card14.png'},
        {name: 'card15', img: 'card15.png'},
        {name: 'card15', img: 'card15.png'},
        {name: 'card16', img: 'card16.png'},
        {name: 'card16', img: 'card16.png'},
        {name: 'card17', img: 'card17.png'},
        {name: 'card17', img: 'card17.png'},
        {name: 'card18', img: 'card18.png'},
        {name: 'card18', img: 'card18.png'},
        {name: 'card19', img: 'card19.png'},
        {name: 'card19', img: 'card19.png'},
        {name: 'card20', img: 'card20.png'},
        {name: 'card20', img: 'card20.png'},
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
    }

    const grid = document.querySelector('#game-board');
    const resultDisplay = document.querySelector('#score-area');  // Corrected to match the actual ID in HTML
    let cardsChosen = [];
    let cardsChosenIds = [];
    let cardsWon = [];
    let playerScores = [];
    let currentPlayer = 0;
    let isChecking = false;  // Flag to prevent flipping more cards during check


    // Function to create the board
    function createBoard(width, height) {
        console.log(`[CREATE BOARD] Creating board with dimensions: ${width}x${height}`);
        const numCards = parseInt(width) * parseInt(height);
    const numPairs = Math.floor(numCards / 2); // Ensure we have enough pairs for even number of cards
        cardArray.sort(() => 0.5 - Math.random());
    if (numPairs > cardArray.length / 2) {
        console.error(`[CREATE BOARD] Not enough cards to fill the board. Required pairs: ${numPairs}, Available pairs: ${cardArray.length / 2}`);
            return;
        }
        let cardsToUse = cardArray.slice(0, numPairs * 2);
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
    document.body.appendChild(messageElement); // Append message to body for better visibility
    setTimeout(() => {
        messageElement.classList.add('fade-out'); // Add fade-out class for smooth transition
        setTimeout(() => messageElement.remove(), 500); // Remove element after fade-out
    }, 1000);
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




    console.log('[INIT] Creating initial board...');
    resetGame();
});