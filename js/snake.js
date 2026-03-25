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

    draw(ctx) {
    const head = this.body[0];
    const hx = head.x + this.grid / 2;
    const hy = head.y + this.grid / 2;

    // 1. ROTATION BASED ON DIRECTION
    const angle = Math.atan2(this.dy, this.dx);
    ctx.save();
    ctx.translate(hx, hy);
    ctx.rotate(angle);

    const sizeX = this.grid * 0.6;
    const sizeY = this.grid * 0.4;

    // 2. HEAD (gradient for realism)
    const headGradient = ctx.createRadialGradient(0, 0, sizeY * 0.3, 0, 0, sizeX);
    headGradient.addColorStop(0, "#A4F54C"); // lighter center
    headGradient.addColorStop(1, "#2E7D32"); // darker edges
    ctx.fillStyle = headGradient;
    ctx.beginPath();
    ctx.ellipse(0, 0, sizeX, sizeY, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#1B5E20";
    ctx.lineWidth = 2;
    ctx.stroke();

    // 3. SCALES (subtle texture)
    ctx.strokeStyle = "rgba(0,0,0,0.1)";
    ctx.lineWidth = 0.5;
    for (let i = -sizeX + 2; i < sizeX; i += 4) {
        ctx.beginPath();
        ctx.moveTo(i, -sizeY);
        ctx.lineTo(i + 2, sizeY);
        ctx.stroke();
    }

    // 4. EYES (realistic with iris + highlight)
    const eyeOffsetX = sizeX * 0.3;
    const eyeOffsetY = sizeY * 0.1;
    const eyeRadius = sizeY * 0.15;

    if (!this.blink) {
        // Eye white
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.ellipse(eyeOffsetX, -eyeOffsetY, eyeRadius, eyeRadius * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(eyeOffsetX, eyeOffsetY, eyeRadius, eyeRadius * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Iris
        ctx.fillStyle = "#1A1A00";
        ctx.beginPath();
        ctx.ellipse(eyeOffsetX, -eyeOffsetY, eyeRadius * 0.5, eyeRadius * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(eyeOffsetX, eyeOffsetY, eyeRadius * 0.5, eyeRadius * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Highlight
        ctx.fillStyle = "rgba(255,255,255,0.7)";
        ctx.beginPath();
        ctx.arc(eyeOffsetX - eyeRadius * 0.2, -eyeOffsetY - eyeRadius * 0.1, eyeRadius * 0.15, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(eyeOffsetX - eyeRadius * 0.2, eyeOffsetY - eyeRadius * 0.1, eyeRadius * 0.15, 0, Math.PI * 2);
        ctx.fill();
    }

    // 5. MOUTH (curved, can open)
    ctx.strokeStyle = "#1B5E20";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    if (this.mouthOpen) {
        ctx.moveTo(-sizeX * 0.3, sizeY * 0.2);
        ctx.quadraticCurveTo(sizeX * 0.2, sizeY * 0.4, sizeX * 0.4, 0);
    } else {
        ctx.moveTo(-sizeX * 0.3, sizeY * 0.1);
        ctx.quadraticCurveTo(sizeX * 0.2, sizeY * 0.2, sizeX * 0.4, 0);
    }
    ctx.stroke();

    // 6. TONGUE (forked, animated)
    if (this.tongueOut) {
        ctx.strokeStyle = "#FF0000";
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(sizeX * 0.4, 0);
        ctx.lineTo(sizeX * 0.6, -sizeY * 0.15);
        ctx.moveTo(sizeX * 0.4, 0);
        ctx.lineTo(sizeX * 0.6, sizeY * 0.15);
        ctx.stroke();
    }

    ctx.restore();

    // 7. BODY (same as before)
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