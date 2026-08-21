// LexiQuest Ultra-Smooth 60FPS GameLoop (Delta Smoothing & High FPS Precision)
export class GameLoop {
    constructor(updateFn, renderFn) {
        this.updateFn = updateFn;
        this.renderFn = renderFn;
        this.isRunning = false;
        this.lastTime = 0;
        this.maxDelta = 64; // Max delta 64ms for stability
        this.rafId = null;
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.lastTime = performance.now();
        this.rafId = requestAnimationFrame(this.loop.bind(this));
    }

    stop() {
        this.isRunning = false;
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
        }
    }

    loop(currentTime) {
        if (!this.isRunning) return;

        let delta = currentTime - this.lastTime;
        if (delta > this.maxDelta) delta = this.maxDelta;

        this.lastTime = currentTime;

        this.updateFn(delta);
        this.renderFn();

        this.rafId = requestAnimationFrame(this.loop.bind(this));
    }
}
