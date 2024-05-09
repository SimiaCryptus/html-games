document.addEventListener('DOMContentLoaded', function () {
    const gameArea = document.getElementById('gameArea');
    const scoreElement = document.getElementById('score');
    const gameOverMessage = document.getElementById('gameOverMessage');

    const gameWidth = Math.min(window.innerWidth, window.innerHeight);
    const gameHeight = Math.min(window.innerWidth, window.innerHeight);
    const snakeSize = 20;
    const gridWidth = Math.floor(window.innerWidth / snakeSize) * snakeSize; // Ensure the grid width is a multiple of snakeSize
    const gridHeight = Math.floor(window.innerHeight / snakeSize) * snakeSize; // Ensure the grid height is a multiple of snakeSize
    let score = 0;
    let gameRunning = false;

    let snake = [{x: 160, y: 200}, {x: 140, y: 200}, {x: 120, y: 200}];
    let food = {x: 300, y: 200};
    let dx = snakeSize; // horizontal delta
    let dy = 0; // vertical delta

    // Adjust canvas size on window resize
    window.addEventListener('resize', function() {
        const newSize = Math.min(window.innerWidth, window.innerHeight);
       const newWidth = Math.floor(window.innerWidth / snakeSize) * snakeSize;
       const newHeight = Math.floor(window.innerHeight / snakeSize) * snakeSize;
       gameArea.width = newWidth;
       gameArea.height = newHeight;
        console.log(`Resized: width=${gameArea.width}, height=${gameArea.height}`);
    });
    function main() {
        if (hasGameEnded()) {
            gameOverMessage.style.display = 'block';
            return;
        }

        gameRunning = true;
        setTimeout(function onTick() {
            clearCanvas();
            drawFood();
            moveSnake();
            drawSnake();
            main();
        }, 100);
    }

    function clearCanvas() {
       gameArea.getContext('2d').clearRect(0, 0, gameArea.width, gameArea.height);
    }

    function drawSnake() {
        snake.forEach(segment => {
            const ctx = gameArea.getContext('2d');
            ctx.fillStyle = 'green';
            ctx.fillRect(segment.x, segment.y, snakeSize, snakeSize);
        });
    }

    function moveSnake() {
        const head = {x: snake[0].x + dx, y: snake[0].y + dy};
        snake.unshift({x: (head.x + gridWidth) % gridWidth, y: (head.y + gridHeight) % gridHeight}); // Correct wrap around modification

        if (head.x === food.x && head.y === food.y) {
            score += 10;
            scoreElement.innerHTML = 'Score: ' + score;
            generateFood();
        } else {
            snake.pop();
        }
    }

    function generateFood() {
        food.x = Math.floor(Math.random() * (gridWidth / snakeSize - 1) + 1) * snakeSize;
        food.y = Math.floor(Math.random() * (gridHeight / snakeSize)) * snakeSize;
    }

    function drawFood() {
        const ctx = gameArea.getContext('2d');
        ctx.fillStyle = 'red';
        ctx.fillRect(food.x, food.y, snakeSize, snakeSize);
    }

    function hasGameEnded() {
        for (let i = 4; i < snake.length; i++) {
            if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
        }
        // Removed game ending conditions related to wall hits as snake should wrap around
        return false; // Remove game ending conditions related to wall hits
    }

    function changeDirection(event) {
        const LEFT_KEY = 37;
        const RIGHT_KEY = 39;
        const UP_KEY = 38;
        const DOWN_KEY = 40;

        const keyPressed = event.keyCode;
        const goingUp = dy === -snakeSize;
        const goingDown = dy === snakeSize;
        const goingRight = dx === snakeSize;
        const goingLeft = dx === -snakeSize;

        if (keyPressed === LEFT_KEY && !goingRight) {
            dx = -snakeSize;
            dy = 0;
        }
        if (keyPressed === UP_KEY && !goingDown) {
            dx = 0;
            dy = -snakeSize;
        }
        if (keyPressed === RIGHT_KEY && !goingLeft) {
            dx = snakeSize;
            dy = 0;
        }
        if (keyPressed === DOWN_KEY && !goingUp) {
            dx = 0;
            dy = snakeSize;
        }
    }

    document.addEventListener('keydown', changeDirection);

    function handleTouchMove(event) {
        const touchX = event.touches[0].clientX;
        const touchY = event.touches[0].clientY;
        const midX = gameArea.offsetLeft + gameArea.clientWidth / 2;
        const midY = gameArea.offsetTop + gameArea.clientHeight / 2;

        const diffX = touchX - midX;
        const diffY = touchY - midY;

        if (Math.abs(diffX) > Math.abs(diffY)) {
            // Horizontal movement
            if (diffX > 0 && dx === 0) { // Move right
                dx = snakeSize;
                dy = 0;
            } else if (diffX < 0 && dx === 0) { // Move left
                dx = -snakeSize;
                dy = 0;
            }
        } else {
            // Vertical movement
            if (diffY > 0 && dy === 0) { // Move down
                dx = 0;
                dy = snakeSize;
            } else if (diffY < 0 && dy === 0) { // Move up
                dx = 0;
                dy = -snakeSize;
            }
        }
        event.preventDefault(); // Prevent scrolling when touching canvas
    }

    gameArea.addEventListener('touchstart', handleTouchMove);
    gameArea.addEventListener('touchmove', handleTouchMove);

    function restartGame() {
        snake = [{x: 160, y: 200}, {x: 140, y: 200}, {x: 120, y: 200}];
        food = {x: 300, y: 200};
        dx = snakeSize;
        dy = 0;
        score = 0;
        scoreElement.innerHTML = 'Score: 0';
        gameOverMessage.style.display = 'none';
        gameRunning = false;
        if (!gameRunning) {
            main();
        }
    }


// Initialize the game
    gameArea.width = gridWidth;
    gameArea.height = gridHeight;

    main();
    let restart = document.getElementById('restartButton');
    restart.addEventListener('click', restartGame);
});