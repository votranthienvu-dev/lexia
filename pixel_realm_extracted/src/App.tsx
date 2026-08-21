import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { GameCanvas } from './components/GameCanvas';
import { HUD } from './components/HUD';
import { CharacterModal } from './components/CharacterModal';
import { InventoryModal } from './components/InventoryModal';
import { CraftingModal } from './components/CraftingModal';
import { QuestModal } from './components/QuestModal';
import { WorldMapModal } from './components/WorldMapModal';
import { DialogueBox } from './components/DialogueBox';
import { ShopModal } from './components/ShopModal';

const GameInterface: React.FC = () => {
  const { activeModal } = useGame();

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-slate-950 flex flex-col items-center justify-center font-sans antialiased text-slate-100">
      {/* RPG Viewport Canvas */}
      <GameCanvas />

      {/* Real-time HUD Layer */}
      <HUD />

      {/* NPC Dialogue Box */}
      <DialogueBox />

      {/* Dynamic Popups & Overlays */}
      {activeModal === 'character' && <CharacterModal />}
      {activeModal === 'inventory' && <InventoryModal />}
      {activeModal === 'crafting' && <CraftingModal />}
      {activeModal === 'quests' && <QuestModal />}
      {activeModal === 'map' && <WorldMapModal />}
      {activeModal === 'shop' && <ShopModal />}
    </main>
  );
};

export default function App() {
  return (
    <GameProvider>
      <GameInterface />
    </GameProvider>
  );
}
