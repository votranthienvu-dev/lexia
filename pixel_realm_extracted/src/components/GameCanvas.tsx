import React, { useRef, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { PixelRenderer } from '../utils/pixelRenderer';

export const GameCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const keysPressed = useRef<{ [key: string]: boolean }>({});

  const {
    playerX,
    playerY,
    playerDirection,
    playerState,
    appearance,
    equipment,
    currentZone,
    monsters,
    resourceNodes,
    npcs,
    projectiles,
    floatingTexts,
    particles,
    gameTimeHours,
    movePlayer,
    performAction,
    interactNearest,
    setActiveModal,
    activeModal,
    activeHotbarIndex,
    setActiveHotbarIndex,
    animTick
  } = useGame();

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture when typing in inputs
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return;

      keysPressed.current[e.key.toLowerCase()] = true;

      // Modal toggles
      if (e.key === 'i' || e.key === 'I') {
        setActiveModal(activeModal === 'inventory' ? null : 'inventory');
      } else if (e.key === 'c' || e.key === 'C') {
        setActiveModal(activeModal === 'character' ? null : 'character');
      } else if (e.key === 'q' || e.key === 'Q') {
        setActiveModal(activeModal === 'quests' ? null : 'quests');
      } else if (e.key === 'm' || e.key === 'M') {
        setActiveModal(activeModal === 'map' ? null : 'map');
      } else if (e.key === 'k' || e.key === 'K') {
        setActiveModal(activeModal === 'crafting' ? null : 'crafting');
      } else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        performAction();
      } else if (e.key === 'e' || e.key === 'E') {
        interactNearest();
      } else if (['1', '2', '3', '4', '5', '6'].includes(e.key)) {
        setActiveHotbarIndex(parseInt(e.key) - 1);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [activeModal, setActiveModal, performAction, interactNearest, setActiveHotbarIndex]);

  // Continuous movement loop from keys
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeModal) return;

      let dx = 0;
      let dy = 0;
      if (keysPressed.current['w'] || keysPressed.current['arrowup']) dy -= 1;
      if (keysPressed.current['s'] || keysPressed.current['arrowdown']) dy += 1;
      if (keysPressed.current['a'] || keysPressed.current['arrowleft']) dx -= 1;
      if (keysPressed.current['d'] || keysPressed.current['arrowright']) dx += 1;

      if (dx !== 0 && dy !== 0) {
        // Normalize diagonal
        dx *= 0.7071;
        dy *= 0.7071;
      }

      if (dx !== 0 || dy !== 0) {
        movePlayer(dx, dy);
      }
    }, 1000 / 60);

    return () => clearInterval(interval);
  }, [activeModal, movePlayer]);

  // Render Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Viewport sizing
    const vw = canvas.width;
    const vh = canvas.height;

    // Camera follow player smoothly
    const cameraX = Math.max(0, Math.min(currentZone.width - vw, playerX - vw / 2));
    const cameraY = Math.max(0, Math.min(currentZone.height - vh, playerY - vh / 2));

    ctx.save();
    ctx.imageSmoothingEnabled = false;

    // Clear Canvas
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, vw, vh);

    // Apply Camera Transform
    ctx.translate(-Math.floor(cameraX), -Math.floor(cameraY));

    // --- 1. DRAW MAP TILES ---
    const tileSize = 32;
    const startCol = Math.max(0, Math.floor(cameraX / tileSize));
    const endCol = Math.min(currentZone.tiles[0].length, Math.ceil((cameraX + vw) / tileSize) + 1);
    const startRow = Math.max(0, Math.floor(cameraY / tileSize));
    const endRow = Math.min(currentZone.tiles.length, Math.ceil((cameraY + vh) / tileSize) + 1);

    for (let r = startRow; r < endRow; r++) {
      for (let c = startCol; c < endCol; c++) {
        const tileType = currentZone.tiles[r]?.[c];
        const tx = c * tileSize;
        const ty = r * tileSize;

        if (tileType === 0) {
          // Lush Grass
          ctx.fillStyle = (r + c) % 2 === 0 ? '#15803d' : '#16a34a';
          ctx.fillRect(tx, ty, tileSize, tileSize);
          // Subtle grass blade details
          if ((r * 7 + c * 13) % 5 === 0) {
            ctx.fillStyle = '#22c55e';
            ctx.fillRect(tx + 8, ty + 12, 2, 4);
            ctx.fillRect(tx + 20, ty + 18, 2, 4);
          }
        } else if (tileType === 1) {
          // Dirt Path
          ctx.fillStyle = '#92400e';
          ctx.fillRect(tx, ty, tileSize, tileSize);
          ctx.fillStyle = '#78350f';
          ctx.fillRect(tx + 4, ty + 6, 4, 3);
          ctx.fillRect(tx + 18, ty + 20, 5, 3);
        } else if (tileType === 2) {
          // Stone Cobblestone
          ctx.fillStyle = '#64748b';
          ctx.fillRect(tx, ty, tileSize, tileSize);
          ctx.strokeStyle = '#475569';
          ctx.lineWidth = 1;
          ctx.strokeRect(tx + 1, ty + 1, tileSize - 2, tileSize - 2);
          ctx.fillStyle = '#94a3b8';
          ctx.fillRect(tx + 3, ty + 3, 6, 4);
        } else if (tileType === 3) {
          // Sparkling Water
          ctx.fillStyle = '#0284c7';
          ctx.fillRect(tx, ty, tileSize, tileSize);
          // Water ripples
          const wave = Math.sin((animTick * 0.05) + (r + c)) * 4;
          ctx.fillStyle = '#38bdf8';
          ctx.fillRect(tx + 6 + wave, ty + 12, 10, 2);
          ctx.fillRect(tx + 14 - wave, ty + 22, 8, 2);
        } else if (tileType === 4) {
          // Dark Mine Rock
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(tx, ty, tileSize, tileSize);
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(tx + 2, ty + 4, 8, 8);
        } else if (tileType === 5) {
          // Wood Floor
          ctx.fillStyle = '#b45309';
          ctx.fillRect(tx, ty, tileSize, tileSize);
          ctx.strokeStyle = '#78350f';
          ctx.strokeRect(tx, ty, tileSize, tileSize);
        } else if (tileType === 6) {
          // Stone Brick Wall
          ctx.fillStyle = '#334155';
          ctx.fillRect(tx, ty, tileSize, tileSize);
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(tx, ty + 14, tileSize, 2);
          ctx.fillRect(tx + 14, ty, 2, tileSize);
        }
      }
    }

    // --- 2. DRAW PORTALS ---
    currentZone.portals.forEach(portal => {
      const pGlow = Math.sin(animTick * 0.1) * 3;
      ctx.fillStyle = 'rgba(56, 189, 248, 0.3)';
      ctx.beginPath();
      ctx.arc(portal.x, portal.y, 22 + pGlow, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.arc(portal.x, portal.y, 16, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#e0f2fe';
      ctx.beginPath();
      ctx.arc(portal.x, portal.y, 8, 0, Math.PI * 2);
      ctx.fill();

      // Portal Label
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(portal.name, portal.x, portal.y - 24);
    });

    // --- 3. DRAW RESOURCE NODES ---
    resourceNodes.forEach(node => {
      if (node.hp > 0) {
        PixelRenderer.drawResourceNode(ctx, node.x, node.y, node.type, node.hp, node.maxHp, animTick);
      }
    });

    // --- 4. DRAW MONSTERS ---
    monsters.forEach(m => {
      if (!m.isDead) {
        PixelRenderer.drawMonster(ctx, m.x, m.y, m, animTick);
      }
    });

    // --- 5. DRAW NPCS ---
    npcs.forEach(npc => {
      PixelRenderer.drawNPC(ctx, npc.x, npc.y, npc, animTick);
    });

    // --- 6. DRAW PLAYER ---
    PixelRenderer.drawHumanCharacter(
      ctx,
      playerX,
      playerY,
      1.5,
      appearance,
      equipment,
      playerDirection,
      playerState,
      animTick,
      true
    );

    // --- 7. DRAW PROJECTILES ---
    projectiles.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

      // Glowing tail
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.beginPath();
      ctx.arc(p.x - p.vx * 0.8, p.y - p.vy * 0.8, p.size * 0.6, 0, Math.PI * 2);
      ctx.fill();
    });

    // --- 8. DRAW PARTICLES ---
    particles.forEach(p => {
      ctx.fillStyle = p.color;
      if (p.shape === 'leaf') {
        ctx.fillRect(p.x, p.y, p.size + 1, p.size);
      } else if (p.shape === 'spark') {
        ctx.fillRect(p.x - 1, p.y - 1, 3, 3);
      } else {
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }
    });

    // --- 9. DRAW FLOATING COMBAT TEXTS ---
    floatingTexts.forEach(ft => {
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';
      // Text drop shadow
      ctx.fillStyle = '#000000';
      ctx.fillText(ft.text, ft.x + 1, ft.y + 1);
      ctx.fillStyle = ft.color;
      ctx.fillText(ft.text, ft.x, ft.y);
    });

    // --- 10. DYNAMIC LIGHTING / DAY-NIGHT OVERLAY ---
    // Compute ambient daylight (0.0 to 1.0)
    // 6am to 6pm daylight, night otherwise
    const hour = gameTimeHours;
    let dayRatio = 1.0;
    if (hour < 5 || hour > 21) {
      dayRatio = 0.25; // Deep Night
    } else if (hour >= 5 && hour <= 7) {
      dayRatio = 0.25 + ((hour - 5) / 2) * 0.75; // Dawn
    } else if (hour >= 18 && hour <= 21) {
      dayRatio = 1.0 - ((hour - 18) / 3) * 0.75; // Dusk
    }

    // Multiply by zone ambient
    const effectiveLight = Math.max(0.2, dayRatio * currentZone.ambientLight);

    if (effectiveLight < 0.9) {
      const darkness = 1.0 - effectiveLight;
      ctx.fillStyle = `rgba(10, 15, 30, ${darkness * 0.85})`;

      // Create torch light halo around player
      const lightRadius = equipment.offhand?.id.includes('torch') ? 140 : 85;
      const gradient = ctx.createRadialGradient(playerX, playerY, 15, playerX, playerY, lightRadius);
      gradient.addColorStop(0, 'rgba(255, 220, 150, 0)');
      gradient.addColorStop(0.7, 'rgba(255, 200, 100, 0.2)');
      gradient.addColorStop(1, `rgba(10, 15, 30, ${darkness * 0.85})`);

      // Light cut-out mask
      ctx.save();
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(playerX, playerY, lightRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.restore();
  }, [
    playerX,
    playerY,
    playerDirection,
    playerState,
    appearance,
    equipment,
    currentZone,
    monsters,
    resourceNodes,
    npcs,
    projectiles,
    floatingTexts,
    particles,
    gameTimeHours,
    animTick
  ]);

  return (
    <div id="game-canvas-container" className="relative w-full h-full flex items-center justify-center bg-slate-950 select-none overflow-hidden">
      <canvas
        id="rpg-viewport-canvas"
        ref={canvasRef}
        width={960}
        height={600}
        className="rounded-xl shadow-2xl border border-slate-800 bg-slate-900 cursor-crosshair max-w-full max-h-full object-contain"
        onClick={() => performAction()}
      />
    </div>
  );
};
