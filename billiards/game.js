document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    const startButton = document.getElementById('startButton');
    const resetButton = document.getElementById('resetButton');

    const ballRadius = 10;
    const velocityTolerance = 0.01;
    let tableWidth = canvas.width;
    let tableHeight = canvas.height;

    let balls = [];
    let cue = {angle: 0};

    let isCharging = false;
    let chargePower = 0;
 
    function resizeCanvas() {
        const aspectRatio = 2; // 800 / 400 = 2
        const container = document.getElementById('game-container');
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        if (containerWidth / containerHeight > aspectRatio) {
            canvas.height = containerHeight;
            canvas.width = containerHeight * aspectRatio;
        } else {
            canvas.width = containerWidth;
            canvas.height = containerWidth / aspectRatio;
        }

        tableWidth = canvas.width;
        tableHeight = canvas.height;
        drawGame();
    }

    function initGame() {
        // Initialize balls and cue position
        const centerX = tableWidth / 2;
        const centerY = tableHeight / 2;
        balls = createBalls();
        cue.angle = 0;
        drawGame();
    }

    function createBalls() {
        const colors = ['white', 'red', 'yellow', 'blue', 'green', 'purple', 'orange', 'brown'];
        const balls = [];
        let index = 0;
       const positions = [
           {x: tableWidth / 4, y: tableHeight / 2}, // cue ball
           {x: tableWidth * 3 / 4, y: tableHeight / 2}, // 8-ball
           {x: tableWidth * 3 / 4 + 20, y: tableHeight / 2 - 10},
           {x: tableWidth * 3 / 4 + 20, y: tableHeight / 2 + 10},
           {x: tableWidth * 3 / 4 + 40, y: tableHeight / 2 - 20},
           {x: tableWidth * 3 / 4 + 40, y: tableHeight / 2},
           {x: tableWidth * 3 / 4 + 40, y: tableHeight / 2 + 20},
           {x: tableWidth * 3 / 4 + 60, y: tableHeight / 2 - 30},
           {x: tableWidth * 3 / 4 + 60, y: tableHeight / 2 - 10},
           {x: tableWidth * 3 / 4 + 60, y: tableHeight / 2 + 10},
           {x: tableWidth * 3 / 4 + 60, y: tableHeight / 2 + 30}
       ];
        positions.forEach(pos => {
            balls.push({x: pos.x, y: pos.y, vx: 0, vy: 0, color: colors[index % colors.length]});
            index++;
        });
        return balls;
    }

    function drawGame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBalls();
       if (!isCueBallMoving() && balls.length > 0) {
            drawCue();
        }
    }

    function drawBalls() {
        balls.forEach(ball => {
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
            ctx.fillStyle = ball.color;
            ctx.fill();
            ctx.closePath();
        });
    }

    function drawCue() {
        const cueBall = balls[0];
        ctx.save();
        ctx.translate(cueBall.x - Math.cos(cue.angle) * chargePower, cueBall.y - Math.sin(cue.angle) * chargePower);
        ctx.rotate(cue.angle);
        ctx.beginPath();
        ctx.rect(0, -2.5, -100, 5); // Draw a rectangle to represent the cue stick
        ctx.fillStyle = '#8B4513'; // Brown color for the cue stick
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }

    function updateGame() {
        // Update ball positions and handle collisions
        balls.forEach(ball => {
            ball.x += ball.vx;
            ball.y += ball.vy;

            // Handle wall collisions
            if (ball.x < ballRadius || ball.x > tableWidth - ballRadius) ball.vx *= -1;
            if (ball.y < ballRadius || ball.y > tableHeight - ballRadius) ball.vy *= -1;

            // Apply friction
            ball.vx *= 0.99;
            ball.vy *= 0.99;
        });

        handleBallCollisions();
        drawGame();
       if (!isCueBallMoving()) {
        drawCue();
    }
    }

    function isAnyBallMoving() {
        return balls.some(ball => Math.abs(ball.vx) > velocityTolerance || Math.abs(ball.vy) > velocityTolerance);
    }

   function isCueBallMoving() {
       const cueBall = balls[0];
       return Math.abs(cueBall.vx) > velocityTolerance || Math.abs(cueBall.vy) > velocityTolerance;
   }
    function handleBallCollisions() {
        for (let i = 0; i < balls.length; i++) {
            for (let j = i + 1; j < balls.length; j++) {
                const ball1 = balls[i];
                const ball2 = balls[j];
                const dx = ball2.x - ball1.x;
                const dy = ball2.y - ball1.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < ballRadius * 2) {
                    // Calculate angle, sine, and cosine
                    const angle = Math.atan2(dy, dx);
                    const sin = Math.sin(angle);
                    const cos = Math.cos(angle);

                    // Rotate ball1's position
                    let x1 = 0;
                    let y1 = 0;

                    // Rotate ball2's position
                    let x2 = dx * cos + dy * sin;
                    let y2 = dy * cos - dx * sin;

                    // Rotate ball1's velocity
                    let vx1 = ball1.vx * cos + ball1.vy * sin;
                    let vy1 = ball1.vy * cos - ball1.vx * sin;

                    // Rotate ball2's velocity
                    let vx2 = ball2.vx * cos + ball2.vy * sin;
                    let vy2 = ball2.vy * cos - ball2.vx * sin;

                    // Collision reaction
                    const vxTotal = vx1 - vx2;
                    vx1 = ((ballRadius - ballRadius) * vx1 + (ballRadius + ballRadius) * vx2) / (ballRadius + ballRadius);
                    vx2 = vxTotal + vx1;

                    // Update positions to avoid overlap
                    const absV = Math.abs(vx1) + Math.abs(vx2);
                    const overlap = (ballRadius * 2 - Math.abs(x2 - x1)) / absV;
                    ball1.x -= vx1 * overlap;
                    ball2.x += vx2 * overlap;

                    // Rotate positions back
                    const x1Final = x1 * cos - y1 * sin;
                    const y1Final = y1 * cos + x1 * sin;
                    const x2Final = x2 * cos - y2 * sin;
                    const y2Final = y2 * cos + x2 * sin;

                    // Update ball positions
                    ball2.x = ball1.x + x2Final;
                    ball2.y = ball1.y + y2Final;
                    ball1.x = ball1.x + x1Final;
                    ball1.y = ball1.y + y1Final;

                    // Rotate velocities back
                    ball1.vx = vx1 * cos - vy1 * sin;
                    ball1.vy = vy1 * cos + vx1 * sin;
                    ball2.vx = vx2 * cos - vy2 * sin;
                    ball2.vy = vy2 * cos + vx2 * sin;
                }
            }
        }
    }

    function shootCueBall() {
        // Implement shooting logic
        balls[0].vx = Math.cos(cue.angle) * chargePower * 0.1;
        balls[0].vy = Math.sin(cue.angle) * chargePower * 0.1;
        chargePower = 0;
    }

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const cueBall = balls[0];
        if (!isAnyBallMoving()) {
            cue.angle = Math.atan2(mouseY - cueBall.y, mouseX - cueBall.x);
        }
        drawGame();
    });

    canvas.addEventListener('mousedown', () => {
        if (!isAnyBallMoving()) {
            isCharging = true;
            chargePower = 0;
        }
    });

    canvas.addEventListener('mouseup', () => {
        if (isCharging) {
            shootCueBall();
            isCharging = false;
        }
    });

    initGame();
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    setInterval(updateGame, 1000 / 60);
 
    setInterval(() => {
        if (isCharging && chargePower < 100) chargePower += 1;
    }, 1000 / 60);

 });