document.addEventListener('DOMContentLoaded', function () {
    const gameArea = document.getElementById('gameArea');
    const startButton = document.getElementById('startButton');
    const scoreboard = document.getElementById('scoreBoard'); // Fix ID reference
    let cities = [];
    let batteries = [];
    let missiles = [];
    let interceptors = [];
    let gameInterval;
    let score = 0;

    function startGame() {
        //console.log('Starting game...');
        setupGame();
        gameInterval = setInterval(gameLoop, 100); // Run game loop every 100ms
        startButton.style.display = 'none'; // Hide start button during game
    }

    function setupGame() {
        //console.log('Setting up game...');
        // Clear previous game data
        cities = [];
        batteries = [];
        missiles = [];
        interceptors = [];
        score = 0;
        updateScoreboard();

        // Setup cities and batteries
        const gameAreaWidth = gameArea.clientWidth;
        const citySpacing = gameAreaWidth / 7; // 6 cities, 7 spaces
        const batterySpacing = gameAreaWidth / 4; // 3 batteries, 4 spaces

        for (let i = 0; i < 6; i++) {
            let city = document.createElement('div');
            city.className = 'city';
           city.style.left = `${citySpacing * (i + 1) - citySpacing / 2}px`;
            city.style.bottom = '0px'; // Ensure cities are positioned at the bottom
            gameArea.appendChild(city);
            cities.push(city);

            if (i % 2 === 0) { // Place batteries between some cities
                let battery = document.createElement('div');
                battery.className = 'battery';
               battery.style.left = `${batterySpacing * (i / 2 + 1) - batterySpacing / 2}px`;
                battery.style.bottom = '0px'; // Ensure batteries are positioned at the bottom
                gameArea.appendChild(battery);
                batteries.push(battery);
            }
        }
    }

    function gameLoop() {
        //console.log('Running game loop...');
        moveMissiles();
        moveInterceptors();
        checkCollisions();
        spawnEnemyMissile();
        if (cities.length === 0) {
            gameOver();
        }
    }

    function moveMissiles() {
        missiles.forEach((missile, index) => {
            missile.y += 3; // Move missile downwards
            missile.element.style.top = `${missile.y}px`;
            if (missile.y + missile.element.offsetHeight >= gameArea.height - cities[0].offsetHeight) { // Missile has reached the bottom
                console.log('Missile reached the bottom');
                gameArea.removeChild(missile.element);
                missiles.splice(index, 1);
            }
        });
    }

    function moveInterceptors() {
        interceptors.forEach((interceptor, index) => {
            interceptor.x += interceptor.dx;
            interceptor.y += interceptor.dy;
            interceptor.element.style.top = `${interceptor.y}px`;
            interceptor.element.style.left = `${interceptor.x}px`;
           let angle = Math.atan2(interceptor.dy, interceptor.dx) * 180 / Math.PI + 90; // Adjust angle to match flight direction
           interceptor.element.style.transform = `rotate(${angle}deg)`;
            if (Math.abs(interceptor.x - interceptor.targetX) < 10 && Math.abs(interceptor.y - interceptor.targetY) < 10) {
                // Interceptor reached the target position
                gameArea.removeChild(interceptor.element);
                interceptors.splice(index, 1);
                createExplosion(interceptor.x, interceptor.y, 2); // 2x radius explosion
                checkExplosionCollisions(interceptor.x, interceptor.y, 2);
            } else if (interceptor.y < 0) {
                gameArea.removeChild(interceptor.element);
                interceptors.splice(index, 1);
            }
        });
    }

    function checkExplosionCollisions(explosionX, explosionY, scale) {
        const explosionRadius = 20 * scale; // Assuming base radius is 20
        missiles.forEach((missile, missileIndex) => {
            if (Math.abs(missile.x - explosionX) < explosionRadius && Math.abs(missile.y - explosionY) < explosionRadius) {
                console.log('Missile destroyed by explosion');
                gameArea.removeChild(missile.element);
                missiles.splice(missileIndex, 1);
                score += 10;
                updateScoreboard();
            }
        });
    }

    function checkCollisions() {
        missiles.forEach((missile, missileIndex) => {
            // Check collision with cities
            cities.forEach((city, cityIndex) => {
                if (Math.abs(missile.x - city.offsetLeft) < 20 && missile.y >= city.offsetTop) {
                    console.log('City hit by missile');
                    gameArea.removeChild(city);
                    cities.splice(cityIndex, 1);
                    gameArea.removeChild(missile.element);
                    missiles.splice(missileIndex, 1);
                    createExplosion(missile.x, missile.y);
                }
            });
            // Check collision with batteries
            batteries.forEach((battery, batteryIndex) => {
                if (Math.abs(missile.x - battery.offsetLeft) < 20 && missile.y >= battery.offsetTop) {
                    console.log('Battery hit by missile');
                    gameArea.removeChild(battery);
                    batteries.splice(batteryIndex, 1);
                    gameArea.removeChild(missile.element);
                    missiles.splice(missileIndex, 1);
                    createExplosion(missile.x, missile.y);
                }
            });
        });
        interceptors.forEach((interceptor, interceptorIndex) => {
            missiles.forEach((missile, missileIndex) => {
                if (Math.abs(interceptor.x - missile.x) < 5 && Math.abs(interceptor.y - missile.y) < 5) {
                    console.log('Missile intercepted');
                    gameArea.removeChild(interceptor.element);
                    interceptors.splice(interceptorIndex, 1);
                    gameArea.removeChild(missile.element);
                    missiles.splice(missileIndex, 1);
                    createExplosion(missile.x, missile.y);
                    score += 10;
                    updateScoreboard();
                }
            });
        });
    }

    function spawnEnemyMissile() {
        //console.log('Attempting to spawn enemy missile...');
        if (Math.random() < 0.1) { // 10% chance to spawn a missile each loop
            console.log('Spawning enemy missile...');
            let missile = document.createElement('div');
            missile.className = 'missile';
            missile.style.position = 'absolute'; // Ensure missile is positioned absolutely within gameArea
           missile.style.left = `${Math.random() * gameArea.clientWidth}px`;
            missile.style.top = '0px';
            gameArea.appendChild(missile);

            missiles.push({
                element: missile,
                x: parseInt(missile.style.left, 10),
                y: 0
            });
        }
    }

    function updateScoreboard() {
        scoreboard.textContent = `Score: ${score}`;
    }

    function createExplosion(x, y, scale = 1) {
        let explosion = document.createElement('div');
        explosion.className = 'explosion';
        explosion.style.left = `${x}px`;
        explosion.style.top = `${y}px`;
        explosion.style.transform = `scale(${scale})`; // Scale the explosion
        gameArea.appendChild(explosion);
        setTimeout(() => {
            gameArea.removeChild(explosion);
        }, 500);
    }

    function gameOver() {
        clearInterval(gameInterval);
        console.log('Game over'); // Log game over event
        startButton.textContent = 'Restart Game';
        startButton.style.display = 'block';
        alert('Game Over! Your final score is: ' + score);
    }

    gameArea.addEventListener('click', function (event) {
        let x = event.clientX - gameArea.offsetLeft;
        let y = event.clientY - gameArea.offsetTop;
        console.log('Interceptor launch attempt at x:', x); // Log interceptor launch attempt
        let closestBattery = batteries.reduce((prev, curr) => {
            return (Math.abs(curr.offsetLeft - x) < Math.abs(prev.offsetLeft - x) ? curr : prev);
        });

        if (!closestBattery) {
            console.log('No battery available');
            return;
        } // Ensure there is a closest battery

        let interceptor = document.createElement('div');
        interceptor.className = 'interceptor';
        interceptor.style.position = 'absolute'; // Ensure interceptor is positioned absolutely within gameArea
        interceptor.style.left = `${closestBattery.offsetLeft + closestBattery.offsetWidth / 2}px`; // Center on battery
        interceptor.style.top = `${closestBattery.offsetTop}px`; // Start from the top of the battery
        interceptor.style.height = '20px'; // Set a height for the interceptor
        interceptor.style.width = '2px'; // Set a width for the interceptor
        interceptor.style.backgroundColor = 'red'; // Set a color for visibility
        gameArea.appendChild(interceptor);
        console.log('Interceptor launched'); // Log successful interceptor launch

        let dx = x - (closestBattery.offsetLeft + closestBattery.offsetWidth / 2);
        let dy = y - closestBattery.offsetTop;
        interceptors.push({
            element: interceptor,
            x: closestBattery.offsetLeft + closestBattery.offsetWidth / 2,
            y: closestBattery.offsetTop,
            dx: dx / 50, // 2x speed
            dy: dy / 50,  // 2x speed
            targetX: x,
            targetY: y
        });
    });

    startButton.addEventListener('click', startGame);
});