import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CornerUpLeft, ArrowBigUp, ConciergeBell, Bed, Dumbbell, GlassWater, Crown, SwatchBook, Timer } from 'lucide-react';
import { RoomType } from '../types';
import { cn } from '../lib/utils';

interface ReceptionProps {
  onNavigate: (id: RoomType) => void;
  onGoToFloor: (id: RoomType, name: string) => void;
}

export function Reception({ onNavigate, onGoToFloor }: ReceptionProps) {
  const [showChat, setShowChat] = useState(false);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowChat(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const floors: { id: RoomType; name: string; icon: any }[] = [
    { id: 'reception', name: 'Recepción', icon: ConciergeBell },
    { id: 'hotel-gym', name: 'Gym & Wellness', icon: Dumbbell },
    { id: 'salon', name: 'Salón VIP', icon: GlassWater },
    { id: 'room-simple', name: 'Habitación Simple', icon: Bed },
    { id: 'room-double', name: 'Habitación Doble', icon: SwatchBook },
    { id: 'room-suite', name: 'Suite Real', icon: Crown },
    { id: 'hotel-pool', name: 'Piscina Infinity', icon: Timer },
  ];

  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex flex-col pt-20">
      <button
        onClick={() => onNavigate('landing')}
        className="absolute top-8 left-8 z-50 flex items-center gap-2 px-6 py-3 rounded-full bg-black/60 border border-[#d4af37]/40 text-[#d4af37] text-[10px] font-bold tracking-[2px] backdrop-blur-xl hover:bg-[#d4af37] hover:text-black transition-all duration-500"
      >
        <CornerUpLeft className="w-4 h-4" /> EXPLORAR
      </button>

      <div className="relative flex-1">
        <img 
          src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663602259141/MoQJJqWvcOjawrqm.jpeg" 
          className="w-full h-full object-cover brightness-75 scale-105" 
        />
        
        <AnimatePresence>
          {showChat && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute top-[35%] left-[12%] bg-black/85 text-[#d4af37] p-6 rounded-2xl rounded-bl-none border border-[#d4af37] backdrop-blur-2xl max-w-xs shadow-2xl z-10"
            >
              <p className="text-sm font-medium leading-relaxed">
                Bienvenido a Zyra Smart Hotel. Soy su asistente personal. ¿A qué piso desea dirigirse hoy?
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setShowControls(true)}
          className="absolute top-[55%] right-[24%] group"
        >
          <div className="w-16 h-16 rounded-full bg-[#d4af37]/20 border-2 border-[#d4af37] flex items-center justify-center text-[#d4af37] backdrop-blur-md animate-[pulse_2s_infinite] transition-transform hover:scale-110 shadow-[0_0_30px_rgba(212,175,55,0.4)]">
            <ArrowBigUp className="w-8 h-8" />
          </div>
          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] font-bold uppercase tracking-widest text-[#d4af37] drop-shadow-lg">
            Llamar Ascensor
          </span>
        </button>

        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute top-1/2 -translate-y-1/2 right-[28%] flex flex-col gap-3 p-4 bg-black/80 rounded-2xl border-2 border-[#d4af37] backdrop-blur-xl shadow-2xl z-20"
            >
              {floors.map((floor) => (
                <button
                  key={floor.id}
                  onClick={() => onGoToFloor(floor.id, floor.name)}
                  className="flex items-center gap-4 px-6 py-3 rounded-xl border border-[#d4af37]/30 text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition-all duration-300 font-bold text-xs"
                >
                  <floor.icon className="w-5 h-5 shrink-0" />
                  <span>{floor.name.toUpperCase()}</span>
                </button>
              ))}
              <button 
                onClick={() => setShowControls(false)}
                className="mt-2 text-[8px] uppercase tracking-widest text-white/40 hover:text-white"
              >
                Cancelar
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.7); }
          70% { box-shadow: 0 0 0 15px rgba(212, 175, 55, 0); }
          100% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0); }
        }
      `}</style>
    </div>
  );
}
