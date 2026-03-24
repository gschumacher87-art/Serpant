// ===== food.js =====
export class Food {
    constructor(grid, canvasWidth, canvasHeight) {
        this.grid = grid;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.position = this.randomPosition();
    }

    randomPosition(snakeBody = [], obstacles = []) {
        const tilesX = Math.floor(this.canvasWidth / this.grid);
        const tilesY = Math.floor(this.canvasHeight / this.grid);
        let x, y;
        let safe = false;

        while (!safe) {
            x = Math.floor(Math.random() * tilesX) * this.grid;
            y = Math.floor(Math.random() * tilesY) * this.grid;

            // Check against snake body
            const onSnake = snakeBody.some(seg => seg.x === x && seg.y === y);
            // Check against obstacles
            const onObstacle = obstacles.some(obs => obs.x === x && obs.y === y);

            safe = !onSnake && !onObstacle;
        }

        this.position = { x, y };
        return this.position;
    }

    draw(ctx) {
        ctx.fillStyle = "red";
        ctx.fillRect(this.position.x, this.position.y, this.grid - 2, this.grid - 2);
    }

    getPosition() {
        return this.position;
    }
}
