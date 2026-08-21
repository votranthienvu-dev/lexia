// LexiQuest DOM Lesson / Quiz Panel UI Controller
export class LessonPanel {
    constructor(eventBus, learningSystem) {
        this.eventBus = eventBus;
        this.learningSystem = learningSystem;

        this.modal = document.getElementById('battle-modal');
        this.questionEl = document.getElementById('battle-question');
        this.optionsEl = document.getElementById('battle-options');
        this.feedbackEl = document.getElementById('battle-feedback');

        this.eventBus.on('LESSON_START', (data) => this.show(data.puzzle));
        this.eventBus.on('LESSON_CORRECT', (data) => this.showCorrect(data.explanation));
        this.eventBus.on('LESSON_WRONG', (data) => this.showWrong(data.message));
        this.eventBus.on('LESSON_CLOSE', () => this.hide());
    }

    show(puzzle) {
        if (!puzzle) return;
        this.feedbackEl.classList.add('hidden');
        this.questionEl.innerText = `[Thử Thách Resonance] ${puzzle.prompt}`;

        this.optionsEl.innerHTML = '';
        puzzle.options.forEach((optText, index) => {
            const btn = document.createElement('button');
            btn.className = 'battle-option-btn';
            btn.innerText = `${index + 1}. ${optText}`;
            btn.onclick = () => this.learningSystem.submitAnswer(index);
            this.optionsEl.appendChild(btn);
        });

        this.modal.classList.remove('hidden');
    }

    showCorrect(explanation) {
        this.feedbackEl.innerText = `✨ ${explanation}`;
        this.feedbackEl.className = 'battle-feedback correct';
        this.feedbackEl.classList.remove('hidden');
    }

    showWrong(message) {
        this.feedbackEl.innerText = message;
        this.feedbackEl.className = 'battle-feedback wrong';
        this.feedbackEl.classList.remove('hidden');
    }

    hide() {
        this.modal.classList.add('hidden');
    }
}
