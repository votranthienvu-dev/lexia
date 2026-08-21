// LexiQuest Player Entity: Kaelen Mana Regen, Cooldowns & Strict Damage Balancing
import { PixelRenderer } from '../engine/PixelRenderer.js';
import { Collision } from '../engine/Collision.js';

export class Player {
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
