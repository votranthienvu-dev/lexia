// LexiQuest Core Input System (Polling WASD, Arrow keys, E/Space/Esc/Q/I/G)
export class Input {
    constructor() {
        this.keys = {};
        this.pressed = {};
        this.init();
    }

    init() {
        window.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            const key = e.code;
            if (!this.keys[key]) {
                this.pressed[key] = true;
            }
            this.keys[key] = true;
        });

        window.addEventListener('keyup', (e) => {
            const key = e.code;
            this.keys[key] = false;
            this.pressed[key] = false;
        });
    }

    isDown(code) {
        return !!this.keys[code];
    }

    isPressed(code) {
        if (this.pressed[code]) {
            this.pressed[code] = false;
            return true;
        }
        return false;
    }

    getMovementVector() {
        let dx = 0;
        let dy = 0;

        if (this.isDown('KeyW') || this.isDown('ArrowUp')) dy -= 1;
        if (this.isDown('KeyS') || this.isDown('ArrowDown')) dy += 1;
        if (this.isDown('KeyA') || this.isDown('ArrowLeft')) dx -= 1;
        if (this.isDown('KeyD') || this.isDown('ArrowRight')) dx += 1;

        if (dx !== 0 && dy !== 0) {
            dx *= 0.7071;
            dy *= 0.7071;
        }

        return { dx, dy };
    }
}
