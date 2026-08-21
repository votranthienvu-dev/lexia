// LexiQuest Main Game Initialization & Direct Web Engine Loop
let engine;
let player;
let lexFollower;
let suFollower;
let npcs = [];
let dialogueManager;
let battleManager;

let gameState = 'SELECT';
let activeShard = null;
let nearbyTarget = null;
let collectedShardsCount = 0;

let isJournalOpen = false;
let isQuestOpen = false;
let isGearOpen = false;

window.onload = () => {
    engine = new PixelEngine('gameCanvas');
    dialogueManager = new DialogueManager();
    battleManager = new BattleManager(engine);

    // Create Kaelen Leader at open cobblestone plaza (450, 360)
    player = new Character(450, 360, 'kaelen', 'Kaelen (The Seeker)', true);

    // Create Party Followers (Lex & Sử) beside Kaelen on open paths
    lexFollower = new Character(400, 360, 'lex', 'Lex');
    suFollower = new Character(500, 360, 'su', 'Sử');

    window.addEventListener('keydown', handleKeyDown);

    document.getElementById('dialogue-box').addEventListener('click', () => {
        if (gameState === 'DIALOGUE') {
            dialogueManager.advance();
        }
    });

    requestAnimationFrame(gameLoop);
};

function startGame() {
    soundEngine.init();
    document.getElementById('campaign-select').classList.add('hidden');
    gameState = 'EXPLORE';
    updateHUD();
}

function toggleJournal() {
    soundEngine.init();
    soundEngine.playJournalFlip();

    isJournalOpen = !isJournalOpen;
    const modal = document.getElementById('journal-modal');
    if (isJournalOpen) {
        closeAllModals();
        isJournalOpen = true;
        renderJournalContent();
        modal.classList.remove('hidden');
    } else {
        modal.classList.add('hidden');
    }
}

function toggleQuestModal() {
    soundEngine.init();
    soundEngine.playJournalFlip();

    isQuestOpen = !isQuestOpen;
    const modal = document.getElementById('quest-modal');
    if (isQuestOpen) {
        closeAllModals();
        isQuestOpen = true;
        modal.classList.remove('hidden');
    } else {
        modal.classList.add('hidden');
    }
}

function toggleGearModal() {
    soundEngine.init();
    soundEngine.playJournalFlip();

    isGearOpen = !isGearOpen;
    const modal = document.getElementById('gear-modal');
    if (isGearOpen) {
        closeAllModals();
        isGearOpen = true;
        updateGearUI();
        modal.classList.remove('hidden');
    } else {
        modal.classList.add('hidden');
    }
}

function closeAllModals() {
    isJournalOpen = false;
    isQuestOpen = false;
    isGearOpen = false;
    document.getElementById('journal-modal').classList.add('hidden');
    document.getElementById('quest-modal').classList.add('hidden');
    document.getElementById('gear-modal').classList.add('hidden');
}

function updateGearUI() {
    if (!player || !player.stats) return;
    document.getElementById('stat-power').innerText = player.stats.resonancePower;
    document.getElementById('stat-def').innerText = player.stats.logicDefense;
    document.getElementById('stat-spd').innerText = player.speed + player.stats.speedBoost;
}

function renderJournalContent() {
    const listContainer = document.getElementById('journal-content-list');
    listContainer.innerHTML = '';

    LEXIQUEST_DATA.shards.forEach(shard => {
        const card = document.createElement('div');
        card.className = `journal-card ${shard.collected ? 'collected' : 'locked'}`;

        const icon = shard.collected ? shard.icon : '🔒';
        const statusText = shard.collected ? '<span style="color:#00ff80;">[ĐÃ KHÔI PHỤC]</span>' : '<span style="color:#ff7675;">[ĐANG BỊ NIÊM PHONG]</span>';

        card.innerHTML = `
            <div class="journal-card-title">${icon} ${shard.title} ${statusText}</div>
            <div class="journal-card-desc">${shard.collected ? shard.puzzle.explanation : 'Hãy tìm vị trí Mảnh Tri Thức này trên bản đồ và giải thử thách để giải phóng năng lượng Resonance!'}</div>
        `;
        listContainer.appendChild(card);
    });
}

function updateHUD() {
    collectedShardsCount = LEXIQUEST_DATA.shards.filter(s => s.collected).length;
    const total = LEXIQUEST_DATA.shards.length;
    const restorationPct = (collectedShardsCount / total) * 100;

    engine.treeRestorationPct = restorationPct;

    document.getElementById('tree-progress-bar').style.width = `${restorationPct}%`;
    document.getElementById('tree-pct-text').innerText = `${Math.round(restorationPct)}%`;
    document.getElementById('shards-counter').innerText = `${collectedShardsCount} / ${total}`;
}

function triggerShardPickup(shard) {
    activeShard = shard;
    player.triggerInteractState();
    gameState = 'DIALOGUE';

    dialogueManager.startDialogue(shard.dialogue, () => {
        gameState = 'BATTLE';
        battleManager.startBattle({
            enemy: `Thử Thách: ${shard.title}`,
            enemyHp: 100,
            questions: [shard.puzzle]
        }, () => {
            shard.collected = true;

            const shardX = shard.x * 48 + 24;
            const shardY = shard.y * 48 + 24;
            const treeX = 9 * 48 + 24;
            const treeY = 3 * 48 + 24;

            engine.triggerBeam(shardX, shardY, treeX, treeY);
            engine.addFloatingText(shardX, shardY, '+1 Mảnh Tri Thức Khôi Phục!', '#00fff5');
            engine.addSparkles(shardX, shardY, '#ffeaa7');

            if (player && player.stats) player.stats.resonancePower += 25;

            updateHUD();
            gameState = 'EXPLORE';

            if (collectedShardsCount >= LEXIQUEST_DATA.shards.length) {
                setTimeout(() => {
                    alert('🎉 THẮNG LỢI RẠNG RỠ! Bạn đã khôi phục 100% Cội Nguồn Lexaris!');
                }, 600);
            }
        });
    });
}

function handleKeyDown(e) {
    soundEngine.init();

    if (e.code === 'KeyI') {
        e.preventDefault();
        toggleJournal();
        return;
    }
    if (e.code === 'KeyQ') {
        e.preventDefault();
        toggleQuestModal();
        return;
    }
    if (e.code === 'KeyG') {
        e.preventDefault();
        toggleGearModal();
        return;
    }

    if (gameState === 'DIALOGUE') {
        if (e.code === 'Space' || e.code === 'Enter' || e.code === 'KeyE') {
            dialogueManager.advance();
        }
        return;
    }

    if (gameState === 'EXPLORE') {
        if (e.code === 'KeyE' || e.code === 'Space') {
            if (nearbyTarget && !nearbyTarget.collected) {
                triggerShardPickup(nearbyTarget);
            }
        }
    }
}

const keys = {};
window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup', e => keys[e.code] = false);

function gameLoop() {
    engine.clear();

    if (gameState !== 'SELECT') {
        engine.renderMap();

        LEXIQUEST_DATA.shards.forEach(shard => engine.drawShard(shard));

        if (gameState === 'EXPLORE') {
            let dx = 0, dy = 0;
            if (keys['KeyW'] || keys['ArrowUp']) dy -= 1;
            if (keys['KeyS'] || keys['ArrowDown']) dy += 1;
            if (keys['KeyA'] || keys['ArrowLeft']) dx -= 1;
            if (keys['KeyD'] || keys['ArrowRight']) dx += 1;

            player.move(dx, dy, engine);

            lexFollower.followLeader(player, 12);
            suFollower.followLeader(player, 24);

            nearbyTarget = player.checkShardProximity(LEXIQUEST_DATA.shards, engine.tileSize);
        }

        suFollower.draw(engine.ctx);
        lexFollower.draw(engine.ctx);

        player.draw(engine.ctx);

        if (gameState === 'EXPLORE' && nearbyTarget && !nearbyTarget.collected) {
            const promptX = nearbyTarget.x * 48 + 24;
            const promptY = nearbyTarget.y * 48;
            engine.drawInteractionPrompt(promptX, promptY, 'Nhặt Mảnh Tri Thức');
        }

        engine.updateParticles();
    }

    requestAnimationFrame(gameLoop);
}
