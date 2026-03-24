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
let gameInterval;

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

// ===== Arrow button controls =====
const controlsDiv = document.createElement("div");
controlsDiv.className = "arrow-controls";
document.body.appendChild(controlsDiv);

const btnUp = document.createElement("button"); btnUp.textContent = "↑";
const btnLeft = document.createElement("button"); btnLeft.textContent = "←";
const btnDown = document.createElement("button"); btnDown.textContent = "↓";
const btnRight = document.createElement("button"); btnRight.textContent = "→";

controlsDiv.appendChild(document.createElement("div"));
controlsDiv.appendChild(btnUp);
controlsDiv.appendChild(document.createElement("div"));
controlsDiv.appendChild(btnLeft);
controlsDiv.appendChild(btnDown);
controlsDiv.appendChild(btnRight);

btnUp.addEventListener("click", () => { if(dy===0){ dx=0; dy=-grid; } });
btnDown.addEventListener("click", () => { if(dy===0){ dx=0; dy=grid; } });
btnLeft.addEventListener("click", () => { if(dx===0){ dx=-grid; dy=0; } });
btnRight.addEventListener("click", () => { if(dx===0){ dx=grid; dy=0; } });

// ===== Initialize game =====
function initGame() {
    snake = [{ x: Math.floor(canvas.width/2/grid)*grid, y: Math.floor(canvas.height/2/grid)*grid }];
    dx = grid;
    dy = 0;
    score = 0;
    food = randomFood();
    gameRunning = true;
    gameInterval = setInterval(gameLoop, 200);
}

// ===== Game loop =====
function gameLoop() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    // Eat food
    if (head.x === food.x && head.y === food.y) {
        score++;
        food = randomFood();
    } else {
        snake.pop();
    }

    // Collisions
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height ||
        snake.slice(1).some(seg => seg.x === head.x && seg.y === head.y)) {
        gameOver();
    }

    draw();
}

// ===== Draw =====
function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // Snake
    ctx.fillStyle = "lime";
    snake.forEach(seg => ctx.fillRect(seg.x, seg.y, grid-2, grid-2));

    // Food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, grid-2, grid-2);
}

// ===== Food =====
function randomFood() {
    const tilesX = Math.floor(canvas.width / grid);
    const tilesY = Math.floor(canvas.height / grid);
    return {
        x: Math.floor(Math.random()*tilesX)*grid,
        y: Math.floor(Math.random()*tilesY)*grid
    };
}

// ===== Game over =====
function gameOver() {
    gameRunning = false;
    clearInterval(gameInterval);
    alert("Game Over! Score: " + score);
    startBtn.style.display = "block";
}

// ===== Keyboard controls =====
document.addEventListener("keydown", e => {
    if (!gameRunning) return;
    if (e.key === "ArrowLeft" && dx===0) { dx=-grid; dy=0; }
    else if (e.key === "ArrowUp" && dy===0) { dx=0; dy=-grid; }
    else if (e.key === "ArrowRight" && dx===0) { dx=grid; dy=0; }
    else if (e.key === "ArrowDown" && dy===0) { dx=0; dy=grid; }
});

// ===== Touch swipe =====
let touchStartX=0, touchStartY=0;
canvas.addEventListener("touchstart", e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});
canvas.addEventListener("touchend", e => {
    const dxSwipe = e.changedTouches[0].clientX - touchStartX;
    const dySwipe = e.changedTouches[0].clientY - touchStartY;
    if(Math.abs(dxSwipe) > Math.abs(dySwipe)){
        if(dxSwipe>0 && dx===0) dx=grid, dy=0;
        else if(dxSwipe<0 && dx===0) dx=-grid, dy=0;
    } else {
        if(dySwipe>0 && dy===0) dx=0, dy=grid;
        else if(dySwipe<0 && dy===0) dx=0, dy=-grid;
    }
});
