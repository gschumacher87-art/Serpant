// ===== SNAKE LOGIC =====
export class Snake {
    constructor(grid, canvasWidth, canvasHeight) {
        this.grid = grid;
        this.reset(canvasWidth, canvasHeight);
    }

    reset(canvasWidth, canvasHeight) {
        this.body = [{ x: Math.floor(canvasWidth/2/this.grid)*this.grid,
                       y: Math.floor(canvasHeight/2/this.grid)*this.grid }];
        this.dx = this.grid;
        this.dy = 0;
    }

    move() {
        const head = { x: this.body[0].x + this.dx, y: this.body[0].y + this.dy };
        this.body.unshift(head);
        this.body.pop();
    }

    grow() {
        const tail = this.body[this.body.length-1];
        this.body.push({ x: tail.x, y: tail.y });
    }

    setDirection(dx, dy) {
        if ((dx !== 0 && dx !== -this.dx) || (dy !== 0 && dy !== -this.dy)) {
            this.dx = dx;
            this.dy = dy;
        }
    }

    checkCollision(canvasWidth, canvasHeight) {
        const head = this.body[0];
        if (head.x < 0 || head.x >= canvasWidth || head.y < 0 || head.y >= canvasHeight)
            return true;
        for (let i=1; i<this.body.length; i++) {
            if (head.x === this.body[i].x && head.y === this.body[i].y) return true;
        }
        return false;
    }

    getHead() { return this.body[0]; }

    draw(ctx) {
        ctx.fillStyle = "lime";
        this.body.forEach(seg => ctx.fillRect(seg.x, seg.y, this.grid-2, this.grid-2));
    }
}
