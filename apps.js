const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// ===== Responsive canvas =====
function resizeCanvas() {
    const size = Math.min(window.innerWidth * 0.9, 400);
    canvas.width = size;
    canvas.height = size;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// ===== Game variables =====
const grid = 20;
let snake = [];
let dx = grid;
let dy = 0;
let food = {};
let score = 0;
let gameRunning = false;
let gameTimeout;

// ===== Start button =====
const startBtn = document.createElement("button");
startBtn.textContent = "Start Game";
startBtn.style.position = "absolute";
startBtn.style.top = "20px";
startBtn.style.left = "50%";
startBtn.style.transform = "translateX(-50%)";
startBtn.style.padding = "10px 20px";
startBtn.style.fontSize = "16px";
document.body.appendChild(startBtn);

startBtn.addEventListener("click", () => {
    if (!gameRunning) {
        initGame();
        startBtn.style.display = "none";
    }
});

// ===== Initialize game =====
function initGame() {
    snake = [{ x: canvas.width / 2, y: canvas.height / 2 }];
    dx = grid;
    dy = 0;
    score = 0;
    food = randomFood();
    gameRunning = true;
    gameLoop();
}

// ===== Game loop =====
function gameLoop() {
    if (!gameRunning) return;

    gameTimeout = setTimeout(() => {
        requestAnimationFrame(gameLoop);

        const head = { x: snake[0].x + dx, y: snake[0].y + dy };
        snake.unshift(head);

        // Eat food
        if (head.x === food.x && head.y === food.y) {
            food = randomFood();
            score++;
        } else {
            snake.pop();
        }

        // Collision detection
        if (
            head.x < 0 || head.x >= canvas.width ||
            head.y < 0 || head.y >= canvas.height ||
            snake.slice(1).some(s => s.x === head.x && s.y === head.y)
        ) {
            gameOver();
        }

        draw();
    }, 100);
}

// ===== Draw =====
function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "lime";
    snake.forEach(s => ctx.fillRect(s.x, s.y, grid - 2, grid - 2));

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, grid - 2, grid - 2);
}

// ===== Food =====
function randomFood() {
    const tiles = canvas.width / grid;
    return {
        x: Math.floor(Math.random() * tiles) * grid,
        y: Math.floor(Math.random() * tiles) * grid
    };
}

// ===== Keyboard controls =====
document.addEventListener("keydown", e => {
    if (!gameRunning) return;
    if (e.key === "ArrowLeft" && dx === 0) { dx = -grid; dy = 0; }
    else if (e.key === "ArrowUp" && dy === 0) { dx = 0; dy = -grid; }
    else if (e.key === "ArrowRight" && dx === 0) { dx = grid; dy = 0; }
    else if (e.key === "ArrowDown" && dy === 0) { dx = 0; dy = grid; }
});

// ===== Touch swipe controls =====
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener("touchstart", e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

canvas.addEventListener("touchend", e => {
    if (!gameRunning) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const dxSwipe = touchEndX - touchStartX;
    const dySwipe = touchEndY - touchStartY;

    if (Math.abs(dxSwipe) > Math.abs(dySwipe)) {
        // Horizontal swipe
        if (dxSwipe > 0 && dx === 0) { dx = grid; dy = 0; }
        else if (dxSwipe < 0 && dx === 0) { dx = -grid; dy = 0; }
    } else {
        // Vertical swipe
        if (dySwipe > 0 && dy === 0) { dx = 0; dy = grid; }
        else if (dySwipe < 0 && dy === 0) { dx = 0; dy = -grid; }
    }
});

// ===== Game over =====
function gameOver() {
    gameRunning = false;
    clearTimeout(gameTimeout);
    alert("Game Over! Score: " + score);
    startBtn.style.display = "block";
}
