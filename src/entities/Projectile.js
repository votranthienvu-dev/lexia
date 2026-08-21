// LexiQuest Projectile Entity (Player Elemental Spells & Enemy Dark Orbs)
export class Projectile {
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
