// on page load
document.addEventListener('DOMContentLoaded', function () {

// Game elements
    let canvas = document.getElementById('gameCanvas');
    let ctx = canvas.getContext('2d');

// Game variables
    let x;
    let y;
    let dx = 0.5;
    let dy = -0.5;
    let ballRadius = 5;
    let paddleHeight = 10;
    let paddleWidth = 75;
    let paddleX = (canvas.width - paddleWidth) / 2;
    let rightPressed = false;
    let leftPressed = false;
    let score = 0;
    let bricks = [];
    let brickRowCount = 10;
    let brickColumnCount = 10;
    let brickPadding = 10;
    let brickOffsetTop = 10;
    let brickOffsetLeft = 10;
    let gameRunning = false;
    let gameOver = false;

    function calculateSizes() {
        ballRadius = canvas.width * 0.01;
        paddleHeight = canvas.height * 0.02;
        paddleWidth = canvas.width * 0.15;
        paddleX = (canvas.width - paddleWidth) / 2;
        let brickAreaHeight = canvas.height * 0.5; // 50% of the canvas height
        brickWidth = (canvas.width - (2 * brickOffsetLeft) - (brickPadding * (brickColumnCount - 1))) / brickColumnCount;
        brickHeight = (brickAreaHeight - (2 * brickOffsetTop) - (brickPadding * (brickRowCount - 1))) / brickRowCount;
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = canvas.width * 0.005;
        dy = -canvas.height * 0.005;
    }

    let brickWidth;
    let brickHeight;

// Setup bricks
    function setupBricks() {
        for (let c = 0; c < brickColumnCount; c++) {
            bricks[c] = [];
            for (let r = 0; r < brickRowCount; r++) {
                bricks[c][r] = {x: 0, y: 0, status: 1};
            }
        }
        let brickAreaHeight = canvas.height * 0.5; // 50% of the canvas height
        brickWidth = (canvas.width - (2 * brickOffsetLeft) - (brickPadding * (brickColumnCount - 1))) / brickColumnCount;
        brickHeight = (brickAreaHeight - (2 * brickOffsetTop) - (brickPadding * (brickRowCount - 1))) / brickRowCount;
    }

// Draw game elements
    function drawBall() {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    }

    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    }

    function drawBricks() {
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                if (bricks[c][r].status == 1) {
                    let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                    let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    ctx.fillStyle = "#0095DD";
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }

    function drawScore() {
        ctx.font = "16px Arial";
        ctx.fillStyle = "#0095DD";
        ctx.fillText("Score: " + score, 8, 20);
    }

// Handle key presses
    function keyDownHandler(e) {
        if (e.key == "Right" || e.key == "ArrowRight") {
            rightPressed = true;
        } else if (e.key == "Left" || e.key == "ArrowLeft") {
            leftPressed = true;
        } else if (e.key == " ") {
            if (score == 0) {
                resetBall();
                setupBricks();
                draw();
            } else {
                if (paused) {
                    paused = false;
                    draw();
                } else {
                    paused = true;
                }
            }
        }
    }

    function touchStartHandler(e) {
        if (e.touches[0].clientX > canvas.width / 2) {
            rightPressed = true;
        } else {
            leftPressed = true;
        }
    }

    function touchEndHandler(e) {
        rightPressed = false;
        leftPressed = false;
    }

    function keyUpHandler(e) {
        if (e.key == "Right" || e.key == "ArrowRight") {
            rightPressed = false;
        } else if (e.key == "Left" || e.key == "ArrowLeft") {
            leftPressed = false;
        }
    }

    let paused = false;
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    canvas.addEventListener("touchstart", touchStartHandler, false);
    canvas.addEventListener("touchend", touchEndHandler, false);

    document.getElementById('startButton').addEventListener('click', function () {
        if (!gameRunning) {
        resetBall();
        setupBricks();
        draw();
            gameRunning = true;
            gameOver = false;
        }
    });

// Collision detection
    function collisionDetection() {
        for (let c = 0; c < Math.ceil(brickColumnCount); c++) {
            for (let r = 0; r < brickRowCount; r++) {
                let b = bricks[c][r];
                if (b.status == 1) {
                    if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                        dy = -dy;
                        b.status = 0;
                        score++;
                        if (score == brickRowCount * brickColumnCount) {
                            alert("Congratulations! You win!");
                            document.location.reload();
                        }
                    }
                }
            }
        }
    }

    function resetBall() {
        x = canvas.width / 2;
        y = canvas.height - 30;
    }

// Game loop
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks();
        drawBall();
        drawPaddle();
        drawScore();
        collisionDetection();

        if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }
        if (y + dy < ballRadius) {
            dy = -dy;
        } else if (y + dy > canvas.height - ballRadius) {
            if (x > paddleX && x < paddleX + paddleWidth) {
                dy = -dy;
            } else {
                alert("GAME OVER");
                gameOver = true;
                resetBall();
                document.location.reload();
            }
        }

        if (rightPressed && paddleX < canvas.width - paddleWidth) {
            paddleX += 7;
        } else if (leftPressed && paddleX > 0) {
            paddleX -= 7;
        }

        x += dx;
        y += dy;
        if (score < brickRowCount * brickColumnCount && !gameOver) {
            requestAnimationFrame(draw);
        }
    }

    window.addEventListener('resize', function () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        calculateSizes();
        draw();
    });

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    calculateSizes();
});