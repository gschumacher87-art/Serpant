export function setupControls(snake, canvas) {
    // ===== Keyboard controls =====
    document.addEventListener("keydown", e => {
        if (e.key === "ArrowLeft") snake.setDirection(-snake.grid, 0);
        else if (e.key === "ArrowUp") snake.setDirection(0, -snake.grid);
        else if (e.key === "ArrowRight") snake.setDirection(snake.grid, 0);
        else if (e.key === "ArrowDown") snake.setDirection(0, snake.grid);
    });

    // ===== Touch swipe controls =====
    let touchStartX = 0, touchStartY = 0;

    canvas.addEventListener("touchstart", e => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });

    canvas.addEventListener("touchend", e => {
        const dxSwipe = e.changedTouches[0].clientX - touchStartX;
        const dySwipe = e.changedTouches[0].clientY - touchStartY;

        if (Math.abs(dxSwipe) > Math.abs(dySwipe)) {
            if (dxSwipe > 0) snake.setDirection(snake.grid, 0);
            else snake.setDirection(-snake.grid, 0);
        } else {
            if (dySwipe > 0) snake.setDirection(0, snake.grid);
            else snake.setDirection(0, -snake.grid);
        }
    });
}
