// ===== game.js =====
import { Snake } from './snake.js';
import { Food } from './food.js';
import { setupControls } from './controls.js';
import { Obstacles } from './obstacles.js';

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let snake;
let food;
let obstacles;
let grid = 20;
let gameRunning = false;
let gameTimeout;
const speed = 200; // halved speed

// ===== Responsive canvas =====
function resizeCanvas() {
    const size = Math.min(window.innerWidth * 0.9, 400);
    canvas.width = size;
    canvas.height = size;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

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
    grid = Math.floor(canvas.width / 20);

    snake = new Snake(grid, canvas.width, canvas.height);
    obstacles = new Obstacles(grid, canvas.width, canvas.height, 5);
    food = new Food(grid, canvas.width, canvas.height);

    // Generate obstacles first, then food
    obstacles.generate(snake.body);
    food.randomPosition(snake.body, obstacles.list);

    setupControls(snake, canvas);
    gameRunning = true;
    gameLoop();
}

// ===== Game loop =====
function gameLoop() {
    if (!gameRunning) return;

    gameTimeout = setTimeout(() => {
        requestAnimationFrame(gameLoop);

        snake.move();

        const head = snake.getHead();

        // Check if snake eats food
        if (head.x === food.position.x && head.y === food.position.y) {
            snake.grow();
            food.randomPosition(snake.body, obstacles.list);
        }

        // Check collision with walls, self, or obstacles
        if (snake.checkCollision() || obstacles.checkCollision(head)) {
            gameOver();
        }

        draw();
    }, speed);
}

// ===== Draw =====
function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    snake.draw(ctx);
    food.draw(ctx);
    obstacles.draw(ctx);
}

// ===== Game over =====
function gameOver() {
    gameRunning = false;
    clearTimeout(gameTimeout);
    alert(`Game Over! Score: ${snake.body.length - 1}`);
    startBtn.style.display = "block";
}
