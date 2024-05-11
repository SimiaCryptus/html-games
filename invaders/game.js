// Game.js

function restartGame() {
    // Reset game state
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
let touchstartX = 0;
let touchendX = 0;
const touchSensitivity = 30; // Reduced sensitivity for better swipe detection

const gameArea = document.getElementById('gameArea');
const player = document.createElement('div');
player.id = 'player';
player.className = 'player';
gameArea.appendChild(player);
const startButton = document.getElementById('startButton');
const scoreBoard = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
gameArea.addEventListener('touchend', handleSwipeGesture, false);
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

gameArea.addEventListener('touchmove', handleTouchMove, false);

function createInvaders() {
    for (let i = 0; i < 24; i++) {
        let invader = document.createElement('div');
        invader.className = 'invader';
        invader.style.left = `${i % 8 * 50}px`;
        invader.style.top = `${Math.floor(i / 8) * 50}px`;
        gameArea.appendChild(invader);
        invaders.push(invader);
    }
    setInterval(() => {
        console.log('Attempting to shoot from invader...');
        invaderShoot();
    }, 1000); // Invaders shoot every 2 seconds with debug log
}

function movePlayer(direction) {
    const currentLeft = parseInt(window.getComputedStyle(player).getPropertyValue('left'));
    if (direction === 'left' && currentLeft > 0) {
        player.style.left = `${currentLeft - playerSpeed}px`;
    } else if (direction === 'right' && currentLeft < gameArea.clientWidth - player.offsetWidth) {
        player.style.left = `${currentLeft + playerSpeed}px`;
    }
}

function shoot() {
   const currentTime = Date.now();
   if (currentTime - lastShotTime < shootCooldown) return; // Check if cooldown period has passed
    let bullet = document.createElement('div');
    bullet.className = 'bullet';
    bullet.style.left = `${parseInt(window.getComputedStyle(player).getPropertyValue('left')) + 15}px`; // Adjust bullet's initial left position to align with player center
    bullet.style.bottom = '50px';
    gameArea.appendChild(bullet);
    bullets.push(bullet);
   lastShotTime = currentTime; // Update last shot time
}

function moveInvaders() {
    let anyReverse = false;
    invaders.forEach(invader => {
        let invaderLeft = parseInt(window.getComputedStyle(invader).getPropertyValue('left'));
        if (invaderLeft >= gameArea.clientWidth || invaderLeft < 0) {
            anyReverse = true;
        }
    });
    if (anyReverse) {
        reverse = !reverse;
        invaders.forEach(invader => {
            let invaderTop = parseInt(window.getComputedStyle(invader).getPropertyValue('top'));
            invader.style.top = `${invaderTop + 10}px`; // Move down when changing direction
        });
    }
    if (reverse) {
        invaders.forEach(invader => {
            invader.style.left = `${parseInt(window.getComputedStyle(invader).getPropertyValue('left')) - 10}px`; // Change direction
        });
    } else { // Correctly move invaders without the incorrect log
        invaders.forEach(invader => {
            invader.style.left = `${parseInt(window.getComputedStyle(invader).getPropertyValue('left')) + 10}px`;
        });
    }
}

function moveBullets() {
    for (let bullet of bullets) {
        let bulletBottom = parseInt(window.getComputedStyle(bullet).getPropertyValue('bottom'));
        if (bulletBottom >= window.innerHeight) {
            bullet.remove();
            bullets = bullets.filter(b => b !== bullet);
            console.log('Bullet removed: reached top of the screen');
        } else {
            if (bullet.classList.contains('invaderBullet')) {
                bullet.style.bottom = `${bulletBottom - bulletSpeed}px`; // Move invader bullets downwards
                // console.log(`Invader bullet moved to bottom: ${bullet.style.bottom}`);
                bullet.style.backgroundColor = '#0f0'; // Green color for invader bullets
            } else {
                bullet.style.bottom = `${bulletBottom + bulletSpeed}px`; // Move player bullets upwards
                bullet.style.backgroundColor = '#f00'; // Red color for player bullets
                // console.log(`Player bullet moved to top: ${bullet.style.bottom}`);
            }
        }
    }
}

function checkCollisions() {
    for (let bullet of bullets) {
        let bulletRect = bullet.getBoundingClientRect();
        let targets = bullet.classList.contains('invaderBullet') ? [player] : invaders; // Set targets based on bullet type
        for (let invader of targets) {
            let bulletRect = bullet.getBoundingClientRect();
            let invaderRect = invader.getBoundingClientRect();
            if (bulletRect.left < invaderRect.right &&
                bulletRect.right > invaderRect.left &&
                bulletRect.top < invaderRect.bottom &&
                bulletRect.bottom > invaderRect.top) {
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
                bullet.remove();
                bullets = bullets.filter(b => b !== bullet);
                lives -= 1;
                livesDisplay.innerText = `Lives: ${lives}`;
                if (lives <= 0) {
                    alert(`Game Over! Your score: ${score}`);
                    stopGame();
                }
            }
        }
    }
}

function gameLoop() {
    moveBullets();
    moveInvaders(); // Add this to move invaders in each game loop iteration
    checkCollisions();
    if (invaders.length === 0) {
        console.log('All invaders defeated!');
        stopGame();
    }
    // Additional game logic here
}

function startGame() {
    createInvaders();
    gameInterval = setInterval(gameLoop, 50);
    startButton.style.display = 'none'; // Hide start button when game starts
}

function stopGame() {
    clearInterval(gameInterval);
    console.log('Game Over');
    startButton.innerText = 'Restart';
    startButton.style.display = 'block';
    startButton.onclick = restartGame; // Set up restart game function
    livesDisplay.innerText = `Lives: ${lives}`;
    scoreBoard.innerText = `Score: ${score}`;
    if (lives <= 0) {
        alert(`Game Over! Your score: ${score}`);
    }
}

startButton.addEventListener('click', startGame);

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        movePlayer('left');
    } else if (event.key === 'ArrowRight') {
        movePlayer('right');
    } else if (event.code === 'Space' || event.key === ' ') {
       shoot();
        shoot();
        console.log('Shot fired'); // Log shooting action
    }
});


gameArea.addEventListener('touchstart', (e) => {
    touchstartX = e.changedTouches[0].screenX;
    console.log(`Touch start: ${touchstartX}`); // Log touch start position
    e.preventDefault(); // Prevent default browser behavior
}, false);

function handleTouchMove(e) {
    let touchX = e.changedTouches[0].screenX;
    let gameAreaRect = gameArea.getBoundingClientRect();
    let targetX = touchX - gameAreaRect.left - player.offsetWidth / 2;
    let currentLeft = parseInt(window.getComputedStyle(player).getPropertyValue('left'));
    let newPlayerLeft = currentLeft + (targetX > currentLeft ? playerSpeed : -playerSpeed);
    if (Math.abs(targetX - currentLeft) > playerSpeed) {
        newPlayerLeft = Math.max(0, Math.min(gameArea.clientWidth - player.offsetWidth, newPlayerLeft));
        player.style.left = `${newPlayerLeft}px`;
    }
    e.preventDefault(); // Prevent default browser behavior
}

// Removed duplicated touchend event listener

// Remove the duplicated touchend event listener for shooting
function handleSwipeGesture(e) {
    touchendX = event.changedTouches[0].screenX;
    console.log(`Touch end: ${touchendX}`); // Log touch end position
    if (touchendX < touchstartX - touchSensitivity) {
        movePlayer('left');
        console.log('Swiped left'); // Log swipe left action
    } else if (touchendX > touchstartX + touchSensitivity) {
        movePlayer('right');
        console.log('Swiped right'); // Log swipe right action
    } else if (Math.abs(touchendX - touchstartX) < 10) { // Ensure minimal horizontal movement for shooting
        // Only shoot if there was no significant horizontal movement
        shoot();
        console.log('Shot fired'); // Log shooting action
    }
    e.preventDefault(); // Prevent default browser behavior
}


// Integrated shooting logic into the existing touchend listener