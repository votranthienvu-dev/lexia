// LexiQuest Learning System with RPG HP Damage Penalties
export class LearningSystem {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.activeEncounter = null;
        this.onSuccess = null;
        this.onWrong = null;
    }

    startEncounter(puzzleData, onSuccess = null, onWrong = null) {
        this.activeEncounter = puzzleData;
        this.onSuccess = onSuccess;
        this.onWrong = onWrong;

        this.eventBus.emit('LESSON_START', { puzzle: puzzleData });
        this.eventBus.emit('MOVEMENT_LOCK', true);
    }

    submitAnswer(selectedIndex) {
        if (!this.activeEncounter) return;

        const isCorrect = (selectedIndex === this.activeEncounter.correct);

        if (isCorrect) {
            this.eventBus.emit('LESSON_CORRECT', { explanation: this.activeEncounter.explanation });
            setTimeout(() => {
                this.close();
                if (this.onSuccess) this.onSuccess();
            }, 2000);
        } else {
            this.eventBus.emit('LESSON_WRONG', { message: '❌ Sai rồi! Nhàn Nhã Hội làm bạn mất -20 HP!' });
            if (this.onWrong) this.onWrong(20);
        }
    }

    close() {
        this.activeEncounter = null;
        this.eventBus.emit('LESSON_CLOSE');
        this.eventBus.emit('MOVEMENT_LOCK', false);
    }
}
