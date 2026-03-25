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

        // === START WITH 3 SEGMENTS ===
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

        if (this.growSegments > 0) {
            this.growSegments--;
        } else {
            this.body.pop();
        }

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

    grow() {
        this.growSegments++;
    }

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

        // ===== REALISTIC BODY (NATURAL TAPER) =====
ctx.lineCap = "round";
ctx.lineJoin = "round";
ctx.strokeStyle = "lime";

ctx.beginPath();

for (let i = 0; i < this.body.length; i++) {
    const seg = this.body[i];
    const x = seg.x + this.grid / 2;
    const y = seg.y + this.grid / 2;

    if (i === 0) {
        ctx.moveTo(x, y);
    } else {
        const prev = this.body[i - 1];
        const px = prev.x + this.grid / 2;
        const py = prev.y + this.grid / 2;

        const cx = (px + x) / 2;
        const cy = (py + y) / 2;

        ctx.quadraticCurveTo(px, py, cx, cy);
    }
}

// 👇 key change: slight taper only
const base = this.grid * 0.9;
const taper = this.grid * 0.35;
ctx.lineWidth = base - taper * 0.5;

ctx.stroke();


// ===== CLEAN POINTED TAIL =====
const tail = this.body[this.body.length - 1];
const beforeTail = this.body[this.body.length - 2];

const tx = tail.x + this.grid / 2;
const ty = tail.y + this.grid / 2;

const bx = beforeTail.x + this.grid / 2;
const by = beforeTail.y + this.grid / 2;

const angle = Math.atan2(ty - by, tx - bx);

ctx.fillStyle = "lime";
ctx.beginPath();
ctx.moveTo(tx, ty);
ctx.lineTo(
    tx - Math.cos(angle + 0.2) * this.grid * 0.6,
    ty - Math.sin(angle + 0.2) * this.grid * 0.6
);
ctx.lineTo(
    tx - Math.cos(angle - 0.2) * this.grid * 0.6,
    ty - Math.sin(angle - 0.2) * this.grid * 0.6
);
ctx.closePath();
ctx.fill();
        // ===== HEAD =====
        const hx = head.x + this.grid / 2;
        const hy = head.y + this.grid / 2;
        const r = this.grid / 2;

        ctx.beginPath();
        ctx.arc(hx, hy, r, 0, Math.PI * 2);
        ctx.fill();

        // ===== EYES =====
        const eyeOffsetX = this.grid * 0.25;
        const eyeOffsetY = this.grid * 0.25;

        if (!this.blink) {
            ctx.fillStyle = "white";
            ctx.beginPath();
            ctx.arc(head.x + eyeOffsetX, head.y + eyeOffsetY, this.grid * 0.25, 0, Math.PI * 2);
            ctx.arc(head.x + this.grid - eyeOffsetX, head.y + eyeOffsetY, this.grid * 0.25, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "black";
            ctx.beginPath();
            ctx.arc(head.x + eyeOffsetX, head.y + eyeOffsetY, this.grid * 0.12, 0, Math.PI * 2);
            ctx.arc(head.x + this.grid - eyeOffsetX, head.y + eyeOffsetY, this.grid * 0.12, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.strokeStyle = "black";
            ctx.lineWidth = 2;

            ctx.beginPath();
            ctx.moveTo(head.x + eyeOffsetX - 5, head.y + eyeOffsetY);
            ctx.lineTo(head.x + eyeOffsetX + 5, head.y + eyeOffsetY);

            ctx.moveTo(head.x + this.grid - eyeOffsetX - 5, head.y + eyeOffsetY);
            ctx.lineTo(head.x + this.grid - eyeOffsetX + 5, head.y + eyeOffsetY);
            ctx.stroke();
        }

        // ===== MOUTH =====
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;

        ctx.beginPath();

        if (this.mouthOpen) {
            ctx.moveTo(head.x + this.grid * 0.3, head.y + this.grid * 0.7);
            ctx.quadraticCurveTo(
                head.x + this.grid * 0.5,
                head.y + this.grid * 1.0,
                head.x + this.grid * 0.7,
                head.y + this.grid * 0.7
            );
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