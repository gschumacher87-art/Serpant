import { Snake } from './snake.js';
import { Food } from './food.js';

// ===== CANVAS SETUP =====
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// ===== RESPONSIVE CANVAS =====
function resizeCanvas() {
    const size = Math.min(window.innerWidth * 0.9, 400);
    canvas.width = size;
    canvas.height = size;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// ===== GAME VARIABLES =====
const grid = 20;
let snake;
let food;
let score = 0;
let gameRunning = false;
let gameInterval;

// ===== START BUTTON =====
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
    if (!gameRunning) initGame();
});

// ===== ARROW BUTTON CONTROLS =====
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

btnUp.addEventListener("click", () => { if(snake.dy===0){ snake.setDirection(0,-grid); } });
btnDown.addEventListener("click", () => { if(snake.dy===0){ snake.setDirection(0,grid); } });
btnLeft.addEventListener("click", () => { if(snake.dx===0){ snake.setDirection(-grid,0); } });
btnRight.addEventListener("click", () => { if(snake.dx===0){ snake.setDirection(grid,0); } });

// ===== INITIALIZE GAME =====
function initGame() {
    snake = new Snake(grid, canvas.width, canvas.height);
    food = new Food(grid, canvas.width, canvas.height);
    score = 0;
    gameRunning = true;
    startBtn.style.display = "none";
    gameInterval = setInterval(gameLoop, 200);
}

// ===== GAME LOOP =====
function gameLoop() {
    snake.move();

    // Eat food
    const head = snake.getHead();
    if (head.x === food.position.x && head.y === food.position.y) {
        score++;
        snake.grow();
        food.randomPosition();
    }

    // Collision
    if (snake.checkCollision(canvas.width, canvas.height)) gameOver();

    draw();
}

// ===== DRAW FUNCTION =====
function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    snake.draw(ctx);
    food.draw(ctx);
}

// ===== GAME OVER =====
function gameOver() {
    gameRunning = false;
    clearInterval(gameInterval);
    alert(`Game Over! Score: ${score}`);
    startBtn.style.display = "block";
}

// ===== KEYBOARD CONTROLS =====
document.addEventListener("keydown", e => {
    if (!gameRunning) return;
    if (e.key === "ArrowLeft" && snake.dx===0) snake.setDirection(-grid,0);
    else if (e.key === "ArrowUp" && snake.dy===0) snake.setDirection(0,-grid);
    else if (e.key === "ArrowRight" && snake.dx===0) snake.setDirection(grid,0);
    else if (e.key === "ArrowDown" && snake.dy===0) snake.setDirection(0,grid);
});

// ===== TOUCH SWIPE CONTROLS =====
let touchStartX=0, touchStartY=0;
canvas.addEventListener("touchstart", e => { touchStartX = e.touches[0].clientX; touchStartY = e.touches[0].clientY; });
canvas.addEventListener("touchend", e => {
    const dxSwipe = e.changedTouches[0].clientX - touchStartX;
    const dySwipe = e.changedTouches[0].clientY - touchStartY;
    if(Math.abs(dxSwipe) > Math.abs(dySwipe)){
        if(dxSwipe>0 && snake.dx===0) snake.setDirection(grid,0);
        else if(dxSwipe<0 && snake.dx===0) snake.setDirection(-grid,0);
    } else {
        if(dySwipe>0 && snake.dy===0) snake.setDirection(0,grid);
        else if(dySwipe<0 && snake.dy===0) snake.setDirection(0,-grid);
    }
});
