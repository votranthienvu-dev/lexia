// LexiQuest Active RPG Interaction & Target System
export class InteractionSystem {
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
