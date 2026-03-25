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

        // === REALISTIC TEXTURE ===
        this.scalePattern = null;
        const img = new Image();
        img.src = "scales.png"; // supply a seamless snake scale texture
        img.onload = () => {
            this.scalePattern = img;
        };
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

        // === MOUTH ===
        this.mouthTimer++;
        if (this.mouthTimer > 6) {
            this.mouthOpen = !this.mouthOpen;
            this.mouthTimer = 0;
        }

        // === BLINK ===
        this.blinkTimer++;
        if (this.blinkTimer > 40) this.blink = true;
        if (this.blinkTimer > 45) {
            this.blink = false;
            this.blinkTimer = 0;
        }

        // === TONGUE ===
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
        for (let i = 1; i < this.body.length; i++)
            if (head.x === this.body[i].x && head.y === this.body[i].y) return true;
        return false;
    }

    getHead() { return this.body[0]; }

    // ===== NEW DRAW METHOD (COBRA-STYLE REALISTIC) =====
    draw(ctx) {
        const head = this.body[0];
        const hx = head.x + this.grid / 2;
        const hy = head.y + this.grid / 2;

        // 1. ROTATION BASED ON DIRECTION
        const angle = Math.atan2(this.dy, this.dx);
        ctx.save();
        ctx.translate(hx, hy);
        ctx.rotate(angle);

        // 2. HEAD SHAPE (Cobra Teardrop/Hood)
        ctx.beginPath();
        ctx.moveTo(this.grid * 0.8, 0);
        ctx.bezierCurveTo(this.grid * 0.7, -this.grid * 0.5, -this.grid * 0.2, -this.grid * 0.6, -this.grid * 0.6, -this.grid * 0.4);
        ctx.lineTo(-this.grid * 0.6, this.grid * 0.4);
        ctx.bezierCurveTo(-this.grid * 0.2, this.grid * 0.6, this.grid * 0.7, this.grid * 0.5, this.grid * 0.8, 0);
        ctx.closePath();

        const headGrad = ctx.createLinearGradient(0, -this.grid, 0, this.grid);
        headGrad.addColorStop(0, "#4a5d3e");
        headGrad.addColorStop(0.5, "#2e3b23");
        headGrad.addColorStop(1, "#1a2412");
        ctx.fillStyle = headGrad;
        ctx.fill();

        ctx.strokeStyle = "#0d1408";
        ctx.lineWidth = 2;
        ctx.stroke();

        // 3. EYES
        if (!this.blink) {
            ctx.fillStyle = "rgba(0,0,0,0.3)";
            ctx.beginPath();
            ctx.ellipse(this.grid * 0.2, -this.grid * 0.2, this.grid * 0.25, this.grid * 0.15, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "#a8b97d";
            ctx.beginPath();
            ctx.ellipse(this.grid * 0.25, -this.grid * 0.2, this.grid * 0.18, this.grid * 0.12, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "black";
            ctx.beginPath();
            ctx.ellipse(this.grid * 0.25, -this.grid * 0.2, this.grid * 0.04, this.grid * 0.11, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "white";
            ctx.beginPath();
            ctx.arc(this.grid * 0.2, -this.grid * 0.25, 2, 0, Math.PI * 2);
            ctx.fill();
        }

        // 4. MOUTH
        ctx.beginPath();
        ctx.moveTo(this.grid * 0.8, 0);
        if (this.mouthOpen) ctx.quadraticCurveTo(this.grid * 0.4, this.grid * 0.1, this.grid * 0.1, this.grid * 0.2);
        else ctx.quadraticCurveTo(this.grid * 0.4, 0, this.grid * 0.1, 0);
        ctx.strokeStyle = "#0d1408";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // 5. TONGUE
        if (this.tongueOut) {
            ctx.beginPath();
            ctx.moveTo(this.grid * 0.8, 0);
            ctx.lineTo(this.grid * 1.2, 0);
            ctx.moveTo(this.grid * 1.2, 0);
            ctx.lineTo(this.grid * 1.4, -this.grid * 0.15);
            ctx.moveTo(this.grid * 1.2, 0);
            ctx.lineTo(this.grid * 1.4, this.grid * 0.15);
            ctx.strokeStyle = "#c0392b";
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        ctx.restore();

        // 6. BODY
        for (let i = 1; i < this.body.length; i++) {
            const seg = this.body[i];
            const prev = this.body[i - 1];

            ctx.beginPath();
            ctx.lineCap = "round";
            ctx.lineWidth = this.grid * (1 - (i / this.body.length) * 0.5);

            if (this.scalePattern) ctx.strokeStyle = ctx.createPattern(this.scalePattern, "repeat");
            else ctx.strokeStyle = "#2e3b23";

            ctx.moveTo(prev.x + this.grid / 2, prev.y + this.grid / 2);
            ctx.lineTo(seg.x + this.grid / 2, seg.y + this.grid / 2);
            ctx.stroke();
        }
    }
}