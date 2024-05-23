// gameManager.js

class GameManager {
    constructor() {
        this.players = [];
        this.currentTurnIndex = 0;
        this.deck = [];
        this.discardPile = [];
        this.isGameOver = false;
    }

    addPlayer(player) {
        this.players.push(player);
    }

    startGame() {
        this.deck = this.createDeck();
        this.shuffleDeck();
        this.dealCards();
        this.discardPile.push(this.deck.pop()); // Start the discard pile
        this.isGameOver = false;
    }

    createDeck() {
        const colors = ['Red', 'Green', 'Blue', 'Yellow'];
        const values = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Skip', 'Reverse', 'Draw Two'];
        let deck = [];

        colors.forEach(color => {
            values.forEach(value => {
                deck.push({ color, value });
                if (value !== '0') { // Add two of each card except for 0
                    deck.push({ color, value });
                }
            });
        });

        // Add wild and wild draw four cards
        for (let i = 0; i < 4; i++) {
            deck.push({ color: 'Wild', value: 'Wild' });
            deck.push({ color: 'Wild', value: 'Draw Four' });
        }

        return deck;
    }

    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    dealCards() {
        const numCards = 7;
        this.players.forEach(player => {
            for (let i = 0; i < numCards; i++) {
                player.hand.push(this.deck.pop());
            }
        });
    }

    playCard(playerIndex, cardIndex) {
        const player = this.players[playerIndex];
        const card = player.hand.splice(cardIndex, 1)[0];
        this.discardPile.push(card);

        // Apply card effects here (e.g., skip, reverse, draw two, wild)
        this.applyCardEffects(card);

        // Check for win condition
        if (player.hand.length === 0) {
            this.isGameOver = true;
            console.log(`Player ${playerIndex} wins!`);
        }

        this.nextTurn();
    }

    applyCardEffects(card) {
        switch (card.value) {
            case 'Skip':
                this.skipTurn();
                break;
            case 'Reverse':
                this.reverseOrder();
                break;
            case 'Draw Two':
                this.drawCards(this.getNextPlayerIndex(), 2);
                break;
            case 'Draw Four':
                this.drawCards(this.getNextPlayerIndex(), 4);
                // Handle wild card color change
                break;
            case 'Wild':
                // Handle wild card color change
                break;
        }
    }

    drawCards(playerIndex, count) {
        for (let i = 0; i < count; i++) {
            if (this.deck.length === 0) {
                this.reshuffleDiscardIntoDeck();
            }
            this.players[playerIndex].hand.push(this.deck.pop());
        }
    }

    nextTurn() {
        this.currentTurnIndex = (this.currentTurnIndex + 1) % this.players.length;
    }

    skipTurn() {
        this.currentTurnIndex = (this.currentTurnIndex + 2) % this.players.length;
    }

    reverseOrder() {
        this.players.reverse();
        // Adjust the current turn index to maintain the turn flow
        this.currentTurnIndex = this.players.length - 1 - this.currentTurnIndex;
    }

    getNextPlayerIndex() {
        return (this.currentTurnIndex + 1) % this.players.length;
    }

    reshuffleDiscardIntoDeck() {
        const cardToKeep = this.discardPile.pop(); // Keep the last played card
        this.deck = this.discardPile;
        this.shuffleDeck();
        this.discardPile = [cardToKeep];
    }
}

module.exports = GameManager;