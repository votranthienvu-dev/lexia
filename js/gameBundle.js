// LexiQuest Standalone Bundle (Progressive Stage Difficulty - Stage 1 with 2 Mobs)
// LexiQuest Core EventBus (Pub/Sub Event System)
class EventBus {
    constructor() {
        this.listeners = {};
    }

    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    off(event, callback) {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }

    emit(event, data) {
        if (!this.listeners[event]) return;
        this.listeners[event].forEach(cb => cb(data));
    }
}

const eventBus = new EventBus();


// LexiQuest Ultra-Smooth 60FPS GameLoop (Delta Smoothing & High FPS Precision)
class GameLoop {
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


// LexiQuest Core Input System (Polling WASD, Arrow keys, E/Space/Esc/Q/I/G)
class Input {
    constructor() {
        this.keys = {};
        this.pressed = {};
        this.init();
    }

    init() {
        window.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            // Prevent default for game keys (Tab focus, Space scroll)
            if (e.code === 'Tab' || e.code === 'Space') e.preventDefault();

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


// LexiQuest 2D Camera Tracking System
class Camera {
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


// LexiQuest Versioned SaveService (LocalStorage JSON)
class SaveService {
    constructor() {
        this.SAVE_KEY = 'LEXIQUEST_SAVE_DATA_V1';
        this.VERSION = '1.0.0';
    }

    save(data) {
        try {
            const saveData = {
                version: this.VERSION,
                timestamp: Date.now(),
                data: data
            };
            localStorage.setItem(this.SAVE_KEY, JSON.stringify(saveData));
            return true;
        } catch (e) {
            console.error('Save failed:', e);
            return false;
        }
    }

    load() {
        try {
            const raw = localStorage.getItem(this.SAVE_KEY);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            return parsed.data || null;
        } catch (e) {
            console.error('Load failed:', e);
            return null;
        }
    }

    clear() {
        localStorage.removeItem(this.SAVE_KEY);
    }
}

const saveService = new SaveService();


// LexiQuest Ultra-Detailed 16-Bit Pixel Character Renderer (Multi-Tier Shading & Micro Details)
class PixelRenderer {
    static shadeColor(color, percent) {
        if (!color || color[0] !== '#') return color || '#ffffff';
        let num = parseInt(color.replace('#', ''), 16);
        if (isNaN(num)) return color;
        let amt = Math.round(2.55 * percent);
        let R = (num >> 16) + amt;
        let G = (num >> 8 & 0x00FF) + amt;
        let B = (num & 0x0000FF) + amt;
        return '#' + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
    }

    static drawHumanCharacter(ctx, x, y, scale, appearance, equipment, direction, state, animTick, isPlayer = true) {
        ctx.save();
        ctx.imageSmoothingEnabled = false;

        ctx.translate(Math.floor(x), Math.floor(y));
        ctx.scale(scale, scale);

        // 8-Frame Walk & Idle Animation Physics
        const walkFrame = state === 'walk' ? Math.floor((animTick / 4) % 8) : 0;
        const idleBob = state === 'idle' ? Math.sin(animTick * 0.1) * 1.5 : 0;
        const hairSway = Math.sin(animTick * 0.12) * 1.5;
        const capeWave = Math.sin(animTick * 0.15) * 2.5;

        const isUp = direction === 'up';
        const isDown = direction === 'down';
        const isLeft = direction === 'left';
        const isRight = direction === 'right';
        const isSide = isLeft || isRight;

        if (isLeft) ctx.scale(-1, 1);

        // 1. DYNAMIC HIGH-CONTRAST DROP SHADOW
        ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
        ctx.beginPath();
        ctx.ellipse(0, 16, 9, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // 2. KAELEN CANON PALETTE (White/Silver Hair, Royal Blue Robe, Gold Trim)
        const hairColor = appearance.hairColor || '#e2e8f0';
        const hairHighlight = '#ffffff';
        const hairShadow = '#94a3b8';

        const robeBase = appearance.shirtColor || '#1e3a8a';
        const robeHighlight = this.shadeColor(robeBase, 30);
        const robeShadow = this.shadeColor(robeBase, -35);

        const gold = '#fbbf24';
        const goldHighlight = '#fef08a';
        const goldShadow = '#b45309';

        const shirtColor = '#ffffff';
        const pantsColor = appearance.pantsColor || '#1e293b';
        const bootsColor = '#78350f';

        // 3. ROYAL BLUE CAPE & GOLD EMBROIDERED HEM (Back Layer)
        if (isUp) {
            ctx.fillStyle = robeShadow;
            ctx.fillRect(-8, -4 + idleBob, 16, 18);
            ctx.fillStyle = robeBase;
            ctx.fillRect(-7, 2 + idleBob, 14, 12 + Math.floor(capeWave * 0.5));

            ctx.fillStyle = gold;
            ctx.fillRect(-7, 13 + idleBob + Math.floor(capeWave * 0.5), 14, 2);
            ctx.fillStyle = goldHighlight;
            ctx.fillRect(-5, -3 + idleBob, 10, 2);
        } else if (isSide) {
            ctx.fillStyle = robeShadow;
            ctx.fillRect(-7 + capeWave * 0.4, -3 + idleBob, 7, 16);
            ctx.fillStyle = gold;
            ctx.fillRect(-7 + capeWave * 0.4, 12 + idleBob, 7, 2);
        } else if (isDown) {
            ctx.fillStyle = robeShadow;
            ctx.fillRect(-8, -3 + idleBob, 3, 11);
            ctx.fillRect(5, -3 + idleBob, 3, 11);
            ctx.fillStyle = gold;
            ctx.fillRect(-8, 7 + idleBob, 3, 2);
            ctx.fillRect(5, 7 + idleBob, 3, 2);
        }

        // 4. LEGS & CANON LEATHER BOOTS (8-Frame Strides & Metallic Buckles)
        let legL = 0, legR = 0;
        if (state === 'walk') {
            const strides = [0, 2, 4, 2, 0, -2, -4, -2];
            legL = strides[walkFrame];
            legR = -strides[walkFrame];
        }

        // Left Leg & Boot
        ctx.fillStyle = pantsColor;
        ctx.fillRect(-5, 4 + idleBob + legL, 4, 7);
        ctx.fillStyle = bootsColor;
        ctx.fillRect(-6, 10 + idleBob + legL, 5, 5);
        ctx.fillStyle = '#b45309';
        ctx.fillRect(-6, 10 + idleBob + legL, 5, 1);
        if (isDown) {
            ctx.fillStyle = gold; // Gold Buckle
            ctx.fillRect(-5, 12 + idleBob + legL, 3, 1);
        }

        // Right Leg & Boot
        ctx.fillStyle = pantsColor;
        ctx.fillRect(1, 4 + idleBob + legR, 4, 7);
        ctx.fillStyle = bootsColor;
        ctx.fillRect(1, 10 + idleBob + legR, 5, 5);
        ctx.fillStyle = '#b45309';
        ctx.fillRect(1, 10 + idleBob + legR, 5, 1);
        if (isDown) {
            ctx.fillStyle = gold;
            ctx.fillRect(2, 12 + idleBob + legR, 3, 1);
        }

        // 5. WHITE SHIRT, ROYAL BLUE COAT & GOLD BUTTONS
        ctx.fillStyle = shirtColor;
        ctx.fillRect(-4, -4 + idleBob, 8, 9);
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(-2, -4 + idleBob, 4, 2); // Collar shadow

        // Open Royal Blue Coat Flaps
        ctx.fillStyle = robeBase;
        ctx.fillRect(-6, -4 + idleBob, 3, 10);
        ctx.fillRect(3, -4 + idleBob, 3, 10);

        ctx.fillStyle = robeHighlight;
        ctx.fillRect(-6, -4 + idleBob, 1, 10);
        ctx.fillRect(5, -4 + idleBob, 1, 10);

        // Gold Coat Buttons (Double Breasted)
        ctx.fillStyle = gold;
        ctx.fillRect(-5, -1 + idleBob, 2, 2);
        ctx.fillRect(-5, 3 + idleBob, 2, 2);
        ctx.fillRect(3, -1 + idleBob, 2, 2);
        ctx.fillRect(3, 3 + idleBob, 2, 2);

        ctx.fillStyle = goldHighlight;
        ctx.fillRect(-5, -1 + idleBob, 1, 1);
        ctx.fillRect(3, -1 + idleBob, 1, 1);

        // Leather Belt & Gold Buckle
        ctx.fillStyle = '#451a03';
        ctx.fillRect(-4, 5 + idleBob, 8, 2);
        ctx.fillStyle = gold;
        ctx.fillRect(-1, 4 + idleBob, 2, 4);
        ctx.fillStyle = goldShadow;
        ctx.fillRect(0, 5 + idleBob, 1, 2);

        // 6. ANCIENT SPELLBOOK ACCESSORY (Carried in Hand with Gold Emblem)
        if (!isUp) {
            ctx.fillStyle = '#7c2d12'; // Ancient Leather Cover
            ctx.fillRect(4, 2 + idleBob, 5, 7);
            ctx.fillStyle = gold;
            ctx.fillRect(5, 3 + idleBob, 3, 5); // Gold Rune Crest
            ctx.fillStyle = '#00fff5';
            ctx.fillRect(6, 4 + idleBob, 1, 3); // Gem Inset
            ctx.fillStyle = '#fef08a';
            ctx.fillRect(4, 3 + idleBob, 1, 5); // Pages
        }

        // 7. ARMS & SLEEVES
        const skinColor = appearance.skinColor || '#fde047';
        const skinShadow = this.shadeColor(skinColor, -20);

        if (state === 'cast') {
            ctx.fillStyle = robeBase;
            ctx.fillRect(-8, -12 + idleBob, 4, 12);
            ctx.fillRect(4, -12 + idleBob, 4, 12);

            ctx.fillStyle = skinColor;
            ctx.fillRect(-8, -16 + idleBob, 4, 4);
            ctx.fillRect(4, -16 + idleBob, 4, 4);

            // Floating Mana Aura around Hands
            ctx.fillStyle = '#00fff5';
            ctx.fillRect(-9, -17 + idleBob, 6, 2);
            ctx.fillRect(3, -17 + idleBob, 6, 2);
        } else {
            const armL = -legL;
            const armR = -legR;

            ctx.fillStyle = robeBase;
            ctx.fillRect(-7, -3 + idleBob + armL, 3, 7);
            ctx.fillRect(4, -3 + idleBob + armR, 3, 7);

            ctx.fillStyle = skinColor;
            ctx.fillRect(-7, 3 + idleBob + armL, 3, 3);
            ctx.fillRect(4, 3 + idleBob + armR, 3, 3);
        }

        // 8. CANON SILVER/WHITE HAIR & BLUE SEEKER EYES
        ctx.fillStyle = skinColor;
        ctx.fillRect(-5, -14 + idleBob, 10, 10);
        ctx.fillStyle = skinShadow;
        ctx.fillRect(-5, -5 + idleBob, 10, 1);

        // Silver/White Hair Locks (Multi-tier Shaded)
        ctx.fillStyle = hairColor;
        ctx.fillRect(-6, -17 + idleBob, 12, 6);
        ctx.fillRect(-6 + hairSway, -15 + idleBob, 3, 8); // Left parted bang
        ctx.fillRect(3 + hairSway, -15 + idleBob, 3, 8);  // Right parted bang
        ctx.fillRect(-2, -18 + idleBob, 4, 3);            // Top tuft

        ctx.fillStyle = hairHighlight;
        ctx.fillRect(-4, -17 + idleBob, 8, 2);
        ctx.fillRect(-1, -18 + idleBob, 2, 2);

        ctx.fillStyle = hairShadow;
        ctx.fillRect(-6, -12 + idleBob, 2, 4);
        ctx.fillRect(4, -12 + idleBob, 2, 4);

        // Eyes (Canon Blue Seeker Eyes with Pupils & Catchlights)
        if (isDown) {
            const isBlinking = (animTick % 160) > 152;
            if (!isBlinking) {
                ctx.fillStyle = '#0f172a'; // Socket
                ctx.fillRect(-4, -10 + idleBob, 3, 4);
                ctx.fillRect(1, -10 + idleBob, 3, 4);

                ctx.fillStyle = '#0284c7'; // Canon Royal Blue Iris
                ctx.fillRect(-3, -10 + idleBob, 2, 3);
                ctx.fillRect(2, -10 + idleBob, 2, 3);

                ctx.fillStyle = '#00fff5'; // Iris Glow
                ctx.fillRect(-3, -9 + idleBob, 2, 1);
                ctx.fillRect(2, -9 + idleBob, 2, 1);

                ctx.fillStyle = '#ffffff'; // White Catchlight Sparkle
                ctx.fillRect(-3, -10 + idleBob, 1, 1);
                ctx.fillRect(2, -10 + idleBob, 1, 1);
            } else {
                ctx.fillStyle = '#0f172a';
                ctx.fillRect(-4, -8 + idleBob, 3, 1);
                ctx.fillRect(1, -8 + idleBob, 3, 1);
            }
        }

        ctx.restore();
    }
}


// LexiQuest Axis-Aligned Sliding Collision System
class Collision {
    static isTileSolid(mapGrid, tileCols, tileRows, tileSize, x, y) {
        const col = Math.floor(x / tileSize);
        const row = Math.floor(y / tileSize);

        if (row < 0 || row >= tileRows || col < 0 || col >= tileCols) {
            return true;
        }

        const tile = mapGrid[row][col];
        // Tile 1 (Deep Water), Tile 3 (Outer Wall), Tile 4 (Dense Forest Tree) are solid!
        return tile === 1 || tile === 3 || tile === 4;
    }

    static resolveMovement(entity, dx, dy, speed, mapGrid, tileCols, tileRows, tileSize) {
        if (dx === 0 && dy === 0) return { x: entity.x, y: entity.y };

        const stepX = dx * speed;
        const stepY = dy * speed;

        const margin = 12;
        const footY = 48; // Foot bounding level for 48x64 sprite

        let newX = entity.x;
        let newY = entity.y;

        // Test X Movement independently for smooth wall sliding
        if (stepX !== 0) {
            const targetX = entity.x + stepX;
            const canMoveX = !this.isTileSolid(mapGrid, tileCols, tileRows, tileSize, targetX + margin, entity.y + footY) &&
                             !this.isTileSolid(mapGrid, tileCols, tileRows, tileSize, targetX + entity.width - margin, entity.y + footY);
            if (canMoveX) {
                newX = targetX;
            }
        }

        // Test Y Movement independently
        if (stepY !== 0) {
            const targetY = entity.y + stepY;
            const canMoveY = !this.isTileSolid(mapGrid, tileCols, tileRows, tileSize, entity.x + margin, targetY + footY) &&
                             !this.isTileSolid(mapGrid, tileCols, tileRows, tileSize, entity.x + entity.width - margin, targetY + footY);
            if (canMoveY) {
                newY = targetY;
            }
        }

        return { x: newX, y: newY };
    }
}


// LexiQuest Player Entity: Kaelen Mana Regen, Cooldowns & Strict Damage Balancing

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 48;
        this.height = 64;
        this.type = 'kaelen';
        this.name = 'Kaelen (Cậu Bé Seeker)';
        this.isPlayer = true;

        // RPG Power & Mana Progression
        this.powerLevel = 1;
        this.atk = 10;      // Base ATK = 10 (Deals 0 Damage to Heavy Mobs if no Shards collected!)
        this.def = 5;       // Base Defense
        this.hp = 100;
        this.maxHp = 100;
        this.mp = 100;
        this.maxMp = 100;
        this.mpRegenRate = 0.25; // Mana regen per frame (~15 MP/sec)

        // Skill Cooldowns (in frames @ 60fps)
        this.cdShot = 0;       // [J] Normal Shot (18 frames = 0.3s)
        this.cdSkill1 = 0;     // [1] Lightning (180 frames = 3s)
        this.cdSkill2 = 0;     // [2] Frost Nova (360 frames = 6s)
        this.cdSkill3 = 0;     // [3] Firestorm (600 frames = 10s)
        this.cdDash = 0;       // [Shift] Dash (120 frames = 2s)

        this.combo = 0;
        this.comboTimer = 0;

        this.speed = 4.5;
        this.dir = 'down';
        this.state = 'idle'; // 'idle', 'walk', 'cast', 'dash'
        this.animTick = 0;
        this.posHistory = [];
        this.isDashing = false;
        this.damageFlashTimer = 0;

        this.appearance = {
            gender: 'male',
            hairStyle: 'wandering_boy',
            hairColor: '#f59e0b',
            skinColor: '#fde047',
            eyeColor: '#00fff5',
            shirtColor: '#2563eb',
            pantsColor: '#334155',
            capeStyle: 'traveler_scarf'
        };

        this.equipment = {
            weapon: { id: 'rune_staff', name: 'Trượng Cổ Tự Rune', type: 'weapon_staff' },
            offhand: { id: 'traveler_pouch', name: 'Túi Đeo Chéo Ký Ức', type: 'book' },
            armor: { id: 'traveler_tunic', name: 'Áo Hành Giả Lang Thang', color: '#2563eb' },
            helmet: { id: 'red_scarf', name: 'Khăn Quàng Đỏ Seeker', color: '#dc2626' }
        };
    }

    gainPowerFromShard() {
        this.powerLevel++;
        this.atk += 30;   // +30 ATK per Shard solved!
        this.maxHp += 25; // +25 Max HP per Shard solved!
        this.hp = this.maxHp;
        this.mp = this.maxMp;
    }

    canCast(manaCost, cooldownValue) {
        return this.mp >= manaCost && cooldownValue <= 0;
    }

    consumeMana(manaCost) {
        this.mp = Math.max(0, this.mp - manaCost);
    }

    performDash(engine) {
        if (!this.canCast(15, this.cdDash) || this.state === 'cast') return false;
        this.consumeMana(15);
        this.cdDash = 120; // 2 seconds CD
        this.isDashing = true;
        this.state = 'dash';

        let dashDx = 0, dashDy = 0;
        if (this.dir === 'left') dashDx = -1;
        else if (this.dir === 'right') dashDx = 1;
        else if (this.dir === 'up') dashDy = -1;
        else dashDy = 1;

        const dashSpeed = 16;
        const resolved = Collision.resolveMovement(this, dashDx, dashDy, dashSpeed, engine.grid, engine.cols, engine.rows, engine.tileSize);
        this.x = resolved.x;
        this.y = resolved.y;

        setTimeout(() => {
            this.isDashing = false;
            if (this.state === 'dash') this.state = 'idle';
        }, 150);
        return true;
    }

    addCombo() {
        this.combo++;
        this.comboTimer = 120;
    }

    takeDamage(amount) {
        if (this.isDashing) return; // Invulnerable during Dash!
        const actualDmg = Math.max(1, amount - this.def);
        this.hp = Math.max(0, this.hp - actualDmg);
        this.damageFlashTimer = 15;
        this.combo = 0;
    }

    heal(amount) {
        this.hp = Math.min(this.maxHp, this.hp + amount);
    }

    update(input, mapGrid, tileCols, tileRows, tileSize) {
        if (this.state === 'cast') return;

        // Passive Mana Regen
        this.mp = Math.min(this.maxMp, this.mp + this.mpRegenRate);

        // Cooldown Tick Reduction
        if (this.cdShot > 0) this.cdShot--;
        if (this.cdSkill1 > 0) this.cdSkill1--;
        if (this.cdSkill2 > 0) this.cdSkill2--;
        if (this.cdSkill3 > 0) this.cdSkill3--;
        if (this.cdDash > 0) this.cdDash--;
        if (this.damageFlashTimer > 0) this.damageFlashTimer--;

        if (this.comboTimer > 0) {
            this.comboTimer--;
            if (this.comboTimer <= 0) this.combo = 0;
        }

        const { dx, dy } = input.getMovementVector();

        if (dx === 0 && dy === 0) {
            if (!this.isDashing) this.state = 'idle';
        } else {
            if (!this.isDashing) this.state = 'walk';

            const resolved = Collision.resolveMovement(this, dx, dy, this.speed, mapGrid, tileCols, tileRows, tileSize);
            this.x = resolved.x;
            this.y = resolved.y;

            this.posHistory.push({ x: this.x, y: this.y, dir: this.dir });
            if (this.posHistory.length > 50) this.posHistory.shift();

            if (Math.abs(dx) > Math.abs(dy)) {
                this.dir = dx > 0 ? 'right' : 'left';
            } else if (dy !== 0) {
                this.dir = dy > 0 ? 'down' : 'up';
            }
        }

        this.animTick++;
    }

    draw(ctx, camera) {
        const drawX = Math.floor(this.x - camera.x);
        const drawY = Math.floor(this.y - camera.y);

        ctx.save();

        if (this.isDashing) {
            ctx.fillStyle = 'rgba(0, 255, 245, 0.4)';
            ctx.fillRect(drawX - 10, drawY - 10, this.width + 20, this.height + 20);
        }

        if (this.damageFlashTimer > 0) {
            ctx.fillStyle = 'rgba(255, 0, 0, 0.4)';
            ctx.fillRect(drawX, drawY, this.width, this.height);
        }

        PixelRenderer.drawHumanCharacter(
            ctx,
            drawX + 24,
            drawY + 32,
            1.3,
            this.appearance,
            this.equipment,
            this.dir,
            this.state,
            this.animTick,
            true
        );

        // Name & Power Level Tag
        ctx.fillStyle = '#ffeaa7';
        ctx.font = '13px Pixelify Sans';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 4;
        ctx.fillText(`${this.name} (Lvl ${this.powerLevel})`, drawX + 24, drawY - 18);

        // HP Bar above Head
        const hpPct = this.hp / this.maxHp;
        ctx.fillStyle = '#333333';
        ctx.fillRect(drawX + 4, drawY - 12, 40, 5);
        ctx.fillStyle = hpPct > 0.5 ? '#2ecc71' : hpPct > 0.25 ? '#f1c40f' : '#e74c3c';
        ctx.fillRect(drawX + 4, drawY - 12, Math.floor(40 * hpPct), 5);

        // Mana Bar above Head
        const mpPct = this.mp / this.maxMp;
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(drawX + 4, drawY - 6, 40, 4);
        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(drawX + 4, drawY - 6, Math.floor(40 * mpPct), 4);

        if (this.combo > 1) {
            ctx.fillStyle = '#ffeaa7';
            ctx.font = '18px Press Start 2P';
            ctx.fillText(`COMBO x${this.combo}!`, drawX + 24, drawY - 30);
        }

        ctx.restore();
    }
}


// LexiQuest Companion Entity: Lex (Spirit Owl - Canon Concept Bible Spec 48x48)
class Companion {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 36;
        this.height = 48;
        this.name = 'Lex 🦉';
        this.dir = 'down';
        this.animTick = 0;
    }

    followLeader(leader, delayIndex = 12) {
        if (!leader || leader.posHistory.length < delayIndex) return;

        const targetPos = leader.posHistory[leader.posHistory.length - delayIndex];
        if (!targetPos) return;

        const dx = targetPos.x - this.x;
        const dy = targetPos.y - this.y;
        const dist = Math.hypot(dx, dy);

        if (dist > 6) {
            this.x += dx * 0.25;
            this.y += dy * 0.25;
            this.dir = targetPos.dir || 'down';
        }

        this.animTick++;
    }

    draw(ctx, camera) {
        const drawX = Math.floor(this.x - camera.x);
        const drawY = Math.floor(this.y - camera.y);

        // Hovering & Wing Flap Animations (Canon Spirit Owl Spec)
        const floatY = Math.sin(Date.now() / 200) * 5;
        const wingAngle = Math.sin(Date.now() / 130) * 7;
        const pulse = Math.sin(Date.now() / 160) * 3;

        ctx.save();

        // 1. Spirit Aura Halo
        ctx.fillStyle = 'rgba(0, 255, 245, 0.25)';
        ctx.beginPath();
        ctx.arc(drawX + 18, drawY + 18 + floatY, 20 + pulse, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(0, 255, 245, 0.45)';
        ctx.beginPath();
        ctx.arc(drawX + 18, drawY + 18 + floatY, 14 + pulse * 0.5, 0, Math.PI * 2);
        ctx.fill();

        // 2. Drop Shadow
        ctx.fillStyle = 'rgba(15, 23, 42, 0.3)';
        ctx.beginPath();
        ctx.ellipse(drawX + 18, drawY + 40, 10, 3.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // 3. Feathered Ear Tufts (Light Cyan / Deep Cyan)
        ctx.fillStyle = '#00cec9';
        ctx.beginPath();
        ctx.moveTo(drawX + 10, drawY + 8 + floatY);
        ctx.lineTo(drawX + 6, drawY + 1 + floatY);
        ctx.lineTo(drawX + 13, drawY + 6 + floatY);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(drawX + 26, drawY + 8 + floatY);
        ctx.lineTo(drawX + 30, drawY + 1 + floatY);
        ctx.lineTo(drawX + 23, drawY + 6 + floatY);
        ctx.fill();

        // 4. Spirit Owl White Body & Light Cyan Back Wings
        ctx.fillStyle = '#ffffff'; // Canon Pure White Body
        ctx.beginPath();
        ctx.arc(drawX + 18, drawY + 18 + floatY, 12, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#81ecec'; // Light Cyan Feather Accents
        ctx.beginPath();
        ctx.arc(drawX + 18, drawY + 22 + floatY, 8, 0, Math.PI * 2);
        ctx.fill();

        // 5. Flapping Wings (Left & Right)
        ctx.fillStyle = '#81ecec';
        ctx.beginPath();
        ctx.ellipse(drawX + 6, drawY + 18 + floatY, 5, 10, (wingAngle * Math.PI) / 180, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(drawX + 30, drawY + 18 + floatY, 5, 10, (-wingAngle * Math.PI) / 180, 0, Math.PI * 2);
        ctx.fill();

        // 6. Large Golden Wise Eyes & Gold Beak (Canon Spec)
        ctx.fillStyle = '#ffffff'; // Outer Disc
        ctx.beginPath();
        ctx.arc(drawX + 13, drawY + 15 + floatY, 5, 0, Math.PI * 2);
        ctx.arc(drawX + 23, drawY + 15 + floatY, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#f59e0b'; // Canon Golden Eyes
        ctx.beginPath();
        ctx.arc(drawX + 13, drawY + 15 + floatY, 3, 0, Math.PI * 2);
        ctx.arc(drawX + 23, drawY + 15 + floatY, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#0f172a'; // Pupil
        ctx.fillRect(drawX + 13, drawY + 15 + floatY, 2, 2);
        ctx.fillRect(drawX + 23, drawY + 15 + floatY, 2, 2);

        ctx.fillStyle = '#ffffff'; // Sparkle Catchlight
        ctx.fillRect(drawX + 13, drawY + 14 + floatY, 1, 1);
        ctx.fillRect(drawX + 23, drawY + 14 + floatY, 1, 1);

        ctx.fillStyle = '#fbbf24'; // Canon Gold Beak
        ctx.beginPath();
        ctx.moveTo(drawX + 16, drawY + 17 + floatY);
        ctx.lineTo(drawX + 20, drawY + 17 + floatY);
        ctx.lineTo(drawX + 18, drawY + 22 + floatY);
        ctx.closePath();
        ctx.fill();

        // Name Tag
        ctx.fillStyle = '#ffffff';
        ctx.font = '13px Pixelify Sans';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 3;
        ctx.fillText(this.name, drawX + 18, drawY - 4);

        ctx.restore();
    }
}


// LexiQuest Interactive NPC Entity System

class Npc {
    constructor(id, x, y, name, title, npcType, dialogue) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.width = 48;
        this.height = 64;
        this.name = name;
        this.title = title;
        this.npcType = npcType; // 'elder', 'su', 'blacksmith', 'villager'
        this.dialogue = dialogue;
        this.dir = 'down';
        this.animTick = 0;

        if (npcType === 'su') {
            this.appearance = {
                gender: 'male',
                hairStyle: 'short_spiky',
                hairColor: '#2d3436',
                skinColor: '#f5cba7',
                eyeColor: '#2d3436',
                shirtColor: '#27ae60',
                pantsColor: '#d35400',
                capeStyle: 'none'
            };
        } else if (npcType === 'elder') {
            this.appearance = {
                gender: 'male',
                hairStyle: 'elder_white',
                hairColor: '#ffffff',
                skinColor: '#fde047',
                eyeColor: '#1e293b',
                shirtColor: '#7c3aed',
                pantsColor: '#1e293b',
                capeStyle: 'scholar_mantle'
            };
        } else {
            this.appearance = {
                gender: 'male',
                hairStyle: 'messy',
                hairColor: '#78350f',
                skinColor: '#fcd34d',
                eyeColor: '#1e293b',
                shirtColor: '#059669',
                pantsColor: '#334155',
                capeStyle: 'none'
            };
        }

        this.equipment = { weapon: null, offhand: null, armor: null, helmet: null };
    }

    draw(ctx, camera) {
        const drawX = Math.floor(this.x - camera.x);
        const drawY = Math.floor(this.y - camera.y);

        this.animTick++;

        PixelRenderer.drawHumanCharacter(
            ctx,
            drawX + 24,
            drawY + 32,
            1.3,
            this.appearance,
            this.equipment,
            this.dir,
            'idle',
            this.animTick,
            false
        );

        // Name & Title Tag
        ctx.fillStyle = '#f1c40f';
        ctx.font = '13px Pixelify Sans';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 4;
        ctx.fillText(`${this.name} (${this.title})`, drawX + 24, drawY - 6);
    }
}


// LexiQuest Shard Entity (Knowledge Shards / Memory Anchors)
class Shard {
    constructor(id, tileX, tileY, title, icon, puzzleData, dialogueData) {
        this.id = id;
        this.tileX = tileX;
        this.tileY = tileY;
        this.title = title;
        this.icon = icon;
        this.puzzleData = puzzleData;
        this.dialogueData = dialogueData;
        this.collected = false;
        this.tileSize = 48;
    }

    getPixelPos() {
        return {
            x: this.tileX * this.tileSize + 24,
            y: this.tileY * this.tileSize + 24
        };
    }

    draw(ctx, camera) {
        if (this.collected) return;

        const drawX = this.tileX * this.tileSize - camera.x + 12;
        const drawY = this.tileY * this.tileSize - camera.y + 12;
        const pulse = Math.sin(Date.now() / 200 + this.id) * 5;

        ctx.save();
        ctx.fillStyle = 'rgba(0, 255, 245, 0.5)';
        ctx.beginPath();
        ctx.arc(drawX + 12, drawY + 12, 18 + pulse, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = '24px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(this.icon, drawX + 12, drawY + 20);
        ctx.restore();
    }
}


// LexiQuest Interactive Teleporter Portal Entity (Stage Zone Transition Portal)
class Portal {
    constructor(id, tileX, tileY, targetStageIndex, targetZoneTitle) {
        this.id = id;
        this.tileX = tileX;
        this.tileY = tileY;
        this.targetStageIndex = targetStageIndex;
        this.targetZoneTitle = targetZoneTitle;
        this.tileSize = 48;
        this.width = 48;
        this.height = 48;
        this.name = 'Cổng Dịch Chuyển';
    }

    getPixelPos() {
        return {
            x: this.tileX * this.tileSize + 24,
            y: this.tileY * this.tileSize + 24
        };
    }

    draw(ctx, camera) {
        const drawX = this.tileX * this.tileSize - camera.x;
        const drawY = this.tileY * this.tileSize - camera.y;

        const pulse = Math.sin(Date.now() / 150) * 6;
        const spin = (Date.now() / 200) % (Math.PI * 2);

        ctx.save();

        // Glowing Blue Outer Portal Ring
        ctx.fillStyle = 'rgba(0, 255, 245, 0.4)';
        ctx.beginPath();
        ctx.arc(drawX + 24, drawY + 24, 28 + pulse, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(108, 92, 231, 0.6)';
        ctx.beginPath();
        ctx.arc(drawX + 24, drawY + 24, 20 + pulse * 0.5, 0, Math.PI * 2);
        ctx.fill();

        // Swirling Portal Core Symbol
        ctx.font = '28px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('🌀', drawX + 24, drawY + 34);

        // Label
        ctx.fillStyle = '#ffffff';
        ctx.font = '13px Pixelify Sans';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 4;
        ctx.fillText(`Cổng ${this.targetZoneTitle}`, drawX + 24, drawY - 8);

        ctx.restore();
    }
}


// LexiQuest Enemy Entity (Active Ranged Counter-Attacks & Heavy Defense Scaling)
class Enemy {
    constructor(id, x, y, name, color = '#7c3aed', hp = 120, def = 55) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 48;
        this.name = name;
        this.color = color;
        this.hp = hp;
        this.maxHp = hp;
        this.def = def; // High Defense (Requires Shard ATK Buffs to pierce!)
        this.isDead = false;

        this.attackCooldown = 0; // Enemy shot cooldown
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = (Math.random() - 0.5) * 1.5;
        this.animTick = 0;
    }

    update(mapGrid, tileCols, tileRows, tileSize, player) {
        if (this.isDead) return;

        this.animTick++;
        if (this.attackCooldown > 0) this.attackCooldown--;

        // Random patrol wandering
        if (Math.random() < 0.03) {
            this.vx = (Math.random() - 0.5) * 2;
            this.vy = (Math.random() - 0.5) * 2;
        }

        const nextX = this.x + this.vx;
        const nextY = this.y + this.vy;

        if (nextX > 48 && nextX < (tileCols - 1) * tileSize) this.x = nextX;
        else this.vx *= -1;

        if (nextY > 48 && nextY < (tileRows - 1) * tileSize) this.y = nextY;
        else this.vy *= -1;

        // Counter-Attack Logic: Shoot Dark Orb at Player if in range (250px)!
        if (player && this.attackCooldown <= 0) {
            const eX = this.x + this.width / 2;
            const eY = this.y + this.height / 2;
            const pX = player.x + player.width / 2;
            const pY = player.y + player.height / 2;

            const dist = Math.hypot(pX - eX, pY - eY);
            if (dist < 250) {
                this.attackCooldown = 150; // Shoot every 2.5 seconds @ 60fps
                return {
                    shoot: true,
                    startX: eX,
                    startY: eY,
                    dirX: (pX - eX) / dist,
                    dirY: (pY - eY) / dist
                };
            }
        }
        return null;
    }

    takeDamage(rawDamage) {
        // Strict Defense Formula: 0 Damage if rawDamage <= DEF!
        const actualDmg = Math.max(0, rawDamage - this.def);
        if (actualDmg > 0) {
            this.hp = Math.max(0, this.hp - actualDmg);
            if (this.hp <= 0) this.isDead = true;
        }
        return actualDmg; // Returns 0 if blocked by Defense!
    }

    draw(ctx, camera) {
        if (this.isDead) return;

        const drawX = Math.floor(this.x - camera.x);
        const drawY = Math.floor(this.y - camera.y);
        const pulse = Math.sin(Date.now() / 150) * 3;

        ctx.save();

        ctx.fillStyle = 'rgba(124, 58, 237, 0.35)';
        ctx.beginPath();
        ctx.arc(drawX + 20, drawY + 24, 22 + pulse, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = this.color;
        ctx.fillRect(drawX + 8, drawY + 12 + pulse, 24, 28);

        ctx.fillStyle = '#1e1b4b';
        ctx.fillRect(drawX + 10, drawY + 6 + pulse, 20, 14);

        ctx.fillStyle = '#ff0055';
        ctx.fillRect(drawX + 13, drawY + 10 + pulse, 4, 4);
        ctx.fillRect(drawX + 23, drawY + 10 + pulse, 4, 4);

        ctx.fillStyle = '#ff7675';
        ctx.font = '12px Pixelify Sans';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 4;
        ctx.fillText(`${this.name} (DEF: ${this.def})`, drawX + 20, drawY - 10);

        const hpPct = this.hp / this.maxHp;
        ctx.fillStyle = '#333333';
        ctx.fillRect(drawX + 5, drawY - 6, 30, 4);
        ctx.fillStyle = '#ff0055';
        ctx.fillRect(drawX + 5, drawY - 6, Math.floor(30 * hpPct), 4);

        ctx.restore();
    }
}


// LexiQuest Projectile Entity (Player Elemental Spells & Enemy Dark Orbs)
class Projectile {
    constructor(x, y, dirX, dirY, type = 'standard', speed = 8, damage = 20, isEnemy = false) {
        this.x = x;
        this.y = y;
        this.width = 16;
        this.height = 16;
        this.type = type; // 'standard', 'lightning', 'frost', 'firestorm', 'dark_orb'
        this.speed = speed;
        this.damage = damage;
        this.isEnemy = isEnemy; // True for Enemy projectiles targeting Kaelen!
        this.isDead = false;
        this.life = 80;

        // Calculate velocity from direction vector or string
        if (typeof dirX === 'string') {
            const dir = dirX;
            this.vx = 0;
            this.vy = 0;
            if (dir === 'left') this.vx = -speed;
            else if (dir === 'right') this.vx = speed;
            else if (dir === 'up') this.vy = -speed;
            else this.vy = speed;
        } else {
            this.vx = dirX * speed;
            this.vy = dirY * speed;
        }

        if (type === 'firestorm') {
            this.width = 60;
            this.height = 60;
        } else if (type === 'frost') {
            this.width = 80;
            this.height = 80;
            this.life = 35;
        } else if (type === 'dark_orb') {
            this.width = 20;
            this.height = 20;
        }
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;
        if (this.life <= 0) this.isDead = true;
    }

    draw(ctx, camera) {
        if (this.isDead) return;

        const drawX = Math.floor(this.x - camera.x);
        const drawY = Math.floor(this.y - camera.y);
        const pulse = Math.sin(Date.now() / 80) * 4;

        ctx.save();

        if (this.isEnemy) {
            // Dark Shadow Orb shot by Enemy Mobs
            ctx.fillStyle = 'rgba(147, 51, 234, 0.5)';
            ctx.beginPath();
            ctx.arc(drawX + 10, drawY + 10, 14 + pulse, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#ff0055'; // Crimson Core
            ctx.beginPath();
            ctx.arc(drawX + 10, drawY + 10, 6, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.type === 'lightning') {
            ctx.fillStyle = '#fef08a';
            ctx.beginPath();
            ctx.arc(drawX + 10, drawY + 10, 14 + pulse, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#eab308';
            ctx.fillRect(drawX + 4, drawY + 4, 12, 12);
        } else if (this.type === 'frost') {
            ctx.fillStyle = 'rgba(129, 236, 236, 0.45)';
            ctx.beginPath();
            ctx.arc(drawX + 40, drawY + 40, 40 + pulse * 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#00fff5';
            ctx.lineWidth = 3;
            ctx.stroke();
        } else if (this.type === 'firestorm') {
            ctx.fillStyle = 'rgba(239, 68, 68, 0.6)';
            ctx.beginPath();
            ctx.arc(drawX + 30, drawY + 30, 30 + pulse * 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#f97316';
            ctx.beginPath();
            ctx.arc(drawX + 30, drawY + 30, 18, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.fillStyle = 'rgba(0, 255, 245, 0.4)';
            ctx.beginPath();
            ctx.arc(drawX + 8, drawY + 8, 12 + pulse, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#00fff5';
            ctx.beginPath();
            ctx.arc(drawX + 8, drawY + 8, 6, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }
}


// LexiQuest Active RPG Interaction & Target System
class InteractionSystem {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.activeTarget = null;
        this.threshold = 48;
    }

    update(player, shards, npcs, portals = [], enemies = []) {
        const pCenterX = player.x + player.width / 2;
        const pCenterY = player.y + player.height / 2;

        let closestTarget = null;
        let minDistance = Infinity;

        // 1. Check Portals (Highest Priority!)
        portals.forEach(portal => {
            const pPos = portal.getPixelPos();
            const dist = Math.hypot(pCenterX - pPos.x, pCenterY - pPos.y);

            if (dist < this.threshold + 10 && dist < minDistance) {
                minDistance = dist;
                closestTarget = { type: 'portal', target: portal, label: `Đi Qua ${portal.targetZoneTitle}` };
            }
        });

        // 2. Check Enemies (Tay Sai Hội Nhàn Nhã)
        if (!closestTarget) {
            enemies.forEach(enemy => {
                if (enemy.isDead) return;
                const eCenterX = enemy.x + enemy.width / 2;
                const eCenterY = enemy.y + enemy.height / 2;
                const dist = Math.hypot(pCenterX - eCenterX, pCenterY - eCenterY);

                if (dist < this.threshold + 10 && dist < minDistance) {
                    minDistance = dist;
                    closestTarget = { type: 'enemy', target: enemy, label: `⚡ Khiêu Chiến ${enemy.name}` };
                }
            });
        }

        // 3. Check Shards
        if (!closestTarget) {
            shards.forEach(shard => {
                if (shard.collected) return;
                const sPos = shard.getPixelPos();
                const dist = Math.hypot(pCenterX - sPos.x, pCenterY - sPos.y);

                if (dist < this.threshold && dist < minDistance) {
                    minDistance = dist;
                    closestTarget = { type: 'shard', target: shard, label: 'Nhặt Mảnh Tri Thức' };
                }
            });
        }

        // 4. Check NPCs
        if (!closestTarget) {
            npcs.forEach(npc => {
                const npcCenterX = npc.x + npc.width / 2;
                const npcCenterY = npc.y + npc.height / 2;
                const dist = Math.hypot(pCenterX - npcCenterX, pCenterY - npcCenterY);

                if (dist < this.threshold + 10 && dist < minDistance) {
                    minDistance = dist;
                    closestTarget = { type: 'npc', target: npc, label: `Trò Chuyện (${npc.name})` };
                }
            });
        }

        this.activeTarget = closestTarget;
    }

    drawPrompt(ctx, camera) {
        if (!this.activeTarget) return;

        const target = this.activeTarget.target;
        const pos = target.getPixelPos ? target.getPixelPos() : { x: target.x + target.width / 2, y: target.y };
        const drawX = pos.x - camera.x;
        const drawY = pos.y - camera.y;

        const bounce = Math.sin(Date.now() / 180) * 4;

        ctx.save();
        ctx.fillStyle = this.activeTarget.type === 'portal' ? '#00fff5' : (this.activeTarget.type === 'enemy' ? '#ff0055' : (this.activeTarget.type === 'npc' ? '#6c5ce7' : '#ff0055'));
        ctx.fillRect(drawX - 48, drawY - 42 + bounce, 96, 24);

        ctx.fillStyle = this.activeTarget.type === 'portal' ? '#0f172a' : '#ffffff';
        ctx.font = '12px Press Start 2P';
        ctx.textAlign = 'center';
        ctx.fillText('[E]', drawX, drawY - 26 + bounce);

        ctx.fillStyle = this.activeTarget.type === 'portal' ? '#000000' : '#ffeaa7';
        ctx.font = '14px Pixelify Sans';
        ctx.fillText(this.activeTarget.label, drawX, drawY - 48 + bounce);
        ctx.restore();
    }
}


// LexiQuest Dialogue System (Typewriter & Movement Lock)
class DialogueSystem {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.queue = [];
        this.currentIndex = 0;
        this.isOpen = false;
        this.onComplete = null;
    }

    start(dialogueQueue, onComplete = null) {
        this.queue = dialogueQueue;
        this.currentIndex = 0;
        this.onComplete = onComplete;
        this.isOpen = true;

        this.eventBus.emit('DIALOGUE_START', { line: this.queue[0] });
        this.eventBus.emit('MOVEMENT_LOCK', true);
    }

    advance() {
        if (!this.isOpen) return;

        this.currentIndex++;
        if (this.currentIndex >= this.queue.length) {
            this.close();
        } else {
            this.eventBus.emit('DIALOGUE_LINE', { line: this.queue[this.currentIndex] });
        }
    }

    close() {
        this.isOpen = false;
        this.eventBus.emit('DIALOGUE_CLOSE');
        this.eventBus.emit('MOVEMENT_LOCK', false);

        if (this.onComplete) {
            this.onComplete();
        }
    }
}


// LexiQuest Learning System with RPG HP Damage Penalties
class LearningSystem {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.activeEncounter = null;
        this.onSuccess = null;
        this.onWrong = null;
    }

    startEncounter(puzzleData, onSuccess = null, onWrong = null) {
        this.activeEncounter = puzzleData;
        this.onSuccess = onSuccess;
        this.onWrong = onWrong;

        this.eventBus.emit('LESSON_START', { puzzle: puzzleData });
        this.eventBus.emit('MOVEMENT_LOCK', true);
    }

    submitAnswer(selectedIndex) {
        if (!this.activeEncounter) return;

        const isCorrect = (selectedIndex === this.activeEncounter.correct);

        if (isCorrect) {
            this.eventBus.emit('LESSON_CORRECT', { explanation: this.activeEncounter.explanation });
            setTimeout(() => {
                this.close();
                if (this.onSuccess) this.onSuccess();
            }, 2000);
        } else {
            this.eventBus.emit('LESSON_WRONG', { message: '❌ Sai rồi! Nhàn Nhã Hội làm bạn mất -20 HP!' });
            if (this.onWrong) this.onWrong(20);
        }
    }

    close() {
        this.activeEncounter = null;
        this.eventBus.emit('LESSON_CLOSE');
        this.eventBus.emit('MOVEMENT_LOCK', false);
    }
}


// LexiQuest Restoration System (Lexaris Tree Glow & Magic Beam FX)
class RestorationSystem {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.restorationPct = 0;
    }

    restoreShard(shard, totalShards = 8) {
        shard.collected = true;
        this.restorationPct += (100 / totalShards);

        this.eventBus.emit('RESTORATION_UPDATE', {
            pct: this.restorationPct,
            shard: shard
        });

        this.eventBus.emit('SPAWN_MAGIC_BEAM', {
            startX: shard.tileX * 48 + 24,
            startY: shard.tileY * 48 + 24,
            targetX: 9 * 48 + 24,
            targetY: 3 * 48 + 24
        });
    }
}


// LexiQuest DOM HUD UI Controller
class Hud {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.treeBar = document.getElementById('tree-progress-bar');
        this.treePctText = document.getElementById('tree-pct-text');
        this.shardsCounter = document.getElementById('shards-counter');

        this.eventBus.on('RESTORATION_UPDATE', (data) => {
            this.updateRestoration(data.pct);
        });
    }

    updateRestoration(pct) {
        const rounded = Math.round(pct);
        if (this.treeBar) this.treeBar.style.width = `${pct}%`;
        if (this.treePctText) this.treePctText.innerText = `${rounded}%`;
    }

    updateShardsCount(collected, total) {
        if (this.shardsCounter) this.shardsCounter.innerText = `${collected} / ${total}`;
    }
}


// LexiQuest DOM DialogueBox UI Controller
class DialogueBox {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.box = document.getElementById('dialogue-box');
        this.speakerName = document.getElementById('speaker-name');
        this.content = document.getElementById('dialogue-text');
        this.avatar = document.getElementById('avatar');

        this.eventBus.on('DIALOGUE_START', (data) => this.show(data.line));
        this.eventBus.on('DIALOGUE_LINE', (data) => this.show(data.line));
        this.eventBus.on('DIALOGUE_CLOSE', () => this.hide());
    }

    show(line) {
        if (!line) return;
        this.speakerName.innerText = line.speaker;
        this.avatar.className = `portrait ${line.avatar || 'kaelen'}`;
        this.content.innerText = line.text;
        this.box.classList.remove('hidden');
    }

    hide() {
        this.box.classList.add('hidden');
    }
}


// LexiQuest DOM Lesson / Quiz Panel UI Controller
class LessonPanel {
    constructor(eventBus, learningSystem) {
        this.eventBus = eventBus;
        this.learningSystem = learningSystem;

        this.modal = document.getElementById('battle-modal');
        this.questionEl = document.getElementById('battle-question');
        this.optionsEl = document.getElementById('battle-options');
        this.feedbackEl = document.getElementById('battle-feedback');

        this.eventBus.on('LESSON_START', (data) => this.show(data.puzzle));
        this.eventBus.on('LESSON_CORRECT', (data) => this.showCorrect(data.explanation));
        this.eventBus.on('LESSON_WRONG', (data) => this.showWrong(data.message));
        this.eventBus.on('LESSON_CLOSE', () => this.hide());
    }

    show(puzzle) {
        if (!puzzle) return;
        this.feedbackEl.classList.add('hidden');
        this.questionEl.innerText = `[Thử Thách Resonance] ${puzzle.prompt}`;

        this.optionsEl.innerHTML = '';
        puzzle.options.forEach((optText, index) => {
            const btn = document.createElement('button');
            btn.className = 'battle-option-btn';
            btn.innerText = `${index + 1}. ${optText}`;
            btn.onclick = () => this.learningSystem.submitAnswer(index);
            this.optionsEl.appendChild(btn);
        });

        this.modal.classList.remove('hidden');
    }

    showCorrect(explanation) {
        this.feedbackEl.innerText = `✨ ${explanation}`;
        this.feedbackEl.className = 'battle-feedback correct';
        this.feedbackEl.classList.remove('hidden');
    }

    showWrong(message) {
        this.feedbackEl.innerText = message;
        this.feedbackEl.className = 'battle-feedback wrong';
        this.feedbackEl.classList.remove('hidden');
    }

    hide() {
        this.modal.classList.add('hidden');
    }
}


// LexiQuest DOM Knowledge Book (Lore & Shards Journal Overlay)
class KnowledgeBook {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.modal = document.getElementById('journal-modal');
        this.listEl = document.getElementById('journal-content-list');
    }

    open(shards) {
        this.listEl.innerHTML = '';
        shards.forEach(shard => {
            const card = document.createElement('div');
            card.className = `journal-card ${shard.collected ? 'collected' : 'locked'}`;

            const icon = shard.collected ? shard.icon : '🔒';
            const status = shard.collected ? '<span style="color:#00ff80;">[ĐÃ KHÔI PHỤC]</span>' : '<span style="color:#ff7675;">[ĐANG BỊ NIÊM PHONG]</span>';

            card.innerHTML = `
                <div class="journal-card-title">${icon} ${shard.title} ${status}</div>
                <div class="journal-card-desc">${shard.collected ? shard.puzzleData.explanation : 'Hãy tiếp cận vị trí Mảnh Tri Thức này trên bản đồ và giải thử thách Resonance!'}</div>
            `;
            this.listEl.appendChild(card);
        });
        this.modal.classList.remove('hidden');
    }

    close() {
        this.modal.classList.add('hidden');
    }
}


// LexiQuest DOM QuestLog Overlay Controller
class QuestLog {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.modal = document.getElementById('quest-modal');
    }

    open() {
        this.modal.classList.remove('hidden');
    }

    close() {
        this.modal.classList.add('hidden');
    }
}


// LexiQuest DOM Đại Sử Việt History Chronicle Overlay Controller
class ChroniclePanel {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.modal = document.getElementById('chronicle-modal');
        this.listEl = document.getElementById('chronicle-content-list');
    }

    open(historyAnchors) {
        if (!this.modal || !this.listEl) return;
        this.listEl.innerHTML = '';

        historyAnchors.forEach(anchor => {
            const card = document.createElement('div');
            card.className = `card-item ${anchor.collected ? 'active' : ''}`;

            const icon = anchor.collected ? anchor.icon : '🔒';
            const status = anchor.collected ? '<span style="color:#00ff80;">[ĐÃ GHI CHRONICLE]</span>' : '<span style="color:#ff7675;">[CHƯA GIẢI MÃ]</span>';
            const sources = anchor.sourceRefs ? anchor.sourceRefs.join(', ') : 'Nguồn Bảo tàng Quốc gia';

            card.innerHTML = `
                <div class="card-title">${icon} ${anchor.title} ${status}</div>
                <div class="card-desc"><b>Phân loại:</b> ${anchor.classification || 'Ký ức Lịch sử'}</div>
                <div class="card-desc" style="margin-top:4px;"><b>Nguồn kiểm chứng:</b> ${sources}</div>
                <div class="card-desc" style="margin-top:4px;">${anchor.collected ? anchor.puzzleData.explanation : 'Hãy tìm Memory Anchor này trên bản đồ và giải thử thách để ghi lại vào Chronicle!'}</div>
            `;
            this.listEl.appendChild(card);
        });

        this.modal.classList.remove('hidden');
    }

    close() {
        if (this.modal) this.modal.classList.add('hidden');
    }
}


// LexiQuest DOM Lexaris Restoration Progress Overlay Controller
class ProgressModal {
    constructor(eventBus, game) {
        this.eventBus = eventBus;
        this.game = game;
        this.modal = document.getElementById('progress-modal');
        this.listEl = document.getElementById('progress-content-list');
    }

    open() {
        if (!this.modal || !this.listEl) return;
        this.listEl.innerHTML = '';

        const game = this.game;
        const totalShards = game.shards ? game.shards.length : 0;
        const collectedShards = game.shards ? game.shards.filter(s => s.collected).length : 0;
        const restorationPct = game.restorationSystem ? game.restorationSystem.restorationPct : 0;

        const summaryCard = document.createElement('div');
        summaryCard.className = 'card-item active';
        summaryCard.innerHTML = `
            <div class="card-title">🌳 Cội Nguồn Lexaris: ${restorationPct}% Khôi Phục</div>
            <div class="card-desc"><b>Tiến trình Mảnh Tri Thức:</b> ${collectedShards} / ${totalShards} Mảnh đã thu thập.</div>
            <div class="card-desc" style="margin-top:4px;"><b>Sức mạnh Kaelen:</b> ⚔️ ATK: ${game.player.atk} | ❤️ HP: ${game.player.hp}/${game.player.maxHp} | 💧 MP: ${Math.floor(game.player.mp)}/100</div>
            <div class="card-desc" style="margin-top:4px;"><b>Vùng đất hiện tại:</b> ${game.map.title || 'Màn 1'} (${game.enemies.filter(e => !e.isDead).length} tay sai còn sống)</div>
        `;
        this.listEl.appendChild(summaryCard);

        if (game.shards) {
            game.shards.forEach((shard, idx) => {
                const card = document.createElement('div');
                card.className = `card-item ${shard.collected ? 'active' : ''}`;
                const status = shard.collected ? '<span style="color:#00ff80;">[ĐÃ THU THẬP & TĂNG SỨC MẠNH]</span>' : '<span style="color:#ff7675;">[CHƯA THU THẬP - QUÁI DEF RẤT CAO!]</span>';
                card.innerHTML = `
                    <div class="card-title">${shard.collected ? '💎' : '🔒'} Mảnh ${idx + 1}: ${shard.title} ${status}</div>
                    <div class="card-desc">${shard.collected ? (shard.puzzleData?.explanation || 'Đã khôi phục tri thức và tăng sức mạnh cho Kaelen!') : 'Hãy di chuyển đến vị trí Mảnh này trên bản đồ và giải thử thách để giải niêm phong.'}</div>
                `;
                this.listEl.appendChild(card);
            });
        }

        this.modal.classList.remove('hidden');
    }

    close() {
        if (this.modal) this.modal.classList.add('hidden');
    }
}



// LexiQuest Pixel Concept Bible Map Repository (Rich 16-Bit Tilesets & Landmark Props)
const MAPS_DATA = {
    // ─── MODULE 1: THE LAND OF WORDS (Màu xanh lá - Forgotten Library & Vocabulary Forest) ───
    'zone-stage-1': {
        id: 'zone-stage-1',
        title: 'Module 1 Stage 1: The Forgotten Library (Thư viện bị lãng quên)',
        moduleTheme: 'words',
        cols: 22,
        rows: 14,
        tileSize: 48,
        // Tiles: 0:Grass, 1:Water, 2:Cobblestone Path, 3:Ancient Stone Wall, 4:Lush Tree, 5:Wooden Bridge, 6:Bookshelf, 7:Rock, 8:Barrel, 9:Fountain, 10:Chest, 11:Lantern
        grid: [
            [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
            [3,6,6,6,3,8,0,0,8,3,2,2,2,2,3,6,6,6,3,7,11,3],
            [3,6,6,6,3,0,4,0,4,3,2,0,0,2,3,6,6,6,3,4,0,3],
            [3,2,2,2,2,0,0,0,0,2,2,9,0,2,2,2,2,2,2,0,7,3],
            [3,2,0,0,2,8,4,0,0,2,0,0,0,2,0,0,4,0,2,0,0,3],
            [3,2,10,0,2,0,0,0,0,5,2,2,2,5,0,0,0,0,2,10,0,3],
            [3,1,1,1,1,1,1,1,1,1,1,2,2,1,1,1,1,1,1,1,1,3],
            [3,2,0,0,2,0,0,0,0,5,2,2,2,5,0,0,0,0,2,0,7,3],
            [3,2,4,0,2,0,4,0,0,2,2,2,2,2,0,0,4,0,2,0,0,3],
            [3,2,2,2,2,0,0,0,8,2,0,0,0,2,8,7,0,0,2,0,0,3],
            [3,3,6,6,3,8,0,4,0,2,0,0,0,2,0,4,0,7,3,6,6,3],
            [3,3,6,6,3,0,0,0,0,2,0,0,0,2,0,0,0,0,3,6,6,3],
            [3,3,3,3,3,3,3,3,3,3,2,2,2,3,3,3,3,3,3,3,3,3],
            [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3]
        ]
    },
    'zone-stage-2': {
        id: 'zone-stage-2',
        title: 'Module 1 Stage 2: The Vocabulary Forest (Khu rừng từ vựng)',
        moduleTheme: 'words',
        cols: 22,
        rows: 14,
        tileSize: 48,
        grid: [
            [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
            [3,4,4,4,4,0,2,2,2,2,2,2,2,2,0,4,4,4,4,4,11,3],
            [3,4,0,0,4,0,2,0,0,0,0,0,0,2,0,4,0,0,0,4,0,3],
            [3,4,0,10,0,0,2,0,4,9,4,0,0,2,0,0,10,4,0,4,7,3],
            [3,4,4,0,4,0,2,0,4,4,4,0,0,2,0,4,0,4,0,4,0,3],
            [3,0,0,0,0,0,5,2,2,2,2,2,2,5,0,0,0,0,0,0,0,3],
            [3,1,1,1,1,1,1,1,1,2,2,1,1,1,1,1,1,1,1,1,1,3],
            [3,0,0,0,0,0,5,2,2,2,2,2,2,5,0,0,0,0,0,0,7,3],
            [3,4,4,0,4,0,2,0,4,4,4,0,0,2,0,4,0,4,0,4,0,3],
            [3,4,0,10,0,0,2,0,4,4,4,0,0,2,0,0,10,4,0,4,0,3],
            [3,4,0,0,4,0,2,0,0,0,0,0,0,2,0,4,0,0,0,4,0,3],
            [3,4,4,4,4,0,2,2,2,2,2,2,2,2,0,4,4,4,4,4,11,3],
            [3,3,3,3,3,3,3,3,3,2,2,3,3,3,3,3,3,3,3,3,3,3],
            [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3]
        ]
    },
    'zone-stage-3': {
        id: 'zone-stage-3',
        title: 'Module 1 Stage 3: The Missing Letters Mine (Mỏ khai thác chữ cái)',
        moduleTheme: 'words',
        cols: 22,
        rows: 14,
        tileSize: 48,
        grid: [
            [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
            [3,7,7,7,3,8,2,2,2,2,2,2,2,2,8,3,7,7,7,7,11,3],
            [3,7,10,7,3,0,2,7,7,7,7,7,7,2,0,3,7,10,7,7,0,3],
            [3,7,7,7,3,0,2,7,6,6,6,6,7,2,0,3,7,7,7,7,7,3],
            [3,2,2,2,2,2,2,7,6,9,9,6,7,2,2,2,2,2,2,2,0,3],
            [3,2,0,0,0,0,2,7,6,6,6,6,7,2,0,0,0,0,0,2,0,3],
            [3,2,0,0,0,0,2,7,7,7,7,7,7,2,0,0,0,0,0,2,0,3],
            [3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,7,3],
            [3,7,7,7,3,0,2,7,7,7,7,7,7,2,0,3,7,7,7,7,0,3],
            [3,7,10,7,3,0,2,7,7,7,7,7,7,2,0,3,7,10,7,7,0,3],
            [3,7,7,7,3,8,2,2,2,2,2,2,2,2,8,3,7,7,7,7,0,3],
            [3,3,3,3,3,3,3,3,3,2,2,3,3,3,3,3,3,3,3,3,11,3],
            [3,3,3,3,3,3,3,3,3,2,2,3,3,3,3,3,3,3,3,3,3,3],
            [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3]
        ]
    }
};


// LexiQuest English Campaign Data (Canon Concept Bible - 4 Modules Architecture)
const ENGLISH_CAMPAIGN = {
    id: 'campaign-english',
    title: 'Chiến Dịch 1: Cổ Tự Rune Tiếng Anh (Modules 1-3)',
    unlocked: true,
    modules: [
        // MODULE 1: THE LAND OF WORDS
        {
            id: 'module-1',
            title: 'MODULE 1: THE LAND OF WORDS (Vùng Đất Từ Vựng)',
            colorTheme: '#27ae60', // Xanh lá
            icon: '📖',
            boss: {
                id: 'boss-module-1',
                name: 'The Word Golem (Golem Từ Vựng)',
                avatar: 'oblivitas',
                hp: 400,
                def: 60,
                title: 'Trận Chiến Golem Từ Vựng',
                questions: [
                    {
                        prompt: '[Trùm Module 1 - Pha 1] Chọn cấu trúc câu S-V-O hoàn chỉnh:',
                        options: ['Kaelen restores Lexaris.', 'Restores Kaelen Lexaris.', 'Lexaris Kaelen restores.'],
                        correct: 0,
                        explanation: 'Chính xác! S (Kaelen) + V (restores) + O (Lexaris).'
                    },
                    {
                        prompt: '[Trùm Module 1 - Pha 2] Từ nào là Noun Uncountable?',
                        options: ['Knowledge', 'Shard', 'Book'],
                        correct: 0,
                        explanation: 'Chính xác! Knowledge là danh từ không đếm được.'
                    },
                    {
                        prompt: '[Trùm Module 1 - Pha 3] Chọn dạng từ số nhiều đúng của "Child":',
                        options: ['Children', 'Childs', 'Childes'],
                        correct: 0,
                        explanation: 'Chính xác! Children là danh từ số nhiều bất quy tắc.'
                    }
                ]
            },
            stages: [
                {
                    id: 'stage-1',
                    title: 'Stage 1: The Forgotten Library (Thư viện bị lãng quên)',
                    mapZoneId: 'zone-stage-1',
                    wordChallenges: [
                        {
                            id: 'word-mod1-stg1-day1',
                            fileRef: 'Ngay 1.docx',
                            title: 'Thử Thách Ngày 1: Cấu Trúc S-V-O',
                            tileX: 5, tileY: 3, icon: '📖',
                            dialogue: [{ speaker: 'Lex 🦉', avatar: 'lex', text: 'Kaelen! Thư viện bị lãng quên lưu giữ Cổ Tự Ngày 1! Hãy khôi phục quy luật S-V-O!' }],
                            puzzle: {
                                prompt: 'Sắp xếp câu chuẩn cấu trúc S-V-O:',
                                options: ['The Seeker protects the realm.', 'Protects the Seeker the realm.', 'The realm protects The Seeker.'],
                                correct: 0,
                                explanation: 'Đúng! S (The Seeker) + V (protects) + O (the realm).'
                            }
                        },
                        {
                            id: 'word-mod1-stg1-day2',
                            fileRef: 'Ngay 2.docx',
                            title: 'Thử Thách Ngày 2: Subject Pronouns',
                            tileX: 14, tileY: 3, icon: '✨',
                            dialogue: [{ speaker: 'Lex 🦉', avatar: 'lex', text: 'Mảnh Ngày 2! Giúp các thực thể lấy lại danh tánh bằng Subject Pronouns!' }],
                            puzzle: {
                                prompt: 'Chọn Subject Pronoun đúng: "___ protects Lexia with magic."',
                                options: ['He', 'Him', 'His'],
                                correct: 0,
                                explanation: 'Đúng! "He" đóng vai trò Chủ Ngữ (Subject).'
                            }
                        },
                        {
                            id: 'word-mod1-stg1-day3',
                            fileRef: 'Ngay 3.docx',
                            title: 'Thử Thách Ngày 3: Object Pronouns',
                            tileX: 4, tileY: 9, icon: '📘',
                            dialogue: [{ speaker: 'Lex 🦉', avatar: 'lex', text: 'Mảnh Ngày 3! Hãy tìm Object Pronoun đứng sau Động từ!' }],
                            puzzle: {
                                prompt: 'Chọn Object Pronoun: "Lex guides ___ through the ruins."',
                                options: ['him', 'he', 'his'],
                                correct: 0,
                                explanation: 'Đúng! "him" đứng sau Động từ "guides" đóng vai trò Tân Ngữ.'
                            }
                        },
                        {
                            id: 'word-mod1-stg1-day4',
                            fileRef: 'Ngay 4.docx',
                            title: 'Thử Thách Ngày 4: Possessive Adjectives',
                            tileX: 15, tileY: 9, icon: '🗝️',
                            dialogue: [{ speaker: 'Lex 🦉', avatar: 'lex', text: 'Mảnh Ngày 4! Khôi phục quyền sở hữu tri thức!' }],
                            puzzle: {
                                prompt: 'Chọn Possessive Adjective: "Kaelen holds ___ glowing staff."',
                                options: ['his', 'him', 'he'],
                                correct: 0,
                                explanation: 'Đúng! "his" bổ nghĩa cho danh từ "glowing staff".'
                            }
                        }
                    ]
                },
                {
                    id: 'stage-2',
                    title: 'Stage 2: The Vocabulary Forest (Khu rừng từ vựng)',
                    mapZoneId: 'zone-stage-2',
                    wordChallenges: [
                        {
                            id: 'word-mod1-stg2-day5',
                            fileRef: 'Ngày 5.docx',
                            title: 'Thử Thách Ngày 5: Plural Nouns',
                            tileX: 6, tileY: 4, icon: '🌲',
                            dialogue: [{ speaker: 'Lex 🦉', avatar: 'lex', text: 'Stage 2 - Khu rừng từ vựng! Danh từ số nhiều đang tỏa sáng!' }],
                            puzzle: {
                                prompt: 'Dạng số nhiều đúng của "Child" là gì?',
                                options: ['Children', 'Childs', 'Childes'],
                                correct: 0,
                                explanation: 'Đúng! "Children" là dạng danh từ số nhiều bất quy tắc.'
                            }
                        },
                        {
                            id: 'word-mod1-stg2-day6',
                            fileRef: 'Ngày 6.docx',
                            title: 'Thử Thách Ngày 6: Uncountable Nouns',
                            tileX: 13, tileY: 8, icon: '🧪',
                            dialogue: [{ speaker: 'Lex 🦉', avatar: 'lex', text: 'Ngày 6! Phân biệt danh từ không đếm được giữa khu rừng!' }],
                            puzzle: {
                                prompt: 'Từ nào là danh từ không đếm được?',
                                options: ['Information', 'Fact', 'Detail'],
                                correct: 0,
                                explanation: 'Đúng! "Information" là danh từ không đếm được.'
                            }
                        }
                    ]
                },
                {
                    id: 'stage-3',
                    title: 'Stage 3: The Missing Letters Mine (Mỏ khai thác chữ cái)',
                    mapZoneId: 'zone-stage-3',
                    wordChallenges: [
                        {
                            id: 'word-mod1-stg3-day7',
                            fileRef: 'Ngày 7.docx',
                            title: 'Thử Thách Ngày 7: Missing Letters',
                            tileX: 5, tileY: 5, icon: '⛏️',
                            dialogue: [{ speaker: 'Lex 🦉', avatar: 'lex', text: 'Stage 3 - Mỏ khai thác chữ cái! Khai quật ký tự bị phong ấn!' }],
                            puzzle: {
                                prompt: 'Điền chữ cái còn thiếu: "Kn_wledge"',
                                options: ['o', 'e', 'i'],
                                correct: 0,
                                explanation: 'Đúng! "Knowledge" nghĩa là Tri Thức.'
                            }
                        }
                    ]
                }
            ]
        },
        // MODULE 2: THE LAND OF GRAMMAR
        {
            id: 'module-2',
            title: 'MODULE 2: THE LAND OF GRAMMAR (Vùng Đất Ngữ Pháp)',
            colorTheme: '#2980b9', // Xanh dương
            icon: '📜',
            boss: {
                id: 'boss-module-2',
                name: 'The Grammar Guardian (Người Gác Ngữ Pháp)',
                avatar: 'oblivitas',
                hp: 600, def: 80,
                title: 'Trận Chiến Người Gác Ngữ Pháp',
                questions: [
                    {
                        prompt: '[Trùm Module 2 - Pha 1] Chọn câu thì Hiện Tại Đơn đúng:',
                        options: ['He goes to school.', 'He go to school.', 'He going to school.'],
                        correct: 0,
                        explanation: 'Chính xác! He/She/It đi với Động từ thêm s/es.'
                    }
                ]
            },
            stages: [
                {
                    id: 'stage-1',
                    title: 'Stage 1: The Ruined Classroom (Lớp học đổ nát)',
                    mapZoneId: 'zone-stage-1',
                    wordChallenges: [
                        {
                            id: 'word-mod2-stg1-day20',
                            fileRef: 'Ngày 20.docx',
                            title: 'Thử Thách Ngày 20: Present Simple Tense',
                            tileX: 7, tileY: 4, icon: '🏫',
                            dialogue: [{ speaker: 'Lex 🦉', avatar: 'lex', text: 'Module 2 Stage 1 - Lớp học đổ nát! Khôi phục quy luật Hiện Tại Đơn!' }],
                            puzzle: {
                                prompt: 'Chọn dạng động từ đúng: "She ___ (read) books every day."',
                                options: ['reads', 'read', 'reading'],
                                correct: 0,
                                explanation: 'Đúng! Chủ ngữ "She" đi với Động từ "reads".'
                            }
                        }
                    ]
                },
                {
                    id: 'stage-2',
                    title: 'Stage 2: The Grammar Bridge (Cây cầu ngữ pháp)',
                    mapZoneId: 'zone-stage-2',
                    wordChallenges: [
                        {
                            id: 'word-mod2-stg2-day22',
                            fileRef: 'Ngày 22.docx',
                            title: 'Thử Thách Ngày 22: Past Simple Tense',
                            tileX: 8, tileY: 5, icon: '🌉',
                            dialogue: [{ speaker: 'Lex 🦉', avatar: 'lex', text: 'Stage 2 - Cây cầu ngữ pháp! Khôi phục liên kết quá khứ!' }],
                            puzzle: {
                                prompt: 'Dạng Quá Khứ của "Go" là gì?',
                                options: ['went', 'gone', 'goed'],
                                correct: 0,
                                explanation: 'Đúng! "Went" là Quá khứ đơn của "Go".'
                            }
                        }
                    ]
                }
            ]
        },
        // MODULE 3: THE LAND OF FLUENCY
        {
            id: 'module-3',
            title: 'MODULE 3: THE LAND OF FLUENCY (Vùng Đất Giao Tiếp)',
            colorTheme: '#8e44ad', // Tím
            icon: '💬',
            boss: {
                id: 'boss-module-3',
                name: 'The Echo of Doubt (Bóng Tối Nghi Ngờ)',
                avatar: 'oblivitas',
                hp: 800, def: 100,
                title: 'Trận Chiến Bóng Tối Nghi Ngờ',
                questions: [
                    {
                        prompt: '[Trùm Module 3 - Pha 1] Chọn câu phản hồi giao tiếp tự tin:',
                        options: ['I can achieve it!', 'I doubt it.', 'I give up.'],
                        correct: 0,
                        explanation: 'Chính xác! Sự tự tin là chìa khóa giao tiếp!'
                    }
                ]
            },
            stages: [
                {
                    id: 'stage-1',
                    title: 'Stage 1: The Whisper Town (Thị trấn thì thầm)',
                    mapZoneId: 'zone-stage-1',
                    wordChallenges: [
                        {
                            id: 'word-mod3-stg1-day30',
                            fileRef: 'Ngày 30.docx',
                            title: 'Thử Thách Ngày 30: Daily Communication',
                            tileX: 6, tileY: 5, icon: '🏘️',
                            dialogue: [{ speaker: 'Lex 🦉', avatar: 'lex', text: 'Module 3 Stage 1 - Thị trấn thì thầm! Luyện tập giao tiếp!' }],
                            puzzle: {
                                prompt: 'Lời chào trang trọng khi gặp đối tác:',
                                options: ['Good morning, how do you do?', 'Hey bro, what’s up?', 'Bye now.'],
                                correct: 0,
                                explanation: 'Đúng! Lời chào trang trọng và lịch sự.'
                            }
                        }
                    ]
                }
            ]
        }
    ]
};


// LexiQuest History Campaign Data (MODULE 4: THE LAND OF HISTORY - Canon Concept Bible Spec)
const HISTORY_CAMPAIGN = {
    id: 'campaign-history',
    title: 'MODULE 4: THE LAND OF HISTORY (Đại Sử Việt - Hồn Thiêng Non Sông)',
    colorTheme: '#d35400', // Đỏ cam
    icon: '🥁', // Trống đồng
    unlocked: false, // Locked until English Modules 1-3 completed!
    chapters: [
        {
            id: 'history-stage-1',
            title: 'Stage 1: The Ancient Gate (Cổng thành cổ - Bạch Đằng Giang 938)',
            tileX: 3, tileY: 9, icon: '🏛️',
            classification: 'Bạch Đằng Giang 938',
            sourceRefs: ['Bảo tàng Lịch sử Quốc gia - Ngô Quyền và Chiến thắng Bạch Đằng 938'],
            dialogue: [
                { speaker: 'Sử', avatar: 'su', text: 'Kaelen! Cùng tớ mở Cổng thành cổ Bạch Đằng Giang 938! Trí tuệ cọc gỗ bọc sắt đánh tan quân Nam Hán!' }
            ],
            puzzle: {
                prompt: 'Chiến thuật quyết định của Ngô Quyền trên sông Bạch Đằng năm 938 là gì?',
                options: [
                    'Cắm cọc gỗ đầu bọc sắt xuống lòng sông, dụ thuyền địch vào khi thủy triều rút.',
                    'Xây thành lũy đá kiên cố trên bờ.',
                    'Dùng hỏa công đốt thuyền địch trên bến.'
                ],
                correct: 0,
                explanation: 'Tuyệt vời! Ngô Quyền tận dụng quy luật tự nhiên và địa hình sông nước - trí tuệ quân sự Việt Nam! (Nguồn: Bảo tàng Lịch sử Quốc gia)'
            }
        },
        {
            id: 'history-stage-2',
            title: 'Stage 2: The Chronicle Village (Làng sử ký - Hào Khí Diên Hồng)',
            tileX: 17, tileY: 9, icon: '🔥',
            classification: 'Hội Nghị Diên Hồng',
            sourceRefs: ['Bảo tàng Lịch sử Quốc gia - Nhà Trần 3 lần kháng chiến Nguyên Mông'],
            dialogue: [
                { speaker: 'Sử', avatar: 'su', text: 'Mảnh Ký Ức Làng Sử Ký Diên Hồng! Tiếng hô "ĐÁNH!" vang dội của các vị phụ lão nhà Trần!' }
            ],
            puzzle: {
                prompt: 'Khi Vua Trần hỏi ý kiến các phụ lão tại điện Diên Hồng: "Nên Đánh hay Hòa?", muôn người đã hô vang điều gì?',
                options: ['ĐÁNH!', 'HÒA!', 'RÚT!'],
                correct: 0,
                explanation: 'Chính xác! Tiếng hô "ĐÁNH!" thể hiện ý chí quật cường của toàn dân tộc! (Nguồn: Bảo tàng Lịch sử Quốc gia)'
            }
        },
        {
            id: 'history-stage-3',
            title: 'Stage 3: The Legendary Battlefield (Chiến trường huyền thoại - Lam Sơn)',
            tileX: 12, tileY: 10, icon: '📜',
            classification: 'Bình Ngô Đại Cáo',
            sourceRefs: ['Bảo tàng Lịch sử Quốc gia - Nguyễn Trãi trong khởi nghĩa Lam Sơn'],
            dialogue: [
                { speaker: 'Sử', avatar: 'su', text: 'Stage 3 - Chiến trường huyền thoại! Bình Ngô Đại Cáo của Nguyễn Trãi!' }
            ],
            puzzle: {
                prompt: 'Tư tưởng cốt lõi trong Bình Ngô Đại Cáo là gì?',
                options: [
                    'Việc nhân nghĩa cốt ở yên dân / Quân điên phạt trước lo trừ bạo.',
                    'Tích trữ tài sản vàng bạc.',
                    'Mở rộng lãnh thổ sang các nước khác.'
                ],
                correct: 0,
                explanation: 'Chính xác! Tư tưởng nhân nghĩa vì yên dân và hòa bình! (Nguồn: Bảo tàng Lịch sử Quốc gia)'
            }
        },
        {
            id: 'history-stage-4',
            title: 'Stage 4 (Boss): The Shadow of War (Trận chiến Bóng Tối Chiến Tranh)',
            tileX: 10, tileY: 3, icon: '⭐',
            classification: 'Ba Đình 2/9/1945',
            sourceRefs: ['Bảo tàng Hồ Chí Minh - Tuyên ngôn Độc lập 2/9/1945'],
            dialogue: [
                { speaker: 'Sử', avatar: 'su', text: 'Trận chiến cuối cùng - Đánh tan Bóng Tối Chiến Tranh tại Quảng trường Ba Đình lịch sử!' }
            ],
            puzzle: {
                prompt: 'Chủ tịch Hồ Chí Minh đã đọc Tuyên ngôn Độc lập tại đâu ngày 2/9/1945?',
                options: ['Quảng trường Ba Đình, Hà Nội.', 'Bến Nhà Rồng, Sài Gòn.', 'Cố đô Huế.'],
                correct: 0,
                explanation: 'Hoàn hảo! Quảng trường Ba Đình lịch sử! (Nguồn: Bảo tàng Hồ Chí Minh)'
            }
        }
    ]
};


// LexiQuest Quests Data Repository
const QUESTS_DATA = [
    {
        id: 'main-quest-lexaris',
        title: 'Khôi Phục Cội Nguồn Lexaris',
        description: 'Thu thập đủ 8 Mảnh Tri Thức rải rác khắp các vùng đất để thắp sáng Cội Nguồn Lexaris lên 100%.',
        type: 'main',
        isCompleted: false
    },
    {
        id: 'side-quest-english',
        title: 'Cổ Tự Rune S-V-O cùng Lex',
        description: 'Giải mã 4 Mảnh Rune Ngôn Từ Tiếng Anh để hàn gắn vết nứt tri thức.',
        type: 'side',
        isCompleted: false
    },
    {
        id: 'side-quest-history',
        title: 'Hào Khí Non Sông cùng Sử',
        description: 'Khám phá 4 Memory Anchors Lịch sử Việt Nam (Bạch Đằng Giang 938, Diên Hồng, Bình Ngô Đại Cáo, 2/9/1945).',
        type: 'side',
        isCompleted: false
    }
];


// LexiQuest Core Game Singleton (Progressive Stage Difficulty - Stage 1 Starts with 2 Mobs)





class Game {
    constructor() {
        this.eventBus = eventBus;
        this.input = new Input();
        this.camera = new Camera(960, 540);

        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;

        this.isMovementLocked = false;
        this.isGameOver = false;
        this.screenShakeTimer = 0;

        this.activeCampaignId = 'campaign-english';
        this.currentModuleIndex = 0;
        this.currentStageIndex = 0;

        this.map = MAPS_DATA['zone-stage-1'];

        this.player = new Player(450, 360);
        this.companion = new Companion(400, 360);
        this.npcs = [];
        this.shards = [];
        this.portals = [];
        this.enemies = [];
        this.projectiles = [];
        this.floatingTexts = [];

        this.interactionSystem = new InteractionSystem(this.eventBus);
        this.dialogueSystem = new DialogueSystem(this.eventBus);
        this.learningSystem = new LearningSystem(this.eventBus);
        this.restorationSystem = new RestorationSystem(this.eventBus);

        this.hud = new Hud(this.eventBus);
        this.dialogueBox = new DialogueBox(this.eventBus);
        this.lessonPanel = new LessonPanel(this.eventBus, this.learningSystem);
        this.knowledgeBook = new KnowledgeBook(this.eventBus);
        this.questLog = new QuestLog(this.eventBus);
        this.chroniclePanel = new ChroniclePanel(this.eventBus);
        this.progressModal = new ProgressModal(this.eventBus, this);

        this.beams = [];

        this.loop = new GameLoop(this.update.bind(this), this.render.bind(this));

        this.setupEvents();
        this.setupVirtualControls();
        this.initNpcs();
        this.loadStageData();
    }

    setupVirtualControls() {
        const bindTouch = (id, keyName) => {
            const btn = document.getElementById(id);
            if (!btn) return;

            const start = (e) => {
                e.preventDefault();
                this.input.keys[keyName] = true;
                this.input.pressed[keyName] = true;
                btn.classList.add('active');
            };
            const end = (e) => {
                e.preventDefault();
                this.input.keys[keyName] = false;
                this.input.pressed[keyName] = false;
                btn.classList.remove('active');
            };

            btn.addEventListener('mousedown', start);
            btn.addEventListener('mouseup', end);
            btn.addEventListener('mouseleave', end);
            btn.addEventListener('touchstart', start, { passive: false });
            btn.addEventListener('touchend', end, { passive: false });
            btn.addEventListener('touchcancel', end, { passive: false });
        };

        bindTouch('vbtn-up', 'KeyW');
        bindTouch('vbtn-down', 'KeyS');
        bindTouch('vbtn-left', 'KeyA');
        bindTouch('vbtn-right', 'KeyD');

        const bindAction = (id, actionFn) => {
            const btn = document.getElementById(id);
            if (!btn) return;
            const trigger = (e) => {
                e.preventDefault();
                actionFn();
            };
            btn.addEventListener('mousedown', trigger);
            btn.addEventListener('touchstart', trigger, { passive: false });
        };

        bindAction('vbtn-attack', () => this.castSkill('standard'));
        bindAction('vbtn-skill1', () => this.castSkill('lightning'));
        bindAction('vbtn-skill2', () => this.castSkill('frost'));
        bindAction('vbtn-skill3', () => this.castSkill('firestorm'));
        bindAction('vbtn-dash', () => this.player.performDash(this.map));
        bindAction('vbtn-interact', () => {
            const active = this.interactionSystem.activeTarget;
            if (active) {
                if (active.type === 'portal') this.switchStageZone(active.target.targetStageIndex);
                else if (active.type === 'shard' && !active.target.collected) this.triggerShardQuest(active.target);
                else if (active.type === 'npc') this.dialogueSystem.start(active.target.dialogue);
            }
        });
    }

    initNpcs() {
        this.npcs = [
            new Npc('npc-elder', 320, 200, 'Trưởng Làng Lexia', 'Người Giữ Tri Thức', 'elder', [
                { speaker: 'Trưởng Làng Lexia', avatar: 'kaelen', text: 'Kaelen! Màn 1 chỉ có 2 Tay Sai nhẹ nhàng để cậu làm quen! Giải Mảnh Tri Thức để tăng +30 ATK trước khi diệt quái!' },
                { speaker: 'Trưởng Làng Lexia', avatar: 'kaelen', text: 'Các màn sau quái vật sẽ đông hơn và mạnh dần! Thu thập toàn bộ Mảnh Tri Thức để đủ sức qua cửa!' }
            ]),
            new Npc('npc-su', 600, 360, 'Sử', 'Thiếu Niên Việt Nam', 'su', [
                { speaker: 'Sử', avatar: 'su', text: 'Kaelen! Độ khó tăng dần từ Màn 1 đến Màn 4! Dùng [Space] tấn công, [Q] Sét, [E] Băng, [R] Lửa tiêu diệt từng tên một!' }
            ])
        ];
    }

    setupEvents() {
        this.eventBus.on('MOVEMENT_LOCK', (v) => { this.isMovementLocked = v; });
        this.eventBus.on('SPAWN_MAGIC_BEAM', (d) => {
            this.beams.push({ startX: d.startX, startY: d.startY, targetX: d.targetX, targetY: d.targetY, life: 40 });
        });
    }

    loadStageData() {
        this.shards = [];
        this.portals = [];
        this.enemies = [];
        this.projectiles = [];

        if (this.activeCampaignId === 'campaign-english') {
            const mod = ENGLISH_CAMPAIGN.modules[this.currentModuleIndex] || ENGLISH_CAMPAIGN.modules[0];
            const stg = mod.stages[this.currentStageIndex] || mod.stages[0];

            stg.wordChallenges.forEach(wc => {
                const s = new Shard(wc.id, wc.tileX, wc.tileY, wc.title, wc.icon, wc.puzzle, wc.dialogue);
                s.fileRef = wc.fileRef;
                this.shards.push(s);
            });

            // Progressive Difficulty Scaling across Stages!
            if (this.currentStageIndex === 0) {
                // Stage 1 (Màn 1): Only 2 Mobs (Dễ làm quen!)
                this.enemies = [
                    new Enemy('e1', 300, 200, 'Tay Sai Tập Sự', '#7c3aed', 80, 35),
                    new Enemy('e2', 680, 240, 'Bóng Ma Lãng Quên', '#9333ea', 90, 40)
                ];
            } else if (this.currentStageIndex === 1) {
                // Stage 2 (Màn 2): 3 Mobs
                this.enemies = [
                    new Enemy('e1', 220, 160, 'Tay Sai Nhàn Nhã Alpha', '#7c3aed', 130, 55),
                    new Enemy('e2', 720, 220, 'Bóng Ma Lãng Quên', '#9333ea', 150, 60),
                    new Enemy('e3', 450, 420, 'Lính Gác Hư Không', '#c026d3', 170, 65)
                ];
            } else {
                // Stage 3 (Màn 3): 4 Mobs
                this.enemies = [
                    new Enemy('e1', 200, 160, 'Tay Sai Tinh Anh', '#7c3aed', 180, 70),
                    new Enemy('e2', 720, 200, 'Bóng Ma Thập Tự', '#9333ea', 200, 75),
                    new Enemy('e3', 450, 420, 'Đại Lính Gác Hư Không', '#c026d3', 220, 80),
                    new Enemy('e4', 350, 300, 'Vệ Binh Bóng Tối', '#4c1d95', 250, 85)
                ];
            }
        } else {
            HISTORY_CAMPAIGN.chapters.forEach(d => {
                const s = new Shard(d.id, d.tileX, d.tileY, d.title, d.icon, d.puzzle, d.dialogue);
                s.classification = d.classification;
                s.sourceRefs = d.sourceRefs;
                this.shards.push(s);
            });
        }

        const saved = saveService.load();
        if (saved && saved.shards) {
            saved.shards.forEach(sId => {
                const f = this.shards.find(s => s.id === sId);
                if (f) f.collected = true;
            });
        }

        this.hud.updateShardsCount(this.shards.filter(s=>s.collected).length, this.shards.length);
    }

    checkAllEnemiesDead() {
        const allDead = this.enemies.length > 0 && this.enemies.every(e => e.isDead);
        if (allDead && this.portals.length === 0 && this.activeCampaignId === 'campaign-english') {
            const mod = ENGLISH_CAMPAIGN.modules[this.currentModuleIndex];
            const next = this.currentStageIndex + 1;
            const title = next < mod.stages.length ? `Stage ${next + 1}` : 'Trận Đấu Trùm Module';
            this.portals = [ new Portal('portal-next', 17, 5, next, title) ];
        }
    }

    castSkill(type) {
        if (this.isMovementLocked || this.isGameOver) return;
        const cx = this.player.x + this.player.width / 2;
        const cy = this.player.y + this.player.height / 2;

        if (type === 'lightning') {
            if (!this.player.canCast(25, this.player.cdSkill1)) return;
            this.player.consumeMana(25);
            this.player.cdSkill1 = 180;
            this.player.state = 'cast';
            setTimeout(() => { if (this.player.state === 'cast') this.player.state = 'idle'; }, 300);

            this.projectiles.push(new Projectile(cx, cy, this.player.dir, null, 'lightning', 12, this.player.atk + 25));
        } else if (type === 'frost') {
            if (!this.player.canCast(40, this.player.cdSkill2)) return;
            this.player.consumeMana(40);
            this.player.cdSkill2 = 360;
            this.player.state = 'cast';
            setTimeout(() => { if (this.player.state === 'cast') this.player.state = 'idle'; }, 300);

            this.projectiles.push(new Projectile(this.companion.x - 28, this.companion.y - 28, 'up', null, 'frost', 0, this.player.atk + 40));
            this.triggerScreenShake(10);
        } else if (type === 'firestorm') {
            if (!this.player.canCast(60, this.player.cdSkill3)) return;
            this.player.consumeMana(60);
            this.player.cdSkill3 = 600;
            this.player.state = 'cast';
            setTimeout(() => { if (this.player.state === 'cast') this.player.state = 'idle'; }, 300);

            this.projectiles.push(new Projectile(cx - 30, cy - 30, this.player.dir, null, 'firestorm', 4, this.player.atk + 60));
            this.triggerScreenShake(15);
        } else {
            if (!this.player.canCast(5, this.player.cdShot)) return;
            this.player.consumeMana(5);
            this.player.cdShot = 18;
            this.player.state = 'cast';
            setTimeout(() => { if (this.player.state === 'cast') this.player.state = 'idle'; }, 200);

            this.projectiles.push(new Projectile(cx, cy, this.player.dir, null, 'standard', 9, this.player.atk));
        }
    }

    addFloatingText(text, x, y, color = '#ff0055') {
        this.floatingTexts.push({ text: text, x: x, y: y, life: 45, color: color });
    }

    triggerScreenShake(d) { this.screenShakeTimer = d; }

    triggerGameOver() {
        this.isGameOver = true;
        document.getElementById('gameover-modal').classList.remove('hidden');
    }

    continueSave() {
        const saved = saveService.load();
        if (saved) { this.start(); }
        else { this.resetNewGame(); }
    }

    resetNewGame() {
        saveService.clear();
        this.isGameOver = false;
        document.getElementById('gameover-modal').classList.add('hidden');
        this.currentModuleIndex = 0;
        this.currentStageIndex = 0;
        this.activeCampaignId = 'campaign-english';
        HISTORY_CAMPAIGN.unlocked = false;

        this.player = new Player(450, 360);
        this.companion = new Companion(400, 360);
        this.restorationSystem.restorationPct = 0;
        this.hud.updateRestoration(0);
        this.loadStageData();
        this.start();
    }

    switchStageZone(nextStageIndex) {
        const mod = ENGLISH_CAMPAIGN.modules[this.currentModuleIndex];
        if (nextStageIndex < mod.stages.length) {
            this.currentStageIndex = nextStageIndex;
            const stg = mod.stages[this.currentStageIndex];
            this.map = MAPS_DATA[stg.mapZoneId] || MAPS_DATA['zone-stage-1'];
            this.player.x = 144; this.player.y = 192;
            this.companion.x = 100; this.companion.y = 192;
            this.loadStageData();
            alert(`🌀 KHU VỰC MỚI: ${stg.title}!\nĐộ khó tăng lên! Màn này có nhiều quái hơn và DEF cao hơn!`);
        } else {
            this.triggerModuleBoss();
        }
    }

    triggerModuleBoss() {
        const mod = ENGLISH_CAMPAIGN.modules[this.currentModuleIndex];
        const boss = mod.boss;
        alert(`⚡ TRÙM LỚN: ${boss.name}!\nTrận chiến tổng kết Module ${this.currentModuleIndex + 1}!`);

        const bossEnemy = new Enemy('boss-module', 450, 280, `⚡ ${boss.name} ⚡`, '#ff0055', 400, 70);
        this.enemies = [bossEnemy];
        this.portals = [];
        this.shards = [];

        const bossCheck = setInterval(() => {
            if (bossEnemy.isDead) {
                clearInterval(bossCheck);
                alert(`🎉 THẮNG LỢI TRÙM MODULE ${this.currentModuleIndex + 1}!`);
                this.currentModuleIndex++;
                if (this.currentModuleIndex >= 3) {
                    alert('🏆 HOÀN THÀNH 3 MODULE TIẾNG ANH! CHÍNH THỨC MỞ KHÓA MODULE 4: ĐẠI SỬ VIỆT!');
                    HISTORY_CAMPAIGN.unlocked = true;
                    this.activeCampaignId = 'campaign-history';
                    this.loadStageData();
                } else {
                    this.currentStageIndex = 0;
                    const stg = ENGLISH_CAMPAIGN.modules[this.currentModuleIndex].stages[0];
                    this.map = MAPS_DATA[stg.mapZoneId] || MAPS_DATA['zone-stage-1'];
                    this.player.x = 144; this.player.y = 192;
                    this.loadStageData();
                }
            }
        }, 500);
    }

    start() { this.loop.start(); }

    update(delta) {
        if (this.isGameOver) return;

        if (!this.isMovementLocked) {
            this.player.update(this.input, this.map.grid, this.map.cols, this.map.rows, this.map.tileSize);
            this.companion.followLeader(this.player, 12);

            if (this.input.isPressed('ShiftLeft') || this.input.isPressed('ShiftRight')) {
                this.player.performDash(this.map);
            }
            if (this.input.isPressed('Space') || this.input.isPressed('KeyJ')) this.castSkill('standard');
            if (this.input.isPressed('KeyQ')) this.castSkill('lightning');
            if (this.input.isPressed('KeyE')) this.castSkill('frost');
            if (this.input.isPressed('KeyR')) this.castSkill('firestorm');

            this.enemies.forEach(enemy => {
                const shotInfo = enemy.update(this.map.grid, this.map.cols, this.map.rows, this.map.tileSize, this.player);

                if (shotInfo && shotInfo.shoot) {
                    this.projectiles.push(new Projectile(
                        shotInfo.startX, shotInfo.startY,
                        shotInfo.dirX, shotInfo.dirY,
                        'dark_orb', 6, 20, true
                    ));
                }

                if (!enemy.isDead) {
                    const dist = Math.hypot((this.player.x+24)-(enemy.x+20), (this.player.y+32)-(enemy.y+24));
                    if (dist < 32) {
                        this.player.takeDamage(15);
                        this.triggerScreenShake(8);
                        if (this.player.hp <= 0) this.triggerGameOver();
                    }
                }
            });

            for (let i = this.projectiles.length - 1; i >= 0; i--) {
                const proj = this.projectiles[i];
                proj.update();

                if (proj.isEnemy) {
                    const pCenterX = this.player.x + 24;
                    const pCenterY = this.player.y + 32;
                    const dist = Math.hypot(proj.x - pCenterX, proj.y - pCenterY);

                    if (dist < 26) {
                        proj.isDead = true;
                        if (this.player.isDashing) {
                            this.addFloatingText('⚡ DODGED!', pCenterX, pCenterY - 20, '#00fff5');
                        } else {
                            this.player.takeDamage(proj.damage);
                            this.addFloatingText(`-${proj.damage} HP`, pCenterX, pCenterY - 20, '#ff0055');
                            this.triggerScreenShake(8);
                            if (this.player.hp <= 0) this.triggerGameOver();
                        }
                    }
                } else {
                    this.enemies.forEach(enemy => {
                        if (!enemy.isDead && !proj.isDead) {
                            const dist = Math.hypot(proj.x - (enemy.x+20), proj.y - (enemy.y+24));
                            if (dist < proj.width + 14) {
                                if (proj.type !== 'frost' && proj.type !== 'firestorm') proj.isDead = true;

                                const actualDmg = enemy.takeDamage(proj.damage);
                                if (actualDmg === 0) {
                                    this.addFloatingText('0 IMMUNE! (Cần Mảnh)', enemy.x + 20, enemy.y - 15, '#ff7675');
                                } else {
                                    this.addFloatingText(`-${actualDmg}`, enemy.x + 20, enemy.y - 15, '#ffeaa7');
                                    this.player.addCombo();
                                    this.triggerScreenShake(4);
                                }

                                if (enemy.isDead) {
                                    this.restorationSystem.restorationPct += 5;
                                    this.hud.updateRestoration(this.restorationSystem.restorationPct);
                                    this.checkAllEnemiesDead();
                                }
                            }
                        }
                    });
                }

                if (proj.isDead) this.projectiles.splice(i, 1);
            }

            for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
                const ft = this.floatingTexts[i];
                ft.y -= 0.8;
                ft.life--;
                if (ft.life <= 0) this.floatingTexts.splice(i, 1);
            }

            this.interactionSystem.update(this.player, this.shards, this.npcs, this.portals, this.enemies);

            if (this.input.isPressed('KeyF')) {
                const active = this.interactionSystem.activeTarget;
                if (active) {
                    if (active.type === 'portal') {
                        this.switchStageZone(active.target.targetStageIndex);
                    } else if (active.type === 'shard' && !active.target.collected) {
                        this.triggerShardQuest(active.target);
                    } else if (active.type === 'npc') {
                        this.dialogueSystem.start(active.target.dialogue);
                    }
                }
            }

            if (this.input.isPressed('KeyI')) window.toggleJournal();
            if (this.input.isPressed('KeyC')) window.toggleChronicleModal();
            if (this.input.isPressed('Tab')) { window.toggleProgressModal(); }
            if (this.input.isPressed('Escape')) {
                document.querySelectorAll('.overlay-panel').forEach(p => {
                    if (p.id !== 'campaign-select' && p.id !== 'gameover-modal') p.classList.add('hidden');
                });
            }
        } else {
            if (this.dialogueSystem.isOpen && (this.input.isPressed('KeyF') || this.input.isPressed('Space'))) {
                this.dialogueSystem.advance();
            }
        }

        this.camera.follow(
            this.player.x + this.player.width/2,
            this.player.y + this.player.height/2,
            this.map.cols * this.map.tileSize,
            this.map.rows * this.map.tileSize
        );
    }

    triggerShardQuest(shard) {
        this.dialogueSystem.start(shard.dialogueData, () => {
            this.learningSystem.startEncounter(shard.puzzleData, () => {
                shard.collected = true;
                this.player.gainPowerFromShard();
                this.restorationSystem.restoreShard(shard, this.shards.length);

                const collectedIds = this.shards.filter(s => s.collected).map(s => s.id);
                saveService.save({ shards: collectedIds });
                this.hud.updateShardsCount(collectedIds.length, this.shards.length);

                alert(`⬆️ TĂNG SỨC MẠNH!\nATK: ${this.player.atk} (+30) | Max HP: ${this.player.maxHp}\nĐã hồi phục 100% HP & MP! Đạn phép của cậu giờ đã đủ sức phá Giáp DEF của Tay Sai!`);

            }, (dmg) => {
                this.player.takeDamage(dmg);
                if (this.player.hp <= 0) this.triggerGameOver();
            });
        });
    }

    render() {
        this.ctx.save();

        let sx = 0, sy = 0;
        if (this.screenShakeTimer > 0) {
            sx = (Math.random() - 0.5) * 8;
            sy = (Math.random() - 0.5) * 8;
            this.screenShakeTimer--;
        }
        this.ctx.translate(sx, sy);

        this.ctx.fillStyle = '#0f172a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        for (let r = 0; r < this.map.rows; r++) {
            for (let c = 0; c < this.map.cols; c++) {
                this.drawTile(this.map.grid[r][c], c * this.map.tileSize - this.camera.x, r * this.map.tileSize - this.camera.y);
            }
        }

        this.drawLexarisTree(9*48 - this.camera.x, 2*48 - this.camera.y);

        this.shards.forEach(s => s.draw(this.ctx, this.camera));
        this.portals.forEach(p => p.draw(this.ctx, this.camera));
        this.npcs.forEach(n => n.draw(this.ctx, this.camera));
        this.enemies.forEach(e => e.draw(this.ctx, this.camera));
        this.projectiles.forEach(p => p.draw(this.ctx, this.camera));

        this.companion.draw(this.ctx, this.camera);
        this.player.draw(this.ctx, this.camera);

        this.floatingTexts.forEach(ft => {
            this.ctx.fillStyle = ft.color;
            this.ctx.font = '13px Press Start 2P';
            this.ctx.textAlign = 'center';
            this.ctx.shadowColor = '#000000';
            this.ctx.shadowBlur = 4;
            this.ctx.fillText(ft.text, ft.x - this.camera.x, ft.y - this.camera.y);
        });

        this.interactionSystem.drawPrompt(this.ctx, this.camera);
        this.drawBeams();

        // Skill Bar HUD & Cooldown / Mana Indicators
        this.ctx.fillStyle = '#ffeaa7';
        this.ctx.font = '13px Press Start 2P';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`📍 ${this.map.title || 'Khu Vực'}`, 20, 485);
        this.ctx.fillStyle = '#00fff5';
        this.ctx.fillText(`⚔️ ATK: ${this.player.atk}  💧 MP: ${Math.floor(this.player.mp)}/100`, 20, 505);

        const cd1 = Math.ceil(this.player.cdSkill1 / 60);
        const cd2 = Math.ceil(this.player.cdSkill2 / 60);
        const cd3 = Math.ceil(this.player.cdSkill3 / 60);
        const cdDash = Math.ceil(this.player.cdDash / 60);

        const el1 = document.getElementById('vbtn-skill1-cd');
        if (el1) el1.innerText = cd1 > 0 ? `${cd1}s` : 'Q';
        const el2 = document.getElementById('vbtn-skill2-cd');
        if (el2) el2.innerText = cd2 > 0 ? `${cd2}s` : 'E';
        const el3 = document.getElementById('vbtn-skill3-cd');
        if (el3) el3.innerText = cd3 > 0 ? `${cd3}s` : 'R';
        const elDash = document.getElementById('vbtn-dash-cd');
        if (elDash) elDash.innerText = cdDash > 0 ? `${cdDash}s` : '⇧';

        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '12px VT323';
        this.ctx.fillText(`[Space] Bắn | [Q] Sét ${cd1>0?`(${cd1}s)`:'OK'} | [E] Băng ${cd2>0?`(${cd2}s)`:'OK'} | [R] Lửa ${cd3>0?`(${cd3}s)`:'OK'} | [Shift] Dash ${cdDash>0?`(${cdDash}s)`:'OK'}`, 20, 528);

        this.ctx.restore();
    }

    drawTile(type, x, y) {
        const s = 48, ctx = this.ctx;
        switch (type) {
            case 0:
                ctx.fillStyle='#1e824c'; ctx.fillRect(x,y,s,s);
                ctx.fillStyle='#27ae60'; ctx.fillRect(x+6,y+6,4,4); ctx.fillRect(x+32,y+28,4,4);
                break;
            case 1:
                ctx.fillStyle='#2980b9'; ctx.fillRect(x,y,s,s);
                ctx.fillStyle='#3498db'; ctx.fillRect(x+(Date.now()/250%24),y+16,16,3); ctx.fillRect(x+8,y+32,12,2);
                break;
            case 2:
                ctx.fillStyle='#7f8c8d'; ctx.fillRect(x,y,s,s);
                ctx.fillStyle='#95a5a6'; ctx.fillRect(x+3,y+3,s-6,s-6);
                ctx.fillStyle='#bdc3c7'; ctx.fillRect(x+6,y+6,12,12);
                break;
            case 3:
                ctx.fillStyle='#1e272e'; ctx.fillRect(x,y,s,s);
                ctx.fillStyle='#34495e'; ctx.fillRect(x+3,y+3,s-6,s-10);
                ctx.fillStyle='#7f8c8d'; ctx.fillRect(x+6,y+6,s-12,4);
                break;
            case 4:
                ctx.fillStyle='#1e824c'; ctx.fillRect(x,y,s,s);
                ctx.fillStyle='#5d4037'; ctx.fillRect(x+18,y+28,12,20);
                ctx.fillStyle='#2ecc71'; ctx.beginPath(); ctx.arc(x+24,y+16,18,0,Math.PI*2); ctx.fill();
                ctx.fillStyle='#e84393'; ctx.fillRect(x+14,y+12,4,4); ctx.fillRect(x+28,y+18,4,4);
                break;
            case 5:
                ctx.fillStyle='#d35400'; ctx.fillRect(x,y,s,s);
                ctx.fillStyle='#e67e22'; ctx.fillRect(x,y+4,s,6); ctx.fillRect(x,y+20,s,6); ctx.fillRect(x,y+36,s,6);
                ctx.fillStyle='#7f8c8d'; ctx.fillRect(x+2,y,4,s); ctx.fillRect(x+s-6,y,4,s);
                break;
            case 6:
                ctx.fillStyle='#5d4037'; ctx.fillRect(x,y,s,s);
                ctx.fillStyle='#8d6e63'; ctx.fillRect(x+4,y+4,s-8,12); ctx.fillRect(x+4,y+22,s-8,12);
                ctx.fillStyle='#e74c3c'; ctx.fillRect(x+6,y+6,6,8); ctx.fillStyle='#3498db'; ctx.fillRect(x+14,y+6,6,8); ctx.fillStyle='#f1c40f'; ctx.fillRect(x+22,y+6,6,8);
                ctx.fillStyle='#2ecc71'; ctx.fillRect(x+6,y+24,6,8); ctx.fillStyle='#9b59b6'; ctx.fillRect(x+14,y+24,6,8); ctx.fillStyle='#e67e22'; ctx.fillRect(x+22,y+24,6,8);
                break;
            case 7:
                ctx.fillStyle='#1e824c'; ctx.fillRect(x,y,s,s);
                ctx.fillStyle='#546e7a'; ctx.beginPath(); ctx.arc(x+24,y+24,16,0,Math.PI*2); ctx.fill();
                ctx.fillStyle='#78909c'; ctx.beginPath(); ctx.arc(x+20,y+20,10,0,Math.PI*2); ctx.fill();
                ctx.fillStyle='#27ae60'; ctx.fillRect(x+26,y+18,6,4);
                break;
            case 8:
                ctx.fillStyle='#1e824c'; ctx.fillRect(x,y,s,s);
                ctx.fillStyle='#78350f'; ctx.beginPath(); ctx.arc(x+24,y+24,14,0,Math.PI*2); ctx.fill();
                ctx.fillStyle='#b45309'; ctx.beginPath(); ctx.arc(x+24,y+24,10,0,Math.PI*2); ctx.fill();
                ctx.fillStyle='#f59e0b'; ctx.fillRect(x+14,y+22,20,4);
                break;
            case 9:
                ctx.fillStyle='#7f8c8d'; ctx.fillRect(x,y,s,s);
                ctx.fillStyle='#00cec9'; ctx.beginPath(); ctx.arc(x+24,y+24,18,0,Math.PI*2); ctx.fill();
                ctx.fillStyle='#81ecec'; ctx.beginPath(); ctx.arc(x+24,y+24,12,0,Math.PI*2); ctx.fill();
                ctx.fillStyle='#ffffff'; ctx.fillRect(x+22,y+22,4,4);
                break;
            case 10:
                ctx.fillStyle='#1e824c'; ctx.fillRect(x,y,s,s);
                ctx.fillStyle='#f1c40f'; ctx.fillRect(x+10,y+12,28,24);
                ctx.fillStyle='#f39c12'; ctx.fillRect(x+12,y+14,24,20);
                ctx.fillStyle='#78350f'; ctx.fillRect(x+10,y+22,28,4);
                ctx.fillStyle='#ffffff'; ctx.fillRect(x+22,y+21,4,6);
                break;
            case 11:
                ctx.fillStyle='#1e824c'; ctx.fillRect(x,y,s,s);
                ctx.fillStyle='#2c3e50'; ctx.fillRect(x+21,y+16,6,28);
                ctx.fillStyle='#f1c40f'; ctx.fillRect(x+16,y+6,16,14);
                ctx.fillStyle='#e74c3c'; ctx.fillRect(x+20,y+10,8,8);
                break;
        }
    }

    drawLexarisTree(x, y) {
        const ctx = this.ctx;
        ctx.save();
        ctx.fillStyle = this.restorationSystem.restorationPct >= 100 ? 'rgba(255,234,167,0.4)' : 'rgba(0,255,245,0.3)';
        ctx.beginPath(); ctx.arc(x+72,y+72,60,0,Math.PI*2); ctx.fill();
        ctx.fillStyle='#4e342e'; ctx.fillRect(x+54,y+60,36,78);
        ctx.fillStyle = this.restorationSystem.restorationPct >= 100 ? '#f1c40f' : (this.restorationSystem.restorationPct > 0 ? '#00fff5' : '#78909c');
        ctx.beginPath(); ctx.arc(x+72,y+42,54,0,Math.PI*2); ctx.fill();
        ctx.fillStyle='#fff'; ctx.font='16px Press Start 2P'; ctx.textAlign='center';
        ctx.fillText('🌳 LEXARIS',x+72,y-16);
        ctx.restore();
    }

    drawBeams() {
        for (let i = this.beams.length-1; i >= 0; i--) {
            const b = this.beams[i];
            this.ctx.strokeStyle='#00fff5'; this.ctx.lineWidth=4;
            this.ctx.beginPath();
            this.ctx.moveTo(b.startX-this.camera.x,b.startY-this.camera.y);
            this.ctx.lineTo(b.targetX-this.camera.x,b.targetY-this.camera.y);
            this.ctx.stroke();
            b.life--; if(b.life<=0) this.beams.splice(i,1);
        }
    }
}


// LexiQuest Main Entry Point (Continue Game & New Game Title Screen Support)

let game = null;

window.onload = () => {
    game = new Game();

    window.continueGame = () => {
        document.getElementById('campaign-select').classList.add('hidden');
        game.continueSave();
    };

    window.startNewGame = () => {
        document.getElementById('campaign-select').classList.add('hidden');
        game.resetNewGame();
    };

    window.toggleJournal = () => {
        const modal = document.getElementById('journal-modal');
        if (!modal) return;
        if (modal.classList.contains('hidden')) {
            game.knowledgeBook.open(game.shards);
        } else {
            game.knowledgeBook.close();
        }
    };

    window.toggleQuestModal = () => {
        const modal = document.getElementById('quest-modal');
        if (!modal) return;
        if (modal.classList.contains('hidden')) {
            game.questLog.open();
        } else {
            game.questLog.close();
        }
    };

    window.toggleChronicleModal = () => {
        const modal = document.getElementById('chronicle-modal');
        if (!modal) return;
        if (modal.classList.contains('hidden')) {
            game.chroniclePanel.open(game.shards.filter(s => s.sourceRefs));
        } else {
            game.chroniclePanel.close();
        }
    };

    window.toggleProgressModal = () => {
        const modal = document.getElementById('progress-modal');
        if (!modal) return;
        if (modal.classList.contains('hidden')) {
            game.progressModal.open();
        } else {
            game.progressModal.close();
        }
    };

    window.toggleGearModal = () => {
        alert('🛡️ Trang bị Kaelen đang đeo: Áo Choàng Seeker & Trượng Cổ Tự Rune!');
    };
};


