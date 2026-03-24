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
const speed = 200; // HALVED speed (was 100ms)

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

// ===== Arrow button control panel =====
const controlsDiv = document.createElement("div");
controlsDiv.style.position = "absolute";
controlsDiv.style.bottom = "20px";
controlsDiv.style.left = "50%";
controlsDiv.style.transform = "translateX(-50%)";
controlsDiv.style.display = "grid";
controlsDiv.style.gridTemplateColumns = "repeat(3, 60px)";
controlsDiv.style.gridTemplateRows = "repeat(2, 60px)";
controlsDiv.style.gap = "10px";
document.body.appendChild(controlsDiv);

// Create buttons
const btnUp = document.createElement("button");
btnUp.textContent = "↑";
const btnLeft = document.createElement("button");
btnLeft.textContent = "←";
const btnDown = document.createElement("button");
btnDown.textContent = "↓";
const btnRight = document.createElement("button");
btnRight.textContent = "→";

// Arrange in grid
controlsDiv.appendChild(document.createElement("div")); // empty
controlsDiv.appendChild(btnUp);
controlsDiv.appendChild(document.createElement("div")); // empty
controlsDiv.appendChild(btnLeft);
controlsDiv.appendChild(btnDown);
controlsDiv.appendChild(btnRight);

// Button styles
[btnUp, btnDown, btnLeft, btnRight].forEach(b => {
    b.style.fontSize = "24px";
    b.style.padding = "10px";
});

// Button event listeners
btnUp.addEventListener("click", () => { if(dy===0) { dx=0; dy=-grid; } });
btnDown.addEventListener("click", () => { if(dy===0) { dx=0; dy=grid; } });
btnLeft.addEventListener("click", () => { if(dx===0) { dx=-grid; dy=0; } });
btnRight.addEventListener("click", () => { if(dx===0) { dx=grid; dy=0; } });

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
    }, speed);
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
        if (dxSwipe > 0 && dx === 0) { dx = grid; dy = 0; }
        else if (dxSwipe < 0 && dx === 0) { dx = -grid; dy = 0; }
    } else {
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
