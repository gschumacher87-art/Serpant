const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Responsive canvas resolution
function resizeCanvas() {
    const size = Math.min(window.innerWidth * 0.9, 400);
    canvas.width = size;
    canvas.height = size;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const grid = 20;
let snake = [{ x: 200, y: 200 }];
let dx = grid;
let dy = 0;
let food = randomFood();
let score = 0;

function gameLoop() {
    setTimeout(() => {
        requestAnimationFrame(gameLoop);

        const head = { x: snake[0].x + dx, y: snake[0].y + dy };
        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            food = randomFood();
            score++;
        } else {
            snake.pop();
        }

        if (
            head.x < 0 || head.x >= canvas.width ||
            head.y < 0 || head.y >= canvas.height ||
            snake.slice(1).some(s => s.x === head.x && s.y === head.y)
        ) {
            alert("Game Over! Score: " + score);
            snake = [{ x: 200, y: 200 }];
            dx = grid;
            dy = 0;
            score = 0;
        }

        draw();
    }, 100);
}

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "lime";
    snake.forEach(s => ctx.fillRect(s.x, s.y, grid - 2, grid - 2));

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, grid - 2, grid - 2);
}

function randomFood() {
    const tiles = canvas.width / grid;
    return {
        x: Math.floor(Math.random() * tiles) * grid,
        y: Math.floor(Math.random() * tiles) * grid
    };
}

// Keyboard controls
document.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft" && dx === 0) {
        dx = -grid; dy = 0;
    } else if (e.key === "ArrowUp" && dy === 0) {
        dx = 0; dy = -grid;
    } else if (e.key === "ArrowRight" && dx === 0) {
        dx = grid; dy = 0;
    } else if (e.key === "ArrowDown" && dy === 0) {
        dx = 0; dy = grid;
    }
});

gameLoop();
