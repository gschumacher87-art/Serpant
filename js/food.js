// ===== FOOD LOGIC =====
export class Food {
    constructor(grid, canvasWidth, canvasHeight) {
        this.grid = grid;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.position = this.randomPosition();
    }

    randomPosition() {
        const tilesX = Math.floor(this.canvasWidth / this.grid);
        const tilesY = Math.floor(this.canvasHeight / this.grid);
        this.position = {
            x: Math.floor(Math.random()*tilesX)*this.grid,
            y: Math.floor(Math.random()*tilesY)*this.grid
        };
        return this.position;
    }

    draw(ctx) {
        ctx.fillStyle = "red";
        ctx.fillRect(this.position.x, this.position.y, this.grid-2, this.grid-2);
    }
}
