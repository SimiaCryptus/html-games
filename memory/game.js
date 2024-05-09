document.addEventListener('DOMContentLoaded', () => {
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
        createBoard();
    }

    const grid = document.querySelector('#game-board');
    const resultDisplay = document.querySelector('#score-area');  // Corrected to match the actual ID in HTML
    let cardsChosen = [];
    let cardsChosenIds = [];
    let cardsWon = [];

    // Function to create the board
    function createBoard() {
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
        let cardId = this.getAttribute('data-id');
        cardsChosen.push(cardArray[cardId].name);
        cardsChosenIds.push(cardId);
        this.setAttribute('src', cardArray[cardId].img);
        if (cardsChosen.length === 2) {
            setTimeout(checkForMatch, 2500);
        }
    }

    createBoard();
});