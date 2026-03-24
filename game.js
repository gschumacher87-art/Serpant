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

// ===== Canvas resize (optional) =====
canvas.width = 400;
canvas.height = 400;

// ===== Initialize game =====
function initGame() {
    grid = 20;

    snake = new Snake(grid, canvas.width, canvas.height);
    obstacles = new Obstacles(grid, canvas.width, canvas.height, 5);
    food = new Food(grid, canvas.width, canvas.height);

    // Generate obstacles first (avoid snake)
    obstacles.generate(snake.body, {x:-1, y:-1});

    // Place food after obstacles
    food.randomPosition(snake.body, obstacles.list);

    // Setup controls
    setupControls(snake, canvas);

    gameRunning = true;

    // Draw first frame immediately
    draw();

    // Start game loop
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

        // Collision with walls, self, obstacles
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

    obstacles.draw(ctx);
    food.draw(ctx);
    snake.draw(ctx);
}

// ===== Game over =====
function gameOver() {
    gameRunning = false;
    clearTimeout(gameTimeout);
    alert(`Game Over! Score: ${snake.body.length - 1}`);
    startBtn.style.display = "block";
}
