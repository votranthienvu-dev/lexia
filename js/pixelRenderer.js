// LexiQuest Pixel Renderer - Extracted & Ported from pixel-realm-rpg.zip


// Helper to draw a pixel grid or scaled pixel rects
class PixelRenderer {

  /**
   * Draws a complete detailed human pixel art character on a canvas context
   */
  static drawHumanCharacter(
    ctx,
    x,
    y,
    scale,
    appearance,
    equipment,
    direction,
    state,
    animTick,
    isPlayer = true
  ) {
    ctx.save();
    ctx.imageSmoothingEnabled = false;

    // Center coordinates
    ctx.translate(Math.floor(x), Math.floor(y));
    ctx.scale(scale, scale);

    // Animation frame timing
    const walkFrame = state === 'walk' ? Math.floor((animTick / 6) % 4) : 0;
    const idleBob = state === 'idle' ? (Math.sin(animTick * 0.08) > 0 ? 1 : 0) : 0;
    const attackProgress = state === 'attack' || state === 'gather' ? ((animTick % 12) / 12) : 0;
    const castGlow = state === 'cast' ? (Math.sin(animTick * 0.2) * 0.5 + 0.5) : 0;

    // Render layers in depth order depending on direction
    const isUp = direction === 'up';
    const isDown = direction === 'down';
    const isLeft = direction === 'left';
    const isRight = direction === 'right';
    const isSide = isLeft || isRight;

    // Flip horizontally if facing left
    if (isLeft) {
      ctx.scale(-1, 1);
    }

    // --- 1. SHADOW ---
    ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
    ctx.beginPath();
    ctx.ellipse(0, 14, 7, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // --- 2. BACK LAYER (Cape, Quiver, Staves/Shields on back when facing up) ---
    if (isUp) {
      this.drawWeapon(ctx, equipment.weapon, 'up', attackProgress, state);
      this.drawShield(ctx, equipment.offhand, 'up', state);
    }

    // Flowing Cape / Scholar Mantle
    const hasCape = appearance.capeStyle === 'scholar_mantle' || 
                    appearance.capeStyle === 'royal_cape' ||
                    equipment.armor?.id.includes('scholar') ||
                    equipment.armor?.id.includes('robe') ||
                    equipment.armor?.id.includes('shadow') || 
                    equipment.armor?.id.includes('paladin');

    if (hasCape) {
      const capeWave = Math.sin(animTick * 0.12) * 2;
      const capeColor = equipment.armor?.id.includes('shadow') ? '#2e1065' : 
                        (equipment.armor?.id.includes('paladin') ? '#b91c1c' : 
                        (equipment.armor?.id.includes('scholar') || appearance.capeStyle === 'scholar_mantle' ? '#1e3a8a' : '#1e40af'));
      const capeHighlight = this.shadeColor(capeColor, 30);
      const capeGold = '#fbbf24';

      if (isUp) {
        // Full flowing cape from back
        ctx.fillStyle = capeColor;
        ctx.fillRect(-6, -2 + idleBob, 12, 14);
        ctx.fillRect(-7, 4 + idleBob, 14, 9 + Math.floor(capeWave * 0.5));
        // Gold embroidered hem
        ctx.fillStyle = capeGold;
        ctx.fillRect(-7, 12 + idleBob + Math.floor(capeWave * 0.5), 14, 1);
        ctx.fillStyle = capeHighlight;
        ctx.fillRect(-4, -1 + idleBob, 8, 2);
      } else if (isSide) {
        // Side fluttering mantle
        ctx.fillStyle = capeColor;
        ctx.fillRect(-5 + capeWave * 0.4, -1 + idleBob, 4, 13);
        ctx.fillStyle = capeGold;
        ctx.fillRect(-5 + capeWave * 0.4, 11 + idleBob, 4, 1);
      } else if (isDown) {
        // Front shoulder capelet / mantle tips visible behind shoulders
        ctx.fillStyle = capeColor;
        ctx.fillRect(-6, -2 + idleBob, 2, 8);
        ctx.fillRect(4, -2 + idleBob, 2, 8);
        ctx.fillStyle = capeGold;
        ctx.fillRect(-6, 5 + idleBob, 2, 1);
        ctx.fillRect(4, 5 + idleBob, 2, 1);
      }
    }

    // --- 3. LEGS & FEET (Detailed boots, walking cycle) ---
    let legOffsetL = 0;
    let legOffsetR = 0;
    if (state === 'walk') {
      if (walkFrame === 1) {
        legOffsetL = -2;
        legOffsetR = 2;
      } else if (walkFrame === 3) {
        legOffsetL = 2;
        legOffsetR = -2;
      }
    }

    const pantsColor = appearance.pantsColor || '#1e293b';
    const pantsShadow = this.shadeColor(pantsColor, -25);
    const skinColor = appearance.skinColor || '#fcd34d';
    const shoesColor = equipment.boots ? (equipment.boots.color || '#78350f') : (appearance.shoesColor || '#451a03');
    const shoesHighlight = this.shadeColor(shoesColor, 25);

    if (isDown || isUp) {
      // Left Leg
      ctx.fillStyle = pantsColor;
      ctx.fillRect(-4, 5 + idleBob + (isUp ? 0 : legOffsetL), 3, 5);
      ctx.fillStyle = pantsShadow;
      ctx.fillRect(-4, 5 + idleBob + (isUp ? 0 : legOffsetL), 1, 5);

      // Right Leg
      ctx.fillStyle = pantsColor;
      ctx.fillRect(1, 5 + idleBob + (isUp ? 0 : legOffsetR), 3, 5);
      ctx.fillStyle = pantsShadow;
      ctx.fillRect(3, 5 + idleBob + (isUp ? 0 : legOffsetR), 1, 5);

      // Left Boot / Foot
      ctx.fillStyle = shoesColor;
      ctx.fillRect(-5, 9 + idleBob + legOffsetL, 4, 4);
      ctx.fillStyle = shoesHighlight;
      ctx.fillRect(-5, 9 + idleBob + legOffsetL, 4, 1);
      // Boot toe
      if (isDown) {
        ctx.fillStyle = shoesColor;
        ctx.fillRect(-5, 12 + idleBob + legOffsetL, 4, 2);
      }

      // Right Boot / Foot
      ctx.fillStyle = shoesColor;
      ctx.fillRect(1, 9 + idleBob + legOffsetR, 4, 4);
      ctx.fillStyle = shoesHighlight;
      ctx.fillRect(1, 9 + idleBob + legOffsetR, 4, 1);
      if (isDown) {
        ctx.fillStyle = shoesColor;
        ctx.fillRect(1, 12 + idleBob + legOffsetR, 4, 2);
      }
    } else {
      // Side legs
      ctx.fillStyle = pantsShadow;
      ctx.fillRect(-2 + legOffsetL, 5 + idleBob, 3, 5);
      ctx.fillStyle = pantsColor;
      ctx.fillRect(-1 + legOffsetR, 5 + idleBob, 3, 5);

      // Boots
      ctx.fillStyle = this.shadeColor(shoesColor, -20);
      ctx.fillRect(-3 + legOffsetL, 9 + idleBob, 4, 4);
      ctx.fillRect(-3 + legOffsetL, 12 + idleBob, 5, 2);

      ctx.fillStyle = shoesColor;
      ctx.fillRect(-2 + legOffsetR, 9 + idleBob, 4, 4);
      ctx.fillStyle = shoesHighlight;
      ctx.fillRect(-2 + legOffsetR, 9 + idleBob, 4, 1);
      ctx.fillStyle = shoesColor;
      ctx.fillRect(-2 + legOffsetR, 12 + idleBob, 5, 2);
    }

    // --- 4. TORSO & CLOTHING / ARMOR ---
    const shirtColor = equipment.armor ? (equipment.armor.color || '#1e40af') : (appearance.shirtColor || '#1e3a8a');
    const shirtHighlight = this.shadeColor(shirtColor, 20);
    const shirtShadow = this.shadeColor(shirtColor, -30);
    const gold = '#fbbf24';

    if (isDown || isUp) {
      // Torso Base
      ctx.fillStyle = shirtColor;
      ctx.fillRect(-4, -2 + idleBob, 8, 8);

      // Shading / Depth
      ctx.fillStyle = shirtHighlight;
      ctx.fillRect(-3, -2 + idleBob, 6, 2);
      ctx.fillStyle = shirtShadow;
      ctx.fillRect(-4, 4 + idleBob, 8, 2);

      // Scholar High Collar & Cravat / Jabot (When facing down)
      if (isDown) {
        // High collar sides
        ctx.fillStyle = shirtHighlight;
        ctx.fillRect(-4, -3 + idleBob, 2, 3);
        ctx.fillRect(2, -3 + idleBob, 2, 3);

        // White / Silk Cravat / Jabot
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-1, -2 + idleBob, 2, 4);
        ctx.fillRect(-2, -1 + idleBob, 4, 2);
        // Cravat gold brooch
        ctx.fillStyle = gold;
        ctx.fillRect(-1, -1 + idleBob, 2, 1);
        ctx.fillStyle = '#38bdf8'; // Brooch sapphire
        ctx.fillRect(0, -1 + idleBob, 1, 1);

        // Double-breasted scholar vest buttons
        ctx.fillStyle = gold;
        ctx.fillRect(-2, 2 + idleBob, 1, 1);
        ctx.fillRect(1, 2 + idleBob, 1, 1);
      }

      // Belt with gold buckle & scroll pouch
      ctx.fillStyle = '#451a03';
      ctx.fillRect(-4, 3 + idleBob, 8, 2);
      ctx.fillStyle = gold;
      ctx.fillRect(-1, 3 + idleBob, 2, 2);
      if (isDown) {
        // Hip scroll / leather book pouch
        ctx.fillStyle = '#78350f';
        ctx.fillRect(3, 3 + idleBob, 2, 3);
        ctx.fillStyle = '#fef08a'; // Parchment roll top
        ctx.fillRect(3, 2 + idleBob, 2, 1);
      }

      // Armor plates or trims if equipped
      if (equipment.armor) {
        this.drawArmorOverlay(ctx, equipment.armor, isUp ? 'up' : 'down', idleBob);
      }
    } else {
      // Side Torso
      ctx.fillStyle = shirtColor;
      ctx.fillRect(-3, -2 + idleBob, 6, 8);
      ctx.fillStyle = shirtHighlight;
      ctx.fillRect(-2, -2 + idleBob, 3, 3);
      ctx.fillStyle = shirtShadow;
      ctx.fillRect(-3, 3 + idleBob, 6, 3);

      // Collar
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(1, -2 + idleBob, 2, 3);
      ctx.fillStyle = gold;
      ctx.fillRect(1, -1 + idleBob, 1, 1);

      // Belt & hip scroll
      ctx.fillStyle = '#451a03';
      ctx.fillRect(-3, 3 + idleBob, 6, 2);
      ctx.fillStyle = gold;
      ctx.fillRect(1, 3 + idleBob, 2, 2);
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-2, 3 + idleBob, 2, 3);
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(-2, 2 + idleBob, 2, 1);

      if (equipment.armor) {
        this.drawArmorOverlay(ctx, equipment.armor, 'side', idleBob);
      }
    }

    // --- 5. HEAD, FACE, EYES & HAIR ---
    const headBob = idleBob;
    const skinHighlight = this.shadeColor(skinColor, 15);
    const skinShadow = this.shadeColor(skinColor, -25);

    if (isDown) {
      // Neck
      ctx.fillStyle = skinShadow;
      ctx.fillRect(-1, -3 + headBob, 2, 2);

      // Head Base (Refined Handsome Oval Shape)
      ctx.fillStyle = skinColor;
      ctx.fillRect(-4, -11 + headBob, 8, 8);
      ctx.fillRect(-5, -10 + headBob, 10, 6); // Cheeks / ears

      // Face Highlight & Shadow (Handsome bone structure)
      ctx.fillStyle = skinHighlight;
      ctx.fillRect(-3, -11 + headBob, 6, 2); // Forehead
      ctx.fillRect(-3, -7 + headBob, 1, 1); // Cheekbone light
      ctx.fillRect(2, -7 + headBob, 1, 1);
      ctx.fillStyle = skinShadow;
      ctx.fillRect(-4, -4 + headBob, 8, 1); // Jawline shadow

      // Ears
      ctx.fillStyle = skinColor;
      ctx.fillRect(-6, -8 + headBob, 1, 3);
      ctx.fillRect(5, -8 + headBob, 1, 3);

      // Eyes (Handsome expressive anime/scholar eyes with multi-layer depth & glints)
      const isBlinking = (animTick % 120) > 114;
      if (isBlinking) {
        // Elegant closed eyelid with lash line
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(-3, -7 + headBob, 2, 1);
        ctx.fillRect(1, -7 + headBob, 2, 1);
      } else {
        // Upper eyelash contour
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-3, -9 + headBob, 3, 1);
        ctx.fillRect(1, -9 + headBob, 3, 1);

        // Eye whites (sclera)
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-3, -8 + headBob, 2, 2);
        ctx.fillRect(1, -8 + headBob, 2, 2);

        // Iris / Pupil with deep gradation
        const eyeBase = appearance.eyeColor || '#0284c7';
        const eyeLight = this.shadeColor(eyeBase, 30);
        ctx.fillStyle = eyeBase;
        ctx.fillRect(-3, -8 + headBob, 2, 2);
        ctx.fillRect(1, -8 + headBob, 2, 2);

        ctx.fillStyle = eyeLight;
        ctx.fillRect(-3, -7 + headBob, 1, 1);
        ctx.fillRect(1, -7 + headBob, 1, 1);

        // Eye Glint (Micro sparkle twinkle)
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-3, -8 + headBob, 1, 1);
        ctx.fillRect(1, -8 + headBob, 1, 1);

        // Eyebrows (Refined intellectual slant)
        ctx.fillStyle = this.shadeColor(appearance.hairColor || '#78350f', -20);
        ctx.fillRect(-3, -10 + headBob, 3, 1);
        ctx.fillRect(1, -10 + headBob, 3, 1);
      }

      // Nose shadow & gentle mouth
      ctx.fillStyle = skinShadow;
      ctx.fillRect(0, -6 + headBob, 1, 1); // Nose tip
      ctx.fillStyle = '#be123c';
      ctx.fillRect(-1, -4 + headBob, 2, 1); // Subtle handsome lips

      // Eyewear (Monocle, Spectacles, Circlet)
      const eyewear = appearance.eyewear || 'monocle';
      if (eyewear === 'monocle') {
        // Golden circular frame on right eye
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(0, -9 + headBob, 4, 1);
        ctx.fillRect(0, -6 + headBob, 4, 1);
        ctx.fillRect(0, -8 + headBob, 1, 2);
        ctx.fillRect(3, -8 + headBob, 1, 2);
        // Azure glass sheen
        ctx.fillStyle = 'rgba(186, 230, 253, 0.7)';
        ctx.fillRect(1, -8 + headBob, 2, 2);
        // Golden chain hanging down to collar
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(4, -7 + headBob, 1, 2);
        ctx.fillRect(3, -5 + headBob, 1, 2);
        ctx.fillRect(2, -3 + headBob, 1, 2);
      } else if (eyewear === 'spectacles') {
        // Scholar round glasses across both eyes
        ctx.fillStyle = '#fbbf24';
        // Left rim
        ctx.fillRect(-4, -9 + headBob, 3, 1);
        ctx.fillRect(-4, -6 + headBob, 3, 1);
        ctx.fillRect(-4, -8 + headBob, 1, 2);
        ctx.fillRect(-1, -8 + headBob, 1, 2);
        // Nose bridge
        ctx.fillRect(-1, -8 + headBob, 2, 1);
        // Right rim
        ctx.fillRect(1, -9 + headBob, 3, 1);
        ctx.fillRect(1, -6 + headBob, 3, 1);
        ctx.fillRect(1, -8 + headBob, 1, 2);
        ctx.fillRect(3, -8 + headBob, 1, 2);
        // Glass sheen
        ctx.fillStyle = 'rgba(186, 230, 253, 0.5)';
        ctx.fillRect(-3, -8 + headBob, 2, 2);
        ctx.fillRect(1, -8 + headBob, 2, 2);
      } else if (eyewear === 'scholar_circlet') {
        // Golden laurel / astral circlet on forehead
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(-4, -10 + headBob, 8, 1);
        ctx.fillStyle = '#38bdf8'; // Center star gem
        ctx.fillRect(-1, -11 + headBob, 2, 2);
      }

      // Facial hair if any
      if (appearance.facialHair === 'beard') {
        ctx.fillStyle = appearance.hairColor || '#78350f';
        ctx.fillRect(-3, -4 + headBob, 6, 2);
        ctx.fillRect(-2, -2 + headBob, 4, 1);
      } else if (appearance.facialHair === 'stubble') {
        ctx.fillStyle = 'rgba(70, 40, 20, 0.4)';
        ctx.fillRect(-3, -4 + headBob, 6, 2);
      }

      // Hair (Rendered on top of forehead)
      this.drawHair(ctx, appearance.hairStyle, appearance.hairColor, 'down', headBob);

      // Helmet (if equipped)
      if (equipment.helmet) {
        this.drawHelmet(ctx, equipment.helmet, 'down', headBob);
      }

    } else if (isUp) {
      // Head back
      ctx.fillStyle = skinShadow;
      ctx.fillRect(-4, -11 + headBob, 8, 8);
      ctx.fillRect(-5, -10 + headBob, 10, 6);

      // Hair (Full back)
      this.drawHair(ctx, appearance.hairStyle, appearance.hairColor, 'up', headBob);

      if (equipment.helmet) {
        this.drawHelmet(ctx, equipment.helmet, 'up', headBob);
      }

    } else {
      // Side Profile Face
      ctx.fillStyle = skinColor;
      ctx.fillRect(-3, -11 + headBob, 7, 8);
      ctx.fillRect(4, -8 + headBob, 1, 2); // Nose profile jut

      // Eye
      const isBlinking = (animTick % 120) > 114;
      if (!isBlinking) {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(1, -9 + headBob, 3, 1); // Eyelash
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(1, -8 + headBob, 2, 2);
        ctx.fillStyle = appearance.eyeColor || '#0284c7';
        ctx.fillRect(2, -8 + headBob, 1, 2);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(2, -8 + headBob, 1, 1);

        ctx.fillStyle = this.shadeColor(appearance.hairColor || '#78350f', -20);
        ctx.fillRect(1, -10 + headBob, 3, 1);
      } else {
        ctx.fillStyle = skinShadow;
        ctx.fillRect(1, -7 + headBob, 2, 1);
      }

      // Side Monocle / Glasses
      if (appearance.eyewear === 'monocle' || appearance.eyewear === 'spectacles') {
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(1, -9 + headBob, 3, 1);
        ctx.fillRect(1, -6 + headBob, 3, 1);
        ctx.fillRect(3, -8 + headBob, 1, 2);
        ctx.fillStyle = 'rgba(186, 230, 253, 0.6)';
        ctx.fillRect(2, -8 + headBob, 1, 2);
      }

      // Mouth
      ctx.fillStyle = '#be123c';
      ctx.fillRect(2, -4 + headBob, 2, 1);

      this.drawHair(ctx, appearance.hairStyle, appearance.hairColor, 'side', headBob);

      if (equipment.helmet) {
        this.drawHelmet(ctx, equipment.helmet, 'side', headBob);
      }
    }

    // --- 6. ARMS, HANDS & WEAPONS (Animated with slash/cast/carry) ---
    this.drawArmsAndWeapons(
      ctx,
      appearance,
      equipment,
      direction,
      state,
      attackProgress,
      idleBob,
      animTick,
      walkFrame
    );

    // --- 7. MAGIC CIRCLE / AURAS (When casting) ---
    if (state === 'cast' || castGlow > 0.1) {
      ctx.save();
      ctx.strokeStyle = `rgba(56, 189, 248, ${0.4 + castGlow * 0.5})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(0, 12, 10 + castGlow * 3, 5 + castGlow * 1.5, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Magic runes floating
      ctx.fillStyle = 'rgba(125, 211, 252, 0.8)';
      for (let i = 0; i < 4; i++) {
        const angle = (animTick * 0.08) + (i * Math.PI * 0.5);
        const rx = Math.cos(angle) * 11;
        const ry = 12 + Math.sin(angle) * 5;
        ctx.fillRect(rx - 1, ry - 1, 2, 2);
      }
      ctx.restore();
    }

    ctx.restore();
  }

  /**
   * Hair Rendering Engine
   */
  static drawHair(
    ctx,
    style,
    color = '#78350f',
    dir,
    bob
  ) {
    const highlight = this.shadeColor(color, 25);
    const shadow = this.shadeColor(color, -30);
    const gold = '#fbbf24';

    ctx.fillStyle = color;

    if (style === 'scholar_parted') {
      // Handsome Intellectual Side-Parted Style
      if (dir === 'down') {
        // Main hair volume
        ctx.fillRect(-5, -14 + bob, 10, 4);
        ctx.fillRect(-6, -12 + bob, 2, 6); // Left sideburn
        ctx.fillRect(4, -12 + bob, 2, 5);  // Right sideburn
        // Front bangs swooping elegantly to one side
        ctx.fillRect(-4, -10 + bob, 4, 3);
        ctx.fillRect(-1, -9 + bob, 3, 2);
        // Highlight sheen across parted hair
        ctx.fillStyle = highlight;
        ctx.fillRect(-3, -14 + bob, 5, 1);
        ctx.fillRect(-3, -11 + bob, 3, 1);
        // Shadow depth
        ctx.fillStyle = shadow;
        ctx.fillRect(-6, -10 + bob, 1, 4);
        ctx.fillRect(4, -10 + bob, 1, 3);
      } else if (dir === 'up') {
        ctx.fillRect(-5, -14 + bob, 10, 8);
        ctx.fillRect(-6, -12 + bob, 1, 6);
        ctx.fillRect(5, -12 + bob, 1, 6);
        ctx.fillStyle = shadow;
        ctx.fillRect(-4, -7 + bob, 8, 2);
        ctx.fillStyle = highlight;
        ctx.fillRect(-3, -14 + bob, 6, 2);
      } else {
        // Side profile
        ctx.fillRect(-4, -14 + bob, 8, 5);
        ctx.fillRect(-5, -12 + bob, 2, 6);
        ctx.fillRect(2, -11 + bob, 3, 3); // Forward bang curve
        ctx.fillStyle = highlight;
        ctx.fillRect(-1, -14 + bob, 4, 1);
      }
    } else if (style === 'scholar_ponytail') {
      // Noble Aristocratic High Scholar Ponytail
      if (dir === 'down') {
        ctx.fillRect(-5, -14 + bob, 10, 4);
        ctx.fillRect(-6, -12 + bob, 2, 7); // Sleek side strands
        ctx.fillRect(4, -12 + bob, 2, 7);
        // Parted front bangs
        ctx.fillRect(-3, -10 + bob, 2, 2);
        ctx.fillRect(1, -10 + bob, 2, 2);
        // Ribbon visible on top-back
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(-2, -15 + bob, 4, 2);
        ctx.fillStyle = gold;
        ctx.fillRect(-1, -15 + bob, 2, 1);
        // Highlight
        ctx.fillStyle = highlight;
        ctx.fillRect(-4, -13 + bob, 8, 1);
      } else if (dir === 'up') {
        ctx.fillRect(-5, -14 + bob, 10, 6);
        // Blue velvet ribbon clasp
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(-2, -12 + bob, 4, 2);
        ctx.fillStyle = gold;
        ctx.fillRect(-1, -12 + bob, 2, 2);
        // Long flowing ponytail
        ctx.fillStyle = color;
        ctx.fillRect(-2, -10 + bob, 4, 10);
        ctx.fillRect(-1, 0 + bob, 2, 4);
        ctx.fillStyle = highlight;
        ctx.fillRect(-1, -9 + bob, 2, 8);
      } else {
        // Side view
        ctx.fillRect(-4, -14 + bob, 8, 5);
        ctx.fillRect(-5, -11 + bob, 2, 6);
        // Ribbon
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(-6, -11 + bob, 2, 2);
        // Flowing tail backwards
        ctx.fillStyle = color;
        ctx.fillRect(-8, -10 + bob, 3, 9);
        ctx.fillRect(-7, -1 + bob, 2, 4);
      }
    } else if (style === 'scholar_messy') {
      // Fashionable academic tousled wavy hair
      if (dir === 'down') {
        ctx.fillRect(-6, -14 + bob, 12, 4);
        ctx.fillRect(-6, -10 + bob, 2, 4);
        ctx.fillRect(4, -10 + bob, 2, 4);
        ctx.fillRect(-3, -10 + bob, 3, 3);
        ctx.fillRect(0, -11 + bob, 3, 3);
        ctx.fillStyle = highlight;
        ctx.fillRect(-4, -14 + bob, 8, 2);
      } else if (dir === 'up') {
        ctx.fillRect(-6, -14 + bob, 12, 8);
        ctx.fillStyle = shadow;
        ctx.fillRect(-4, -7 + bob, 8, 2);
      } else {
        ctx.fillRect(-5, -14 + bob, 10, 5);
        ctx.fillRect(-5, -9 + bob, 3, 4);
        ctx.fillRect(1, -11 + bob, 3, 3);
        ctx.fillStyle = highlight;
        ctx.fillRect(-1, -14 + bob, 4, 2);
      }
    } else if (style === 'spiky') {
      if (dir === 'down') {
        // Top spikes
        ctx.fillRect(-5, -14 + bob, 10, 4);
        ctx.fillRect(-3, -16 + bob, 2, 2);
        ctx.fillRect(0, -17 + bob, 3, 3);
        ctx.fillRect(3, -15 + bob, 2, 2);
        // Highlights
        ctx.fillStyle = highlight;
        ctx.fillRect(-2, -15 + bob, 2, 2);
        ctx.fillRect(1, -16 + bob, 2, 2);
        // Side bangs
        ctx.fillStyle = shadow;
        ctx.fillRect(-5, -10 + bob, 2, 3);
        ctx.fillRect(3, -10 + bob, 2, 3);
      } else if (dir === 'up') {
        ctx.fillRect(-5, -15 + bob, 10, 10);
        ctx.fillRect(-2, -17 + bob, 4, 3);
        ctx.fillStyle = highlight;
        ctx.fillRect(-3, -14 + bob, 6, 2);
      } else {
        ctx.fillRect(-4, -15 + bob, 9, 5);
        ctx.fillRect(2, -17 + bob, 3, 3);
        ctx.fillStyle = highlight;
        ctx.fillRect(0, -15 + bob, 3, 2);
      }
    } else if (style === 'long' || style === 'wizard_braid') {
      if (dir === 'down') {
        ctx.fillRect(-5, -13 + bob, 10, 4);
        ctx.fillRect(-6, -11 + bob, 2, 9); // Left long strand
        ctx.fillRect(4, -11 + bob, 2, 9); // Right long strand
        ctx.fillStyle = highlight;
        ctx.fillRect(-4, -13 + bob, 8, 2);
      } else if (dir === 'up') {
        ctx.fillRect(-5, -13 + bob, 10, 12);
        ctx.fillRect(-4, -1 + bob, 8, 6);
        ctx.fillStyle = shadow;
        ctx.fillRect(-2, 2 + bob, 4, 4);
      } else {
        ctx.fillRect(-4, -13 + bob, 8, 4);
        ctx.fillRect(-5, -10 + bob, 3, 10);
      }
    } else {
      // Short / Default cut
      if (dir === 'down') {
        ctx.fillRect(-5, -13 + bob, 10, 4);
        ctx.fillRect(-5, -10 + bob, 2, 3);
        ctx.fillRect(3, -10 + bob, 2, 3);
        ctx.fillStyle = highlight;
        ctx.fillRect(-4, -13 + bob, 8, 1);
      } else if (dir === 'up') {
        ctx.fillRect(-5, -13 + bob, 10, 8);
        ctx.fillStyle = shadow;
        ctx.fillRect(-4, -7 + bob, 8, 2);
      } else {
        ctx.fillRect(-4, -13 + bob, 8, 4);
        ctx.fillRect(-4, -10 + bob, 2, 4);
      }
    }
  }

  /**
   * Detailed Helmet & Headgear Rendering
   */
  static drawHelmet(
    ctx,
    helmet,
    dir,
    bob
  ) {
    if (!helmet) return;
    const color = helmet.color || '#1e3a8a';
    const highlight = this.shadeColor(color, 35);
    const shadow = this.shadeColor(color, -35);
    const gold = '#fbbf24';

    if (helmet.id.includes('scholar') || helmet.id.includes('beret') || helmet.id.includes('cap')) {
      // Celestial Scholar Beret / Academic Mortarboard
      ctx.fillStyle = color;
      if (dir === 'down') {
        // Tilted velvet beret
        ctx.fillRect(-6, -15 + bob, 12, 4);
        ctx.fillRect(-7, -13 + bob, 13, 2);
        // Golden star brooch
        ctx.fillStyle = gold;
        ctx.fillRect(-4, -14 + bob, 2, 2);
        // Golden tassel hanging to one side
        ctx.fillRect(-6, -12 + bob, 1, 4);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(-4, -14 + bob, 1, 1);
      } else if (dir === 'up') {
        ctx.fillRect(-6, -15 + bob, 12, 5);
        ctx.fillStyle = gold;
        ctx.fillRect(0, -16 + bob, 2, 2);
      } else {
        ctx.fillRect(-5, -15 + bob, 10, 4);
        ctx.fillRect(-6, -13 + bob, 11, 2);
        ctx.fillStyle = gold;
        ctx.fillRect(-2, -14 + bob, 2, 2);
      }
    } else if (helmet.id.includes('wizard') || helmet.id.includes('mage')) {
      // Pointy Wizard Hat
      ctx.fillStyle = color;
      ctx.fillRect(-7, -13 + bob, 14, 3); // Brim
      ctx.fillRect(-4, -17 + bob, 8, 4);
      ctx.fillRect(-2, -21 + bob, 4, 4);
      ctx.fillRect(0, -24 + bob, 2, 3); // Tip

      // Gold band & star
      ctx.fillStyle = gold;
      ctx.fillRect(-5, -14 + bob, 10, 2);
      ctx.fillRect(-1, -15 + bob, 2, 2);
    } else if (helmet.id.includes('crown')) {
      // Golden Royal Crown
      ctx.fillStyle = gold;
      ctx.fillRect(-5, -14 + bob, 10, 3);
      // Crown Spikes
      ctx.fillRect(-5, -16 + bob, 2, 2);
      ctx.fillRect(-1, -17 + bob, 2, 3);
      ctx.fillRect(3, -16 + bob, 2, 2);
      // Rubies
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(-4, -13 + bob, 1, 1);
      ctx.fillRect(0, -14 + bob, 1, 1);
      ctx.fillRect(4, -13 + bob, 1, 1);
    } else if (helmet.id.includes('hood') || helmet.id.includes('ranger')) {
      // Ranger Hunter Hood
      ctx.fillStyle = color;
      ctx.fillRect(-6, -14 + bob, 12, 5);
      ctx.fillRect(-6, -9 + bob, 3, 5);
      ctx.fillRect(3, -9 + bob, 3, 5);
      ctx.fillStyle = highlight;
      ctx.fillRect(-4, -14 + bob, 8, 2);
    } else {
      // Steel Knight Helm
      ctx.fillStyle = color;
      ctx.fillRect(-5, -13 + bob, 10, 8);
      ctx.fillStyle = highlight;
      ctx.fillRect(-4, -13 + bob, 8, 2);
      
      // Visor slit
      if (dir === 'down') {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-3, -8 + bob, 6, 2);
        // Red plume on top
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(-1, -16 + bob, 2, 3);
        ctx.fillRect(-2, -15 + bob, 4, 1);
      } else if (dir === 'side') {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(1, -8 + bob, 3, 2);
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(-2, -16 + bob, 3, 3);
      }
    }
  }

  /**
   * Detailed Armor Overlay
   */
  static drawArmorOverlay(
    ctx,
    armor,
    dir,
    bob
  ) {
    if (!armor) return;
    const color = armor.color || '#1e40af';
    const highlight = this.shadeColor(color, 30);
    const gold = '#fbbf24';

    if (armor.id.includes('scholar') || armor.id.includes('robe') || armor.id.includes('arcane')) {
      // Grand Scholar Coat & Runes
      ctx.fillStyle = gold;
      if (dir === 'down') {
        // Gold filigree collar and lapels
        ctx.fillRect(-4, -2 + bob, 1, 6);
        ctx.fillRect(3, -2 + bob, 1, 6);
        // Lower coat hem
        ctx.fillRect(-4, 4 + bob, 8, 1);
        // Astral blue core gem
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(-1, 0 + bob, 2, 2);
      } else if (dir === 'side') {
        ctx.fillRect(-2, -1 + bob, 1, 6);
        ctx.fillRect(2, -1 + bob, 1, 6);
      }
    } else if (armor.id.includes('plate') || armor.id.includes('knight') || armor.id.includes('paladin')) {
      // Steel Pauldrons & Breastplate
      ctx.fillStyle = color;
      ctx.fillRect(-5, -2 + bob, 10, 6);
      ctx.fillStyle = highlight;
      ctx.fillRect(-4, -2 + bob, 8, 2);
      // Center crest / cross
      ctx.fillStyle = gold;
      ctx.fillRect(-1, -1 + bob, 2, 4);
      ctx.fillRect(-2, 0 + bob, 4, 2);
      // Heavy Shoulders
      ctx.fillStyle = highlight;
      ctx.fillRect(-6, -2 + bob, 2, 3);
      ctx.fillRect(4, -2 + bob, 2, 3);
    }
  }

  /**
   * Arms, Hands, Animated Mainhand and Offhand
   */
  static drawArmsAndWeapons(
    ctx,
    appearance,
    equipment,
    dir,
    state,
    attackProgress,
    idleBob,
    animTick,
    walkFrame
  ) {
    const skinColor = appearance.skinColor || '#fcd34d';
    const shirtColor = equipment.armor ? (equipment.armor.color || '#3b82f6') : (appearance.shirtColor || '#2563eb');
    const isDown = dir === 'down';
    const isUp = dir === 'up';
    const isSide = dir === 'left' || dir === 'right';

    let armSwingL = 0;
    let armSwingR = 0;

    if (state === 'walk') {
      if (walkFrame === 1) {
        armSwingL = 2;
        armSwingR = -2;
      } else if (walkFrame === 3) {
        armSwingL = -2;
        armSwingR = 2;
      }
    }

    if (isDown) {
      // Left Arm & Hand
      ctx.fillStyle = shirtColor;
      ctx.fillRect(-6, -1 + idleBob + armSwingL, 2, 5);
      ctx.fillStyle = skinColor;
      ctx.fillRect(-6, 4 + idleBob + armSwingL, 2, 2); // Left Hand

      // Offhand shield / torch in Left Hand
      if (equipment.offhand) {
        ctx.save();
        ctx.translate(-7, 2 + idleBob + armSwingL);
        this.drawShield(ctx, equipment.offhand, 'down', state);
        ctx.restore();
      }

      // Right Arm & Hand (Weapon Arm)
      ctx.fillStyle = shirtColor;
      ctx.fillRect(4, -1 + idleBob + armSwingR, 2, 5);
      ctx.fillStyle = skinColor;
      ctx.fillRect(4, 4 + idleBob + armSwingR, 2, 2); // Right Hand

      // Mainhand Weapon in Right Hand
      ctx.save();
      ctx.translate(5, 4 + idleBob + armSwingR);
      this.drawWeapon(ctx, equipment.weapon, 'down', attackProgress, state);
      ctx.restore();

    } else if (isUp) {
      // Arms seen from back
      ctx.fillStyle = shirtColor;
      ctx.fillRect(-6, -1 + idleBob + armSwingL, 2, 5);
      ctx.fillRect(4, -1 + idleBob + armSwingR, 2, 5);

    } else {
      // Side view: front arm holds weapon / tool
      ctx.fillStyle = shirtColor;
      ctx.fillRect(-1, -1 + idleBob + armSwingR, 3, 5);
      ctx.fillStyle = skinColor;
      ctx.fillRect(0, 4 + idleBob + armSwingR, 2, 2);

      // Weapon
      ctx.save();
      ctx.translate(1, 4 + idleBob + armSwingR);
      this.drawWeapon(ctx, equipment.weapon, 'side', attackProgress, state);
      ctx.restore();

      if (equipment.offhand) {
        ctx.save();
        ctx.translate(-2, 2 + idleBob);
        this.drawShield(ctx, equipment.offhand, 'side', state);
        ctx.restore();
      }
    }
  }

  /**
   * Weapon Drawing & Slash Animation
   */
  static drawWeapon(
    ctx,
    weapon,
    dir,
    attackProgress,
    state
  ) {
    if (!weapon) {
      // Unarmed small fist
      return;
    }

    ctx.save();

    // Attack rotation swing
    if (state === 'attack' || state === 'gather') {
      const swingAngle = -Math.PI * 0.4 + (attackProgress * Math.PI * 1.1);
      ctx.rotate(swingAngle);

      // Slash Trail Arc
      if (attackProgress > 0.1 && attackProgress < 0.85) {
        ctx.strokeStyle = weapon.color || 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 14, -Math.PI * 0.5, Math.PI * 0.4);
        ctx.stroke();
      }
    } else {
      // Idle / ready weapon tilt
      ctx.rotate(Math.PI * 0.15);
    }

    const color = weapon.color || '#e2e8f0';
    const highlight = this.shadeColor(color, 25);
    const gold = '#fbbf24';

    if (weapon.type === 'tool_pickaxe') {
      // Sturdy Pickaxe
      ctx.fillStyle = '#78350f'; // Handle
      ctx.fillRect(-1, -8, 2, 12);
      ctx.fillStyle = color; // Curved Head
      ctx.fillRect(-5, -9, 10, 3);
      ctx.fillRect(-6, -8, 2, 2);
      ctx.fillRect(4, -8, 2, 2);
    } else if (weapon.type === 'tool_axe') {
      // Woodcutter Battle Axe
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-1, -8, 2, 12);
      ctx.fillStyle = color;
      ctx.fillRect(0, -9, 5, 5);
      ctx.fillRect(1, -10, 3, 1);
      ctx.fillRect(1, -4, 3, 1);
    } else if (weapon.type === 'weapon_ranged') {
      // Bow
      ctx.fillStyle = '#92400e';
      ctx.fillRect(1, -7, 2, 14);
      ctx.fillRect(2, -9, 2, 3);
      ctx.fillRect(2, 6, 2, 3);
      // Bowstring
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(3, -8);
      ctx.lineTo(-1, 0);
      ctx.lineTo(3, 8);
      ctx.stroke();
    } else if (weapon.type === 'weapon_magic') {
      if (weapon.id.includes('quill') || weapon.id.includes('feather') || weapon.id.includes('scholar')) {
        // Celestial Feather Scholar Quill
        // Quill Stem / Shaft
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, -10, 2, 14);
        // Crystal Star Nib
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(-1, -12, 4, 3);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, -14, 2, 2);
        // Feather Vane Barbs
        ctx.fillStyle = '#93c5fd';
        ctx.fillRect(-3, -8, 3, 6);
        ctx.fillRect(-2, -2, 2, 4);
        // Golden filigree rib
        ctx.fillStyle = gold;
        ctx.fillRect(0, -7, 1, 8);
        // Floating Starlight Sparkles
        ctx.fillStyle = 'rgba(186, 230, 253, 0.9)';
        ctx.fillRect(-4, -13, 2, 2);
        ctx.fillRect(3, -11, 2, 2);
        ctx.fillRect(-2, -15, 1, 1);
      } else {
        // Magic Staff with glowing top crystal
        ctx.fillStyle = '#78350f';
        ctx.fillRect(-1, -9, 2, 15);
        // Crystal
        ctx.fillStyle = color;
        ctx.fillRect(-3, -13, 6, 5);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-1, -12, 2, 2);
        // Floating sparks
        ctx.fillStyle = highlight;
        ctx.fillRect(-4, -14, 2, 2);
        ctx.fillRect(2, -14, 2, 2);
      }
    } else {
      // Melee Sword / Greatsword
      // Crossguard
      ctx.fillStyle = gold;
      ctx.fillRect(-3, 0, 7, 2);
      // Grip & Pommel
      ctx.fillStyle = '#451a03';
      ctx.fillRect(0, 2, 2, 3);
      ctx.fillStyle = gold;
      ctx.fillRect(-1, 5, 4, 2);
      // Blade
      ctx.fillStyle = color;
      ctx.fillRect(0, -11, 2, 11);
      ctx.fillStyle = highlight;
      ctx.fillRect(0, -11, 1, 11);
      // Blade tip
      ctx.fillRect(0, -13, 2, 2);
    }

    ctx.restore();
  }

  /**
   * Offhand Shield / Book / Torch
   */
  static drawShield(
    ctx,
    shield,
    dir,
    state
  ) {
    if (!shield) return;
    const color = shield.color || '#3b82f6';
    const highlight = this.shadeColor(color, 25);
    const gold = '#fbbf24';

    if (shield.id.includes('book') || shield.id.includes('tome') || shield.id.includes('codex') || shield.id.includes('grimoire')) {
      // Ancient Illuminated Scholar Tome
      ctx.fillStyle = color;
      // Leather Cover Spine & Back
      ctx.fillRect(-4, -4, 8, 9);
      // Gold Filigree Corner Clasps
      ctx.fillStyle = gold;
      ctx.fillRect(-4, -4, 2, 2);
      ctx.fillRect(2, -4, 2, 2);
      ctx.fillRect(-4, 3, 2, 2);
      ctx.fillRect(2, 3, 2, 2);
      // Glowing Parchment Pages
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(-3, -3, 6, 7);
      // Arcane Astral Rune / Star Glyphs
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(-1, -1, 2, 3);
      ctx.fillRect(-2, 0, 4, 1);
      // Floating starlight rune particles
      ctx.fillStyle = 'rgba(56, 189, 248, 0.8)';
      ctx.fillRect(-5, -5, 1, 1);
      ctx.fillRect(3, -5, 1, 1);
    } else if (shield.id.includes('torch') || shield.id.includes('lantern')) {
      // Torch with animated flame
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-1, 0, 2, 6);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(-2, -3, 4, 3);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(-1, -4, 2, 2);
    } else {
      // Shield
      ctx.fillStyle = color;
      ctx.fillRect(-4, -4, 8, 9);
      ctx.fillRect(-3, 5, 6, 2);
      ctx.fillStyle = gold;
      // Shield Rim & Emblem
      ctx.fillRect(-4, -4, 8, 1);
      ctx.fillRect(-4, -4, 1, 9);
      ctx.fillRect(3, -4, 1, 9);
      ctx.fillRect(-1, -2, 2, 4);
      ctx.fillRect(-2, -1, 4, 2);
    }
  }

  /**
   * Draw Monster Sprites
   */
  static drawMonster(
    ctx,
    x,
    y,
    monster,
    animTick
  ) {
    if (monster.isDead) return;

    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.translate(Math.floor(x), Math.floor(y));

    const bob = Math.sin(animTick * 0.15) * 2;
    const isBoss = monster.rarity === 'boss';
    const isElite = monster.rarity === 'elite';
    const scale = isBoss ? 2.2 : (isElite ? 1.5 : 1.2);
    ctx.scale(scale, scale);

    // Monster Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(0, 10, 8, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Draw based on type
    if (monster.typeId.includes('slime')) {
      // Slime
      ctx.fillStyle = monster.color || '#22c55e';
      ctx.beginPath();
      ctx.arc(0, 4 - Math.abs(bob), 7, 0, Math.PI * 2);
      ctx.fill();
      // Eyes
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-3, 2 - Math.abs(bob), 2, 3);
      ctx.fillRect(1, 2 - Math.abs(bob), 2, 3);
      ctx.fillStyle = '#000000';
      ctx.fillRect(-2, 3 - Math.abs(bob), 1, 2);
      ctx.fillRect(2, 3 - Math.abs(bob), 1, 2);

    } else if (monster.typeId.includes('wolf')) {
      // Wolf / Direwolf
      ctx.fillStyle = monster.color || '#475569';
      ctx.fillRect(-8, -2 + bob, 16, 8);
      // Head
      ctx.fillRect(5, -6 + bob, 6, 6);
      ctx.fillRect(9, -4 + bob, 4, 3); // Snout
      // Ears
      ctx.fillRect(6, -9 + bob, 2, 3);
      // Red Eyes
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(8, -5 + bob, 2, 2);
      // Legs
      ctx.fillStyle = '#334155';
      ctx.fillRect(-6, 6 + bob, 3, 5);
      ctx.fillRect(3, 6 + bob, 3, 5);
      // Tail
      ctx.fillRect(-11, -3 + bob, 3, 6);

    } else if (monster.typeId.includes('goblin')) {
      // Goblin Warrior
      ctx.fillStyle = monster.color || '#65a30d';
      ctx.fillRect(-4, -1, 8, 7); // Body
      ctx.fillRect(-5, -8 + bob, 10, 7); // Head
      // Pointy Ears
      ctx.fillRect(-8, -7 + bob, 3, 3);
      ctx.fillRect(5, -7 + bob, 3, 3);
      // Yellow Eyes
      ctx.fillStyle = '#facc15';
      ctx.fillRect(-3, -6 + bob, 2, 2);
      ctx.fillRect(1, -6 + bob, 2, 2);
      // Dagger
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(5, 1, 6, 2);

    } else if (monster.typeId.includes('skeleton')) {
      // Skeleton Warrior
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(-4, -9 + bob, 8, 7); // Skull
      ctx.fillStyle = '#0f172a'; // Eye sockets
      ctx.fillRect(-3, -7 + bob, 2, 2);
      ctx.fillRect(1, -7 + bob, 2, 2);
      // Ribcage
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(-3, -1, 6, 6);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-1, 0, 2, 4);
      // Rusty Sword
      ctx.fillStyle = '#78350f';
      ctx.fillRect(4, -4, 2, 10);
      // Legs
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(-3, 5, 2, 6);
      ctx.fillRect(1, 5, 2, 6);

    } else if (monster.typeId.includes('golem')) {
      // Stone / Obsidian Golem
      ctx.fillStyle = monster.color || '#334155';
      ctx.fillRect(-8, -8 + bob, 16, 12);
      ctx.fillStyle = '#475569';
      ctx.fillRect(-6, -6 + bob, 12, 8);
      // Glowing Core Eyes
      ctx.fillStyle = '#f97316';
      ctx.fillRect(-4, -4 + bob, 3, 2);
      ctx.fillRect(1, -4 + bob, 3, 2);
      // Heavy Fists
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-10, 0 + bob, 4, 8);
      ctx.fillRect(6, 0 + bob, 4, 8);

    } else if (monster.typeId.includes('dragon') || monster.typeId.includes('boss')) {
      // Dragon Lord Boss
      ctx.fillStyle = '#991b1b'; // Crimson Dragon Scale
      ctx.fillRect(-10, -6 + bob, 20, 14);
      // Dragon Head
      ctx.fillRect(6, -14 + bob, 10, 9);
      ctx.fillRect(14, -11 + bob, 5, 5); // Snout
      // Horns
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(5, -18 + bob, 3, 5);
      ctx.fillRect(9, -17 + bob, 2, 4);
      // Fiery Eyes
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(11, -12 + bob, 3, 2);
      // Large Wings
      const wingFlap = Math.sin(animTick * 0.2) * 5;
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.moveTo(-4, -4 + bob);
      ctx.lineTo(-18, -16 + wingFlap + bob);
      ctx.lineTo(-12, 2 + bob);
      ctx.fill();
      // Boss Crown
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(7, -19 + bob, 6, 2);

    } else {
      // Default Monster
      ctx.fillStyle = monster.color || '#8b5cf6';
      ctx.fillRect(-6, -6 + bob, 12, 12);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(-3, -4 + bob, 2, 2);
      ctx.fillRect(1, -4 + bob, 2, 2);
    }

    // Health Bar above monster
    const barWidth = 20 * scale;
    const hpRatio = Math.max(0, monster.hp / monster.maxHp);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(-barWidth / 2, -18, barWidth, 3);
    ctx.fillStyle = hpRatio > 0.5 ? '#22c55e' : (hpRatio > 0.2 ? '#eab308' : '#ef4444');
    ctx.fillRect(-barWidth / 2, -18, barWidth * hpRatio, 3);

    ctx.restore();
  }

  /**
   * Draw Resource Nodes (Ores, Trees, Herbs, Chests)
   */
  static drawResourceNode(
    ctx,
    x,
    y,
    type,
    hp,
    maxHp,
    animTick
  ) {
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.translate(Math.floor(x), Math.floor(y));

    if (type === 'tree') {
      // Oak / Ancient Tree
      // Trunk
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-4, 0, 8, 14);
      ctx.fillStyle = '#451a03';
      ctx.fillRect(-4, 0, 2, 14);

      // Lush Leaves Crown
      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.arc(0, -10, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.arc(-4, -14, 11, 0, Math.PI * 2);
      ctx.fill();
      // Apples / sap
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(-6, -8, 3, 3);
      ctx.fillRect(5, -12, 3, 3);
      ctx.fillRect(2, -4, 3, 3);

    } else if (type.includes('ore')) {
      // Mining Rock Vein
      ctx.fillStyle = '#64748b'; // Rock Base
      ctx.fillRect(-8, -4, 16, 12);
      ctx.fillRect(-6, -8, 12, 4);
      ctx.fillStyle = '#475569';
      ctx.fillRect(-8, 4, 16, 4);

      // Shiny Ore Crystals
      const oreColor = type.includes('gold') ? '#fbbf24' : (type.includes('mithril') ? '#38bdf8' : '#f97316');
      ctx.fillStyle = oreColor;
      ctx.fillRect(-4, -5, 3, 3);
      ctx.fillRect(2, -3, 4, 4);
      ctx.fillRect(-5, 2, 3, 3);
      // Sparkle
      const glint = (animTick % 60) < 15;
      if (glint) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(3, -2, 2, 2);
      }

    } else if (type.includes('herb')) {
      // Harvestable Flower / Herb
      ctx.fillStyle = '#16a34a'; // Stem & leaves
      ctx.fillRect(-1, -2, 2, 8);
      ctx.fillRect(-4, 2, 3, 2);
      ctx.fillRect(1, 0, 3, 2);

      // Blossom
      const petalColor = type.includes('mana') ? '#3b82f6' : '#ec4899';
      ctx.fillStyle = petalColor;
      ctx.fillRect(-4, -6, 8, 5);
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(-1, -4, 2, 2);

    } else if (type === 'chest') {
      // Treasure Chest
      ctx.fillStyle = '#78350f'; // Wood body
      ctx.fillRect(-7, -4, 14, 10);
      ctx.fillStyle = '#fbbf24'; // Gold bands
      ctx.fillRect(-7, -4, 14, 2);
      ctx.fillRect(-7, 2, 14, 2);
      ctx.fillRect(-2, -1, 4, 4); // Keyhole
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-1, 0, 2, 2);

    } else if (type === 'magic_crystal') {
      // Glowing Arcane Crystal
      const crystalGlow = Math.sin(animTick * 0.1) * 2;
      ctx.fillStyle = '#a855f7';
      ctx.beginPath();
      ctx.moveTo(0, -16 + crystalGlow);
      ctx.lineTo(7, 2);
      ctx.lineTo(0, 8);
      ctx.lineTo(-7, 2);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#e9d5ff';
      ctx.beginPath();
      ctx.moveTo(0, -14 + crystalGlow);
      ctx.lineTo(3, 0);
      ctx.lineTo(0, 4);
      ctx.lineTo(-3, 0);
      ctx.closePath();
      ctx.fill();
    }

    // Health / Durability Bar if partially damaged
    if (hp < maxHp) {
      const barW = 16;
      const ratio = hp / maxHp;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(-barW / 2, -16, barW, 2);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(-barW / 2, -16, barW * ratio, 2);
    }

    ctx.restore();
  }

  /**
   * Draw NPC with friendly name badge
   */
  static drawNPC(
    ctx,
    x,
    y,
    npc,
    animTick
  ) {
    const dummyEquip = {
      weapon: null,
      offhand: null,
      helmet: null,
      armor: null,
      boots: null,
      accessory: null
    };

    this.drawHumanCharacter(
      ctx,
      x,
      y,
      1.4,
      npc.appearance,
      dummyEquip,
      npc.direction,
      'idle',
      animTick,
      false
    );

    // Floating Quest Indicator / Name Badge
    ctx.save();
    ctx.translate(Math.floor(x), Math.floor(y) - 24);

    // Quest Mark '!'
    const markBob = Math.sin(animTick * 0.1) * 2;
    ctx.fillStyle = '#facc15';
    ctx.fillRect(-2, -8 + markBob, 4, 5);
    ctx.fillRect(-2, -1 + markBob, 4, 2);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.strokeRect(-2, -8 + markBob, 4, 5);
    ctx.strokeRect(-2, -1 + markBob, 4, 2);

    // Name tag
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    const textW = ctx.measureText(npc.name).width;
    ctx.fillRect(-textW / 2 - 4, 3, textW + 8, 12);
    ctx.fillStyle = '#f8fafc';
    ctx.fillText(npc.name, 0, 12);

    ctx.restore();
  }

  /**
   * Utility color shade helper
   */
  static shadeColor(color, percent) {
    let num = parseInt(color.replace('#', ''), 16);
    if (isNaN(num)) return color;
    let amt = Math.round(2.55 * percent);
    let R = (num >> 16) + amt;
    let G = (num >> 8 & 0x00FF) + amt;
    let B = (num & 0x0000FF) + amt;
    return '#' + (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    ).toString(16).slice(1);
  }
}
