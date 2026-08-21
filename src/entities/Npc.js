// LexiQuest Interactive NPC Entity System
import { PixelRenderer } from '../engine/PixelRenderer.js';

export class Npc {
    constructor(id, x, y, name, title, npcType, dialogue) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.width = 48;
        this.height = 64;
        this.name = name;
        this.title = title;
        this.npcType = npcType; // 'elder', 'su', 'blacksmith', 'villager'
        this.dialogue = dialogue;
        this.dir = 'down';
        this.animTick = 0;

        if (npcType === 'su') {
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
        } else if (npcType === 'elder') {
            this.appearance = {
                gender: 'male',
                hairStyle: 'elder_white',
                hairColor: '#ffffff',
                skinColor: '#fde047',
                eyeColor: '#1e293b',
                shirtColor: '#7c3aed',
                pantsColor: '#1e293b',
                capeStyle: 'scholar_mantle'
            };
        } else {
            this.appearance = {
                gender: 'male',
                hairStyle: 'messy',
                hairColor: '#78350f',
                skinColor: '#fcd34d',
                eyeColor: '#1e293b',
                shirtColor: '#059669',
                pantsColor: '#334155',
                capeStyle: 'none'
            };
        }

        this.equipment = { weapon: null, offhand: null, armor: null, helmet: null };
    }

    draw(ctx, camera) {
        const drawX = Math.floor(this.x - camera.x);
        const drawY = Math.floor(this.y - camera.y);

        this.animTick++;

        PixelRenderer.drawHumanCharacter(
            ctx,
            drawX + 24,
            drawY + 32,
            1.3,
            this.appearance,
            this.equipment,
            this.dir,
            'idle',
            this.animTick,
            false
        );

        // Name & Title Tag
        ctx.fillStyle = '#f1c40f';
        ctx.font = '13px Pixelify Sans';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 4;
        ctx.fillText(`${this.name} (${this.title})`, drawX + 24, drawY - 6);
    }
}
