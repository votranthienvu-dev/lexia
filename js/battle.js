// LexiQuest Battle System: Echo Resonance Puzzle Combat with Sound SFX
class BattleManager {
    constructor(engine) {
        this.engine = engine;
        this.battleModal = document.getElementById('battle-modal');
        this.enemyNameEl = document.getElementById('enemy-name');
        this.enemyHpEl = document.getElementById('enemy-hp');
        this.questionEl = document.getElementById('battle-question');
        this.optionsEl = document.getElementById('battle-options');
        this.feedbackEl = document.getElementById('battle-feedback');

        this.currentBattleData = null;
        this.currentQuestionIndex = 0;
        this.currentEnemyHp = 100;
        this.maxEnemyHp = 100;
        this.onVictoryCallback = null;
    }

    startBattle(battleData, onVictory) {
        this.currentBattleData = battleData;
        this.currentQuestionIndex = 0;
        this.maxEnemyHp = battleData.enemyHp || 100;
        this.currentEnemyHp = this.maxEnemyHp;
        this.onVictoryCallback = onVictory;

        this.enemyNameEl.innerText = battleData.enemy;
        this.updateHpBar();

        this.battleModal.classList.remove('hidden');
        this.loadQuestion();
    }

    updateHpBar() {
        const pct = Math.max(0, (this.currentEnemyHp / this.maxEnemyHp) * 100);
        this.enemyHpEl.style.width = `${pct}%`;
    }

    loadQuestion() {
        this.feedbackEl.classList.add('hidden');
        const q = this.currentBattleData.questions[this.currentQuestionIndex];
        this.questionEl.innerText = `[Thử Thách Rune ${this.currentQuestionIndex + 1}] ${q.prompt}`;

        this.optionsEl.innerHTML = '';
        q.options.forEach((optText, index) => {
            const btn = document.createElement('button');
            btn.className = 'battle-option-btn';
            btn.innerText = `${index + 1}. ${optText}`;
            btn.onclick = () => this.handleAnswer(index);
            this.optionsEl.appendChild(btn);
        });
    }

    handleAnswer(selectedIndex) {
        const q = this.currentBattleData.questions[this.currentQuestionIndex];

        if (selectedIndex === q.correct) {
            // Correct Answer! Play Fanfare SFX & Sparkle FX
            soundEngine.playCorrectFanfare();

            this.currentEnemyHp -= Math.ceil(this.maxEnemyHp / this.currentBattleData.questions.length);
            this.updateHpBar();
            this.engine.addSparkles(400, 250, '#00ff80');

            this.showFeedback(true, `✨ ${q.explanation}`);

            setTimeout(() => {
                this.currentQuestionIndex++;
                if (this.currentQuestionIndex >= this.currentBattleData.questions.length || this.currentEnemyHp <= 0) {
                    this.winBattle();
                } else {
                    this.loadQuestion();
                }
            }, 2500);
        } else {
            // Wrong Answer - Play Buzzer SFX
            soundEngine.playWrongBuzzer();
            this.engine.addSparkles(400, 250, '#ff0055');
            this.showFeedback(false, '❌ Chưa chính xác! Nhàn Nhã Hội đang bóp méo suy nghĩ. Hãy suy luận lại!');
        }
    }

    showFeedback(isCorrect, message) {
        this.feedbackEl.innerText = message;
        this.feedbackEl.className = `battle-feedback ${isCorrect ? 'correct' : 'wrong'}`;
        this.feedbackEl.classList.remove('hidden');
    }

    winBattle() {
        soundEngine.playShardChime();
        this.showFeedback(true, '🎉 THẮNG LỢI! Năng lượng Resonance đã thanh tẩy Hư Không Thú & khôi phục ký ức!');
        setTimeout(() => {
            this.battleModal.classList.add('hidden');
            if (this.onVictoryCallback) {
                this.onVictoryCallback();
            }
        }, 2000);
    }
}
