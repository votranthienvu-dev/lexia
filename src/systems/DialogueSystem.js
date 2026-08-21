// LexiQuest Dialogue System (Typewriter & Movement Lock)
export class DialogueSystem {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.queue = [];
        this.currentIndex = 0;
        this.isOpen = false;
        this.onComplete = null;
    }

    start(dialogueQueue, onComplete = null) {
        this.queue = dialogueQueue;
        this.currentIndex = 0;
        this.onComplete = onComplete;
        this.isOpen = true;

        this.eventBus.emit('DIALOGUE_START', { line: this.queue[0] });
        this.eventBus.emit('MOVEMENT_LOCK', true);
    }

    advance() {
        if (!this.isOpen) return;

        this.currentIndex++;
        if (this.currentIndex >= this.queue.length) {
            this.close();
        } else {
            this.eventBus.emit('DIALOGUE_LINE', { line: this.queue[this.currentIndex] });
        }
    }

    close() {
        this.isOpen = false;
        this.eventBus.emit('DIALOGUE_CLOSE');
        this.eventBus.emit('MOVEMENT_LOCK', false);

        if (this.onComplete) {
            this.onComplete();
        }
    }
}
