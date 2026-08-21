// LexiQuest Main Entry Point (Continue Game & New Game Title Screen Support)
import { Game } from './core/Game.js';

let game = null;

window.onload = () => {
    game = new Game();

    window.continueGame = () => {
        document.getElementById('campaign-select').classList.add('hidden');
        game.continueSave();
    };

    window.startNewGame = () => {
        document.getElementById('campaign-select').classList.add('hidden');
        game.resetNewGame();
    };

    window.toggleJournal = () => {
        game.knowledgeBook.open(game.shards);
    };

    window.toggleQuestModal = () => {
        game.questLog.open();
    };

    window.toggleChronicleModal = () => {
        game.chroniclePanel.open(game.shards.filter(s => s.sourceRefs));
    };

    window.toggleGearModal = () => {
        alert('🛡️ Trang bị Kaelen đang đeo: Áo Choàng Seeker & Trượng Cổ Tự Rune!');
    };
};
