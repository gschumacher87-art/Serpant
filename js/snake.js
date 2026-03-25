// ===== SNAKE LOGIC =====
export class Snake {
    constructor(grid, canvasWidth, canvasHeight) {
        this.grid = grid;
        this.reset(canvasWidth, canvasHeight);

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

        this.animate();
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

    animate() {
        // Mouth animation
        this.mouthTimer++;
        if (this.mouthTimer > 6) {
            this.mouthOpen = !this.mouthOpen;
            this.mouthTimer = 0;
        }

        // Blink animation
        this.blinkTimer++;
        if (this.blinkTimer > 40) this.blink = true;
        if (this.blinkTimer > 45) {
            this.blink = false;
            this.blinkTimer = 0;
        }

        // Tongue animation
        this.tongueTimer++;
        if (this.tongueTimer > 20) {
            this.tongueOut = !this.tongueOut;
            this.tongueTimer = 0;
        }
    }

    draw(ctx) {
        const head = this.body[0];
        const hx = head.x + this.grid / 2;
        const hy = head.y + this.grid / 2;

        const width = this.grid;
        const height = this.grid * 0.8;

        // Rotate snake head
        const angle = Math.atan2(this.dy, this.dx);
        ctx.save();
        ctx.translate(hx, hy);
        ctx.rotate(angle);

        // ---- HEAD SHAPE (triangular snout) ----
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(width * 0.6, -height * 0.5);
        ctx.lineTo(width * 0.6, height * 0.5);
        ctx.closePath();

        // Head gradient
        const grad = ctx.createLinearGradient(0, -height * 0.5, width * 0.6, height * 0.5);
        grad.addColorStop(0, "#7BC043");
        grad.addColorStop(1, "#2E7D32");
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.strokeStyle = "#1B5E20";
        ctx.lineWidth = 2;
        ctx.stroke();

        // ---- SCALES ----
        const scaleSize = width * 0.08;
        for (let y = -height * 0.45; y < height * 0.45; y += scaleSize) {
            for (let x = 0; x < width * 0.55; x += scaleSize) {
                ctx.beginPath();
                ctx.arc(x, y + (x % (scaleSize * 2) ? 0 : scaleSize / 2), scaleSize / 2, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(0,0,0,0.05)";
                ctx.fill();
            }
        }

        // ---- EYES ----
        const eyeX = width * 0.35;
        const eyeY = height * 0.25;
        if (!this.blink) {
            // Left eye
            ctx.fillStyle = "#FFFFFF";
            ctx.beginPath();
            ctx.ellipse(eyeX, -eyeY, scaleSize * 1.5, scaleSize * 2, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#000000";
            ctx.beginPath();
            ctx.ellipse(eyeX, -eyeY, scaleSize * 0.7, scaleSize * 1, 0, 0, Math.PI * 2);
            ctx.fill();

            // Right eye
            ctx.fillStyle = "#FFFFFF";
            ctx.beginPath();
            ctx.ellipse(eyeX, eyeY, scaleSize * 1.5, scaleSize * 2, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#000000";
            ctx.beginPath();
            ctx.ellipse(eyeX, eyeY, scaleSize * 0.7, scaleSize * 1, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        // ---- MOUTH ----
        ctx.strokeStyle = "#1B5E20";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        if (this.mouthOpen) ctx.moveTo(width * 0.1, -height * 0.2), ctx.quadraticCurveTo(width * 0.5, 0, width * 0.1, height * 0.2);
        else ctx.moveTo(width * 0.1, -height * 0.1), ctx.quadraticCurveTo(width * 0.5, 0, width * 0.1, height * 0.1);
        ctx.stroke();

        // ---- TONGUE ----
        if (this.tongueOut) {
            ctx.strokeStyle = "red";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(width * 0.55, 0);
            ctx.lineTo(width * 0.8, -height * 0.15);
            ctx.moveTo(width * 0.55, 0);
            ctx.lineTo(width * 0.8, height * 0.15);
            ctx.stroke();
        }

        ctx.restore();

        // ---- BODY ----
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