// LexiQuest Pixel Engine: 48px Grid, 3-Quarter View & Safe Collision Check
class PixelEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;

        this.tileSize = 48; // 48px Grid
        this.mapCols = 20;
        this.mapRows = 13;

        // Open 3-Quarter Multi-Biome Map Grid (No Spawning Collisions!)
        // 0: Grass, 1: River, 2: Stone Path, 3: Outer Wall, 4: Tree, 5: Bridge, 6: Platform
        this.map = [
            [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
            [3,8,0,0,8,0,3,2,2,2,2,2,2,3,0,7,0,7,11,3],
            [3,0,4,0,4,0,3,2,0,0,0,0,2,3,0,4,0,4,0,3],
            [3,0,0,0,0,0,2,2,10,6,6,10,2,2,0,0,0,0,7,3],
            [3,8,4,0,0,0,2,0,6,6,6,6,0,2,0,0,4,0,0,3],
            [3,0,0,0,0,0,5,2,2,6,6,2,2,5,0,0,0,0,0,3],
            [3,1,1,1,1,1,5,1,1,2,2,1,1,5,1,1,1,1,1,3],
            [3,0,0,0,0,0,2,0,10,2,2,10,0,2,0,0,0,0,7,3],
            [3,0,4,0,0,0,2,2,2,2,2,2,2,2,0,0,4,0,0,3],
            [3,0,0,0,8,0,2,0,0,2,0,0,0,2,0,7,0,0,0,3],
            [3,8,0,4,0,0,2,0,0,2,0,0,0,2,0,4,0,7,0,3],
            [3,0,0,0,0,0,2,0,0,2,0,0,0,2,0,0,0,0,11,3],
            [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3]
        ];

        this.particles = [];
        this.floatingTexts = [];
        this.beams = [];
        this.treeRestorationPct = 0;
    }

    clear() {
        this.ctx.fillStyle = '#0f172a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    renderMap() {
        for (let r = 0; r < this.map.length; r++) {
            for (let c = 0; c < this.map[r].length; c++) {
                const tileType = this.map[r][c];
                const x = c * this.tileSize;
                const y = r * this.tileSize;

                this.drawTile(tileType, x, y);
            }
        }

        // Draw Lexaris Tree Centerpiece (144x144 px)
        this.drawLexarisTree(8 * this.tileSize + 24, 2 * this.tileSize + 24);

        // Draw Connecting Magic Beams
        this.drawBeams();
    }

    drawTile(type, x, y) {
        const ctx = this.ctx;
        const s = this.tileSize;

        switch (type) {
            case 0: // Grass
                ctx.fillStyle = '#1e824c';
                ctx.fillRect(x, y, s, s);
                ctx.fillStyle = '#27ae60';
                ctx.fillRect(x + 6, y + 6, 4, 4);
                ctx.fillRect(x + 28, y + 22, 4, 4);
                break;
            case 1: // River with Waves
                ctx.fillStyle = '#2980b9';
                ctx.fillRect(x, y, s, s);
                ctx.fillStyle = '#3498db';
                const waveOffset = Math.sin(Date.now() / 300 + x) * 6;
                ctx.fillRect(x + (Date.now() / 250 % 24), y + 16 + waveOffset, 16, 3);
                ctx.fillStyle = '#ecf0f1';
                ctx.fillRect(x + (Date.now() / 350 % 30), y + 4, 6, 2);
                break;
            case 2: // Stone Path
                ctx.fillStyle = '#7f8c8d';
                ctx.fillRect(x, y, s, s);
                ctx.fillStyle = '#95a5a6';
                ctx.fillRect(x + 3, y + 3, s - 6, s - 6);
                ctx.fillStyle = '#bdc3c7';
                ctx.fillRect(x + 6, y + 6, 12, 12);
                ctx.fillRect(x + 24, y + 24, 14, 14);
                break;
            case 3: // Outer Wall
                ctx.fillStyle = '#1e272e';
                ctx.fillRect(x, y, s, s);
                ctx.fillStyle = '#34495e';
                ctx.fillRect(x + 3, y + 3, s - 6, s - 10);
                ctx.fillStyle = '#16a085';
                ctx.fillRect(x + 6, y + 6, 8, 18);
                break;
            case 4: // Ancient Tree
                ctx.fillStyle = '#1e824c';
                ctx.fillRect(x, y, s, s);
                ctx.fillStyle = '#5d4037';
                ctx.fillRect(x + 18, y + 30, 12, 18);
                ctx.fillStyle = '#27ae60';
                ctx.beginPath();
                ctx.arc(x + 24, y + 18, 20, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 5: // Wooden Bridge over River
                ctx.fillStyle = '#d35400';
                ctx.fillRect(x, y, s, s);
                ctx.fillStyle = '#e67e22';
                ctx.fillRect(x, y + 4, s, 6);
                ctx.fillRect(x, y + 38, s, 6);
                break;
            case 6: // Sacred Platform
                ctx.fillStyle = '#2c3e50';
                ctx.fillRect(x, y, s, s);
                ctx.fillStyle = '#00fff5';
                ctx.fillRect(x + 20, y + 20, 8, 8);
                break;
            case 7: // Red Flowers
                ctx.fillStyle = '#1e824c';
                ctx.fillRect(x, y, s, s);
                ctx.fillStyle = '#e74c3c';
                ctx.fillRect(x + 8, y + 8, 6, 6);
                ctx.fillRect(x + 30, y + 24, 6, 6);
                break;
            case 8: // Blue Mana Flowers
                ctx.fillStyle = '#1e824c';
                ctx.fillRect(x, y, s, s);
                ctx.fillStyle = '#00fff5';
                ctx.fillRect(x + 12, y + 14, 8, 8);
                break;
            case 9: // Lotus
                ctx.fillStyle = '#2980b9';
                ctx.fillRect(x, y, s, s);
                ctx.fillStyle = '#27ae60';
                ctx.beginPath();
                ctx.arc(x + 24, y + 24, 14, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#ff7675';
                ctx.fillRect(x + 20, y + 20, 8, 8);
                break;
            case 10: // Lantern Post
                ctx.fillStyle = '#1e824c';
                ctx.fillRect(x, y, s, s);
                ctx.fillStyle = '#5d4037';
                ctx.fillRect(x + 21, y + 14, 6, 34);
                ctx.fillStyle = '#f1c40f';
                ctx.beginPath();
                ctx.arc(x + 24, y + 14, 9, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 11: // Red Banner
                ctx.fillStyle = '#1e824c';
                ctx.fillRect(x, y, s, s);
                ctx.fillStyle = '#c0392b';
                ctx.fillRect(x + 18, y + 6, 12, 36);
                ctx.fillStyle = '#f1c40f';
                ctx.fillRect(x + 21, y + 12, 6, 6);
                break;
        }
    }

    drawLexarisTree(x, y) {
        const ctx = this.ctx;
        const width = 144;
        const height = 144;

        const pulse = Math.sin(Date.now() / 250) * 8;
        const glowRadius = 50 + (this.treeRestorationPct / 100) * 60;

        ctx.save();

        const auraColor = this.treeRestorationPct >= 100 ? 'rgba(255, 234, 167, 0.45)' : 
                          this.treeRestorationPct > 50 ? 'rgba(0, 255, 245, 0.35)' : 'rgba(255, 255, 255, 0.15)';
        
        ctx.fillStyle = auraColor;
        ctx.beginPath();
        ctx.arc(x + width/2, y + height/2, glowRadius + pulse, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#4e342e';
        ctx.fillRect(x + 54, y + 60, 36, 78);

        ctx.fillStyle = '#3e2723';
        ctx.fillRect(x + 42, y + 118, 60, 20);

        let leafColor = '#78909c';
        if (this.treeRestorationPct >= 100) leafColor = '#f1c40f';
        else if (this.treeRestorationPct >= 75) leafColor = '#2ecc71';
        else if (this.treeRestorationPct >= 35) leafColor = '#00fff5';
        else if (this.treeRestorationPct > 0) leafColor = '#9b59b6';

        ctx.fillStyle = leafColor;
        ctx.beginPath();
        ctx.arc(x + width/2, y + 42, 54, 0, Math.PI * 2);
        ctx.arc(x + 26, y + 70, 36, 0, Math.PI * 2);
        ctx.arc(x + 118, y + 70, 36, 0, Math.PI * 2);
        ctx.fill();

        if (this.treeRestorationPct > 0 && Math.random() < 0.4) {
            this.addParticle(x + Math.random() * width, y + Math.random() * height, leafColor);
        }

        ctx.fillStyle = '#ffffff';
        ctx.font = '16px Press Start 2P';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 5;
        ctx.fillText('🌳 LEXARIS', x + width/2, y - 16);

        ctx.fillStyle = leafColor;
        ctx.font = '18px VT323';
        ctx.fillText(`Cội Nguồn Khai Minh: ${Math.round(this.treeRestorationPct)}%`, x + width/2, y + 154);
        ctx.restore();
    }

    drawShard(shard) {
        if (shard.collected) return;

        const ctx = this.ctx;
        const x = shard.x * this.tileSize + 12;
        const y = shard.y * this.tileSize + 12;
        const pulse = Math.sin(Date.now() / 200 + shard.id) * 5;

        ctx.fillStyle = 'rgba(0, 255, 245, 0.5)';
        ctx.beginPath();
        ctx.arc(x + 12, y + 12, 18 + pulse, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = '24px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(shard.icon, x + 12, y + 20);
    }

    drawInteractionPrompt(x, y, labelText) {
        const ctx = this.ctx;
        const bounce = Math.sin(Date.now() / 180) * 4;

        ctx.save();
        ctx.fillStyle = '#ff0055';
        ctx.fillRect(x - 30, y - 30 + bounce, 60, 22);

        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Press Start 2P';
        ctx.textAlign = 'center';
        ctx.fillText('[E]', x, y - 14 + bounce);

        ctx.fillStyle = '#ffeaa7';
        ctx.font = '15px Pixelify Sans';
        ctx.fillText(labelText, x, y - 36 + bounce);

        ctx.restore();
    }

    addParticle(x, y, color = '#00fff5') {
        this.particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 3,
            vy: (Math.random() - 0.5) * 3 - 1,
            life: 30,
            color: color
        });
    }

    addDustParticle(x, y) {
        this.particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 1.5,
            vy: -0.5,
            life: 15,
            color: 'rgba(236, 240, 241, 0.6)'
        });
    }

    addFloatingText(x, y, text, color = '#ffeaa7') {
        this.floatingTexts.push({
            x: x,
            y: y,
            text: text,
            color: color,
            life: 60
        });
    }

    triggerBeam(startX, startY, targetX, targetY) {
        this.beams.push({
            startX: startX,
            startY: startY,
            targetX: targetX,
            targetY: targetY,
            life: 40
        });
    }

    drawBeams() {
        for (let i = this.beams.length - 1; i >= 0; i--) {
            const b = this.beams[i];
            this.ctx.strokeStyle = '#00fff5';
            this.ctx.lineWidth = 4;
            this.ctx.beginPath();
            this.ctx.moveTo(b.startX, b.startY);
            this.ctx.lineTo(b.targetX, b.targetY);
            this.ctx.stroke();
            b.life--;
            if (b.life <= 0) this.beams.splice(i, 1);
        }
    }

    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life--;

            this.ctx.fillStyle = p.color;
            this.ctx.fillRect(p.x, p.y, 4, 4);

            if (p.life <= 0) this.particles.splice(i, 1);
        }

        for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
            const ft = this.floatingTexts[i];
            ft.y -= 0.9;
            ft.life--;

            this.ctx.fillStyle = ft.color;
            this.ctx.font = '18px Pixelify Sans';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(ft.text, ft.x, ft.y);

            if (ft.life <= 0) this.floatingTexts.splice(i, 1);
        }
    }

    // Safe Collision Check: ONLY Outer Wall (3), Dense Forest Tree (4), Deep Water (1) are solid!
    isSolid(x, y) {
        const col = Math.floor(x / this.tileSize);
        const row = Math.floor(y / this.tileSize);

        if (row < 0 || row >= this.map.length || col < 0 || col >= this.map[0].length) {
            return true;
        }

        const tile = this.map[row][col];
        return tile === 1 || tile === 3 || tile === 4;
    }
}
