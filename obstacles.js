// ===== obstacles.js =====
export class Obstacles {
    constructor(grid, canvasWidth, canvasHeight, numObstacles = 5) {
        this.grid = grid;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.numObstacles = numObstacles;
        this.list = [];
    }

    generate(snakeBody = [], foodPosition = {}) {
        this.list = [];
        const tilesX = Math.floor(this.canvasWidth / this.grid);
        const tilesY = Math.floor(this.canvasHeight / this.grid);

        let attempts = 0;
        while (this.list.length < this.numObstacles && attempts < 1000) {
            const x = Math.floor(Math.random() * tilesX) * this.grid;
            const y = Math.floor(Math.random() * tilesY) * this.grid;

            // Avoid snake and food
            const onSnake = snakeBody.some(seg => seg.x === x && seg.y === y);
            const onFood = (foodPosition.x === x && foodPosition.y === y);
            const onObstacle = this.list.some(obs => obs.x === x && obs.y === y);

            if (!onSnake && !onFood && !onObstacle) {
                this.list.push({ x, y });
            }

            attempts++;
        }
    }

    draw(ctx) {
        ctx.fillStyle = "gray";
        this.list.forEach(obs => ctx.fillRect(obs.x, obs.y, this.grid - 2, this.grid - 2));
    }

    checkCollision(snakeHead) {
        return this.list.some(obs => obs.x === snakeHead.x && obs.y === snakeHead.y);
    }
}
