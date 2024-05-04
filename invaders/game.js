// Game.js

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
const bulletSpeed = 5;

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
}

function movePlayer(direction) {
    const currentLeft = parseInt(window.getComputedStyle(player).getPropertyValue('left'));
    if (direction === 'left' && currentLeft > 0) {
        player.style.left = `${currentLeft - playerSpeed}px`;
    } else if (direction === 'right' && currentLeft < 450) {
        player.style.left = `${currentLeft + playerSpeed}px`;
    }
}

function shoot() {
    let bullet = document.createElement('div');
    bullet.className = 'bullet';
    bullet.style.left = `${parseInt(window.getComputedStyle(player).getPropertyValue('left')) + 15}px`; // Adjust bullet's initial left position to align with player center
    bullet.style.bottom = '50px';
    gameArea.appendChild(bullet);
    bullets.push(bullet);
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
    } else {
        invaders.forEach(invader => {
            invader.style.left = `${parseInt(window.getComputedStyle(invader).getPropertyValue('left')) + 10}px`;
        });
    }
}

function moveBullets() {
    for (let bullet of bullets) {
        let bulletBottom = parseInt(window.getComputedStyle(bullet).getPropertyValue('bottom'));
        if (bulletBottom >= 600) {
            bullet.remove();
            bullets = bullets.filter(b => b !== bullet);
        } else {
            bullet.style.bottom = `${bulletBottom + bulletSpeed}px`;
            bullet.style.backgroundColor = '#f00'; // Ensuring bullet color
        }
    }
}

function checkCollisions() {
    for (let bullet of bullets) {
        for (let invader of invaders) {
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
    }
}

function gameLoop() {
    moveBullets();
    moveInvaders(); // Add this to move invaders in each game loop iteration
    checkCollisions();
    // Additional game logic here
}

function startGame() {
    createInvaders();
    gameInterval = setInterval(gameLoop, 50);
    startButton.style.display = 'none'; // Hide start button when game starts
}

function stopGame() {
    clearInterval(gameInterval);
    // Handle game over logic
}

startButton.addEventListener('click', startGame);

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