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

    // ===== NEW DRAW METHOD (REALISTIC) =====
    draw(ctx) {
        const head = this.body[0];
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        // ===== REALISTIC BODY =====
        for (let i = 0; i < this.body.length - 1; i++) {
            const seg = this.body[i];
            const next = this.body[i + 1];

            const x1 = seg.x + this.grid / 2;
            const y1 = seg.y + this.grid / 2;
            const x2 = next.x + this.grid / 2;
            const y2 = next.y + this.grid / 2;

            const width = this.grid * (1 - i / this.body.length) * 0.9;

            ctx.lineWidth = width;

            // ===== BEFORE =====
            // ctx.strokeStyle = "lime";

            // ===== AFTER (gradient + texture) =====
            if (this.scalePattern) {
                const pattern = ctx.createPattern(this.scalePattern, "repeat");
                ctx.strokeStyle = pattern;
            } else {
                const grad = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
                grad.addColorStop(0, "#3a5f2a"); // light
                grad.addColorStop(1, "#0f2e13"); // dark
                ctx.strokeStyle = grad;
            }

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }

        // ===== TAIL POINT =====
        const tail = this.body[this.body.length - 1];
        const beforeTail = this.body[this.body.length - 2];

        const tx = tail.x + this.grid / 2;
        const ty = tail.y + this.grid / 2;
        const bx = beforeTail.x + this.grid / 2;
        const by = beforeTail.y + this.grid / 2;

        const angle = Math.atan2(ty - by, tx - bx);

        ctx.fillStyle = "#1f4e20";
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(tx - Math.cos(angle + 0.2) * this.grid * 0.6, ty - Math.sin(angle + 0.2) * this.grid * 0.6);
        ctx.lineTo(tx - Math.cos(angle - 0.2) * this.grid * 0.6, ty - Math.sin(angle - 0.2) * this.grid * 0.6);
        ctx.closePath();
        ctx.fill();

        // ===== HEAD =====
        const hx = head.x + this.grid / 2;
        const hy = head.y + this.grid / 2;
        const hr = this.grid * 0.6;

        ctx.fillStyle = "#2e7d32";
        ctx.beginPath();
        ctx.ellipse(hx, hy, hr, hr * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();

        // ===== EYES =====
        const eyeOffsetX = this.grid * 0.2;
        const eyeOffsetY = this.grid * 0.15;

        if (!this.blink) {
            ctx.fillStyle = "white";
            ctx.beginPath();
            ctx.arc(head.x + eyeOffsetX, head.y + eyeOffsetY, this.grid * 0.12, 0, Math.PI * 2);
            ctx.arc(head.x + this.grid - eyeOffsetX, head.y + eyeOffsetY, this.grid * 0.12, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "black";
            ctx.beginPath();
            ctx.arc(head.x + eyeOffsetX, head.y + eyeOffsetY, this.grid * 0.06, 0, Math.PI * 2);
            ctx.arc(head.x + this.grid - eyeOffsetX, head.y + eyeOffsetY, this.grid * 0.06, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.strokeStyle = "black";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(head.x + eyeOffsetX - 3, head.y + eyeOffsetY);
            ctx.lineTo(head.x + eyeOffsetX + 3, head.y + eyeOffsetY);
            ctx.moveTo(head.x + this.grid - eyeOffsetX - 3, head.y + eyeOffsetY);
            ctx.lineTo(head.x + this.grid - eyeOffsetX + 3, head.y + eyeOffsetY);
            ctx.stroke();
        }

        // ===== MOUTH =====
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.beginPath();
        if (this.mouthOpen) {
            ctx.moveTo(head.x + this.grid * 0.3, head.y + this.grid * 0.7);
            ctx.quadraticCurveTo(head.x + this.grid * 0.5, head.y + this.grid * 1.0, head.x + this.grid * 0.7, head.y + this.grid * 0.7);
        } else {
            ctx.moveTo(head.x + this.grid * 0.3, head.y + this.grid * 0.75);
            ctx.lineTo(head.x + this.grid * 0.7, head.y + this.grid * 0.75);
        }
        ctx.stroke();

        // ===== TONGUE =====
        if (this.tongueOut) {
            ctx.strokeStyle = "red";
            ctx.lineWidth = 2;
            ctx.beginPath();
            const tx2 = head.x + this.grid * 0.5;
            const ty2 = head.y + this.grid * 0.8;
            ctx.moveTo(tx2, ty2);
            ctx.lineTo(tx2, ty2 + this.grid * 0.4);
            ctx.moveTo(tx2, ty2 + this.grid * 0.4);
            ctx.lineTo(tx2 - 4, ty2 + this.grid * 0.5);
            ctx.moveTo(tx2, ty2 + this.grid * 0.4);
            ctx.lineTo(tx2 + 4, ty2 + this.grid * 0.5);
            ctx.stroke();
        }
    }
}