// LexiQuest Restoration System (Lexaris Tree Glow & Magic Beam FX)
export class RestorationSystem {
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
