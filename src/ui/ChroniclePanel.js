// LexiQuest DOM Đại Sử Việt History Chronicle Overlay Controller
export class ChroniclePanel {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.modal = document.getElementById('chronicle-modal');
        this.listEl = document.getElementById('chronicle-content-list');
    }

    open(historyAnchors) {
        if (!this.modal || !this.listEl) return;
        this.listEl.innerHTML = '';

        historyAnchors.forEach(anchor => {
            const card = document.createElement('div');
            card.className = `card-item ${anchor.collected ? 'active' : ''}`;

            const icon = anchor.collected ? anchor.icon : '🔒';
            const status = anchor.collected ? '<span style="color:#00ff80;">[ĐÃ GHI CHRONICLE]</span>' : '<span style="color:#ff7675;">[CHƯA GIẢI MÃ]</span>';
            const sources = anchor.sourceRefs ? anchor.sourceRefs.join(', ') : 'Nguồn Bảo tàng Quốc gia';

            card.innerHTML = `
                <div class="card-title">${icon} ${anchor.title} ${status}</div>
                <div class="card-desc"><b>Phân loại:</b> ${anchor.classification || 'Ký ức Lịch sử'}</div>
                <div class="card-desc" style="margin-top:4px;"><b>Nguồn kiểm chứng:</b> ${sources}</div>
                <div class="card-desc" style="margin-top:4px;">${anchor.collected ? anchor.puzzleData.explanation : 'Hãy tìm Memory Anchor này trên bản đồ và giải thử thách để ghi lại vào Chronicle!'}</div>
            `;
            this.listEl.appendChild(card);
        });

        this.modal.classList.remove('hidden');
    }

    close() {
        if (this.modal) this.modal.classList.add('hidden');
    }
}
