// ===== SNAKE LOGIC =====
export class Snake {
    constructor(grid, canvasWidth, canvasHeight) {
        this.grid = grid;
        this.reset(canvasWidth, canvasHeight);
        this.growSegments = 0;

        // === ANIMATIONS ===
        this.mouthOpen = true;
        this.mouthTimer = 0;
        this.blink = false;
        this.blinkTimer = 0;
        this.tongueOut = false;
        this.tongueTimer = 0;
    }

    reset(canvasWidth, canvasHeight) {
        const startX = Math.floor(canvasWidth / 2 / this.grid) * this.grid;
        const startY = Math.floor(canvasHeight / 2 / this.grid) * this.grid;

        this.body = [
            { x: startX, y: startY },
            { x: startX - this.grid, y: startY },
            { x: startX - this.grid * 2, y: startY }
        ];

        this.dx = this.grid;
        this.dy = 0;
        this.growSegments = 0;
        this.mouthOpen = true;
        this.mouthTimer = 0;
        this.blink = false;
        this.blinkTimer = 0;
        this.tongueOut = false;
        this.tongueTimer = 0;
    }

    move() {
        const head = { x: this.body[0].x + this.dx, y: this.body[0].y + this.dy };
        this.body.unshift(head);

        if (this.growSegments > 0) this.growSegments--;
        else this.body.pop();

        // === MOUTH ANIMATION ===
        this.mouthTimer++;
        if (this.mouthTimer > 6) {
            this.mouthOpen = !this.mouthOpen;
            this.mouthTimer = 0;
        }

        // === BLINK ANIMATION ===
        this.blinkTimer++;
        if (this.blinkTimer > 40) this.blink = true;
        if (this.blinkTimer > 45) {
            this.blink = false;
            this.blinkTimer = 0;
        }

        // === TONGUE ANIMATION ===
        this.tongueTimer++;
        if (this.tongueTimer > 20) {
            this.tongueOut = !this.tongueOut;
            this.tongueTimer = 0;
        }
    }

    grow() { this.growSegments++; }

    setDirection(dx, dy) {
        if ((dx !== 0 && dx !== -this.dx) || (dy !== 0 && dy !== -this.dy)) {
            this.dx = dx;
            this.dy = dy;
        }
    }

    checkCollision(canvasWidth, canvasHeight) {
        const head = this.body[0];
        if (head.x < 0 || head.x >= canvasWidth || head.y < 0 || head.y >= canvasHeight) return true;
        for (let i = 1; i < this.body.length; i++) {
            if (head.x === this.body[i].x && head.y === this.body[i].y) return true;
        }
        return false;
    }

    getHead() { return this.body[0]; }

    // ===== DRAW METHOD (LIME SNAKE) =====
    draw(ctx) {
        const head = this.body[0];
        const hx = head.x + this.grid / 2;
        const hy = head.y + this.grid / 2;

        // 1. ROTATION BASED ON DIRECTION
        const angle = Math.atan2(this.dy, this.dx);
        ctx.save();
        ctx.translate(hx, hy);
        ctx.rotate(angle);

        // 2. HEAD (simple lime oval)
        ctx.fillStyle = "lime";
        ctx.beginPath();
        ctx.ellipse(0, 0, this.grid * 0.6, this.grid * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.stroke();

        // 3. EYES (black)
        if (!this.blink) {
            ctx.fillStyle = "black";
            ctx.beginPath();
            ctx.ellipse(this.grid * 0.2, -this.grid * 0.1, this.grid * 0.05, this.grid * 0.1, 0, 0, Math.PI * 2);
            ctx.ellipse(this.grid * 0.2, this.grid * 0.1, this.grid * 0.05, this.grid * 0.1, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        // 4. MOUTH
        ctx.beginPath();
        if (this.mouthOpen) ctx.moveTo(-this.grid * 0.2, 0), ctx.lineTo(this.grid * 0.3, 0.2);
        else ctx.moveTo(-this.grid * 0.2, 0), ctx.lineTo(this.grid * 0.3, 0);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // 5. TONGUE
        if (this.tongueOut) {
            ctx.beginPath();
            ctx.moveTo(this.grid * 0.3, 0);
            ctx.lineTo(this.grid * 0.5, 0);
            ctx.moveTo(this.grid * 0.5, 0);
            ctx.lineTo(this.grid * 0.55, -this.grid * 0.1);
            ctx.moveTo(this.grid * 0.5, 0);
            ctx.lineTo(this.grid * 0.55, this.grid * 0.1);
            ctx.strokeStyle = "red";
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        ctx.restore();

        // 6. BODY (all lime)
        for (let i = 1; i < this.body.length; i++) {
            const seg = this.body[i];
            const prev = this.body[i - 1];

            ctx.beginPath();
            ctx.lineCap = "round";
            ctx.lineWidth = this.grid * (1 - i / this.body.length * 0.5);
            ctx.strokeStyle = "lime";

            ctx.moveTo(prev.x + this.grid / 2, prev.y + this.grid / 2);
            ctx.lineTo(seg.x + this.grid / 2, seg.y + this.grid / 2);
            ctx.stroke();
        }
    }
}