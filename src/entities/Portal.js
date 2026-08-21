// LexiQuest Interactive Teleporter Portal Entity (Stage Zone Transition Portal)
export class Portal {
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
