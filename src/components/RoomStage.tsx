import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ConciergeBell, Box, CornerUpLeft, MessageSquare } from 'lucide-react';
import { RoomData, RoomState } from '../types';
import { PanoramaViewer } from './PanoramaViewer';
import { RoomControls } from './RoomControls';
import { cn } from '../lib/utils';

interface RoomStageProps {
  room: RoomData;
  state: RoomState;
  is360: boolean;
  rotation: number;
  onNavigate: (id: string) => void;
  onToggle360: () => void;
  onRotate: (dir: number) => void;
  onToggleFeature: (key: keyof RoomState) => void;
  onSecurity: () => void;
  onOpenReservation: () => void;
}

export function RoomStage({ 
  room, 
  state, 
  is360, 
  rotation, 
  onNavigate, 
  onToggle360, 
  onRotate,
  onToggleFeature,
  onSecurity,
  onOpenReservation
}: RoomStageProps) {
  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex flex-col pt-20">
      <header className="absolute top-8 left-8 right-8 flex justify-between items-center z-50 pointer-events-none">
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-black/60 border border-[#d4af37]/40 text-[#d4af37] text-[10px] font-bold tracking-[2px] backdrop-blur-xl pointer-events-auto hover:bg-[#d4af37] hover:text-black transition-all duration-500"
        >
          <CornerUpLeft className="w-4 h-4" /> EXPLORAR
        </button>

        <div className="flex gap-4">
          <button
            onClick={() => onNavigate('reception')}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-black/60 border border-[#d4af37] text-[#d4af37] text-[10px] font-bold tracking-[1px] backdrop-blur-xl pointer-events-auto hover:bg-[#d4af37] hover:text-black transition-all duration-500 shadow-[0_0_20px_rgba(212,175,55,0.3)]"
          >
            <ConciergeBell className="w-4 h-4" /> RECEPCIÓN
          </button>
          
          {room.panorama && (
            <button
              onClick={onToggle360}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-full text-[10px] font-bold tracking-[1.5px] backdrop-blur-xl pointer-events-auto transition-all duration-500",
                is360 
                  ? "bg-[#d4af37] text-black shadow-[0_0_30px_#d4af37]" 
                  : "bg-black/60 border border-[#d4af37]/50 text-[#d4af37] hover:bg-[#d4af37]/20"
              )}
            >
              <Box className="w-4 h-4" /> 360°
            </button>
          )}
        </div>
      </header>

      {room.price && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-32 left-8 z-50 flex flex-col gap-4"
        >
          <div className="bg-black/60 backdrop-blur-xl border border-[#d4af37]/30 px-6 py-4 rounded-2xl flex flex-col gap-1 shadow-2xl">
            <span className="text-[10px] uppercase tracking-widest text-white/60 font-medium">Tarifa</span>
            <span className="text-2xl font-['Cinzel'] text-[#d4af37] font-bold">{room.price}</span>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={onOpenReservation}
              className="flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#d4af37] text-black font-bold tracking-wider hover:scale-105 transition-all duration-300 shadow-[0_10px_30px_rgba(212,175,55,0.4)] group"
            >
              <Box className="w-5 h-5 group-hover:animate-pulse" />
              <span>PEDIR RESERVACIÓN</span>
            </button>

            <a
              href={`https://wa.me/5491122334455?text=Hola,%20quisiera%20reservar%20la%20${encodeURIComponent(room.name)}%20en%20Zyra%20Smart%20Hotel`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#25D366] text-white font-bold tracking-wider hover:scale-105 transition-all duration-300 shadow-[0_10px_30px_rgba(37,211,102,0.3)] group"
            >
              <MessageSquare className="w-5 h-5 group-hover:animate-bounce" />
              <span>WHATSAPP DIRECTO</span>
            </a>
          </div>
        </motion.div>
      )}

      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          {!is360 ? (
            <motion.div
              key="static"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <img 
                src={room.image} 
                className={cn(
                  "w-full h-full object-cover transition-all duration-1000 scale-105",
                  !state.lights && "brightness-[0.15] contrast-[1.2] saturate-[0.8]"
                )} 
              />
              {!state.lights && (
                <div className="absolute inset-0 bg-radial-at-50-50 from-transparent via-black/40 to-black/80 pointer-events-none" />
              )}
              
              {state.tv && room.id.includes('room') && (
                <div className="absolute top-[35%] left-[73%] w-[22%] h-[18%] bg-black/80 backdrop-blur-sm rounded border border-cyan-500/30 flex items-center justify-center overflow-hidden animate-[tvFlicker_0.2s_ease-out]">
                  <div className="text-[10px] font-['Orbitron'] text-cyan-400 text-center animate-pulse drop-shadow-[0_0_5px_rgba(0,242,255,0.8)]">
                    ZYRA SMART<br/>
                    <span className="text-[8px] opacity-60">PISO {room.id === 'room-suite' ? '42' : '15'}</span>
                  </div>
                </div>
              )}

              {state.ac && (
                <div className={cn(
                  "absolute top-[12%] right-[10%] font-['Orbitron'] text-cyan-400 text-sm drop-shadow-[0_0_10px_rgba(0,242,255,0.8)]",
                  !state.lights && "opacity-40"
                )}>
                  {state.temp}°C
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="panorama"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <PanoramaViewer 
                image={room.panorama!} 
                rotation={rotation}
                onRotate={onRotate}
                lightsOff={!state.lights}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <RoomControls 
        state={state} 
        features={room.features} 
        onToggle={onToggleFeature} 
        onSecurity={onSecurity}
      />
      
      <style>{`
        @keyframes tvFlicker {
          0% { opacity: 0; transform: scaleY(0.01); }
          50% { opacity: 1; transform: scaleY(1.2); }
          100% { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}
