import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface ElevatorOverlayProps {
  isVisible: boolean;
  floorName: string;
  isMoving: boolean;
  isOpen: boolean;
}

export function ElevatorOverlay({ isVisible, floorName, isMoving, isOpen }: ElevatorOverlayProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           className="fixed inset-0 z-[100] bg-black overflow-hidden flex items-center justify-center font-['Orbitron']"
        >
          {/* Panoramic View Background */}
          <div 
            className={cn(
              "absolute inset-0 bg-cover bg-center transition-all duration-[5000ms] linear",
              isMoving ? "scale-125 -translate-y-20 brightness-75 blur-0" : "scale-100 translate-y-0 brightness-50 blur-sm"
            )}
            style={{ backgroundImage: 'url("https://files.manuscdn.com/user_upload_by_module/session_file/310519663602259141/yGQsdfzIBdGekRXr.jpg")' }}
          />

          <div className="absolute top-[15%] px-10 py-4 bg-black border-2 border-[#d4af37] text-[#d4af37] text-2xl font-bold rounded shadow-[0_0_20px_#d4af37] z-10 tracking-widest">
            {isMoving ? 'EN TRÁNSITO' : floorName.toUpperCase()}
          </div>

          <div className="relative w-full h-full flex z-20">
            {/* Left Door */}
            <motion.div 
              initial={false}
              animate={{ x: isOpen ? '-100%' : '0%' }}
              transition={{ duration: 1.8, ease: [0.4, 0, 0.2, 1] }}
              className="w-1/2 h-full bg-white/10 backdrop-blur-md border-r-2 border-[#d4af37] shadow-[inset_-20px_0_50px_rgba(212,175,55,0.1)] relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
            </motion.div>

            {/* Right Door */}
            <motion.div 
              initial={false}
              animate={{ x: isOpen ? '100%' : '0%' }}
              transition={{ duration: 1.8, ease: [0.4, 0, 0.2, 1] }}
              className="w-1/2 h-full bg-white/10 backdrop-blur-md border-l-2 border-[#d4af37] shadow-[inset_20px_0_50px_rgba(212,175,55,0.1)] relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent" />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
