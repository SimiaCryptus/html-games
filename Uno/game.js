// Game.js

class Card {
    constructor(color, value) {
        this.color = color;
        this.value = value;
    }

    matches(card) {
        return this.color === card.color || this.value === card.value;
    }
}

class Deck {
    constructor() {
        this.cards = [];
        this.reset();
    }

    reset() {
        const colors = ['red', 'green', 'blue', 'yellow'];
        const values = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Skip', 'Reverse', 'Draw Two'];

        for (let color of colors) {
            for (let value of values) {
                this.cards.push(new Card(color, value));
                if (value !== '0') { // Duplicate cards except for '0'
                    this.cards.push(new Card(color, value));
                }
            }
        }

        this.shuffle();
    }

    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    draw() {
        return this.cards.pop();
    }
}

class Player {
    constructor(name) {
        this.name = name;
        this.hand = [];
    }

    drawCard(deck) {
        const card = deck.draw();
        this.hand.push(card);
    }

    playCard(cardIndex, discardPile) {
        if (this.hand[cardIndex].matches(discardPile[discardPile.length - 1])) {
            return this.hand.splice(cardIndex, 1)[0];
        }
        return null;
    }
}

class Game {
    constructor() {
        this.players = [new Player('You'), new Player('AI')];
        this.deck = new Deck();
        this.discardPile = [];
        this.currentPlayerIndex = 0;
    }

    start() {
        this.deck.reset();
        this.players.forEach(player => {
            player.hand = [];
            for (let i = 0; i < 7; i++) {
                player.drawCard(this.deck);
            }
        });
        this.discardPile.push(this.deck.draw());
        this.render();
    }

    nextTurn() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        this.render();
    }

    render() {
        console.log(`Current player: ${this.players[this.currentPlayerIndex].name}`);
        console.log(`Top of discard pile: ${this.discardPile[this.discardPile.length - 1].color} ${this.discardPile[this.discardPile.length - 1].value}`);
        console.log(`${this.players[this.currentPlayerIndex].name}'s hand:`, this.players[this.currentPlayerIndex].hand);
        // Update UI based on game state
        // This function should be expanded to update the HTML elements with the new game state
    }
}

const game = new Game();
game.players[game.currentPlayerIndex].drawCard(game.deck);
game.nextTurn();
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('start-game').addEventListener('click', () => game.start());
    document.getElementById('draw-card').addEventListener('click', () => {
        game.players[game.currentPlayerIndex].drawCard(game.deck);
        game.nextTurn();
    });
    document.getElementById('end-turn').addEventListener('click', () => game.nextTurn());
});

// Additional event listeners for playing cards, etc., would be added here.