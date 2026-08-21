// LexiQuest Dialogue Manager (Typewriter Text & Avatar Portraits)
class DialogueManager {
    constructor() {
        this.dialogueBox = document.getElementById('dialogue-box');
        this.speakerName = document.getElementById('speaker-name');
        this.dialogueText = document.getElementById('dialogue-text');
        this.avatar = document.getElementById('avatar');

        this.currentQueue = [];
        this.currentIndex = 0;
        this.isTyping = false;
        this.typewriterTimer = null;
        this.onCompleteCallback = null;
    }

    startDialogue(queue, onComplete) {
        this.currentQueue = queue;
        this.currentIndex = 0;
        this.onCompleteCallback = onComplete;
        this.dialogueBox.classList.remove('hidden');
        this.showNextLine();
    }

    showNextLine() {
        if (this.currentIndex >= this.currentQueue.length) {
            this.closeDialogue();
            return;
        }

        const line = this.currentQueue[this.currentIndex];
        this.speakerName.innerText = line.speaker;

        // Set avatar class
        this.avatar.className = `portrait ${line.avatar || 'kaelen'}`;

        // Typewriter effect
        this.typeText(line.text);
    }

    typeText(fullText) {
        clearInterval(this.typewriterTimer);
        this.dialogueText.innerText = '';
        let i = 0;
        this.isTyping = true;

        this.typewriterTimer = setInterval(() => {
            if (i < fullText.length) {
                this.dialogueText.innerText += fullText.charAt(i);
                i++;
            } else {
                clearInterval(this.typewriterTimer);
                this.isTyping = false;
            }
        }, 25);
    }

    advance() {
        if (this.isTyping) {
            // Instantly complete current line
            clearInterval(this.typewriterTimer);
            this.dialogueText.innerText = this.currentQueue[this.currentIndex].text;
            this.isTyping = false;
        } else {
            this.currentIndex++;
            this.showNextLine();
        }
    }

    closeDialogue() {
        this.dialogueBox.classList.add('hidden');
        if (this.onCompleteCallback) {
            this.onCompleteCallback();
        }
    }
}
