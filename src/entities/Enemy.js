// LexiQuest Enemy Entity (Active Ranged Counter-Attacks & Heavy Defense Scaling)
export class Enemy {
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
