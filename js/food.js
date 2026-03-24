// ===== FOOD LOGIC =====
export class Food {
    constructor(grid, canvasWidth, canvasHeight) {
        this.grid = grid;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.position = { x: 0, y: 0 };
    }

    randomPosition(snakeBody = []) {
        const tilesX = Math.floor(this.canvasWidth / this.grid);
        const tilesY = Math.floor(this.canvasHeight / this.grid);

        let newPos;

        do {
            newPos = {
                x: Math.floor(Math.random() * tilesX) * this.grid,
                y: Math.floor(Math.random() * tilesY) * this.grid
            };
        } while (snakeBody.some(seg => seg.x === newPos.x && seg.y === newPos.y));

        this.position = newPos;
    }

    draw(ctx) {
        ctx.fillStyle = "red";
        ctx.fillRect(this.position.x, this.position.y, this.grid - 2, this.grid - 2);
    }
}
