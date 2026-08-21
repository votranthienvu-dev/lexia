// LexiQuest DOM Knowledge Book (Lore & Shards Journal Overlay)
export class KnowledgeBook {
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
