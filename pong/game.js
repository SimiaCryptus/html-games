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

import { randomBetween, calculateReflectionAngle, angleToVelocity } from './utils.js';

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
let ballVelocityX = 5;
let ballVelocityY = 5;

// Scores
let scoreLeft = 0;
let scoreRight = 0;

// Move paddles
function handleKeyDown(event) {
    console.log(`Key pressed: ${event.key}`); // Log key press for debugging
    switch(event.key) {
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
    switch(event.key) {
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

// Update game objects
function updateGame() {
    updatePaddles();
    console.log('Ball position:', ballX, ballY);
    console.log('Ball velocity:', ballVelocityX, ballVelocityY);
    console.log('Game updating...');
    console.log('Canvas width:', canvas.width);
    console.log('Canvas height:', canvas.height);
    // Move the ball
    ballX += ballVelocityX;
    ballY += ballVelocityY;

    // Collision with top and bottom
    if (ballY <= 0 || ballY >= canvas.height) {
        ballVelocityY = -ballVelocityY;
        console.log('Ball hit top/bottom wall. New velocity:', ballVelocityY);
    }

    // Collision with paddles
    if ((ballX <= paddleWidth && ballY >= leftPaddleY && ballY <= leftPaddleY + paddleHeight) ||
        (ballX >= canvas.width - paddleWidth && ballY >= rightPaddleY && ballY <= rightPaddleY + paddleHeight)) {
    let hitPos = (ballX < canvas.width / 2) ? (leftPaddleY + paddleHeight / 2) : (rightPaddleY + paddleHeight / 2);
        let angle = calculateReflectionAngle(ballY, hitPos, paddleHeight);
        let velocity = angleToVelocity(angle, Math.sqrt(ballVelocityX * ballVelocityX + ballVelocityY * ballVelocityY));
        ballVelocityX = velocity.x;
        ballVelocityY = velocity.y;
        console.log('Ball hit paddle. New velocity:', ballVelocityX, ballVelocityY);
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
    console.log('Calling drawGame...');
    drawGame();
}

// Draw game objects
function drawGame() {
    console.log('Drawing game...');
    console.log('Canvas width:', canvas.width);
    console.log('Canvas height:', canvas.height);
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
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.fillText(`${scoreLeft} : ${scoreRight}`, canvas.width / 2 - 50, 50);
    console.log('Game drawn.');
}

// Reset ball position
function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballVelocityX = 5; // Ensure the ball has a consistent initial velocity
    ballVelocityY = 5;
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
 document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        canvas.width = parseInt(window.getComputedStyle(canvas).width, 10);  // Set canvas width based on CSS
        canvas.height = parseInt(window.getComputedStyle(canvas).height, 10); // Set canvas height based on CSS
        canvas.style.display = 'block'; // Ensure canvas is displayed
        resetGame(); // Reset and draw the game to initialize everything correctly
    }, 0);
    resetGame(); // Reset and draw the game to initialize everything correctly
 });