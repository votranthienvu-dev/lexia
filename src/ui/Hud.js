// LexiQuest DOM HUD UI Controller
export class Hud {
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
