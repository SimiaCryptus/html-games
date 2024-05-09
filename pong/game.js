// Game.js

function handleTouchStart(event) {
    const touchY = event.touches[0].clientY;
    const touchX = event.touches[0].clientX;
    const middleY = window.innerHeight / 2;
    const middleX = window.innerWidth / 2;
    if (touchY < middleY && touchX < middleX) {
        leftPaddleVelocity = -paddleVelocity;
    } else if (touchY >= middleY && touchX < middleX) {
        leftPaddleVelocity = paddleVelocity;
    }
    if (touchY < middleY && touchX >= middleX) {
        rightPaddleVelocity = -paddleVelocity;
    } else if (touchY >= middleY && touchX >= middleX) {
        rightPaddleVelocity = paddleVelocity;
    }
}

function handleTouchMove(event) {
    const touchY = event.touches[0].clientY;
    const touchX = event.touches[0].clientX;
    const middleY = window.innerHeight / 2;
    const middleX = window.innerWidth / 2;
    if (touchY < middleY && touchX < middleX) {
        leftPaddleVelocity = -paddleVelocity;
    } else if (touchY >= middleY && touchX < middleX) {
        leftPaddleVelocity = paddleVelocity;
    }
    if (touchY < middleY && touchX >= middleX) {
        rightPaddleVelocity = -paddleVelocity;
    } else if (touchY >= middleY && touchX >= middleX) {
        rightPaddleVelocity = paddleVelocity;
    }
    event.preventDefault(); // Prevent scrolling when touching the canvas
}

function handleTouchEnd(event) {
    leftPaddleVelocity = 0;
    rightPaddleVelocity = 0;
}

// Select the canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game settings
const paddleWidth = 10;
const paddleHeight = 100;
const paddleVelocity = 10;
const ballSize = 10;
let intervalId;
let gameRunning = false;

// Paddle positions
let leftPaddleY = (canvas.height - paddleHeight) / 2;
let rightPaddleY = (canvas.height - paddleHeight) / 2;
let leftPaddleVelocity = 0;
let rightPaddleVelocity = 0;

// Ball position and velocity
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballVelocityX = 3; // Reduced initial X velocity
let ballVelocityY = 3; // Reduced initial Y velocity

// Scores
let scoreLeft = 0;
let scoreRight = 0;

// Move paddles
function handleKeyDown(event) {
    console.log(`Key pressed: ${event.key}`); // Log key press for debugging
    switch (event.key) {
        case 'w':
            leftPaddleVelocity = -paddleVelocity;
            break;
        case 's':
            leftPaddleVelocity = paddleVelocity;
            break;
        case 'ArrowUp':
            rightPaddleVelocity = -paddleVelocity;
            break;
        case 'ArrowDown':
            rightPaddleVelocity = paddleVelocity;
            break;
    }
}

function handleKeyUp(event) {
    switch (event.key) {
        case 'w':
        case 's':
            leftPaddleVelocity = 0;
            break;
        case 'ArrowUp':
        case 'ArrowDown':
            rightPaddleVelocity = 0;
            break;
    }
}

function updatePaddles() {
    leftPaddleY += leftPaddleVelocity;
    leftPaddleY = Math.max(0, Math.min(canvas.height - paddleHeight, leftPaddleY));

    rightPaddleY += rightPaddleVelocity;
    rightPaddleY = Math.max(0, Math.min(canvas.height - paddleHeight, rightPaddleY));
}

function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
}


/**
 * Converts an angle in radians to a velocity object with x and y components.
 * @param {number} angle - The angle in radians.
 * @param {number} speed - The speed of the ball.
 * @return {object} An object with 'x' and 'y' properties representing the velocity components.
 */
function angleToVelocity(angle, speed) {
    return {
        x: speed * Math.cos(angle),
        y: speed * Math.sin(angle)
    };
}

// Update game objects
function updateGame() {
    updatePaddles();
    // console.log('Ball position:', ballX, ballY);
    // console.log('Ball velocity:', ballVelocityX, ballVelocityY);
    // console.log('Game updating...');
    // console.log('Canvas width:', canvas.width);
    // console.log('Canvas height:', canvas.height);
    // Move the ball
    ballX += ballVelocityX;
    ballY += ballVelocityY;

    // Collision with top and bottom
    if (ballY <= 0 || ballY >= canvas.height) {
        ballVelocityY = -ballVelocityY;
        console.log('Ball hit top/bottom wall. New velocity:', ballVelocityY);
    }

    // Improved collision detection with paddles
    // Improved collision detection with paddles
    if ((ballX - ballSize / 2 <= paddleWidth && ballY + ballSize / 2 >= leftPaddleY && ballY - ballSize / 2 <= leftPaddleY + paddleHeight) ||
        (ballX + ballSize / 2 >= canvas.width - paddleWidth && ballY + ballSize / 2 >= rightPaddleY && ballY - ballSize / 2 <= rightPaddleY + paddleHeight)) {
        let hitPos = ballY - ((ballX < canvas.width / 2) ? (leftPaddleY + paddleHeight / 2) : (rightPaddleY + paddleHeight / 2));
        // Normalize the hit position to be between -1 and 1
        let normalizedHitPos = hitPos / (paddleHeight / 2); // Normalize hit position between -1 and 1
        let maxBounceAngle = Math.PI / 4; // 45 degrees in radians
        let angle = normalizedHitPos * maxBounceAngle;
        let speedIncreaseFactor = 1.05; // Increase speed by 5%
        let currentSpeed = Math.sqrt(ballVelocityX * ballVelocityX + ballVelocityY * ballVelocityY);
        let newSpeed = currentSpeed * speedIncreaseFactor;
        let newVelocityX = Math.sign(ballVelocityX) * newSpeed * Math.cos(angle); // Ensure the ball bounces off in the correct x direction
        let newVelocityY = newSpeed * Math.sin(angle);
        ballVelocityX = -newVelocityX; // Reverse X direction
        ballVelocityY = newVelocityY;
        console.log('Ball hit paddle. Angle:', angle);
        // Ensure the ball does not pass through the paddle
        if (ballX < canvas.width / 2) {
            ballX = paddleWidth + ballSize / 2; // Adjust ball position to just outside the left paddle
        } else {
            ballX = canvas.width - paddleWidth - ballSize / 2; // Adjust ball position to just outside the right paddle
        }
        // console.log('Ball hit paddle. New velocity:', ballVelocityX, ballVelocityY);
    }

    // Scoring
    if (ballX < 0) {
        scoreRight++;
        resetBall();
        console.log('Score updated. Right:', scoreRight);
    } else if (ballX > canvas.width) {
        scoreLeft++;
        resetBall();
        console.log('Score updated. Left:', scoreLeft);
    }

    // Draw everything
    // console.log('Calling drawGame...');
    drawGame();
}

// Draw game objects
function drawGame() {
    // console.log('Drawing game...');
    // console.log('Canvas width:', canvas.width);
    // console.log('Canvas height:', canvas.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw paddles
    ctx.fillStyle = 'white';
    ctx.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);
    ctx.fillRect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);

    // Draw ball
    ctx.fillStyle = 'white';
    ctx.fillRect(ballX - ballSize / 2, ballY - ballSize / 2, ballSize, ballSize);

    // Draw score
    ctx.fillStyle = '#ffcc00'; // Change color to yellow for better visibility
    ctx.font = '32px Arial'; // Increase font size for better readability
    ctx.fillText(`${scoreLeft} : ${scoreRight}`, canvas.width / 2 - 30, 30); // Adjust position based on new font size
    // console.log('Game drawn.');
}

// Reset ball position
function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballVelocityX = 3; // Ensure the ball has a consistent initial velocity
    ballVelocityY = 3;
}

// Start and reset game
function startGame() {
    if (!gameRunning) {
        console.log('Starting game...');
        canvas.width = parseInt(window.getComputedStyle(canvas).width, 10);  // Set canvas width based on CSS
        canvas.height = parseInt(window.getComputedStyle(canvas).height, 10); // Set canvas height based on CSS
        intervalId = setInterval(updateGame, 1000 / 60);
        gameRunning = true; // Ensure game state is set to running
    }
}

function resetGame() {
    clearInterval(intervalId);
    scoreLeft = 0;
    scoreRight = 0;
    resetBall();
    gameRunning = false; // Ensure game state is set to not running
    drawGame();
}

// Event listeners
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);
document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('resetButton').addEventListener('click', resetGame);
document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);
document.addEventListener('touchend', handleTouchEnd, false);

// Initial draw
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(function () {
        canvas.width = parseInt(window.getComputedStyle(canvas).width, 10);  // Set canvas width based on CSS
        canvas.height = parseInt(window.getComputedStyle(canvas).height, 10); // Set canvas height based on CSS
        canvas.style.display = 'block'; // Ensure canvas is displayed
        resetGame(); // Reset and draw the game to initialize everything correctly
    }, 0);
    resetGame(); // Reset and draw the game to initialize everything correctly
});