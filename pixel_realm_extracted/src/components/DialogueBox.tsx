import React, { useRef, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { PixelRenderer } from '../utils/pixelRenderer';
import { MessageSquare, ArrowRight, X } from 'lucide-react';

export const DialogueBox: React.FC = () => {
  const {
    activeDialogueNPC,
    activeDialogueId,
    selectDialogueOption,
    closeDialogue,
    animTick
  } = useGame();

  const portraitCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Draw NPC portrait in high-detail pixel zoom
  useEffect(() => {
    if (!activeDialogueNPC) return;
    const canvas = portraitCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = false;

    PixelRenderer.drawHumanCharacter(
      ctx,
      canvas.width / 2,
      canvas.height / 2 + 18,
      4.0,
      activeDialogueNPC.appearance,
      {
        weapon: null,
        offhand: null,
        helmet: null,
        armor: null,
        boots: null,
        accessory: null
      },
      'down',
      'idle',
      animTick,
      false
    );
  }, [activeDialogueNPC, animTick]);

  if (!activeDialogueNPC) return null;

  const currentDialogue = activeDialogueNPC.dialogueTree.find(d => d.id === activeDialogueId) || activeDialogueNPC.dialogueTree[0];

  return (
    <div id="dialogue-box-container" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4 animate-in slide-in-from-bottom-4">
      <div className="bg-slate-900/95 backdrop-blur-md border-2 border-indigo-500/60 rounded-2xl p-5 shadow-2xl flex flex-col md:flex-row gap-5 items-start">
        {/* NPC Pixel Portrait */}
        <div className="flex flex-col items-center bg-slate-950 p-2 rounded-xl border border-slate-800 shrink-0">
          <canvas
            ref={portraitCanvasRef}
            width={96}
            height={96}
            className="pixelated drop-shadow"
          />
          <span className="text-xs font-bold text-slate-200 mt-1">{activeDialogueNPC.name}</span>
          <span className="text-[10px] text-amber-400 font-medium">{activeDialogueNPC.title}</span>
        </div>

        {/* Dialogue text & choices */}
        <div className="flex-1 flex flex-col justify-between h-full w-full">
          <div>
            <p className="text-sm text-slate-100 leading-relaxed font-medium">
              "{currentDialogue.text}"
            </p>
          </div>

          {/* Dialogue Choice Options */}
          <div className="mt-4 flex flex-col gap-2">
            {currentDialogue.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => selectDialogueOption(opt.nextId, opt.action, opt.questId)}
                className="w-full text-left px-3.5 py-2 bg-slate-800/80 hover:bg-indigo-600/90 text-slate-200 hover:text-white rounded-xl text-xs font-semibold border border-slate-700 hover:border-indigo-400 transition-all flex items-center justify-between group"
              >
                <span>{opt.text}</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={closeDialogue}
          className="absolute top-3 right-3 p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
