// Game variables
let canvas, ctx;
let player, enemies = [];
let playerImage, enemyImage;
let projectiles = [];
let gameInterval, score = 0, isGameOver = false;

// Setup touch controls
function setupTouchControls() {
    let ongoingTouches = [];
    let lastTouchX, lastTouchY;
    let lastTouchTime = 0; // Initialize lastTouchTime
    let playerControlledByTouch = false;

    function handleStart(evt) {
        evt.preventDefault();
        let touches = evt.changedTouches;
        let currentTime = new Date().getTime();  // Get the current time
        if (currentTime - lastTouchTime < 300 && touches.length === 1) {  // Check if it's a single tap within 300 ms
            // Trigger shooting
            projectiles.push({
                x: player.x + player.width / 2 - projectileWidth / 2,
                y: player.y - projectileHeight,
                width: projectileWidth,
                height: projectileHeight,
                firedBy: 'player', // Identify who fired the projectile
                direction: 'up'
            });
        }
        lastTouchTime = currentTime;  // Update the last touch time

        for (let i = 0; i < touches.length; i++) {
            ongoingTouches.push(copyTouch(touches[i]));
            playerControlledByTouch = true;
            lastTouchX = touches[i].pageX;
            lastTouchY = touches[i].pageY;
        }
    }

    function handleMove(evt) {
        evt.preventDefault();
        let touches = evt.changedTouches;

        for (let i = 0; i < touches.length; i++) {
            let idx = ongoingTouchIndexById(touches[i].identifier);
            if (idx >= 0 && playerControlledByTouch) {
                let deltaX = touches[i].pageX - lastTouchX;
                let deltaY = touches[i].pageY - lastTouchY;
                player.x += deltaX;
                player.y += deltaY;
                lastTouchX = touches[i].pageX;
                lastTouchY = touches[i].pageY;
                ongoingTouches.splice(idx, 1, copyTouch(touches[i]));
            }
        }
    }

    function handleEnd(evt) {
        evt.preventDefault();
        let touches = evt.changedTouches;

        for (let i = 0; i < touches.length; i++) {
            let idx = ongoingTouchIndexById(touches[i].identifier);
            if (idx >= 0) {
                ongoingTouches.splice(idx, 1);
                if (ongoingTouches.length === 0) {
                    playerControlledByTouch = false;
                }
            }
        }
    }

    function handleCancel(evt) {
        evt.preventDefault();
        let touches = evt.changedTouches;

        for (let i = 0; i < touches.length; i++) {
            let idx = ongoingTouchIndexById(touches[i].identifier);
            if (idx >= 0) {
                ongoingTouches.splice(idx, 1);
                if (ongoingTouches.length === 0) {
                    playerControlledByTouch = false;
                }
            }
        }
    }

    function copyTouch({ identifier, pageX, pageY }) {
        return { identifier, pageX, pageY };
    }

    function ongoingTouchIndexById(idToFind) {
        for (let i = 0; i < ongoingTouches.length; i++) {
            if (ongoingTouches[i].identifier === idToFind) {
                return i;
            }
        }
        return -1; // not found
    }

    canvas.addEventListener("touchstart", handleStart, false);
    canvas.addEventListener("touchend", handleEnd, false);
    canvas.addEventListener("touchcancel", handleCancel, false);
    canvas.addEventListener("touchmove", handleMove, false);
}
function startGame() {
    document.getElementById('startButton').style.display = 'none'; // Hide start button when game starts
    gameInterval = setInterval(gameLoop, 33); // Start the game loop
}
// Spaceship and projectile dimensions
const playerWidth = 50, playerHeight = 30;
const enemyWidth = 50, enemyHeight = 30;
const projectileWidth = 5, projectileHeight = 10;

// Player movement
const moveSpeed = 5;

// Setup the game
function setupGame() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 600;

    // Load player and enemy images
    playerImage = new Image();
    playerImage.src = 'spaceship.png';
    enemyImage = new Image();
    enemyImage.src = 'enemy.png';

    // Create player spaceship
    player = {
        x: canvas.width / 2,
        y: canvas.height - 60,
        width: playerWidth,
        height: playerHeight,
        health: 100
    };
    // Remove marked enemies and projectiles after all checks are done
    enemies = enemies.filter((_, index) => !enemiesToRemove.has(index));
    projectiles = projectiles.filter((_, index) => !projectilesToRemove.has(index));

    // Start game loop
    gameInterval = setInterval(gameLoop, 33); // ~30 fps
   setupTouchControls();
}

// Game loop
function gameLoop() {
    if (isGameOver) {
        return;
    }

    clearCanvas();
    moveEnemies();
    moveProjectiles();
    checkCollisions();
    drawEverything();
    updateScore();
}

// Clear the canvas
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Move the player based on keyboard input
function setupPlayerControls() {
    document.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft' && player.x > 0) {
            player.x -= moveSpeed;
        } else if (e.key === 'ArrowRight' && player.x < canvas.width - playerWidth) {
            player.x += moveSpeed;
        } else if (e.key === 'ArrowUp' && player.y > 0) {
            player.y -= moveSpeed;
        } else if (e.key === 'ArrowDown' && player.y < canvas.height - playerHeight) {
            player.y += moveSpeed;
        } else if (e.key === ' ' && !isGameOver) { // Spacebar to shoot
            // Create a projectile
            projectiles.push({
                x: player.x + player.width / 2 - projectileWidth / 2,
                y: player.y - projectileHeight,
                width: projectileWidth,
                 height: projectileHeight,
                firedBy: 'player', // Identify who fired the projectile
                 direction: 'up'
            });
        }
    });
}

// Create and move enemies
function moveEnemies() {
    const topTwoThirds = canvas.height * 2 / 3;
    let enemiesToRemove = [];
    enemies.forEach(enemy => {
        // Improved movement logic towards the target position
        let stepX = enemy.targetX - enemy.x;
        let stepY = enemy.targetY - enemy.y;
        let distance = Math.sqrt(stepX * stepX + stepY * stepY);
        if (distance < 1.0) {
            console.log(`Enemy at (${enemy.x}, ${enemy.y}) reached target`);
            // Assign new target position within the top 2/3 of the screen
            enemy.targetX = getRandomInt(1, canvas.width - enemyWidth - 1); // X position remains the same
            enemy.targetY = getRandomInt(1, topTwoThirds - enemyHeight - 1); // Adjust Y to be within reach
            console.log(`Enemy at (${enemy.x}, ${enemy.y}) new target is (${enemy.targetX}, ${enemy.targetY})`);
        }
        let moveX = (distance > 0) ? (stepX / distance) : 0;
        let moveY = (distance > 0) ? (stepY / distance) : 0;
        let newX = enemy.x + moveX;
        let newY = enemy.y + moveY;
       if (newY <= topTwoThirds - enemyHeight - 1) {
           enemy.y = newY; // Only update y if within the top two-thirds
       }
        if (enemy.y >= topTwoThirds - enemyHeight - 1) {
            enemy.y--;
            console.log(`Enemy at (${enemy.x}, ${enemy.y}) reached the top`);
            enemy.targetX = getRandomInt(1, canvas.width - enemyWidth - 1); // X position remains the same
            enemy.targetY = getRandomInt(1, topTwoThirds - enemyHeight - 1); // Adjust Y to be within reach
            console.log(`Enemy at (${enemy.x}, ${enemy.y}) new target is (${enemy.targetX}, ${enemy.targetY})`);
        }
        enemy.x = clamp(newX, 0, canvas.width - enemyWidth);
    });

    // Spawn a new enemy occasionally, but only if there are less than a certain number
    if (Math.random() < 0.001 && enemies.length < 5) { // Adjust spawn rate and max enemies
        enemies.push({
            x: getRandomInt(0, canvas.width - enemyWidth),
            y: getRandomInt(0, topTwoThirds - enemyHeight),
            width: enemyWidth,
            height: enemyHeight,
           targetX: getRandomInt(0, canvas.width - enemyWidth),
           targetY: getRandomInt(0, topTwoThirds - enemyHeight)
        });
        console.log('New enemy spawned');
    }
    enemies.forEach((enemy, index) => {
        // Enemies shoot occasionally
        if (Math.random() < 0.01) { // Adjust shooting frequency
            projectiles.push({
                x: enemy.x + enemy.width / 2 - projectileWidth / 2,
                y: enemy.y + enemy.height,
                width: projectileWidth,
                height: projectileHeight,
                firedBy: 'enemy', // Identify who fired the projectile
                direction: 'down' // Correcting the direction of the projectile
            });
            projectiles.push({
                x: enemy.x + enemy.width / 2 - projectileWidth / 2,
                y: enemy.y + enemy.height,
                width: projectileWidth,
                height: projectileHeight,
                firedBy: 'enemy', // Identify who fired the projectile
                direction: 'down' // Correcting the direction of the projectile
            });
            console.log(`Enemy at (${enemy.x}, ${enemy.y}) shot a projectile`);
        }
    });

    // Remove enemies that moved out of bounds
    for (let i = enemiesToRemove.length - 1; i >= 0; i--) {
        enemies.splice(enemiesToRemove[i], 1);
    }
}

// Create and move projectiles
function moveProjectiles() {
    projectiles.forEach((projectile, index) => {
        if (projectile.direction === 'up') {
            projectile.y -= 10; // Move projectile up
        } else if (projectile.direction === 'down') {
            projectile.y += 10; // Move projectile down
        }
        if (projectile.direction === 'up') {
            projectile.y -= 10; // Move projectile up
        } else if (projectile.direction === 'down') {
            projectile.y += 10; // Move projectile down
        }
        // Remove projectile if it goes out of canvas
        if (projectile.y + projectileHeight < 0) {
        }
    });
    projectiles.forEach((projectile, index) => {
        projectile.y -= 10; // Move projectile up
        // Remove projectile if it goes out of canvas
        if (projectile.y + projectileHeight < 0) {
            projectiles.splice(index, 1);
        }
    });
    // Example projectile movement logic
}

// Check for collisions
function checkCollisions() {
    enemies.forEach((enemy, eIndex) => {
        if (checkCollision(player, enemy)) {
            gameOver();
        }
        // Check collisions between projectiles and enemies
        projectiles.forEach((projectile, pIndex) => {
            if (projectile.firedBy === 'player' && checkCollision(projectile, enemy)) {
                // Increase score
                score += 10;
                // Remove enemy and projectile
                projectiles.splice(pIndex, 1);
                enemies.splice(eIndex, 1);
            }
            // Check if enemy projectile hits the player
            if (projectile.firedBy === 'enemy' && checkCollision(projectile, player)) {
                gameOver();
            }
        });
    });
    // Example collision detection logic
}

// Draw player, enemies, and projectiles
function drawEverything() {
    // Draw player with image
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);

    // Draw enemies with image
    enemies.forEach(enemy => {
        ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
    });

    // Draw projectiles
    projectiles.forEach(projectile => {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(projectile.x, projectile.y, projectileWidth, projectileHeight);
    });
}

// Update game score
function updateScore() {
    document.getElementById('score').textContent = `Score: ${score}`;
}

// End the game
function gameOver() {
    clearInterval(gameInterval);
    isGameOver = true;
    alert('Game Over!');
    document.getElementById('gameOverScreen').style.display = 'block';
}

// Initialize the game
window.onload = function () {
    setupGame();
    setupPlayerControls();
    document.getElementById('startButton').style.display = 'block'; // Show start button initially
};