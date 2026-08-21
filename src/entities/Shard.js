// LexiQuest Shard Entity (Knowledge Shards / Memory Anchors)
export class Shard {
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
