// LexiQuest 2D Camera Tracking System
export class Camera {
    constructor(viewportWidth, viewportHeight) {
        this.x = 0;
        this.y = 0;
        this.viewportWidth = viewportWidth;
        this.viewportHeight = viewportHeight;
    }

    follow(targetX, targetY, worldWidth, worldHeight) {
        this.x = targetX - this.viewportWidth / 2;
        this.y = targetY - this.viewportHeight / 2;

        // Clamp camera to world bounds
        this.x = Math.max(0, Math.min(this.x, worldWidth - this.viewportWidth));
        this.y = Math.max(0, Math.min(this.y, worldHeight - this.viewportHeight));
    }
}
