// LexiQuest DOM QuestLog Overlay Controller
export class QuestLog {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.modal = document.getElementById('quest-modal');
    }

    open() {
        this.modal.classList.remove('hidden');
    }

    close() {
        this.modal.classList.add('hidden');
    }
}
