// Game constants
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let canvasWidth = document.documentElement.clientWidth;
let canvasHeight = document.documentElement.clientHeight;
const roadHeight = canvasHeight * 0.1;

const frogWidth = 30;
const frogHeight = roadHeight / 2;
const carWidth = 50;
const carHeight = roadHeight / 2;
const logWidth = 120;
const logHeight = roadHeight / 2; // Same height as the frog

// Game variables
let frogX = canvasWidth / 2 - frogWidth / 2;
let frogY = canvasHeight - frogHeight;
let score = 0;
let cars = [];
let logs = [];
let gameLoop;
let gameRunning = false;

// Load images
const frogImage = new Image();
frogImage.src = 'player.png';
const carImage = new Image();
carImage.src = 'car.png';
const logImage = new Image();
logImage.src = 'log.png';

const waterImage = new Image();
waterImage.src = 'water.png';

function resizeCanvas() {
    canvasWidth = document.documentElement.clientWidth;
    canvasHeight = document.documentElement.clientHeight;
    //roadHeight = canvasHeight * 0.1;
    frogY = canvasHeight - frogHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    console.log(`Canvas resized to ${canvasWidth}x${canvasHeight}`);
}

resizeCanvas();

// Event listeners for player input
document.addEventListener('keydown', (event) => {
    console.log(`Key pressed: ${event.key}`);
    switch (event.key) {
        case 'ArrowUp':
            frogY -= frogHeight;
            console.log(`Frog position: (${frogX}, ${frogY}); lane ${Math.floor(frogY / (roadHeight / 2))}`);
            break;
        case 'ArrowDown':
            frogY += frogHeight;
            console.log(`Frog position: (${frogX}, ${frogY}); lane ${Math.floor(frogY / (roadHeight / 2))}`);
            break;
        case 'ArrowLeft':
            frogX -= frogWidth;
            console.log(`Frog position: (${frogX}, ${frogY}); lane ${Math.floor(frogY / (roadHeight / 2))}`);
            break;
        case 'ArrowRight':
            frogX += frogWidth;
            console.log(`Frog position: (${frogX}, ${frogY}); lane ${Math.floor(frogY / (roadHeight / 2))}`);
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
    console.log(`Touch move detected at (${touchX}, ${touchY})`);

    if (touchY < centerY - frogHeight && Math.abs(centerX - touchX) < 4 * frogWidth) {
        frogY -= frogHeight; // Move up
        console.log(`Frog position: (${frogX}, ${frogY}); lane ${Math.floor(frogY / (roadHeight / 2))}`);
    } else if (touchY > centerY + frogHeight && Math.abs(centerX - touchX) < 2 * frogWidth) {
        frogY += frogHeight; // Move down
        console.log(`Frog position: (${frogX}, ${frogY}); lane ${Math.floor(frogY / (roadHeight / 2))}`);
    } else if (touchX < centerX - frogWidth) {
        frogX -= frogWidth; // Move left
        console.log(`Frog position: (${frogX}, ${frogY}); lane ${Math.floor(frogY / (roadHeight / 2))}`);
    } else if (touchX > centerX + frogWidth) {
        frogX += frogWidth; // Move right
        console.log(`Frog position: (${frogX}, ${frogY}); lane ${Math.floor(frogY / (roadHeight / 2))}`);
    }
    event.preventDefault();
}

// Add touch event listeners
canvas.addEventListener('touchstart', handleTouchMove, false);

// Initialize game objects
function initGame() {
    gameRunning = true;
    const safeZoneHeight = canvasHeight - (roadHeight / 2); // Safe zone for the frog to start
    cars = [
        {x: 100, y: 0, speed: 2, lane: 1, direction: 1},
        {x: canvasWidth - 100, y: 1, speed: 2, lane: 2, direction: -1},
        {x: 300, y: 3, speed: 3, lane: 3, direction: 1},
        {x: canvasWidth - 300, y: 4, speed: 3, lane: 4, direction: -1},
        {x: 500, y: 6, speed: 4, lane: 5, direction: 1},
        {x: canvasWidth - 500, y: 7, speed: 4, lane: 6, direction: -1},
        {x: 200, y: 9, speed: 3, lane: 7, direction: 1},
        {x: canvasWidth - 200, y: 10, speed: 3, lane: 8, direction: -1},
        {x: 200, y: 12, speed: 3, lane: 7, direction: 1},
        {x: canvasWidth - 200, y: 13, speed: 3, lane: 8, direction: -1},
        {x: 200, y: 15, speed: 3, lane: 7, direction: 1},
        {x: canvasWidth - 200, y: 16, speed: 3, lane: 8, direction: -1}
    ].map(car => ({
        ...car,
        y: (car.y * (roadHeight / 2)) // Adjust car positions to center within lanes
    }));
    logs = [
        {x: 50, y: (canvasHeight * 0.5) - roadHeight, speed: -2}
    ];
    score = 0;
    document.getElementById('startButton').style.display = 'none';
    console.log('Game initialized');
    frogX = canvasWidth / 2 - frogWidth / 2;
    frogY = safeZoneHeight;
    console.log(`Initial frog position: (${frogX}, ${frogY}) in lane ${Math.floor(frogY / (roadHeight / 2))}`);
    console.log(`Initial cars: ${JSON.stringify(cars)}`);
    console.log(`Initial logs: ${JSON.stringify(logs)}`);
    requestAnimationFrame(updateGame);
}

// Game update function
function updateGame() {
    if (!gameRunning) return;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw roads
    const roadColors = ['#6c6c6c', '#8c8c8c']; // Alternating road colors
    const riverLaneIndex = 8; // Index of the river lane (0-based)
    for (let i = 0; i < 18; i++) {
        if (i === riverLaneIndex) {
            // Draw water
            ctx.drawImage(waterImage, 0, canvasHeight * (i * 0.05), canvasWidth, roadHeight);
        } else {
            // Draw road lane
            ctx.fillStyle = roadColors[i % 2];
            ctx.fillRect(0, canvasHeight * (i * 0.05), canvasWidth, roadHeight / 2);
            i++;
            // Draw road lane
            ctx.fillStyle = roadColors[i % 2];
            ctx.fillRect(0, canvasHeight * (i * 0.05), canvasWidth, roadHeight / 2);
            i++;
            if (i === riverLaneIndex) {
                // Draw water
                ctx.drawImage(waterImage, 0, canvasHeight * (i * 0.05), canvasWidth, roadHeight);
            } else {
                // Draw safe lane
                ctx.fillStyle = '#00ff00';
                ctx.fillRect(0, canvasHeight * (i * 0.05), canvasWidth, roadHeight / 2);
            }
        }

    }

    for (let i = 0; i < 18; i++) {
        if (i === riverLaneIndex) {
        } else {
            // Draw road lines
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 3;
            ctx.setLineDash([10, 10]);
            ctx.beginPath();
            ctx.moveTo(0, canvasHeight * (i * 0.05) + roadHeight / 2);
            ctx.lineTo(canvasWidth, canvasHeight * (i * 0.05) + roadHeight / 2);
            ctx.stroke();
            i++;
            i++;
        }

    }

    // Draw frog
    ctx.drawImage(frogImage, frogX, frogY, frogWidth, frogHeight);

    // Update and draw cars
    cars.forEach(car => {
        car.x += car.speed * car.direction;
        if (car.direction === 1 && car.x > canvasWidth + carWidth) {
            car.x = -carWidth; // Reset car position when it goes off the right edge
            //console.log(`Car reset to left edge: lane ${car.lane}, position (${car.x}, ${car.y})`);
        } else if (car.direction === -1 && car.x < -carWidth) {
            car.x = canvasWidth + carWidth; // Reset car position when it goes off the left edge
            //console.log(`Car reset to right edge: lane ${car.lane}, position (${car.x}, ${car.y})`);
        }
        // console.log(`Car position: (${car.x}, ${car.y}), lane ${car.lane}`);
        ctx.drawImage(carImage, car.x, car.y, carWidth, carHeight);
    });

    // Update and draw logs
    logs.forEach(log => {
        log.x += log.speed;
        if (log.speed > 0 && log.x > canvasWidth) {
            log.x = -logWidth; // Reset log position when it goes off the right edge
            //console.log('Log reset to left edge');
        } else if (log.speed < 0 && log.x < -logWidth) {
            log.x = canvasWidth; // Reset log position when it goes off the left edge
            //console.log('Log reset');
        }
        //console.log(`Log position: (${log.x}, ${log.y})`);
        ctx.drawImage(logImage, log.x, log.y, logWidth, logHeight);
    });

    // Collision detection
    checkCollisions();

    // Update score
    document.getElementById('score').textContent = `Score: ${score}`;

    // Request next animation frame
    gameLoop = requestAnimationFrame(updateGame);
}

// Resize canvas on window resize
window.addEventListener('resize', resizeCanvas);

// Check for collisions
function checkCollisions() {
    /* safeLanes = every 3rd row */
    const safeLanes = [0, 2, 5, 8, 11, 14, 17];
    cars.forEach(car => {
        if (frogX < car.x + carWidth &&
            frogX + frogWidth > car.x &&
            frogY < car.y + carHeight &&
            frogY + frogHeight > car.y) {
            const frogLane = Math.floor(frogY / (roadHeight / 2));
            if (!safeLanes.includes(frogLane)) {
                resetFrog(); // Reset frog position if collision with car
                console.log('Collision detected with car');
            }
        }
    });
}

// Reset frog position
function resetFrog() {
    stopGame();
    frogX = canvasWidth / 2 - frogWidth / 2;
    frogY = canvasHeight - frogHeight;
    score = 0; // Reset score on collision
    document.getElementById('startButton').style.display = 'block';
    console.log('Frog position reset');
    console.log(`New frog position: (${frogX}, ${frogY}); lane ${Math.floor(frogY / (roadHeight / 2))}`);
}

// Stop the game
function stopGame() {
    gameRunning = false;
    cancelAnimationFrame(gameLoop);
    cars = [];
    logs = [];
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    console.log('Game stopped');
}

// Start the game
document.getElementById('startButton').addEventListener('click', initGame);
console.log('Game started');