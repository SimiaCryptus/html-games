// Game constants
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let canvasWidth = window.innerWidth;
let canvasHeight = window.innerHeight;
const roadHeight = canvasHeight * 0.2;

const frogWidth = 30;
const frogHeight = 30;
const carWidth = 50;
const carHeight = 30;
const logWidth = 120;
const logHeight = 30;

// Game variables
let frogX = canvasWidth / 2 - frogWidth / 2;
let frogY = canvasHeight - frogHeight;
let score = 0;
let cars = [];
let logs = [];
let gameLoop;

// Load images
const frogImage = new Image();
frogImage.src = 'player.png';
const carImage = new Image();
carImage.src = 'car.png';
const logImage = new Image();
logImage.src = 'log.png';

function resizeCanvas() {
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    frogY = canvasHeight - frogHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
}
resizeCanvas();
// Event listeners for player input
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            frogY -= frogHeight;
            break;
        case 'ArrowDown':
            frogY += frogHeight;
            break;
        case 'ArrowLeft':
            frogX -= frogWidth;
            break;
        case 'ArrowRight':
            frogX += frogWidth;
            break;
    }
    event.preventDefault();
});

// Function to handle touch movements
function handleTouchMove(event) {
    const touchX = event.touches[0].clientX;
    const touchY = event.touches[0].clientY;
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;

    if (touchY < centerY - frogHeight && Math.abs(centerX - touchX) < 4*frogWidth) {
        frogY -= frogHeight; // Move up
    } else if (touchY > centerY + frogHeight && Math.abs(centerX - touchX) < 2*frogWidth) {
        frogY += frogHeight; // Move down
    } else if (touchX < centerX - frogWidth) {
        frogX -= frogWidth; // Move left
    } else if (touchX > centerX + frogWidth) {
        frogX += frogWidth; // Move right
    }
    event.preventDefault();
}

// Add touch event listeners
canvas.addEventListener('touchstart', handleTouchMove, false);

// Initialize game objects
function initGame() {
    cars = [
        { x: 100, y: canvasHeight * 0.2, speed: 2, lane: 1, direction: 1 },
        { x: canvasWidth - 100, y: canvasHeight * 0.3, speed: 2, lane: 2, direction: -1 },
        { x: 300, y: canvasHeight * 0.4, speed: 3, lane: 3, direction: 1 },
        { x: canvasWidth - 300, y: canvasHeight * 0.5, speed: 3, lane: 4, direction: -1 },
        { x: 500, y: canvasHeight * 0.6, speed: 4, lane: 5, direction: 1 },
        { x: canvasWidth - 500, y: canvasHeight * 0.7, speed: 4, lane: 6, direction: -1 },
        { x: 200, y: canvasHeight * 0.8, speed: 3, lane: 7, direction: 1 },
        { x: canvasWidth - 200, y: canvasHeight * 0.9, speed: 3, lane: 8, direction: -1 }
    ];
    logs = [
        { x: 50, y: canvasHeight * 0.3, speed: -2 },
        { x: 250, y: canvasHeight * 0.5, speed: -3 }
    ];
    score = 0;
    document.getElementById('startButton').style.display = 'none';
    requestAnimationFrame(updateGame);
}

// Game update function
function updateGame() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw roads
    const roadColors = ['#6c6c6c', '#8c8c8c'];
    for (let i = 1; i <= 4; i++) {
        ctx.fillStyle = roadColors[(i - 1) % 2];
        ctx.fillRect(0, canvasHeight * (i * 0.2), canvasWidth, roadHeight);

        // Draw road lines
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.setLineDash([10, 10]);
        ctx.beginPath();
        ctx.moveTo(0, canvasHeight * (i * 0.2) + roadHeight / 2);
        ctx.lineTo(canvasWidth, canvasHeight * (i * 0.2) + roadHeight / 2);
        ctx.stroke();
    }

    // Draw frog
    ctx.drawImage(frogImage, frogX, frogY, frogWidth, frogHeight);

    // Update and draw cars
    cars.forEach(car => {
        car.x += car.speed * car.direction;
        if (car.direction === 1 && car.x > canvasWidth + carWidth) {
            car.x = -carWidth; // Reset car position when it goes off the right edge
        } else if (car.direction === -1 && car.x < -carWidth) {
            car.x = canvasWidth + carWidth; // Reset car position when it goes off the left edge
        }
        ctx.drawImage(carImage, car.x, car.y, carWidth, carHeight);
    });

    // Update and draw logs
    logs.forEach(log => {
        log.x += log.speed;
        if (log.x > canvasWidth || log.x < -logWidth) {
            log.x = -logWidth; // Reset log position
        }
        ctx.drawImage(logImage, log.x, log.y, logWidth, logHeight);
    });

    // Collision detection
    checkCollisions();

    // Update score
    document.getElementById('score').textContent = score;

    // Request next animation frame
    gameLoop = requestAnimationFrame(updateGame);
}

// Resize canvas on window resize
window.addEventListener('resize', resizeCanvas);

// Check for collisions
function checkCollisions() {
    cars.forEach(car => {
        if (frogX < car.x + carWidth &&
            frogX + frogWidth > car.x &&
            frogY < car.y + carHeight &&
            frogY + frogHeight > car.y) {
            resetFrog(); // Reset frog position if collision with car
        }
    });
}

// Reset frog position
function resetFrog() {
    frogX = canvasWidth / 2 - frogWidth / 2;
    frogY = canvasHeight - frogHeight;
    score = 0; // Reset score on collision
    document.getElementById('startButton').style.display = 'block';
}

// Start the game
document.getElementById('startButton').addEventListener('click', initGame);