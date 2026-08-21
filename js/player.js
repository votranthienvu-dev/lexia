// LexiQuest Player Entity & Smooth Axis-Aligned Sliding Collision System
class Character {
    constructor(x, y, type, name, isPlayer = false) {
        this.x = x;
        this.y = y;
        this.width = 48;
        this.height = 64;
        this.type = type; // 'kaelen', 'lex', 'su', 'oblivitas', 'monster'
        this.name = name;
        this.isPlayer = isPlayer;

        this.speed = 4.0;
        this.dir = 'down'; // 'down', 'up', 'left', 'right'

        // State Machine ('idle', 'walk', 'interact', 'cast', 'attack')
        this.state = 'idle';
        this.animTick = 0;
        this.posHistory = [];

        // Player Canon Presets using extracted graphics engine
        if (this.type === 'kaelen') {
            this.appearance = {
                gender: 'male',
                hairStyle: 'scholar_parted',
                hairColor: '#f39c12',
                skinColor: '#fcd34d',
                eyeColor: '#00fff5',
                shirtColor: '#1e3a8a',
                pantsColor: '#1e293b',
                capeStyle: 'scholar_mantle'
            };
            this.equipment = {
                weapon: { id: 'rune_staff', name: 'Trượng Cổ Tự Rune', type: 'weapon_staff', color: '#00fff5' },
                offhand: { id: 'lexaris_tome', name: 'Sách Cổ Tự Lexaris', type: 'book', color: '#fbbf24' },
                armor: { id: 'seeker_robe', name: 'Áo Choàng Seeker', color: '#1e3a8a' },
                helmet: { id: 'headband', name: 'Khăn Gạt Trán Seeker', color: '#e74c3c' }
            };
        } else if (this.type === 'su') {
            this.appearance = {
                gender: 'male',
                hairStyle: 'short_spiky',
                hairColor: '#2d3436',
                skinColor: '#f5cba7',
                eyeColor: '#2d3436',
                shirtColor: '#27ae60',
                pantsColor: '#d35400',
                capeStyle: 'none'
            };
            this.equipment = {
                weapon: null,
                offhand: null,
                armor: { id: 'viet_shirt', color: '#27ae60' },
                helmet: null
            };
        } else if (this.type === 'oblivitas') {
            this.appearance = {
                gender: 'male',
                hairStyle: 'hood',
                hairColor: '#2c2c54',
                skinColor: '#e2e8f0',
                eyeColor: '#ff0055',
                shirtColor: '#2c2c54',
                pantsColor: '#1a1a2e',
                capeStyle: 'shadow'
            };
            this.equipment = {
                weapon: { id: 'shadow_scythe', name: 'Lưỡi Hái Hư Không', type: 'weapon_staff', color: '#ff0055' },
                offhand: null,
                armor: { id: 'shadow_robe', color: '#2c2c54' },
                helmet: null
            };
        }

        if (this.isPlayer) {
            this.stats = {
                resonancePower: 120,
                logicDefense: 45,
                speedBoost: 0
            };
        }
    }

    move(dx, dy, engine) {
        if (this.state === 'cast') return;

        const isMoving = (dx !== 0 || dy !== 0);

        if (!isMoving) {
            this.state = 'idle';
        } else {
            this.state = 'walk';

            if (dx !== 0 && dy !== 0) {
                dx *= 0.7071;
                dy *= 0.7071;
            }

            const currentSpeed = this.speed + (this.stats ? this.stats.speedBoost : 0);
            const stepX = dx * currentSpeed;
            const stepY = dy * currentSpeed;

            // Axis-Aligned Independent Sliding Movement (Prevents getting stuck!)
            const footBoxMargin = 12;
            const footY = 48; // Feet level for 48x64 sprite

            // Test X Movement
            if (stepX !== 0) {
                const targetX = this.x + stepX;
                const canMoveX = !engine.isSolid(targetX + footBoxMargin, this.y + footY) &&
                                 !engine.isSolid(targetX + this.width - footBoxMargin, this.y + footY);
                if (canMoveX) {
                    this.x = targetX;
                }
            }

            // Test Y Movement
            if (stepY !== 0) {
                const targetY = this.y + stepY;
                const canMoveY = !engine.isSolid(this.x + footBoxMargin, targetY + footY) &&
                                 !engine.isSolid(this.x + this.width - footBoxMargin, targetY + footY);
                if (canMoveY) {
                    this.y = targetY;
                }
            }

            // Record position history for Party Followers
            this.posHistory.push({ x: this.x, y: this.y, dir: this.dir });
            if (this.posHistory.length > 50) this.posHistory.shift();

            // Dust footsteps
            if (Math.random() < 0.25) {
                engine.addDustParticle(this.x + 24, this.y + 56);
                if (this.isPlayer) soundEngine.playFootstep();
            }

            if (Math.abs(dx) > Math.abs(dy)) {
                this.dir = dx > 0 ? 'right' : 'left';
            } else if (dy !== 0) {
                this.dir = dy > 0 ? 'down' : 'up';
            }
        }

        this.animTick++;
    }

    followLeader(leader, delayIndex) {
        if (!leader || leader.posHistory.length < delayIndex) return;

        const targetPos = leader.posHistory[leader.posHistory.length - delayIndex];
        if (!targetPos) return;

        const dx = targetPos.x - this.x;
        const dy = targetPos.y - this.y;
        const dist = Math.hypot(dx, dy);

        if (dist > 8) {
            this.x += dx * 0.25;
            this.y += dy * 0.25;
            this.state = 'walk';
            this.dir = targetPos.dir || 'down';
        } else {
            this.state = 'idle';
        }

        this.animTick++;
    }

    triggerInteractState() {
        this.state = 'cast';
        setTimeout(() => {
            if (this.state === 'cast') this.state = 'idle';
        }, 1200);
    }

    checkShardProximity(shards, tileSize = 48) {
        const playerCenterX = this.x + this.width / 2;
        const playerCenterY = this.y + this.height / 2;

        for (const shard of shards) {
            if (shard.collected) continue;

            const shardX = shard.x * tileSize + tileSize / 2;
            const shardY = shard.y * tileSize + tileSize / 2;

            const dist = Math.hypot(playerCenterX - shardX, playerCenterY - shardY);
            if (dist < 46) {
                return shard;
            }
        }
        return null;
    }

    draw(ctx) {
        const x = Math.floor(this.x);
        const y = Math.floor(this.y);

        ctx.save();

        if (this.type === 'lex') {
            this.drawLexSpirit(ctx, x, y);
        } else if (this.appearance && this.equipment) {
            PixelRenderer.drawHumanCharacter(
                ctx,
                x + 24,
                y + 32,
                1.3,
                this.appearance,
                this.equipment,
                this.dir,
                this.state,
                this.animTick,
                this.isPlayer
            );
        } else {
            this.drawMonster(ctx, x, y);
        }

        // High-Contrast Name Tag
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px Pixelify Sans';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 4;
        ctx.fillText(this.name, x + 24, y - 6);

        ctx.restore();
    }

    drawLexSpirit(ctx, x, y) {
        const floatY = Math.sin(Date.now() / 240) * 6;

        ctx.fillStyle = 'rgba(0, 255, 245, 0.35)';
        ctx.beginPath();
        ctx.arc(x + 24, y + 24 + floatY, 24, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#00fff5';
        ctx.fillRect(x + 14, y + 12 + floatY, 20, 26);

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x + 12, y + 4 + floatY, 24, 16);

        ctx.fillStyle = '#0984e3';
        ctx.fillRect(x + 16, y + 8 + floatY, 5, 6);
        ctx.fillRect(x + 27, y + 8 + floatY, 5, 6);
    }

    drawMonster(ctx, x, y) {
        ctx.fillStyle = '#ff0055';
        ctx.fillRect(x + 8, y + 12, 32, 32);
        ctx.fillStyle = '#ffff00';
        ctx.fillRect(x + 14, y + 18, 6, 6);
        ctx.fillRect(x + 28, y + 18, 6, 6);
    }
}
