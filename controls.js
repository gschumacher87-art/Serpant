// ===== controls.js =====
export function setupControls(snake, canvas) {
    // ===== Keyboard controls =====
    document.addEventListener("keydown", e => {
        if (e.key === "ArrowLeft") snake.setDirection(-snake.grid, 0);
        else if (e.key === "ArrowUp") snake.setDirection(0, -snake.grid);
        else if (e.key === "ArrowRight") snake.setDirection(snake.grid, 0);
        else if (e.key === "ArrowDown") snake.setDirection(0, snake.grid);
    });

    // ===== Touch swipe controls =====
    let touchStartX = 0;
    let touchStartY = 0;

    canvas.addEventListener("touchstart", e => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });

    canvas.addEventListener("touchend", e => {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;

        const dxSwipe = touchEndX - touchStartX;
        const dySwipe = touchEndY - touchStartY;

        if (Math.abs(dxSwipe) > Math.abs(dySwipe)) {
            if (dxSwipe > 0) snake.setDirection(snake.grid, 0);
            else if (dxSwipe < 0) snake.setDirection(-snake.grid, 0);
        } else {
            if (dySwipe > 0) snake.setDirection(0, snake.grid);
            else if (dySwipe < 0) snake.setDirection(0, -snake.grid);
        }
    });

    // ===== On-screen arrow buttons =====
    const controlsDiv = document.createElement("div");
    controlsDiv.style.position = "absolute";
    controlsDiv.style.bottom = "20px";
    controlsDiv.style.left = "50%";
    controlsDiv.style.transform = "translateX(-50%)";
    controlsDiv.style.display = "grid";
    controlsDiv.style.gridTemplateColumns = "repeat(3, 60px)";
    controlsDiv.style.gridTemplateRows = "repeat(2, 60px)";
    controlsDiv.style.gap = "10px";
    document.body.appendChild(controlsDiv);

    const btnUp = document.createElement("button");
    btnUp.textContent = "↑";
    const btnLeft = document.createElement("button");
    btnLeft.textContent = "←";
    const btnDown = document.createElement("button");
    btnDown.textContent = "↓";
    const btnRight = document.createElement("button");
    btnRight.textContent = "→";

    controlsDiv.appendChild(document.createElement("div"));
    controlsDiv.appendChild(btnUp);
    controlsDiv.appendChild(document.createElement("div"));
    controlsDiv.appendChild(btnLeft);
    controlsDiv.appendChild(btnDown);
    controlsDiv.appendChild(btnRight);

    [btnUp, btnDown, btnLeft, btnRight].forEach(b => {
        b.style.fontSize = "24px";
        b.style.padding = "10px";
    });

    btnUp.addEventListener("click", () => snake.setDirection(0, -snake.grid));
    btnDown.addEventListener("click", () => snake.setDirection(0, snake.grid));
    btnLeft.addEventListener("click", () => snake.setDirection(-snake.grid, 0));
    btnRight.addEventListener("click", () => snake.setDirection(snake.grid, 0));
}
