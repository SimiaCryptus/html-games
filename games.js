// games.js


const games = [
    {
        title: "2048",
        url: "2048/index.html"
    },
    {
        title: "Snakes",
        url: "snakes/index.html"
    },
    {
        title: "Tetris",
        url: "tetris/index.html"
    },
    {
        title: "Word Search",
        url: "wordsearch/index.html"
    },
    {
        title: "Breakout",
        url: "breakout/index.html"
    },
    {
        title: "Maze Runner",
        url: "maze/index.html"
    },
    {
        title: "Chess",
        url: "chess/index.html"
    },
    {
        title: "Othello",
        url: "othello/index.html"
    },
    {
        title: "Pacman",
        url: "pacman/index.html"
    },
    {
        title: "Missle Command",
        url: "misslecommand/index.html"
    },
    {
        title: "Space Invaders",
        url: "invaders/index.html"
    },
    {
        title: "Mastermind",
        url: "mastermind/index.html"
    },
    {
        title: "Space Battle",
        url: "spacebattle/index.html"
    },
    {
        title: "Frogger",
        url: "frogger/index.html"
    },
    {
        title: "Battleship",
        url: "battleship/index.html"
    },
    {
        title: "Memory",
        url: "memory/index.html"
    },
    {
        title: "Pong",
        url: "pong/index.html"
    },
    {
        title: "Laser Chess",
        url: "laserchess/index.html"
    },
    {
        title: "Sudoku",
        url: "sudoku/index.html"
    },
    {
        title: "Jeopardy",
        url: "jeopardy/index.html"
    },
    {
        title: "Connect Four",
        url: "connect4/index.html"
    },
    {
        title: "Scrabble",
        url: "scrabble/index.html"
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const gameGrid = document.getElementById('gameGrid');

    games.forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.classList.add('game-card');

        const title = document.createElement('h3');
        title.textContent = game.title;
        gameCard.appendChild(title);

        const thumbnail = document.createElement('img');
        thumbnail.src = `${game.url.replace('index.html', '')}thumbnail.png`;
        thumbnail.alt = `${game.title} Thumbnail`;
        gameCard.appendChild(thumbnail);


        gameCard.addEventListener('click', () => {
            window.location.href = game.url;
        });

        gameGrid.appendChild(gameCard);
    });
});