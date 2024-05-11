// Game.js
let keysPressed = {};
function restartGame() {
    // Reset game state
    console.log('Restarting game');
    score = 0;
    lives = 3;
    bullets.forEach(bullet => bullet.remove());
    bullets = [];
    invaders.forEach(invader => invader.remove());
    invaders = [];

    createInvaders();
    startGame();
}

function invaderShoot() {
    // Adding a random chance for shooting
    if (Math.random() < 0.7) { // 30% chance to shoot
        let bottomInvaders = invaders.filter(inv => {
            return !invaders.some(other => {
                return other !== inv && parseInt(window.getComputedStyle(other).getPropertyValue('left')) === parseInt(window.getComputedStyle(inv).getPropertyValue('left')) && parseInt(window.getComputedStyle(other).getPropertyValue('top')) > parseInt(window.getComputedStyle(inv).getPropertyValue('top'));
            });
        });
        if (bottomInvaders.length === 0) return; // No invaders are at the bottom to shoot
        let shootingInvader = bottomInvaders[Math.floor(Math.random() * bottomInvaders.length)];
        let bullet = document.createElement('div');
        bullet.className = 'invaderBullet';
        bullet.classList.add('bullet'); // Ensure bullet is styled correctly
        bullet.style.left = `${parseInt(window.getComputedStyle(shootingInvader).getPropertyValue('left')) + 20}px`; // Center bullet on invader
        bullet.style.bottom = `${gameArea.clientHeight - parseInt(window.getComputedStyle(shootingInvader).getPropertyValue('top')) + 40}px`; // Correctly position bullet at the bottom of the invader
        gameArea.appendChild(bullet);
        bullets.push(bullet);
        console.log('Invader shot fired!');
    }
}

// Touch event handling
let touchX = 0;
let touchY = 0;
const touchSensitivity = 30; // Reduced sensitivity for better swipe detection

const gameArea = document.getElementById('gameArea');
const player = document.createElement('div');
player.id = 'player';
player.classList.add('player');
console.log('Player element created');
const startButton = document.getElementById('startButton');
const scoreBoard = document.getElementById('score');
let invaders = [];
let bullets = [];
let score = 0;
let lives = 3;
let gameInterval;
let reverse = false;

// Player setup
const playerSpeed = 10;
const bulletSpeed = 30; // Increased bullet speed for faster travel
const shootCooldown = 500; // 500 milliseconds cooldown between shots
let lastShotTime = 0; // Time when the last shot was fired
gameArea.addEventListener('touchstart', handleTouchStart, false);
gameArea.addEventListener('touchmove', handleTouchMove, false);

function createInvaders() {
    for (let i = 0; i < 24; i++) {
        console.log(`Creating invader ${i}`);
        let invader = document.createElement('div');
        invader.className = 'invader';
        invader.style.left = `${i % 8 * 50}px`;
        invader.style.top = `${Math.floor(i / 8) * 50}px`;
        gameArea.appendChild(invader);
        invaders.push(invader);
        console.log(`Invader ${i} created at (${invader.style.left}, ${invader.style.top})`);
    }
    console.log('All invaders created');
    setInterval(() => {
        console.log('Attempting to shoot from invader...');
        invaderShoot();
    }, 1000); // Invaders shoot every 2 seconds with debug log
}

function movePlayer(direction) {
    console.log(`Moving player ${direction}`);
    const currentLeft = player ? parseInt(window.getComputedStyle(player).getPropertyValue('left')) : 0;
    console.log(`Current player position: ${currentLeft}`);
    if (direction === 'left' && currentLeft > 0) {
        player.style.left = `${currentLeft - playerSpeed}px`;
    } else if (direction === 'right' && currentLeft < gameArea.clientWidth - player.offsetWidth) {
        console.log(`Moving player right, new position: ${currentLeft + playerSpeed}`);
        player.style.left = `${currentLeft + playerSpeed}px`;
    }
}

function shoot() {
    const currentTime = Date.now();
    if (currentTime - lastShotTime < shootCooldown) return; // Check if cooldown period has passed
    console.log('Player shooting');
    console.log(`Player position: (${window.getComputedStyle(player).getPropertyValue('left')}, ${window.getComputedStyle(player).getPropertyValue('bottom')})`);
    const bullet = document.createElement('div');
    bullet.className = 'bullet';
    bullet.style.left = `${parseInt(window.getComputedStyle(player).getPropertyValue('left')) + 15}px`; // Adjust bullet's initial left position to align with player center
    bullet.style.bottom = '50px';
    gameArea.appendChild(bullet);
    bullets.push(bullet);
    lastShotTime = currentTime; // Update last shot time
}

function moveInvaders() {
    console.log('Moving invaders');
    let anyReverse = false;
    console.log(`Current reverse direction: ${reverse}`);
    invaders.forEach(invader => {
        let invaderLeft = parseInt(window.getComputedStyle(invader).getPropertyValue('left'));
        if (invaderLeft >= gameArea.clientWidth || invaderLeft < 0) {
            anyReverse = true;
        }
    });
    if (anyReverse) {
        reverse = !reverse;
        console.log(`Reversing direction, new reverse: ${reverse}`);
        invaders.forEach(invader => {
            let invaderTop = parseInt(window.getComputedStyle(invader).getPropertyValue('top'));
            invader.style.top = `${invaderTop + 10}px`; // Move down when changing direction
        });
    }
    if (reverse) {
        invaders.forEach(invader => {
            console.log(`Moving invader left, current position: (${window.getComputedStyle(invader).getPropertyValue('left')}, ${window.getComputedStyle(invader).getPropertyValue('top')})`);
            invader.style.left = `${parseInt(window.getComputedStyle(invader).getPropertyValue('left')) - 10}px`; // Change direction
        });
    } else { // Correctly move invaders without the incorrect log
        console.log('Moving invaders right');
        invaders.forEach(invader => {
            invader.style.left = `${parseInt(window.getComputedStyle(invader).getPropertyValue('left')) + 10}px`;
        });
    }
}

function moveBullets() {
    console.log('Moving bullets');
    for (let bullet of bullets) {
        let bulletBottom = parseInt(window.getComputedStyle(bullet).getPropertyValue('bottom'));
        if (bulletBottom >= window.innerHeight) {
            bullet.remove();
            console.log(`Bullet removed, reached top at position: ${bulletBottom}`);
            bullets = bullets.filter(b => b !== bullet);
            console.log('Bullet removed: reached top of the screen');
        } else {
            if (bullet.classList.contains('invaderBullet')) {
                bullet.style.bottom = `${bulletBottom - bulletSpeed}px`; // Move invader bullets downwards
                // console.log(`Invader bullet moved to bottom: ${bullet.style.bottom}`);
                bullet.style.backgroundColor = '#f0f'; // Purple color for invader bullets
            } else {
                bullet.style.bottom = `${bulletBottom + bulletSpeed}px`; // Move player bullets upwards
                bullet.style.backgroundColor = '#f00'; // Red color for player bullets
                // console.log(`Player bullet moved to top: ${bullet.style.bottom}`);
            }
        }
    }
}

function checkCollisions() {
    console.log('Checking collisions');
    for (let bullet of bullets) {
        console.log(`Checking bullet at position: (${bullet.style.left}, ${bullet.style.bottom})`);
        if (!bullet.parentElement) continue; // Skip removed bullets
        let bulletRect = bullet.getBoundingClientRect();
        let targets = bullet.classList.contains('invaderBullet') ? [player] : invaders; // Set targets based on bullet type
        for (let invader of targets) {
            let bulletRect = bullet.getBoundingClientRect();
            let invaderRect = invader.getBoundingClientRect();
            if (bulletRect.left < invaderRect.right &&
                bulletRect.right > invaderRect.left &&
                bulletRect.top < invaderRect.bottom &&
                bulletRect.bottom > invaderRect.top) {
                console.log(`Collision detected between bullet and invader at (${invaderRect.left}, ${invaderRect.top})`);
                invader.remove();
                bullet.remove();
                score += 10;
                scoreBoard.innerText = `Score: ${score}`; // Update score immediately
                invaders = invaders.filter(i => i !== invader);
                bullets = bullets.filter(b => b !== bullet);
            }
        }
        // Check collision between invader bullets and player
        if (bullet.classList.contains('invaderBullet')) {
            let playerRect = player.getBoundingClientRect();
            if (bulletRect.left < playerRect.right &&
                bulletRect.right > playerRect.left &&
                bulletRect.top < playerRect.bottom &&
                bulletRect.bottom > playerRect.top) {
                console.log(`Collision detected between invader bullet and player at (${playerRect.left}, ${playerRect.top})`);
                bullet.remove();
                bullets = bullets.filter(b => b !== bullet);
                lives -= 1;
                if (lives <= 0) {
                    alert(`Game Over! Your score: ${score}`);
                    stopGame();
                }
            }
        }
    }
}

function gameLoop() {
    console.log('Game loop running');
    updatePlayerPosition();
    moveBullets();
    moveInvaders(); // Add this to move invaders in each game loop iteration
    checkCollisions();
    if (invaders.length === 0) {
        console.log('All invaders defeated!');
        alert('You won! All invaders defeated.');
        stopGame();
    }
    console.log(`Invaders count: ${invaders.length}`);
    invaders.forEach((inv, index) => {
        console.log(`Invader ${index} position: left=${inv.style.left}, top=${inv.style.top}`);
    });
    bullets.forEach((bullet, index) => {
        console.log(`Bullet ${index} position: left=${bullet.style.left}, bottom=${bullet.style.bottom}`);
    });
    console.log('Game loop completed');
    // Additional game logic here
}

function startGame() {
    console.log('Starting game');
    console.log('Appending player to game area');
    console.log('Player element:', player);
    console.log('Player element:', player);
    gameArea.appendChild(player); // Add player when game starts
    createInvaders();
    gameInterval = setInterval(gameLoop, 50);
    startButton.style.display = 'none'; // Hide start button when game starts
    gameArea.addEventListener('touchend', handleSwipeGesture, false);
    console.log('Game started with interval ID:', gameInterval);
}

function updatePlayerPosition() {
    if (keysPressed['ArrowLeft']) {
        movePlayer('left');
    }
    if (keysPressed['ArrowRight']) {
        movePlayer('right');
    }
}

function stopGame() {
    console.log('Stopping game');
    clearInterval(gameInterval);
    console.log('Game Over');
    startButton.textContent = 'Restart';
    startButton.style.display = 'block';
    startButton.onclick = restartGame; // Set up restart game function
    gameArea.removeEventListener('touchend', handleSwipeGesture, false);
    scoreBoard.innerText = `Score: ${score}`;
    console.log(`Final score: ${score}`);
    if (lives <= 0) {
        alert(`Game Over! Your score: ${score}`);
    }
}

startButton.addEventListener('click', startGame);

console.log('Adding keydown event listener to document');
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        movePlayer('left');
    } else if (event.key === 'ArrowRight') {
        movePlayer('right');
    } else if (event.code === 'Space' || event.key === ' ') {
        shoot();
        console.log('Shot fired'); // Log shooting action
    }
});

document.addEventListener('keydown', (event) => {
    keysPressed[event.key] = true;
    if (event.code === 'Space' || event.key === ' ') {
        shoot();
    }
});

document.addEventListener('keyup', (event) => {
    delete keysPressed[event.key];
});

function handleTouchStart(e) {
    console.log('Touch start event');
    touchX = e.changedTouches[0].clientX;
    touchY = e.changedTouches[0].clientY;
    e.preventDefault(); // Prevent default browser behavior
}

function handleTouchMove(e) {
    console.log('Touch move event');
    let currentTouchX = e.changedTouches[0].clientX;
    console.log(`Current touch X position: ${currentTouchX}`);
    let gameAreaRect = gameArea.getBoundingClientRect();
    let targetX = currentTouchX - gameAreaRect.left - player.offsetWidth / 2;
    let currentLeft = parseInt(window.getComputedStyle(player).getPropertyValue('left'));
    let deltaX = targetX - currentLeft;
    let newPlayerLeft = Math.max(0, Math.min(gameArea.clientWidth - player.offsetWidth, currentLeft + deltaX));
    player.style.left = `${newPlayerLeft}px`;
    e.preventDefault(); // Prevent default browser behavior
}

function handleSwipeGesture(e) {
    console.log('Swipe gesture event');
    let touchEndX = e.changedTouches[0].clientX;
    console.log(`Touch end X position: ${touchEndX}`);
    let touchEndY = e.changedTouches[0].clientY;

    if (Math.abs(touchEndX - touchX) < 10 && Math.abs(touchEndY - touchY) < 10) {
        shoot();
        console.log('Shot fired'); // Log shooting action
    } else {
        let deltaX = touchEndX - touchX;
        let deltaY = touchEndY - touchY;
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            console.log(`Horizontal swipe detected, delta X: ${deltaX}`);
            if (deltaX < -touchSensitivity) {
                movePlayer('left');
                console.log('Swiped left');
            } else if (deltaX > touchSensitivity) {
                movePlayer('right');
            }
        }
    }
    e.preventDefault(); // Prevent default browser behavior
}