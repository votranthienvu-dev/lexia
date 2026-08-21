// LexiQuest Core Game Singleton (Progressive Stage Difficulty - Stage 1 Starts with 2 Mobs)
import { EventBus, eventBus } from './EventBus.js';
import { GameLoop } from './GameLoop.js';
import { Input } from './Input.js';
import { Camera } from './Camera.js';
import { saveService } from './SaveService.js';

import { Player } from '../entities/Player.js';
import { Companion } from '../entities/Companion.js';
import { Npc } from '../entities/Npc.js';
import { Shard } from '../entities/Shard.js';
import { Portal } from '../entities/Portal.js';
import { Enemy } from '../entities/Enemy.js';
import { Projectile } from '../entities/Projectile.js';

import { InteractionSystem } from '../systems/InteractionSystem.js';
import { DialogueSystem } from '../systems/DialogueSystem.js';
import { LearningSystem } from '../systems/LearningSystem.js';
import { RestorationSystem } from '../systems/RestorationSystem.js';

import { Hud } from '../ui/Hud.js';
import { DialogueBox } from '../ui/DialogueBox.js';
import { LessonPanel } from '../ui/LessonPanel.js';
import { KnowledgeBook } from '../ui/KnowledgeBook.js';
import { QuestLog } from '../ui/QuestLog.js';
import { ChroniclePanel } from '../ui/ChroniclePanel.js';

import { MAPS_DATA } from '../data/mapsData.js';
import { ENGLISH_CAMPAIGN } from '../data/englishData.js';
import { HISTORY_CAMPAIGN } from '../data/historyData.js';

export class Game {
    constructor() {
        this.eventBus = eventBus;
        this.input = new Input();
        this.camera = new Camera(960, 540);

        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;

        this.isMovementLocked = false;
        this.isGameOver = false;
        this.screenShakeTimer = 0;

        this.activeCampaignId = 'campaign-english';
        this.currentModuleIndex = 0;
        this.currentStageIndex = 0;

        this.map = MAPS_DATA['zone-stage-1'];

        this.player = new Player(450, 360);
        this.companion = new Companion(400, 360);
        this.npcs = [];
        this.shards = [];
        this.portals = [];
        this.enemies = [];
        this.projectiles = [];
        this.floatingTexts = [];

        this.interactionSystem = new InteractionSystem(this.eventBus);
        this.dialogueSystem = new DialogueSystem(this.eventBus);
        this.learningSystem = new LearningSystem(this.eventBus);
        this.restorationSystem = new RestorationSystem(this.eventBus);

        this.hud = new Hud(this.eventBus);
        this.dialogueBox = new DialogueBox(this.eventBus);
        this.lessonPanel = new LessonPanel(this.eventBus, this.learningSystem);
        this.knowledgeBook = new KnowledgeBook(this.eventBus);
        this.questLog = new QuestLog(this.eventBus);
        this.chroniclePanel = new ChroniclePanel(this.eventBus);

        this.beams = [];

        this.loop = new GameLoop(this.update.bind(this), this.render.bind(this));

        this.setupEvents();
        this.initNpcs();
        this.loadStageData();
    }

    initNpcs() {
        this.npcs = [
            new Npc('npc-elder', 320, 200, 'Trưởng Làng Lexia', 'Người Giữ Tri Thức', 'elder', [
                { speaker: 'Trưởng Làng Lexia', avatar: 'kaelen', text: 'Kaelen! Màn 1 chỉ có 2 Tay Sai nhẹ nhàng để cậu làm quen! Giải Mảnh Tri Thức để tăng +30 ATK trước khi diệt quái!' },
                { speaker: 'Trưởng Làng Lexia', avatar: 'kaelen', text: 'Các màn sau quái vật sẽ đông hơn và mạnh dần! Thu thập toàn bộ Mảnh Tri Thức để đủ sức qua cửa!' }
            ]),
            new Npc('npc-su', 600, 360, 'Sử', 'Thiếu Niên Việt Nam', 'su', [
                { speaker: 'Sử', avatar: 'su', text: 'Kaelen! Độ khó tăng dần từ Màn 1 đến Màn 4! Dùng [J], [1], [2], [3] tiêu diệt từng tên một!' }
            ])
        ];
    }

    setupEvents() {
        this.eventBus.on('MOVEMENT_LOCK', (v) => { this.isMovementLocked = v; });
        this.eventBus.on('SPAWN_MAGIC_BEAM', (d) => {
            this.beams.push({ startX: d.startX, startY: d.startY, targetX: d.targetX, targetY: d.targetY, life: 40 });
        });
    }

    loadStageData() {
        this.shards = [];
        this.portals = [];
        this.enemies = [];
        this.projectiles = [];

        if (this.activeCampaignId === 'campaign-english') {
            const mod = ENGLISH_CAMPAIGN.modules[this.currentModuleIndex] || ENGLISH_CAMPAIGN.modules[0];
            const stg = mod.stages[this.currentStageIndex] || mod.stages[0];

            stg.wordChallenges.forEach(wc => {
                const s = new Shard(wc.id, wc.tileX, wc.tileY, wc.title, wc.icon, wc.puzzle, wc.dialogue);
                s.fileRef = wc.fileRef;
                this.shards.push(s);
            });

            // Progressive Difficulty Scaling across Stages!
            if (this.currentStageIndex === 0) {
                // Stage 1 (Màn 1): Only 2 Mobs (Dễ làm quen!)
                this.enemies = [
                    new Enemy('e1', 300, 200, 'Tay Sai Tập Sự', '#7c3aed', 80, 35),
                    new Enemy('e2', 680, 240, 'Bóng Ma Lãng Quên', '#9333ea', 90, 40)
                ];
            } else if (this.currentStageIndex === 1) {
                // Stage 2 (Màn 2): 3 Mobs
                this.enemies = [
                    new Enemy('e1', 220, 160, 'Tay Sai Nhàn Nhã Alpha', '#7c3aed', 130, 55),
                    new Enemy('e2', 720, 220, 'Bóng Ma Lãng Quên', '#9333ea', 150, 60),
                    new Enemy('e3', 450, 420, 'Lính Gác Hư Không', '#c026d3', 170, 65)
                ];
            } else {
                // Stage 3 (Màn 3): 4 Mobs
                this.enemies = [
                    new Enemy('e1', 200, 160, 'Tay Sai Tinh Anh', '#7c3aed', 180, 70),
                    new Enemy('e2', 720, 200, 'Bóng Ma Thập Tự', '#9333ea', 200, 75),
                    new Enemy('e3', 450, 420, 'Đại Lính Gác Hư Không', '#c026d3', 220, 80),
                    new Enemy('e4', 350, 300, 'Vệ Binh Bóng Tối', '#4c1d95', 250, 85)
                ];
            }
        } else {
            HISTORY_CAMPAIGN.chapters.forEach(d => {
                const s = new Shard(d.id, d.tileX, d.tileY, d.title, d.icon, d.puzzle, d.dialogue);
                s.classification = d.classification;
                s.sourceRefs = d.sourceRefs;
                this.shards.push(s);
            });
        }

        const saved = saveService.load();
        if (saved && saved.shards) {
            saved.shards.forEach(sId => {
                const f = this.shards.find(s => s.id === sId);
                if (f) f.collected = true;
            });
        }

        this.hud.updateShardsCount(this.shards.filter(s=>s.collected).length, this.shards.length);
    }

    checkAllEnemiesDead() {
        const allDead = this.enemies.length > 0 && this.enemies.every(e => e.isDead);
        if (allDead && this.portals.length === 0 && this.activeCampaignId === 'campaign-english') {
            const mod = ENGLISH_CAMPAIGN.modules[this.currentModuleIndex];
            const next = this.currentStageIndex + 1;
            const title = next < mod.stages.length ? `Stage ${next + 1}` : 'Trận Đấu Trùm Module';
            this.portals = [ new Portal('portal-next', 17, 5, next, title) ];
        }
    }

    castSkill(type) {
        if (this.isMovementLocked || this.isGameOver) return;
        const cx = this.player.x + this.player.width / 2;
        const cy = this.player.y + this.player.height / 2;

        if (type === 'lightning') {
            if (!this.player.canCast(25, this.player.cdSkill1)) return;
            this.player.consumeMana(25);
            this.player.cdSkill1 = 180;
            this.player.state = 'cast';
            setTimeout(() => { if (this.player.state === 'cast') this.player.state = 'idle'; }, 300);

            this.projectiles.push(new Projectile(cx, cy, this.player.dir, null, 'lightning', 12, this.player.atk + 25));
        } else if (type === 'frost') {
            if (!this.player.canCast(40, this.player.cdSkill2)) return;
            this.player.consumeMana(40);
            this.player.cdSkill2 = 360;
            this.player.state = 'cast';
            setTimeout(() => { if (this.player.state === 'cast') this.player.state = 'idle'; }, 300);

            this.projectiles.push(new Projectile(this.companion.x - 28, this.companion.y - 28, 'up', null, 'frost', 0, this.player.atk + 40));
            this.triggerScreenShake(10);
        } else if (type === 'firestorm') {
            if (!this.player.canCast(60, this.player.cdSkill3)) return;
            this.player.consumeMana(60);
            this.player.cdSkill3 = 600;
            this.player.state = 'cast';
            setTimeout(() => { if (this.player.state === 'cast') this.player.state = 'idle'; }, 300);

            this.projectiles.push(new Projectile(cx - 30, cy - 30, this.player.dir, null, 'firestorm', 4, this.player.atk + 60));
            this.triggerScreenShake(15);
        } else {
            if (!this.player.canCast(5, this.player.cdShot)) return;
            this.player.consumeMana(5);
            this.player.cdShot = 18;
            this.player.state = 'cast';
            setTimeout(() => { if (this.player.state === 'cast') this.player.state = 'idle'; }, 200);

            this.projectiles.push(new Projectile(cx, cy, this.player.dir, null, 'standard', 9, this.player.atk));
        }
    }

    addFloatingText(text, x, y, color = '#ff0055') {
        this.floatingTexts.push({ text: text, x: x, y: y, life: 45, color: color });
    }

    triggerScreenShake(d) { this.screenShakeTimer = d; }

    triggerGameOver() {
        this.isGameOver = true;
        document.getElementById('gameover-modal').classList.remove('hidden');
    }

    continueSave() {
        const saved = saveService.load();
        if (saved) { this.start(); }
        else { this.resetNewGame(); }
    }

    resetNewGame() {
        saveService.clear();
        this.isGameOver = false;
        document.getElementById('gameover-modal').classList.add('hidden');
        this.currentModuleIndex = 0;
        this.currentStageIndex = 0;
        this.activeCampaignId = 'campaign-english';
        HISTORY_CAMPAIGN.unlocked = false;

        this.player = new Player(450, 360);
        this.companion = new Companion(400, 360);
        this.restorationSystem.restorationPct = 0;
        this.hud.updateRestoration(0);
        this.loadStageData();
        this.start();
    }

    switchStageZone(nextStageIndex) {
        const mod = ENGLISH_CAMPAIGN.modules[this.currentModuleIndex];
        if (nextStageIndex < mod.stages.length) {
            this.currentStageIndex = nextStageIndex;
            const stg = mod.stages[this.currentStageIndex];
            this.map = MAPS_DATA[stg.mapZoneId] || MAPS_DATA['zone-stage-1'];
            this.player.x = 144; this.player.y = 192;
            this.companion.x = 100; this.companion.y = 192;
            this.loadStageData();
            alert(`🌀 KHU VỰC MỚI: ${stg.title}!\nĐộ khó tăng lên! Màn này có nhiều quái hơn và DEF cao hơn!`);
        } else {
            this.triggerModuleBoss();
        }
    }

    triggerModuleBoss() {
        const mod = ENGLISH_CAMPAIGN.modules[this.currentModuleIndex];
        const boss = mod.boss;
        alert(`⚡ TRÙM LỚN: ${boss.name}!\nTrận chiến tổng kết Module ${this.currentModuleIndex + 1}!`);

        const bossEnemy = new Enemy('boss-module', 450, 280, `⚡ ${boss.name} ⚡`, '#ff0055', 400, 70);
        this.enemies = [bossEnemy];
        this.portals = [];
        this.shards = [];

        const bossCheck = setInterval(() => {
            if (bossEnemy.isDead) {
                clearInterval(bossCheck);
                alert(`🎉 THẮNG LỢI TRÙM MODULE ${this.currentModuleIndex + 1}!`);
                this.currentModuleIndex++;
                if (this.currentModuleIndex >= 3) {
                    alert('🏆 HOÀN THÀNH 3 MODULE TIẾNG ANH! CHÍNH THỨC MỞ KHÓA MODULE 4: ĐẠI SỬ VIỆT!');
                    HISTORY_CAMPAIGN.unlocked = true;
                    this.activeCampaignId = 'campaign-history';
                    this.loadStageData();
                } else {
                    this.currentStageIndex = 0;
                    const stg = ENGLISH_CAMPAIGN.modules[this.currentModuleIndex].stages[0];
                    this.map = MAPS_DATA[stg.mapZoneId] || MAPS_DATA['zone-stage-1'];
                    this.player.x = 144; this.player.y = 192;
                    this.loadStageData();
                }
            }
        }, 500);
    }

    start() { this.loop.start(); }

    update(delta) {
        if (this.isGameOver) return;

        if (!this.isMovementLocked) {
            this.player.update(this.input, this.map.grid, this.map.cols, this.map.rows, this.map.tileSize);
            this.companion.followLeader(this.player, 12);

            if (this.input.isPressed('ShiftLeft') || this.input.isPressed('ShiftRight')) {
                this.player.performDash(this.map);
            }
            if (this.input.isPressed('Space') || this.input.isPressed('KeyJ')) this.castSkill('standard');
            if (this.input.isPressed('KeyQ')) this.castSkill('lightning');
            if (this.input.isPressed('KeyE')) this.castSkill('frost');
            if (this.input.isPressed('KeyR')) this.castSkill('firestorm');

            this.enemies.forEach(enemy => {
                const shotInfo = enemy.update(this.map.grid, this.map.cols, this.map.rows, this.map.tileSize, this.player);

                if (shotInfo && shotInfo.shoot) {
                    this.projectiles.push(new Projectile(
                        shotInfo.startX, shotInfo.startY,
                        shotInfo.dirX, shotInfo.dirY,
                        'dark_orb', 6, 20, true
                    ));
                }

                if (!enemy.isDead) {
                    const dist = Math.hypot((this.player.x+24)-(enemy.x+20), (this.player.y+32)-(enemy.y+24));
                    if (dist < 32) {
                        this.player.takeDamage(15);
                        this.triggerScreenShake(8);
                        if (this.player.hp <= 0) this.triggerGameOver();
                    }
                }
            });

            for (let i = this.projectiles.length - 1; i >= 0; i--) {
                const proj = this.projectiles[i];
                proj.update();

                if (proj.isEnemy) {
                    const pCenterX = this.player.x + 24;
                    const pCenterY = this.player.y + 32;
                    const dist = Math.hypot(proj.x - pCenterX, proj.y - pCenterY);

                    if (dist < 26) {
                        proj.isDead = true;
                        if (this.player.isDashing) {
                            this.addFloatingText('⚡ DODGED!', pCenterX, pCenterY - 20, '#00fff5');
                        } else {
                            this.player.takeDamage(proj.damage);
                            this.addFloatingText(`-${proj.damage} HP`, pCenterX, pCenterY - 20, '#ff0055');
                            this.triggerScreenShake(8);
                            if (this.player.hp <= 0) this.triggerGameOver();
                        }
                    }
                } else {
                    this.enemies.forEach(enemy => {
                        if (!enemy.isDead && !proj.isDead) {
                            const dist = Math.hypot(proj.x - (enemy.x+20), proj.y - (enemy.y+24));
                            if (dist < proj.width + 14) {
                                if (proj.type !== 'frost' && proj.type !== 'firestorm') proj.isDead = true;

                                const actualDmg = enemy.takeDamage(proj.damage);
                                if (actualDmg === 0) {
                                    this.addFloatingText('0 IMMUNE! (Cần Mảnh)', enemy.x + 20, enemy.y - 15, '#ff7675');
                                } else {
                                    this.addFloatingText(`-${actualDmg}`, enemy.x + 20, enemy.y - 15, '#ffeaa7');
                                    this.player.addCombo();
                                    this.triggerScreenShake(4);
                                }

                                if (enemy.isDead) {
                                    this.restorationSystem.restorationPct += 5;
                                    this.hud.updateRestoration(this.restorationSystem.restorationPct);
                                    this.checkAllEnemiesDead();
                                }
                            }
                        }
                    });
                }

                if (proj.isDead) this.projectiles.splice(i, 1);
            }

            for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
                const ft = this.floatingTexts[i];
                ft.y -= 0.8;
                ft.life--;
                if (ft.life <= 0) this.floatingTexts.splice(i, 1);
            }

            this.interactionSystem.update(this.player, this.shards, this.npcs, this.portals, this.enemies);

            if (this.input.isPressed('KeyF')) {
                const active = this.interactionSystem.activeTarget;
                if (active) {
                    if (active.type === 'portal') {
                        this.switchStageZone(active.target.targetStageIndex);
                    } else if (active.type === 'shard' && !active.target.collected) {
                        this.triggerShardQuest(active.target);
                    } else if (active.type === 'npc') {
                        this.dialogueSystem.start(active.target.dialogue);
                    }
                }
            }

            if (this.input.isPressed('KeyI')) window.toggleJournal();
            if (this.input.isPressed('KeyQ')) window.toggleQuestModal();
            if (this.input.isPressed('KeyC')) window.toggleChronicleModal();
            if (this.input.isPressed('Tab')) window.toggleProgressModal();
            if (this.input.isPressed('Escape')) {
                document.querySelectorAll('.overlay-panel').forEach(p => {
                    if (p.id !== 'campaign-select' && p.id !== 'gameover-modal') p.classList.add('hidden');
                });
            }
        } else {
            if (this.dialogueSystem.isOpen && (this.input.isPressed('KeyF') || this.input.isPressed('Space'))) {
                this.dialogueSystem.advance();
            }
        }

        this.camera.follow(
            this.player.x + this.player.width/2,
            this.player.y + this.player.height/2,
            this.map.cols * this.map.tileSize,
            this.map.rows * this.map.tileSize
        );
    }

    triggerShardQuest(shard) {
        this.dialogueSystem.start(shard.dialogueData, () => {
            this.learningSystem.startEncounter(shard.puzzleData, () => {
                shard.collected = true;
                this.player.gainPowerFromShard();
                this.restorationSystem.restoreShard(shard, this.shards.length);

                const collectedIds = this.shards.filter(s => s.collected).map(s => s.id);
                saveService.save({ shards: collectedIds });
                this.hud.updateShardsCount(collectedIds.length, this.shards.length);

                alert(`⬆️ TĂNG SỨC MẠNH!\nATK: ${this.player.atk} (+30) | Max HP: ${this.player.maxHp}\nĐã hồi phục 100% HP & MP! Đạn phép của cậu giờ đã đủ sức phá Giáp DEF của Tay Sai!`);

            }, (dmg) => {
                this.player.takeDamage(dmg);
                if (this.player.hp <= 0) this.triggerGameOver();
            });
        });
    }

    render() {
        this.ctx.save();

        let sx = 0, sy = 0;
        if (this.screenShakeTimer > 0) {
            sx = (Math.random() - 0.5) * 8;
            sy = (Math.random() - 0.5) * 8;
            this.screenShakeTimer--;
        }
        this.ctx.translate(sx, sy);

        this.ctx.fillStyle = '#0f172a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        for (let r = 0; r < this.map.rows; r++) {
            for (let c = 0; c < this.map.cols; c++) {
                this.drawTile(this.map.grid[r][c], c * this.map.tileSize - this.camera.x, r * this.map.tileSize - this.camera.y);
            }
        }

        this.drawLexarisTree(9*48 - this.camera.x, 2*48 - this.camera.y);

        this.shards.forEach(s => s.draw(this.ctx, this.camera));
        this.portals.forEach(p => p.draw(this.ctx, this.camera));
        this.npcs.forEach(n => n.draw(this.ctx, this.camera));
        this.enemies.forEach(e => e.draw(this.ctx, this.camera));
        this.projectiles.forEach(p => p.draw(this.ctx, this.camera));

        this.companion.draw(this.ctx, this.camera);
        this.player.draw(this.ctx, this.camera);

        this.floatingTexts.forEach(ft => {
            this.ctx.fillStyle = ft.color;
            this.ctx.font = '13px Press Start 2P';
            this.ctx.textAlign = 'center';
            this.ctx.shadowColor = '#000000';
            this.ctx.shadowBlur = 4;
            this.ctx.fillText(ft.text, ft.x - this.camera.x, ft.y - this.camera.y);
        });

        this.interactionSystem.drawPrompt(this.ctx, this.camera);
        this.drawBeams();

        // Skill Bar HUD & Cooldown / Mana Indicators
        this.ctx.fillStyle = '#ffeaa7';
        this.ctx.font = '13px Press Start 2P';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`📍 ${this.map.title || 'Khu Vực'}`, 20, 485);
        this.ctx.fillStyle = '#00fff5';
        this.ctx.fillText(`⚔️ ATK: ${this.player.atk}  💧 MP: ${Math.floor(this.player.mp)}/100`, 20, 505);

        const cd1 = Math.ceil(this.player.cdSkill1 / 60);
        const cd2 = Math.ceil(this.player.cdSkill2 / 60);
        const cd3 = Math.ceil(this.player.cdSkill3 / 60);
        const cdDash = Math.ceil(this.player.cdDash / 60);

        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '12px VT323';
        this.ctx.fillText(`[J] Bắn (5MP) | [1] Sét ${cd1>0?`(${cd1}s)`:'READY'} | [2] Băng ${cd2>0?`(${cd2}s)`:'READY'} | [3] Lửa ${cd3>0?`(${cd3}s)`:'READY'} | [Shift] Dash ${cdDash>0?`(${cdDash}s)`:'READY'}`, 20, 528);

        this.ctx.restore();
    }

    drawTile(type, x, y) {
        const s = 48, ctx = this.ctx;
        switch (type) {
            case 0:
                ctx.fillStyle='#1e824c'; ctx.fillRect(x,y,s,s);
                ctx.fillStyle='#27ae60'; ctx.fillRect(x+6,y+6,4,4); ctx.fillRect(x+32,y+28,4,4);
                break;
            case 1:
                ctx.fillStyle='#2980b9'; ctx.fillRect(x,y,s,s);
                ctx.fillStyle='#3498db'; ctx.fillRect(x+(Date.now()/250%24),y+16,16,3); ctx.fillRect(x+8,y+32,12,2);
                break;
            case 2:
                ctx.fillStyle='#7f8c8d'; ctx.fillRect(x,y,s,s);
                ctx.fillStyle='#95a5a6'; ctx.fillRect(x+3,y+3,s-6,s-6);
                ctx.fillStyle='#bdc3c7'; ctx.fillRect(x+6,y+6,12,12);
                break;
            case 3:
                ctx.fillStyle='#1e272e'; ctx.fillRect(x,y,s,s);
                ctx.fillStyle='#34495e'; ctx.fillRect(x+3,y+3,s-6,s-10);
                ctx.fillStyle='#7f8c8d'; ctx.fillRect(x+6,y+6,s-12,4);
                break;
            case 4:
                ctx.fillStyle='#1e824c'; ctx.fillRect(x,y,s,s);
                ctx.fillStyle='#5d4037'; ctx.fillRect(x+18,y+28,12,20);
                ctx.fillStyle='#2ecc71'; ctx.beginPath(); ctx.arc(x+24,y+16,18,0,Math.PI*2); ctx.fill();
                ctx.fillStyle='#e84393'; ctx.fillRect(x+14,y+12,4,4); ctx.fillRect(x+28,y+18,4,4);
                break;
            case 5:
                ctx.fillStyle='#d35400'; ctx.fillRect(x,y,s,s);
                ctx.fillStyle='#e67e22'; ctx.fillRect(x,y+4,s,6); ctx.fillRect(x,y+20,s,6); ctx.fillRect(x,y+36,s,6);
                ctx.fillStyle='#7f8c8d'; ctx.fillRect(x+2,y,4,s); ctx.fillRect(x+s-6,y,4,s);
                break;
            case 6:
                ctx.fillStyle='#5d4037'; ctx.fillRect(x,y,s,s);
                ctx.fillStyle='#8d6e63'; ctx.fillRect(x+4,y+4,s-8,12); ctx.fillRect(x+4,y+22,s-8,12);
                ctx.fillStyle='#e74c3c'; ctx.fillRect(x+6,y+6,6,8); ctx.fillStyle='#3498db'; ctx.fillRect(x+14,y+6,6,8); ctx.fillStyle='#f1c40f'; ctx.fillRect(x+22,y+6,6,8);
                ctx.fillStyle='#2ecc71'; ctx.fillRect(x+6,y+24,6,8); ctx.fillStyle='#9b59b6'; ctx.fillRect(x+14,y+24,6,8); ctx.fillStyle='#e67e22'; ctx.fillRect(x+22,y+24,6,8);
                break;
            case 7:
                ctx.fillStyle='#1e824c'; ctx.fillRect(x,y,s,s);
                ctx.fillStyle='#546e7a'; ctx.beginPath(); ctx.arc(x+24,y+24,16,0,Math.PI*2); ctx.fill();
                ctx.fillStyle='#78909c'; ctx.beginPath(); ctx.arc(x+20,y+20,10,0,Math.PI*2); ctx.fill();
                ctx.fillStyle='#27ae60'; ctx.fillRect(x+26,y+18,6,4);
                break;
            case 8:
                ctx.fillStyle='#1e824c'; ctx.fillRect(x,y,s,s);
                ctx.fillStyle='#78350f'; ctx.beginPath(); ctx.arc(x+24,y+24,14,0,Math.PI*2); ctx.fill();
                ctx.fillStyle='#b45309'; ctx.beginPath(); ctx.arc(x+24,y+24,10,0,Math.PI*2); ctx.fill();
                ctx.fillStyle='#f59e0b'; ctx.fillRect(x+14,y+22,20,4);
                break;
            case 9:
                ctx.fillStyle='#7f8c8d'; ctx.fillRect(x,y,s,s);
                ctx.fillStyle='#00cec9'; ctx.beginPath(); ctx.arc(x+24,y+24,18,0,Math.PI*2); ctx.fill();
                ctx.fillStyle='#81ecec'; ctx.beginPath(); ctx.arc(x+24,y+24,12,0,Math.PI*2); ctx.fill();
                ctx.fillStyle='#ffffff'; ctx.fillRect(x+22,y+22,4,4);
                break;
            case 10:
                ctx.fillStyle='#1e824c'; ctx.fillRect(x,y,s,s);
                ctx.fillStyle='#f1c40f'; ctx.fillRect(x+10,y+12,28,24);
                ctx.fillStyle='#f39c12'; ctx.fillRect(x+12,y+14,24,20);
                ctx.fillStyle='#78350f'; ctx.fillRect(x+10,y+22,28,4);
                ctx.fillStyle='#ffffff'; ctx.fillRect(x+22,y+21,4,6);
                break;
            case 11:
                ctx.fillStyle='#1e824c'; ctx.fillRect(x,y,s,s);
                ctx.fillStyle='#2c3e50'; ctx.fillRect(x+21,y+16,6,28);
                ctx.fillStyle='#f1c40f'; ctx.fillRect(x+16,y+6,16,14);
                ctx.fillStyle='#e74c3c'; ctx.fillRect(x+20,y+10,8,8);
                break;
        }
    }

    drawLexarisTree(x, y) {
        const ctx = this.ctx;
        ctx.save();
        ctx.fillStyle = this.restorationSystem.restorationPct >= 100 ? 'rgba(255,234,167,0.4)' : 'rgba(0,255,245,0.3)';
        ctx.beginPath(); ctx.arc(x+72,y+72,60,0,Math.PI*2); ctx.fill();
        ctx.fillStyle='#4e342e'; ctx.fillRect(x+54,y+60,36,78);
        ctx.fillStyle = this.restorationSystem.restorationPct >= 100 ? '#f1c40f' : (this.restorationSystem.restorationPct > 0 ? '#00fff5' : '#78909c');
        ctx.beginPath(); ctx.arc(x+72,y+42,54,0,Math.PI*2); ctx.fill();
        ctx.fillStyle='#fff'; ctx.font='16px Press Start 2P'; ctx.textAlign='center';
        ctx.fillText('🌳 LEXARIS',x+72,y-16);
        ctx.restore();
    }

    drawBeams() {
        for (let i = this.beams.length-1; i >= 0; i--) {
            const b = this.beams[i];
            this.ctx.strokeStyle='#00fff5'; this.ctx.lineWidth=4;
            this.ctx.beginPath();
            this.ctx.moveTo(b.startX-this.camera.x,b.startY-this.camera.y);
            this.ctx.lineTo(b.targetX-this.camera.x,b.targetY-this.camera.y);
            this.ctx.stroke();
            b.life--; if(b.life<=0) this.beams.splice(i,1);
        }
    }
}
