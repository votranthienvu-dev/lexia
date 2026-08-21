// LexiQuest Ultra-Detailed 16-Bit Pixel Character Renderer (Multi-Tier Shading & Micro Details)
export class PixelRenderer {
    static shadeColor(color, percent) {
        if (!color || color[0] !== '#') return color || '#ffffff';
        let num = parseInt(color.replace('#', ''), 16);
        if (isNaN(num)) return color;
        let amt = Math.round(2.55 * percent);
        let R = (num >> 16) + amt;
        let G = (num >> 8 & 0x00FF) + amt;
        let B = (num & 0x0000FF) + amt;
        return '#' + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
    }

    static drawHumanCharacter(ctx, x, y, scale, appearance, equipment, direction, state, animTick, isPlayer = true) {
        ctx.save();
        ctx.imageSmoothingEnabled = false;

        ctx.translate(Math.floor(x), Math.floor(y));
        ctx.scale(scale, scale);

        // 8-Frame Walk & Idle Animation Physics
        const walkFrame = state === 'walk' ? Math.floor((animTick / 4) % 8) : 0;
        const idleBob = state === 'idle' ? Math.sin(animTick * 0.1) * 1.5 : 0;
        const hairSway = Math.sin(animTick * 0.12) * 1.5;
        const capeWave = Math.sin(animTick * 0.15) * 2.5;

        const isUp = direction === 'up';
        const isDown = direction === 'down';
        const isLeft = direction === 'left';
        const isRight = direction === 'right';
        const isSide = isLeft || isRight;

        if (isLeft) ctx.scale(-1, 1);

        // 1. DYNAMIC HIGH-CONTRAST DROP SHADOW
        ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
        ctx.beginPath();
        ctx.ellipse(0, 16, 9, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // 2. KAELEN CANON PALETTE (White/Silver Hair, Royal Blue Robe, Gold Trim)
        const hairColor = appearance.hairColor || '#e2e8f0';
        const hairHighlight = '#ffffff';
        const hairShadow = '#94a3b8';

        const robeBase = appearance.shirtColor || '#1e3a8a';
        const robeHighlight = this.shadeColor(robeBase, 30);
        const robeShadow = this.shadeColor(robeBase, -35);

        const gold = '#fbbf24';
        const goldHighlight = '#fef08a';
        const goldShadow = '#b45309';

        const shirtColor = '#ffffff';
        const pantsColor = appearance.pantsColor || '#1e293b';
        const bootsColor = '#78350f';

        // 3. ROYAL BLUE CAPE & GOLD EMBROIDERED HEM (Back Layer)
        if (isUp) {
            ctx.fillStyle = robeShadow;
            ctx.fillRect(-8, -4 + idleBob, 16, 18);
            ctx.fillStyle = robeBase;
            ctx.fillRect(-7, 2 + idleBob, 14, 12 + Math.floor(capeWave * 0.5));

            ctx.fillStyle = gold;
            ctx.fillRect(-7, 13 + idleBob + Math.floor(capeWave * 0.5), 14, 2);
            ctx.fillStyle = goldHighlight;
            ctx.fillRect(-5, -3 + idleBob, 10, 2);
        } else if (isSide) {
            ctx.fillStyle = robeShadow;
            ctx.fillRect(-7 + capeWave * 0.4, -3 + idleBob, 7, 16);
            ctx.fillStyle = gold;
            ctx.fillRect(-7 + capeWave * 0.4, 12 + idleBob, 7, 2);
        } else if (isDown) {
            ctx.fillStyle = robeShadow;
            ctx.fillRect(-8, -3 + idleBob, 3, 11);
            ctx.fillRect(5, -3 + idleBob, 3, 11);
            ctx.fillStyle = gold;
            ctx.fillRect(-8, 7 + idleBob, 3, 2);
            ctx.fillRect(5, 7 + idleBob, 3, 2);
        }

        // 4. LEGS & CANON LEATHER BOOTS (8-Frame Strides & Metallic Buckles)
        let legL = 0, legR = 0;
        if (state === 'walk') {
            const strides = [0, 2, 4, 2, 0, -2, -4, -2];
            legL = strides[walkFrame];
            legR = -strides[walkFrame];
        }

        // Left Leg & Boot
        ctx.fillStyle = pantsColor;
        ctx.fillRect(-5, 4 + idleBob + legL, 4, 7);
        ctx.fillStyle = bootsColor;
        ctx.fillRect(-6, 10 + idleBob + legL, 5, 5);
        ctx.fillStyle = '#b45309';
        ctx.fillRect(-6, 10 + idleBob + legL, 5, 1);
        if (isDown) {
            ctx.fillStyle = gold; // Gold Buckle
            ctx.fillRect(-5, 12 + idleBob + legL, 3, 1);
        }

        // Right Leg & Boot
        ctx.fillStyle = pantsColor;
        ctx.fillRect(1, 4 + idleBob + legR, 4, 7);
        ctx.fillStyle = bootsColor;
        ctx.fillRect(1, 10 + idleBob + legR, 5, 5);
        ctx.fillStyle = '#b45309';
        ctx.fillRect(1, 10 + idleBob + legR, 5, 1);
        if (isDown) {
            ctx.fillStyle = gold;
            ctx.fillRect(2, 12 + idleBob + legR, 3, 1);
        }

        // 5. WHITE SHIRT, ROYAL BLUE COAT & GOLD BUTTONS
        ctx.fillStyle = shirtColor;
        ctx.fillRect(-4, -4 + idleBob, 8, 9);
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(-2, -4 + idleBob, 4, 2); // Collar shadow

        // Open Royal Blue Coat Flaps
        ctx.fillStyle = robeBase;
        ctx.fillRect(-6, -4 + idleBob, 3, 10);
        ctx.fillRect(3, -4 + idleBob, 3, 10);

        ctx.fillStyle = robeHighlight;
        ctx.fillRect(-6, -4 + idleBob, 1, 10);
        ctx.fillRect(5, -4 + idleBob, 1, 10);

        // Gold Coat Buttons (Double Breasted)
        ctx.fillStyle = gold;
        ctx.fillRect(-5, -1 + idleBob, 2, 2);
        ctx.fillRect(-5, 3 + idleBob, 2, 2);
        ctx.fillRect(3, -1 + idleBob, 2, 2);
        ctx.fillRect(3, 3 + idleBob, 2, 2);

        ctx.fillStyle = goldHighlight;
        ctx.fillRect(-5, -1 + idleBob, 1, 1);
        ctx.fillRect(3, -1 + idleBob, 1, 1);

        // Leather Belt & Gold Buckle
        ctx.fillStyle = '#451a03';
        ctx.fillRect(-4, 5 + idleBob, 8, 2);
        ctx.fillStyle = gold;
        ctx.fillRect(-1, 4 + idleBob, 2, 4);
        ctx.fillStyle = goldShadow;
        ctx.fillRect(0, 5 + idleBob, 1, 2);

        // 6. ANCIENT SPELLBOOK ACCESSORY (Carried in Hand with Gold Emblem)
        if (!isUp) {
            ctx.fillStyle = '#7c2d12'; // Ancient Leather Cover
            ctx.fillRect(4, 2 + idleBob, 5, 7);
            ctx.fillStyle = gold;
            ctx.fillRect(5, 3 + idleBob, 3, 5); // Gold Rune Crest
            ctx.fillStyle = '#00fff5';
            ctx.fillRect(6, 4 + idleBob, 1, 3); // Gem Inset
            ctx.fillStyle = '#fef08a';
            ctx.fillRect(4, 3 + idleBob, 1, 5); // Pages
        }

        // 7. ARMS & SLEEVES
        const skinColor = appearance.skinColor || '#fde047';
        const skinShadow = this.shadeColor(skinColor, -20);

        if (state === 'cast') {
            ctx.fillStyle = robeBase;
            ctx.fillRect(-8, -12 + idleBob, 4, 12);
            ctx.fillRect(4, -12 + idleBob, 4, 12);

            ctx.fillStyle = skinColor;
            ctx.fillRect(-8, -16 + idleBob, 4, 4);
            ctx.fillRect(4, -16 + idleBob, 4, 4);

            // Floating Mana Aura around Hands
            ctx.fillStyle = '#00fff5';
            ctx.fillRect(-9, -17 + idleBob, 6, 2);
            ctx.fillRect(3, -17 + idleBob, 6, 2);
        } else {
            const armL = -legL;
            const armR = -legR;

            ctx.fillStyle = robeBase;
            ctx.fillRect(-7, -3 + idleBob + armL, 3, 7);
            ctx.fillRect(4, -3 + idleBob + armR, 3, 7);

            ctx.fillStyle = skinColor;
            ctx.fillRect(-7, 3 + idleBob + armL, 3, 3);
            ctx.fillRect(4, 3 + idleBob + armR, 3, 3);
        }

        // 8. CANON SILVER/WHITE HAIR & BLUE SEEKER EYES
        ctx.fillStyle = skinColor;
        ctx.fillRect(-5, -14 + idleBob, 10, 10);
        ctx.fillStyle = skinShadow;
        ctx.fillRect(-5, -5 + idleBob, 10, 1);

        // Silver/White Hair Locks (Multi-tier Shaded)
        ctx.fillStyle = hairColor;
        ctx.fillRect(-6, -17 + idleBob, 12, 6);
        ctx.fillRect(-6 + hairSway, -15 + idleBob, 3, 8); // Left parted bang
        ctx.fillRect(3 + hairSway, -15 + idleBob, 3, 8);  // Right parted bang
        ctx.fillRect(-2, -18 + idleBob, 4, 3);            // Top tuft

        ctx.fillStyle = hairHighlight;
        ctx.fillRect(-4, -17 + idleBob, 8, 2);
        ctx.fillRect(-1, -18 + idleBob, 2, 2);

        ctx.fillStyle = hairShadow;
        ctx.fillRect(-6, -12 + idleBob, 2, 4);
        ctx.fillRect(4, -12 + idleBob, 2, 4);

        // Eyes (Canon Blue Seeker Eyes with Pupils & Catchlights)
        if (isDown) {
            const isBlinking = (animTick % 160) > 152;
            if (!isBlinking) {
                ctx.fillStyle = '#0f172a'; // Socket
                ctx.fillRect(-4, -10 + idleBob, 3, 4);
                ctx.fillRect(1, -10 + idleBob, 3, 4);

                ctx.fillStyle = '#0284c7'; // Canon Royal Blue Iris
                ctx.fillRect(-3, -10 + idleBob, 2, 3);
                ctx.fillRect(2, -10 + idleBob, 2, 3);

                ctx.fillStyle = '#00fff5'; // Iris Glow
                ctx.fillRect(-3, -9 + idleBob, 2, 1);
                ctx.fillRect(2, -9 + idleBob, 2, 1);

                ctx.fillStyle = '#ffffff'; // White Catchlight Sparkle
                ctx.fillRect(-3, -10 + idleBob, 1, 1);
                ctx.fillRect(2, -10 + idleBob, 1, 1);
            } else {
                ctx.fillStyle = '#0f172a';
                ctx.fillRect(-4, -8 + idleBob, 3, 1);
                ctx.fillRect(1, -8 + idleBob, 3, 1);
            }
        }

        ctx.restore();
    }
}
