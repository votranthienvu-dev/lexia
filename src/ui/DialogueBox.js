// LexiQuest DOM DialogueBox UI Controller
export class DialogueBox {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.box = document.getElementById('dialogue-box');
        this.speakerName = document.getElementById('speaker-name');
        this.content = document.getElementById('dialogue-text');
        this.avatar = document.getElementById('avatar');

        this.eventBus.on('DIALOGUE_START', (data) => this.show(data.line));
        this.eventBus.on('DIALOGUE_LINE', (data) => this.show(data.line));
        this.eventBus.on('DIALOGUE_CLOSE', () => this.hide());
    }

    show(line) {
        if (!line) return;
        this.speakerName.innerText = line.speaker;
        this.avatar.className = `portrait ${line.avatar || 'kaelen'}`;
        this.content.innerText = line.text;
        this.box.classList.remove('hidden');
    }

    hide() {
        this.box.classList.add('hidden');
    }
}
