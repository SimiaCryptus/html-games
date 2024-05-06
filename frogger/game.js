// Game constants
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
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
let animationFrameId;

// Load images
const frogImage = new Image();
frogImage.src = 'player.png';
const carImage = new Image();
carImage.src = 'car.png';
const logImage = new Image();
logImage.src = 'log.png';

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

// Initialize game objects
function initGame() {
    cars = [
        { x: 100, y: 100, speed: 2 },
        { x: 300, y: 200, speed: 3 },
        { x: 500, y: 300, speed: 4 }
    ];
    logs = [
        { x: 50, y: 150, speed: -2 },
        { x: 250, y: 250, speed: -3 }
    ];
    score = 0;
    requestAnimationFrame(updateGame);
}

// Game update function
function updateGame() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw frog
    ctx.drawImage(frogImage, frogX, frogY, frogWidth, frogHeight);

    // Update and draw cars
    cars.forEach(car => {
        car.x += car.speed;
        if (car.x > canvasWidth || car.x < -carWidth) {
            car.x = -carWidth; // Reset car position
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
    animationFrameId = requestAnimationFrame(updateGame);
}

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
}

// Start the game
document.getElementById('startButton').addEventListener('click', initGame);