// LexiQuest Companion Entity: Lex (Spirit Owl - Canon Concept Bible Spec 48x48)
export class Companion {
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
