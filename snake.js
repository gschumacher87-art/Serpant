export class Snake {
    constructor(grid, canvasWidth, canvasHeight) {
        this.grid = grid;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.reset();
    }

    reset() {
        this.body = [{
            x: Math.floor(this.canvasWidth / 2 / this.grid) * this.grid,
            y: Math.floor(this.canvasHeight / 2 / this.grid) * this.grid
        }];
        this.dx = this.grid;
        this.dy = 0;
        this.growSegments = 0;
    }

    move() {
        const head = { x: this.body[0].x + this.dx, y: this.body[0].y + this.dy };
        this.body.unshift(head);

        if (this.growSegments > 0) {
            this.growSegments--;
        } else {
            this.body.pop();
        }
    }

    grow() { this.growSegments++; }

    setDirection(dx, dy) {
        // Prevent reversing
        if ((dx !== 0 && dx !== -this.dx) || (dy !== 0 && dy !== -this.dy)) {
            this.dx = dx;
            this.dy = dy;
        }
    }

    checkCollision() {
        const head = this.body[0];
        // Wall collision
        if (head.x < 0 || head.x >= this.canvasWidth ||
            head.y < 0 || head.y >= this.canvasHeight) {
            return true;
        }
        // Self collision
        for (let i = 1; i < this.body.length; i++) {
            if (head.x === this.body[i].x && head.y === this.body[i].y) {
                return true;
            }
        }
        return false;
    }

    draw(ctx) {
        ctx.fillStyle = "lime";
        this.body.forEach(segment => ctx.fillRect(segment.x, segment.y, this.grid - 2, this.grid - 2));
    }

    getHead() { return this.body[0]; }
}
